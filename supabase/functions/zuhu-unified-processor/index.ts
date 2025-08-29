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

// Template mapping based on categories
const TEMPLATE_MAPPING = {
  'AI Reality Check': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'clean_sans_serif',
      spacing: 'generous_whitespace',
      layout: 'article_focused'
    },
    componentMap: {
      hero: 'minimal_hero',
      content: 'article_body',
      cta: 'subtle_inline_cta',
      navigation: 'clean_breadcrumb'
    },
    designPhilosophy: 'Cut through AI hype with clean, minimal design that prioritizes readability and trust.'
  },
  'AI Automation': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'clean_sans_serif',
      spacing: 'process_oriented',
      layout: 'step_by_step'
    },
    componentMap: {
      hero: 'process_hero',
      content: 'structured_article',
      cta: 'action_oriented_cta',
      navigation: 'progress_breadcrumb'
    },
    designPhilosophy: 'Systematic, process-focused design that guides users through automation workflows.'
  },
  'Tool Comparisons': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'data_focused',
      spacing: 'compact_comparison',
      layout: 'comparison_grid'
    },
    componentMap: {
      hero: 'comparison_hero',
      content: 'table_heavy_article',
      cta: 'decision_helper_cta',
      navigation: 'filter_breadcrumb'
    },
    designPhilosophy: 'Data-dense, comparison-focused design with clear visual separation.'
  },
  'AI News': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'news_readable',
      spacing: 'news_digest',
      layout: 'timeline_focused'
    },
    componentMap: {
      hero: 'news_hero',
      content: 'news_article',
      cta: 'newsletter_cta',
      navigation: 'date_breadcrumb'
    },
    designPhilosophy: 'News-focused design with emphasis on recency and credibility.'
  },
  'Builder Stories': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'narrative_focused',
      spacing: 'story_flow',
      layout: 'narrative_journey'
    },
    componentMap: {
      hero: 'story_hero',
      content: 'narrative_article',
      cta: 'inspiration_cta',
      navigation: 'journey_breadcrumb'
    },
    designPhilosophy: 'Story-driven design that creates emotional connection.'
  },
  'Trending Opportunities': {
    templateId: 'template_ai_ugc_v1',
    designTokenSet: {
      colorScheme: 'minimal_black_white',
      typography: 'opportunity_focused',
      spacing: 'trend_highlight',
      layout: 'opportunity_showcase'
    },
    componentMap: {
      hero: 'trending_hero',
      content: 'opportunity_article',
      cta: 'urgent_action_cta',
      navigation: 'trend_breadcrumb'
    },
    designPhilosophy: 'Trend-focused design with emphasis on timeliness and actionable insights.'
  }
};

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

    await supabase.from('zuhu_processing_stages').insert(stageData);
    console.log(`[${contentId}] ${stage}: ${status}`);
  } catch (error) {
    console.error('Stage update error:', error);
  }
}

// Update content processing status
async function updateContentStatus(contentId: string, status: string, additionalData: any = {}) {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...additionalData
    };

    await supabase
      .from('zuhu_content_processing')
      .update(updateData)
      .eq('content_id', contentId);

    console.log(`[${contentId}] Status updated to: ${status}`);
  } catch (error) {
    console.error('Content status update error:', error);
  }
}

