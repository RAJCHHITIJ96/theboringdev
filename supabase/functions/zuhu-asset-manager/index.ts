import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Update processing stage
async function updateProcessingStage(contentId: string, stage: string, status: string, errorMessage?: string) {
  try {
    const stageData = {
      content_id: contentId,
      stage,
      status,
      started_at: status === 'processing' ? new Date().toISOString() : undefined,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined,
      error_message: errorMessage || null
    };

    const { data, error } = await supabase
      .from('zuhu_processing_stages')
      .insert(stageData);

    if (error) {
      console.error(`Error updating processing stage:`, error);
    } else {
      console.log(`[${contentId}] ${stage}: ${status}`);
    }
  } catch (error) {
    console.error('Stage update error:', error);
  }
}

// Get design-approved content for asset processing
async function getDesignApprovedContent(contentId: string) {
  const { data, error } = await supabase
    .from('zuhu_content_processing')
    .select('*')
    .eq('content_id', contentId)
    .eq('status', 'design_approved')
    .single();

  if (error) {
    throw new Error(`Failed to fetch design-approved content: ${error.message}`);
  }

  return data;
}

// Extract image URLs from content
function extractImageUrls(content: any): string[] {
  const imageUrls: string[] = [];
  
  try {
    // Extract from shipped_content markdown
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.shipped_content) {
      const shippedContent = content.raw_content[0].shipped_content;
      const markdownImageMatches = shippedContent.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/g);
      
      if (markdownImageMatches) {
        markdownImageMatches.forEach((match: string) => {
          const urlMatch = match.match(/\((https?:\/\/[^\)]+)\)/);
          if (urlMatch) {
            imageUrls.push(urlMatch[1]);
          }
        });
      }

      // Extract from [IMAGE: url] format
      const imageTagMatches = shippedContent.match(/\[IMAGE:\s*(https?:\/\/[^\]]+)\]/g);
      if (imageTagMatches) {
        imageTagMatches.forEach((match: string) => {
          const urlMatch = match.match(/\[IMAGE:\s*(https?:\/\/[^\]]+)\]/);
          if (urlMatch) {
            imageUrls.push(urlMatch[1]);
          }
        });
      }
    }

    // Extract from image_seo_details
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.image_seo_details) {
      const imageSeoDetails = content.raw_content[0].image_seo_details;
      if (Array.isArray(imageSeoDetails)) {
        imageSeoDetails.forEach((imageDetail: any) => {
          if (imageDetail.url) {
            imageUrls.push(imageDetail.url);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error extracting image URLs:', error);
  }

  return [...new Set(imageUrls)]; // Remove duplicates
}

// Check if URL is accessible
async function checkUrlHealth(url: string): Promise<{ url: string; status: string; statusCode?: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      url,
      status: response.ok ? 'healthy' : 'broken',
      statusCode: response.status
    };
  } catch (error) {
    return {
      url,
      status: 'broken',
      statusCode: 0
    };
  }
}

// Get existing alt text from content
function getExistingAltText(content: any, imageUrl: string): string {
  try {
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.image_seo_details) {
      const imageSeoDetails = content.raw_content[0].image_seo_details;
      if (Array.isArray(imageSeoDetails)) {
        const imageDetail = imageSeoDetails.find((detail: any) => detail.url === imageUrl);
        if (imageDetail && imageDetail.alt_text) {
          return imageDetail.alt_text;
        }
      }
    }
  } catch (error) {
    console.error('Error getting existing alt text:', error);
  }
  return '';
}

