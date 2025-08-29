import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Content Classifier Prompt
const CONTENT_CLASSIFIER_PROMPT = `
You are the ZUHU Content Intelligence Classifier with EXPONENTIAL ANALYSIS POWER.

SYSTEM IDENTITY:
- Primary Function: Intelligent content classification and SEO extraction
- Brand: theboringdev (Chhitij's AI authority platform)
- Mission: Transform raw content into strategically classified, SEO-optimized intelligence

INPUT CONTENT TO ANALYZE:
{{rawContent}}

CLASSIFICATION CATEGORIES (with Advanced Intelligence Matching):

**1. Trending AI Opportunities**
- Keywords: emerging, new, opportunity, market gap, before everyone, early adoption, first mover, untapped, breakthrough
- Content Pattern: Forward-looking, opportunity-focused, market timing emphasis
- Brand Voice: "You gotta see this opportunity before everyone else does"
- SEO Focus: Trend keywords, early adoption terms, opportunity language

**2. AI Automation** 
- Keywords: workflow, productivity, ROI, system, process, automated, efficiency, streamline, optimize, time-saving
- Content Pattern: Practical implementation, measurable results, system building
- Brand Voice: "Here's what actually works in practice"
- SEO Focus: Implementation keywords, ROI terms, automation benefits

**3. Tool Comparisons**
- Keywords: vs, comparison, best, review, analysis, which tool, better, features, pricing, evaluation
- Content Pattern: Data-driven analysis, feature breakdowns, testing results
- Brand Voice: "Let me show you the uncomfortable truth about these tools"
- SEO Focus: Comparison keywords, tool names, evaluation terms

**4. AI News**
- Keywords: launched, announced, update, breaking, latest, released, news, happened, event, development
- Content Pattern: Current events with actionable insights, what happened + why it matters
- Brand Voice: "Here's what happened and what you need to do about it"
- SEO Focus: News keywords, trending events, current terms

**5. AI Reality Check**
- Keywords: hype, reality, truth, debunked, actually works, myth, facts, honest review, real talk, cut through
- Content Pattern: Hype-busting with practical alternatives, myth vs reality
- Brand Voice: "Time to separate the signal from the noise"
- SEO Focus: Reality-check keywords, myth-busting terms, truth language

**6. Builder Stories**
- Keywords: built, journey, experience, learned, case study, how I, behind scenes, lessons, mistakes, wins
- Content Pattern: Personal experiences, real developer stories, practical lessons
- Brand Voice: "Here's what actually worked when I built this"
- SEO Focus: Experience keywords, tutorial terms, story language

INTELLIGENCE ANALYSIS REQUIREMENTS:

1. **Category Classification** (99.5% accuracy target)
   - Analyze content against all 6 categories
   - Score each category (0-100)
   - Select highest scoring category
   - Provide confidence score and reasoning

2. **SEO Element Extraction**
   - Title Tag: Extract/optimize (under 60 chars, include primary keyword)
   - Meta Description: Craft compelling description (under 160 chars)
   - Primary Keywords: Identify 3-5 main keywords
   - Semantic Keywords: Extract 5-8 related terms
   - Internal Link Opportunities: Find 3-5 strategic linking points
   - External Link Validation: Check authority and relevance

3. **Content Intelligence Assessment**
   - Brand Voice Alignment (theboringdev persona match)
   - Value Density Score (practical vs fluff ratio)
   - Engagement Potential (dopamine triggers, hook strength)
   - Monetization Readiness (natural product integration points)

4. **Quality Validation**
   - Content Completeness Check
   - Technical Accuracy Verification  
   - Brand Guidelines Compliance
   - Competitor Advantage Assessment

CRITICAL OUTPUT FORMAT (Clean JSON Only):
{
  "classification": {
    "primaryCategory": "category_name",
    "confidenceScore": 0.98,
    "categoryScores": {
      "trending": 0.95,
      "automation": 0.30,
      "comparisons": 0.20,
      "news": 0.15,
      "realityCheck": 0.10,
      "builderStories": 0.25
    },
    "reasoning": "Detailed analysis of why this category was selected",
    "alternativeCategory": "second_best_option"
  },
  "seoElements": {
    "titleTag": "Optimized title under 60 chars",
    "metaDescription": "Compelling description under 160 chars", 
    "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
    "semanticKeywords": ["related1", "related2", "related3", "related4", "related5"],
    "internalLinks": [
      {"anchor": "anchor text", "target": "/internal-url/", "relevance": "why relevant"},
      {"anchor": "anchor text 2", "target": "/another-url/", "relevance": "connection reason"}
    ],
    "externalLinks": [
      {"anchor": "link text", "url": "https://authority-source.com", "authority": "high", "relevance": "why included"}
    ]
  },
  "contentIntelligence": {
    "brandVoiceAlignment": 0.94,
    "valueDensityScore": 0.91,
    "engagementPotential": 0.96,
    "monetizationReadiness": 0.88,
    "uniqueAngles": ["angle1", "angle2"],
    "competitorAdvantage": "how this beats competition"
  },
  "qualityMetrics": {
    "contentCompleteness": 0.93,
    "technicalAccuracy": 0.95,
    "brandCompliance": 0.97,
    "processingComplexity": "medium",
    "recommendedNextStep": "proceed_to_page_generation"
  },
  "systemMetadata": {
    "processingTime": "2.3s",
    "tokensUsed": 1847,
    "apiCalls": 1,
    "timestamp": "2025-08-29T10:30:00Z",
    "agentVersion": "classifier_v1.0"
  }
}

CRITICAL SUCCESS FACTORS:
- Return ONLY clean JSON, no additional text or explanations
- Maintain 99.5% classification accuracy
- Integrate all ecosystem intelligence for decision making
- Prepare content for seamless handoff to Page Generation system
- Ensure theboringdev brand voice consistency throughout analysis
`;