// Bulletproof JSON extraction
function extractJsonFromResponse(responseText: string): any {
  console.log('Attempting to extract JSON from response...');
  
  // Strategy 1: Direct parse
  try {
    const parsed = JSON.parse(responseText.trim());
    console.log('✅ Direct JSON parse successful');
    return parsed;
  } catch (e) {
    console.log('❌ Direct JSON parse failed, trying alternative methods...');
  }

  // Strategy 2: Code blocks
  const codeBlockMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      console.log('✅ JSON code block extraction successful');
      return parsed;
    } catch (e) {
      console.log('❌ JSON code block extraction failed');
    }
  }

  // Strategy 3: Find JSON objects
  const jsonMatches = responseText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
  for (const match of jsonMatches.sort((a, b) => b.length - a.length)) {
    try {
      const parsed = JSON.parse(match);
      if (parsed.classification && parsed.seoElements) {
        console.log('✅ Pattern-matched JSON extraction successful');
        return parsed;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error(`Could not extract valid JSON from response`);
}

// STAGE 1: Content Classification
async function classifyContent(contentId: string, rawContent: any): Promise<any> {
  console.log(`[${contentId}] Starting content classification`);
  await updateProcessingStage(contentId, 'analysis', 'processing');

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `You are the ZUHU Content Intelligence Classifier, specialized in analyzing and classifying content with exponential accuracy and SEO optimization focus for theboringdev's brand standards.

ANALYSIS TARGET:
Content ID: ${contentId}
Raw Content: ${JSON.stringify(rawContent)}

CLASSIFICATION CATEGORIES (Choose the PRIMARY category with highest confidence):
1. "Trending AI Opportunities" - Market trends, emerging technologies, business opportunities
2. "AI Automation" - Workflow optimization, process automation, productivity tools
3. "Tool Comparisons" - Feature analysis, decision frameworks, competitive analysis
4. "AI News" - Industry updates, breaking developments, announcements
5. "AI Reality Check" - Cutting through hype, practical perspectives, honest assessments
6. "Builder Stories" - Success stories, case studies, entrepreneurial journeys

TASK: Analyze the content and provide a detailed JSON response with exponential intelligence:

{
  "classification": {
    "primaryCategory": "Most likely category",
    "confidenceScore": 0.95,
    "categoryScores": {
      "trending": 0.15,
      "automation": 0.85,
      "comparisons": 0.25,
      "news": 0.10,
      "realityCheck": 0.30,
      "builderStories": 0.20
    },
    "reasoning": "Detailed analysis of why this classification was chosen",
    "alternativeCategory": "Second most likely category"
  },
  "seoElements": {
    "titleTag": "Optimized title under 60 characters",
    "metaDescription": "Compelling meta description under 160 characters",
    "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
    "semanticKeywords": ["related1", "related2", "related3"],
    "internalLinks": [
      {"anchor": "link text", "target": "/internal/path/", "relevance": "why this link"}
    ],
    "externalLinks": [
      {"anchor": "link text", "url": "https://external.com", "authority": "high", "relevance": "why this link"}
    ]
  },
  "contentIntelligence": {
    "brandVoiceAlignment": 0.96,
    "valueDensityScore": 0.94,
    "engagementPotential": 0.92,
    "monetizationReadiness": 0.95,
    "uniqueAngles": ["angle1", "angle2"],
    "competitorAdvantage": "What makes this content unique"
  },
  "qualityMetrics": {
    "contentCompleteness": 0.97,
    "technicalAccuracy": 0.96,
    "brandCompliance": 0.98,
    "processingComplexity": "high",
    "recommendedNextStep": "proceed_to_design"
  }
}

Respond with ONLY the JSON object, no additional text.`;

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
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const result = await response.json();
    const responseText = result.content[0].text;
    const classification = extractJsonFromResponse(responseText);

    await updateProcessingStage(contentId, 'analysis', 'completed');
    console.log(`[${contentId}] Classification completed successfully`);
    
    return classification;
  } catch (error) {
    await updateProcessingStage(contentId, 'analysis', 'failed', error.message);
    throw error;
  }
}

// STAGE 2: Design Assignment
async function assignDesign(contentId: string, category: string): Promise<any> {
  console.log(`[${contentId}] Starting design assignment for category: ${category}`);
  await updateProcessingStage(contentId, 'design', 'processing');

  try {
    const templateConfig = TEMPLATE_MAPPING[category] || TEMPLATE_MAPPING['AI Reality Check'];
    
    const designDirective = {
      content_id: contentId,
      template_id: templateConfig.templateId,
      design_token_set: templateConfig.designTokenSet,
      component_map: templateConfig.componentMap,
      category: category,
      design_philosophy: templateConfig.designPhilosophy
    };

    const { data: savedDirective, error } = await supabase
      .from('design_directives')
      .insert(designDirective)
      .select()
      .single();

    if (error) throw error;

    await updateProcessingStage(contentId, 'design', 'completed');
    console.log(`[${contentId}] Design assignment completed`);
    
    return savedDirective;
  } catch (error) {
    await updateProcessingStage(contentId, 'design', 'failed', error.message);
    throw error;
  }
}

// STAGE 3: Asset Validation
async function validateAssets(contentId: string, rawContent: any, category: string): Promise<any> {
  console.log(`[${contentId}] Starting asset validation`);
  await updateProcessingStage(contentId, 'asset_validation', 'processing');

  try {
    // Extract image URLs
    const imageUrls: string[] = [];
    
    if (rawContent && Array.isArray(rawContent) && rawContent[0]?.shipped_content) {
      const shippedContent = rawContent[0].shipped_content;
      
      // Extract from markdown images
      const markdownMatches = shippedContent.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/g);
      if (markdownMatches) {
        markdownMatches.forEach((match: string) => {
          const urlMatch = match.match(/\((https?:\/\/[^\)]+)\)/);
          if (urlMatch) imageUrls.push(urlMatch[1]);
        });
      }

      // Extract from [IMAGE: url] format
      const imageTagMatches = shippedContent.match(/\[IMAGE:\s*(https?:\/\/[^\]]+)\]/g);
      if (imageTagMatches) {
        imageTagMatches.forEach((match: string) => {
          const urlMatch = match.match(/\[IMAGE:\s*(https?:\/\/[^\]]+)\]/);
          if (urlMatch) imageUrls.push(urlMatch[1]);
        });
      }
    }

    // Extract from image_seo_details
    if (rawContent && Array.isArray(rawContent) && rawContent[0]?.image_seo_details) {
      const imageSeoDetails = rawContent[0].image_seo_details;
      if (Array.isArray(imageSeoDetails)) {
        imageSeoDetails.forEach((detail: any) => {
          if (detail.url) imageUrls.push(detail.url);
        });
      }
    }

    const uniqueUrls = [...new Set(imageUrls)];
    console.log(`[${contentId}] Found ${uniqueUrls.length} images to validate`);

    // Health check all URLs
    const healthChecks = await Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return {
            url,
            status: response.ok ? 'healthy' : 'broken',
            statusCode: response.status
          };
        } catch {
          return { url, status: 'broken', statusCode: 0 };
        }
      })
    );

    const brokenAssets = healthChecks.filter(check => check.status === 'broken');
    const validatedAssets = healthChecks.map(check => ({
      url: check.url,
      healthStatus: check.status,
      statusCode: check.statusCode,
      altTextScore: 85, // Default score for MVP
      needsImprovement: false
    }));

    const assetDataRecord = {
      content_id: contentId,
      asset_urls: uniqueUrls,
      validated_assets: validatedAssets,
      asset_health_check: {
        totalAssets: uniqueUrls.length,
        healthyAssets: healthChecks.filter(check => check.status === 'healthy').length,
        brokenAssets: brokenAssets.length,
        brokenUrls: brokenAssets.map(asset => asset.url)
      },
      alt_text_improvements: [],
      validation_errors: brokenAssets.map(asset => ({
        url: asset.url,
        error: `HTTP ${asset.statusCode}: Asset not accessible`
      }))
    };

    const { data: savedAssetData, error } = await supabase
      .from('asset_data')
      .insert(assetDataRecord)
      .select()
      .single();

    if (error) throw error;

    await updateProcessingStage(contentId, 'asset_validation', 'completed');
    console.log(`[${contentId}] Asset validation completed`);
    
    return savedAssetData;
  } catch (error) {
    await updateProcessingStage(contentId, 'asset_validation', 'failed', error.message);
    throw error;
  }
}

