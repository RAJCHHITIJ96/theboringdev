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

// Extract all assets from the new structured input format
function extractAssetsFromStructuredInput(content: any) {
  const assets = {
    images: [],
    tables: [],
    charts: [],
    code_snippets: [],
    video_embeds: []
  };

  try {
    console.log('Extracting assets from structured content...');
    
    // Check if we have the new structured format
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.assets_manager_details) {
      const assetDetails = content.raw_content[0].assets_manager_details;
      console.log('Found structured assets_manager_details:', JSON.stringify(assetDetails, null, 2));
      
      // Extract images
      if (assetDetails.images && Array.isArray(assetDetails.images)) {
        assetDetails.images.forEach((imageObj: any, index: number) => {
          Object.keys(imageObj).forEach(key => {
            const imageData = imageObj[key];
            if (imageData && imageData.link) {
              assets.images.push({
                id: key,
                url: imageData.link,
                alt_text: imageData.alt_text || '',
                placement: imageData.where_to_place || '',
                index
              });
            }
          });
        });
      }

      // Extract tables
      if (assetDetails.tables && Array.isArray(assetDetails.tables)) {
        assetDetails.tables.forEach((tableObj: any, index: number) => {
          Object.keys(tableObj).forEach(key => {
            const tableData = tableObj[key];
            if (tableData) {
              assets.tables.push({
                id: key,
                title: tableData.title || '',
                description: tableData.description || '',
                placement: tableData.where_to_place || '',
                index
              });
            }
          });
        });
      }

      // Extract charts
      if (assetDetails.charts && Array.isArray(assetDetails.charts)) {
        assetDetails.charts.forEach((chartObj: any, index: number) => {
          Object.keys(chartObj).forEach(key => {
            const chartData = chartObj[key];
            if (chartData) {
              assets.charts.push({
                id: key,
                data: chartData.data || '',
                description: chartData.description || '',
                placement: chartData.where_to_place || '',
                index
              });
            }
          });
        });
      }

      // Extract code snippets
      if (assetDetails.code_snippets && Array.isArray(assetDetails.code_snippets)) {
        assetDetails.code_snippets.forEach((codeObj: any, index: number) => {
          Object.keys(codeObj).forEach(key => {
            const codeData = codeObj[key];
            if (codeData) {
              assets.code_snippets.push({
                id: key,
                code: codeData.code || '',
                description: codeData.description || '',
                placement: codeData.where_to_place || '',
                index
              });
            }
          });
        });
      }

      // Extract video embeds
      if (assetDetails.video_embeds && Array.isArray(assetDetails.video_embeds)) {
        assetDetails.video_embeds.forEach((videoObj: any, index: number) => {
          Object.keys(videoObj).forEach(key => {
            const videoData = videoObj[key];
            if (videoData) {
              assets.video_embeds.push({
                id: key,
                embed_link: videoData.embed_link || '',
                description: videoData.description || '',
                placement: videoData.where_to_place || '',
                index
              });
            }
          });
        });
      }
    } else {
      // Fallback: Try to extract from legacy format
      console.log('No structured assets found, attempting legacy extraction...');
      assets.images = extractLegacyImageUrls(content);
    }

    console.log(`Extracted ${assets.images.length} images, ${assets.tables.length} tables, ${assets.charts.length} charts, ${assets.code_snippets.length} code snippets, ${assets.video_embeds.length} video embeds`);
    
  } catch (error) {
    console.error('Error extracting assets from structured input:', error);
  }

  return assets;
}

// Legacy image extraction for backward compatibility
function extractLegacyImageUrls(content: any): any[] {
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
    console.error('Error extracting legacy image URLs:', error);
  }

  // Convert to new format
  return [...new Set(imageUrls)].map((url, index) => ({
    id: `legacy_image_${index}`,
    url,
    alt_text: '',
    placement: '',
    index
  }));
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

// Extract SEO details from structured input
function extractSeoDetails(content: any) {
  try {
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.seo_details) {
      return content.raw_content[0].seo_details;
    }
  } catch (error) {
    console.error('Error extracting SEO details:', error);
  }
  return null;
}