// Log processing stage
async function logStage(contentId: string, stage: string, status: string, errorMessage?: string) {
  console.log(`[${contentId}] ${stage}: ${status}${errorMessage ? ` - ${errorMessage}` : ''}`);
  
  const { error } = await supabase
    .from('zuhu_processing_stages')
    .insert({
      content_id: contentId,
      stage,
      status,
      error_message: errorMessage,
      started_at: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null
    });

  if (error) {
    console.error('Failed to log stage:', error);
  }
}

// Update content processing status
async function updateProcessingStatus(contentId: string, status: string, data?: any) {
  console.log(`[${contentId}] Updating status to: ${status}`);
  
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (data) {
    if (data.category) updateData.category = data.category;
    if (data.confidence_score) updateData.confidence_score = data.confidence_score;
    if (data.seo_elements) updateData.seo_elements = data.seo_elements;
    if (data.content_intelligence) updateData.content_intelligence = data.content_intelligence;
    if (data.quality_metrics) updateData.quality_metrics = data.quality_metrics;
    if (data.processed_content) updateData.processed_content = data.processed_content;
    if (data.error_logs) updateData.error_logs = data.error_logs;
  }

  if (status === 'completed' || status === 'failed') {
    updateData.processing_end = new Date().toISOString();
  }

  const { error } = await supabase
    .from('zuhu_content_processing')
    .update(updateData)
    .eq('content_id', contentId);

  if (error) {
    console.error('Failed to update processing status:', error);
    throw error;
  }
}

// Call Claude API for content classification
async function classifyWithClaude(rawContent: any): Promise<any> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = CONTENT_CLASSIFIER_PROMPT.replace('{{rawContent}}', JSON.stringify(rawContent, null, 2));

  console.log('Calling Claude API for content classification...');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API Error:', errorText);
    throw new Error(`Claude API failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Claude API response received');

  if (!result.content || !result.content[0] || !result.content[0].text) {
    throw new Error('Invalid response format from Claude API');
  }

  // Extract JSON from Claude's response
  const responseText = result.content[0].text;
  
  try {
    // Try to parse the entire response as JSON first
    return JSON.parse(responseText);
  } catch {
    // If that fails, try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not extract valid JSON from Claude response');
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { content_id, raw_content } = await req.json();

    if (!content_id || !raw_content) {
      return new Response(
        JSON.stringify({ error: 'Missing content_id or raw_content' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[${content_id}] Starting content classification process`);

    // Log analysis stage start
    await logStage(content_id, 'analysis', 'processing');
    await updateProcessingStatus(content_id, 'analyzing');

    try {
      // Classify content with Claude
      const classificationResult = await classifyWithClaude(raw_content);
      
      console.log(`[${content_id}] Classification completed successfully`);

      // Log analysis stage completion
      await logStage(content_id, 'analysis', 'completed');

      // Update processing record with results
      await updateProcessingStatus(content_id, 'classified', {
        category: classificationResult.classification?.primaryCategory,
        confidence_score: classificationResult.classification?.confidenceScore,
        seo_elements: classificationResult.seoElements,
        content_intelligence: classificationResult.contentIntelligence,
        quality_metrics: classificationResult.qualityMetrics,
        processed_content: {
          classification: classificationResult.classification,
          seo_elements: classificationResult.seoElements,
          content_intelligence: classificationResult.contentIntelligence,
          quality_metrics: classificationResult.qualityMetrics,
          system_metadata: {
            ...classificationResult.systemMetadata,
            processingTime: `${(Date.now() - startTime) / 1000}s`,
            timestamp: new Date().toISOString()
          }
        }
      });

      console.log(`[${content_id}] Content classification process completed in ${Date.now() - startTime}ms`);

      return new Response(
        JSON.stringify({
          success: true,
          content_id,
          classification: classificationResult.classification,
          seo_elements: classificationResult.seoElements,
          processing_time: Date.now() - startTime
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (classificationError: any) {
      console.error(`[${content_id}] Classification failed:`, classificationError);

      // Log analysis stage failure
      await logStage(content_id, 'analysis', 'failed', classificationError.message);
      
      // Update status to failed with error details
      await updateProcessingStatus(content_id, 'failed', {
        error_logs: {
          stage: 'analysis',
          error: classificationError.message,
          timestamp: new Date().toISOString(),
          processing_time: Date.now() - startTime
        }
      });

      return new Response(
        JSON.stringify({ 
          error: 'Classification failed', 
          details: classificationError.message,
          content_id
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: any) {
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});