// UNIFIED PROCESSING PIPELINE
async function processContent(contentId: string, rawContent: any) {
  const processingStartTime = Date.now();
  console.log(`[${contentId}] Starting unified content processing pipeline`);

  try {
    // Insert initial record
    await supabase.from('zuhu_content_processing').insert({
      content_id: contentId,
      raw_content: rawContent,
      status: 'received',
      processing_start: new Date().toISOString()
    });

    // STAGE 1: Content Classification
    await updateContentStatus(contentId, 'analyzing');
    const classificationResult = await classifyContent(contentId, rawContent);
    const category = classificationResult.classification.primaryCategory;
    
    await updateContentStatus(contentId, 'classified', {
      category: category,
      confidence_score: classificationResult.classification.confidenceScore,
      seo_elements: classificationResult.seoElements,
      content_intelligence: classificationResult.contentIntelligence,
      quality_metrics: classificationResult.qualityMetrics
    });

    // STAGE 2: Design Assignment
    await updateContentStatus(contentId, 'design_processing');
    const designResult = await assignDesign(contentId, category);
    await updateContentStatus(contentId, 'design_approved');

    // STAGE 3: Asset Validation
    await updateContentStatus(contentId, 'asset_processing');
    const assetResult = await validateAssets(contentId, rawContent, category);
    await updateContentStatus(contentId, 'assets_validated');

    // Final completion
    const processingTime = Date.now() - processingStartTime;
    await updateContentStatus(contentId, 'completed', {
      processing_end: new Date().toISOString()
    });

    console.log(`[${contentId}] Unified processing completed in ${processingTime}ms`);

    return {
      success: true,
      contentId,
      processingTime,
      classification: classificationResult,
      design: designResult,
      assets: assetResult,
      finalStatus: 'completed'
    };

  } catch (error) {
    console.error(`[${contentId}] Pipeline failed:`, error);
    await updateContentStatus(contentId, 'failed', {
      error_logs: [{ error: error.message, stage: 'pipeline', timestamp: new Date().toISOString() }],
      processing_end: new Date().toISOString()
    });
    throw error;
  }
}

// Main request handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content_id, raw_content } = await req.json();

    if (!content_id || !raw_content) {
      return new Response(
        JSON.stringify({ error: 'content_id and raw_content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await processContent(content_id, raw_content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unified processor error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Processing pipeline failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});