// Get existing alt text from content (legacy or structured)
function getExistingAltText(content: any, imageUrl: string): string {
  try {
    // Check structured format first
    if (content.raw_content && Array.isArray(content.raw_content) && content.raw_content[0]?.assets_manager_details?.images) {
      const images = content.raw_content[0].assets_manager_details.images;
      for (const imageObj of images) {
        for (const key of Object.keys(imageObj)) {
          const imageData = imageObj[key];
          if (imageData && imageData.link === imageUrl && imageData.alt_text) {
            return imageData.alt_text;
          }
        }
      }
    }
    
    // Fallback to legacy format
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

// Main asset processing logic - BULLETPROOF VERSION
async function processAssets(contentId: string) {
  console.log(`[${contentId}] 🚀 Starting bulletproof asset processing`);
  
  try {
    await updateProcessingStage(contentId, 'asset_processing', 'processing');

    // Get the design-approved content
    const contentData = await getDesignApprovedContent(contentId);
    const category = contentData.category || 'General';
    
    console.log(`[${contentId}] Processing assets for category: ${category}`);
    console.log(`[${contentId}] Raw content structure:`, JSON.stringify(contentData.raw_content, null, 2));

    // Extract all assets from structured input
    const extractedAssets = extractAssetsFromStructuredInput(contentData);
    
    // Extract SEO details
    const seoDetails = extractSeoDetails(contentData);
    console.log(`[${contentId}] SEO details:`, seoDetails);

    // Process images with health checks and alt text improvements
    const processedImages: any[] = [];
    const altTextImprovements: any[] = [];
    
    if (extractedAssets.images.length > 0) {
      console.log(`[${contentId}] Processing ${extractedAssets.images.length} images`);
      
      for (const imageAsset of extractedAssets.images) {
        const healthCheck = await checkUrlHealth(imageAsset.url);
        const existingAltText = imageAsset.alt_text || getExistingAltText(contentData, imageAsset.url);
        
        let altTextResult = null;
        if (healthCheck?.status === 'healthy') {
          try {
            altTextResult = await improveAltTextWithClaude(imageAsset.url, existingAltText, category);
          } catch (error) {
            console.error(`[${contentId}] Alt text improvement failed for ${imageAsset.url}:`, error);
          }
        }

        const processedImage = {
          id: imageAsset.id,
          url: imageAsset.url,
          placement: imageAsset.placement,
          originalAltText: existingAltText,
          improvedAltText: altTextResult?.improvedAltText || existingAltText,
          altTextScore: altTextResult?.score || 0,
          needsImprovement: altTextResult?.needsImprovement || false,
          healthStatus: healthCheck?.status || 'unknown',
          statusCode: healthCheck?.statusCode,
          index: imageAsset.index
        };

        processedImages.push(processedImage);
        
        if (altTextResult?.needsImprovement) {
          altTextImprovements.push({
            id: imageAsset.id,
            url: imageAsset.url,
            originalAltText: existingAltText,
            improvedAltText: altTextResult.improvedAltText,
            score: altTextResult.score,
            reasoning: altTextResult.reasoning
          });
        }
      }
    }

    // Count healthy and broken assets
    const healthyImages = processedImages.filter(img => img.healthStatus === 'healthy').length;
    const brokenImages = processedImages.filter(img => img.healthStatus === 'broken');
    
    // Create comprehensive asset data record
    const assetDataRecord = {
      content_id: contentId,
      asset_urls: extractedAssets.images.map(img => img.url), // For backward compatibility
      validated_assets: {
        images: processedImages,
        tables: extractedAssets.tables,
        charts: extractedAssets.charts,
        code_snippets: extractedAssets.code_snippets,
        video_embeds: extractedAssets.video_embeds,
        seo_details: seoDetails
      },
      asset_health_check: {
        totalAssets: extractedAssets.images.length + extractedAssets.tables.length + 
                    extractedAssets.charts.length + extractedAssets.code_snippets.length + 
                    extractedAssets.video_embeds.length,
        totalImages: extractedAssets.images.length,
        healthyImages,
        brokenImages: brokenImages.length,
        brokenUrls: brokenImages.map(asset => asset.url),
        tablesCount: extractedAssets.tables.length,
        chartsCount: extractedAssets.charts.length,
        codeSnippetsCount: extractedAssets.code_snippets.length,
        videoEmbedsCount: extractedAssets.video_embeds.length
      },
      alt_text_improvements: altTextImprovements,
      validation_errors: brokenImages.map(asset => ({
        id: asset.id,
        url: asset.url,
        error: `HTTP ${asset.statusCode}: Asset not accessible`
      }))
    };

    console.log(`[${contentId}] Asset summary: ${assetDataRecord.asset_health_check.totalAssets} total assets processed`);

    // Save asset data to database
    const { data: savedAssetData, error: saveError } = await supabase
      .from('asset_data')
      .insert(assetDataRecord)
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save asset data: ${saveError.message}`);
    }

    // CRITICAL FIX: Update content status to 'assets_processed' (not 'assets_validated')
    const { error: updateError } = await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'assets_processed', // ✅ CORRECT STATUS
        updated_at: new Date().toISOString()
      })
      .eq('content_id', contentId);

    if (updateError) {
      throw new Error(`Failed to update content status: ${updateError.message}`);
    }

    await updateProcessingStage(contentId, 'asset_processing', 'completed');
    
    console.log(`[${contentId}] ✅ Asset processing completed successfully`);
    return {
      success: true,
      contentId,
      assetsProcessed: assetDataRecord.asset_health_check.totalAssets,
      imagesProcessed: extractedAssets.images.length,
      healthyImages,
      brokenImages: brokenImages.length,
      tablesProcessed: extractedAssets.tables.length,
      chartsProcessed: extractedAssets.charts.length,
      codeSnippetsProcessed: extractedAssets.code_snippets.length,
      videoEmbedsProcessed: extractedAssets.video_embeds.length,
      altTextImprovements: altTextImprovements.length,
      assetData: savedAssetData,
      seoDetailsExtracted: !!seoDetails
    };

  } catch (error) {
    console.error(`[${contentId}] ❌ Asset processing failed:`, error);
    await updateProcessingStage(contentId, 'asset_processing', 'failed', error.message);
    
    // Update content status to failed
    await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'failed',
        error_logs: [{ stage: 'asset_processing', error: error.message, timestamp: new Date().toISOString() }],
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