// Improve alt text using Claude
async function improveAltTextWithClaude(imageUrl: string, currentAltText: string, category: string): Promise<{ score: number; improvedAltText: string; needsImprovement: boolean }> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `You are an SEO and accessibility expert. Analyze this image alt text for an article about "${category}".

Image URL: ${imageUrl}
Current Alt Text: "${currentAltText}"

Score the current alt text from 1-100 on:
1. SEO relevance (keywords for ${category})
2. Descriptive accuracy 
3. Accessibility compliance

If the score is below 90, generate a new, superior alt text that is:
- Descriptive and accurate
- SEO-optimized for "${category}" topic
- Under 125 characters
- Accessible for screen readers

Return ONLY a JSON object:
{
  "score": number,
  "improvedAltText": "new alt text if needed",
  "needsImprovement": boolean,
  "reasoning": "brief explanation"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    const responseText = result.content[0].text;
    
    try {
      return JSON.parse(responseText);
    } catch {
      // Fallback if JSON parsing fails
      return {
        score: 50,
        improvedAltText: currentAltText || `Image related to ${category}`,
        needsImprovement: true,
        reasoning: 'Failed to parse Claude response'
      };
    }

  } catch (error) {
    console.error('Claude alt text improvement failed:', error);
    return {
      score: 50,
      improvedAltText: currentAltText || `Image related to ${category}`,
      needsImprovement: true,
      reasoning: `Error: ${error.message}`
    };
  }
}

// Main asset processing logic
async function processAssets(contentId: string) {
  console.log(`[${contentId}] Starting asset processing`);
  
  try {
    await updateProcessingStage(contentId, 'asset_validation', 'processing');

    // Get the design-approved content
    const contentData = await getDesignApprovedContent(contentId);
    const category = contentData.category || 'General';
    
    console.log(`[${contentId}] Processing assets for category: ${category}`);

    // Extract image URLs from content
    const imageUrls = extractImageUrls(contentData);
    console.log(`[${contentId}] Found ${imageUrls.length} images to process`);

    // Health check all URLs
    const healthChecks = await Promise.all(
      imageUrls.map(url => checkUrlHealth(url))
    );

    const brokenAssets = healthChecks.filter(check => check.status === 'broken');
    if (brokenAssets.length > 0) {
      console.warn(`[${contentId}] Found ${brokenAssets.length} broken image links`);
    }

    // Process alt text improvements
    const altTextImprovements: any[] = [];
    const validatedAssets: any[] = [];

    for (const url of imageUrls) {
      const healthCheck = healthChecks.find(check => check.url === url);
      const existingAltText = getExistingAltText(contentData, url);
      
      let altTextResult = null;
      if (healthCheck?.status === 'healthy') {
        try {
          altTextResult = await improveAltTextWithClaude(url, existingAltText, category);
        } catch (error) {
          console.error(`[${contentId}] Alt text improvement failed for ${url}:`, error);
        }
      }

      const assetData = {
        url,
        originalAltText: existingAltText,
        improvedAltText: altTextResult?.improvedAltText || existingAltText,
        altTextScore: altTextResult?.score || 0,
        needsImprovement: altTextResult?.needsImprovement || false,
        healthStatus: healthCheck?.status || 'unknown',
        statusCode: healthCheck?.statusCode
      };

      validatedAssets.push(assetData);
      
      if (altTextResult?.needsImprovement) {
        altTextImprovements.push({
          url,
          originalAltText: existingAltText,
          improvedAltText: altTextResult.improvedAltText,
          score: altTextResult.score,
          reasoning: altTextResult.reasoning
        });
      }
    }

    // Create asset data record
    const assetDataRecord = {
      content_id: contentId,
      asset_urls: imageUrls,
      validated_assets: validatedAssets,
      asset_health_check: {
        totalAssets: imageUrls.length,
        healthyAssets: healthChecks.filter(check => check.status === 'healthy').length,
        brokenAssets: brokenAssets.length,
        brokenUrls: brokenAssets.map(asset => asset.url)
      },
      alt_text_improvements: altTextImprovements,
      validation_errors: brokenAssets.map(asset => ({
        url: asset.url,
        error: `HTTP ${asset.statusCode}: Asset not accessible`
      }))
    };

    // Save asset data to database
    const { data: savedAssetData, error: saveError } = await supabase
      .from('asset_data')
      .insert(assetDataRecord)
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save asset data: ${saveError.message}`);
    }

    // Update content status to assets_validated
    const { error: updateError } = await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'assets_validated',
        updated_at: new Date().toISOString()
      })
      .eq('content_id', contentId);

    if (updateError) {
      throw new Error(`Failed to update content status: ${updateError.message}`);
    }

    await updateProcessingStage(contentId, 'asset_validation', 'completed');
    
    console.log(`[${contentId}] Asset processing completed successfully`);
    return {
      success: true,
      contentId,
      assetsProcessed: imageUrls.length,
      healthyAssets: healthChecks.filter(check => check.status === 'healthy').length,
      brokenAssets: brokenAssets.length,
      altTextImprovements: altTextImprovements.length,
      assetData: savedAssetData
    };

  } catch (error) {
    console.error(`[${contentId}] Asset processing failed:`, error);
    await updateProcessingStage(contentId, 'asset_validation', 'failed', error.message);
    
    // Update content status to failed
    await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'failed',
        error_logs: [{ stage: 'asset_validation', error: error.message, timestamp: new Date().toISOString() }],
        updated_at: new Date().toISOString()
      })
      .eq('content_id', contentId);

    throw error;
  }
}

// Main request handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content_id } = await req.json();

    if (!content_id) {
      return new Response(
        JSON.stringify({ error: 'content_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await processAssets(content_id);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Asset Manager error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Asset processing failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});