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

// Template mapping based on categories (MVP version)
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
    designPhilosophy: 'Cut through AI hype with clean, minimal design that prioritizes readability and trust. Focus on content over flashy elements.'
  },
  'AI Automation': {
    templateId: 'template_ai_ugc_v1', // Using same template for MVP
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
    designPhilosophy: 'Systematic, process-focused design that guides users through automation workflows with clear visual hierarchy.'
  },
  'Tool Comparisons': {
    templateId: 'template_ai_ugc_v1', // Using same template for MVP
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
    designPhilosophy: 'Data-dense, comparison-focused design with clear visual separation and easy scanning patterns.'
  },
  'AI News': {
    templateId: 'template_ai_ugc_v1', // Using same template for MVP
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
    designPhilosophy: 'News-focused design with emphasis on recency, credibility, and quick consumption patterns.'
  },
  'Builder Stories': {
    templateId: 'template_ai_ugc_v1', // Using same template for MVP
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
    designPhilosophy: 'Story-driven design that creates emotional connection and follows narrative arc with visual storytelling elements.'
  },
  'Trending Opportunities': {
    templateId: 'template_ai_ugc_v1', // Using same template for MVP
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
    designPhilosophy: 'Trend-focused design with emphasis on timeliness, opportunity, and actionable insights with visual momentum.'
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

// Get classified content for design processing
async function getClassifiedContent(contentId: string) {
  const { data, error } = await supabase
    .from('zuhu_content_processing')
    .select('*')
    .eq('content_id', contentId)
    .eq('status', 'classified')
    .single();

  if (error) {
    throw new Error(`Failed to fetch classified content: ${error.message}`);
  }

  return data;
}

// Main design processing logic
async function processDesign(contentId: string) {
  console.log(`[${contentId}] Starting design processing`);
  
  try {
    await updateProcessingStage(contentId, 'design', 'processing');

    // Get the classified content
    const contentData = await getClassifiedContent(contentId);
    const category = contentData.category;
    
    console.log(`[${contentId}] Processing category: ${category}`);

    // Get template configuration for this category
    const templateConfig = TEMPLATE_MAPPING[category] || TEMPLATE_MAPPING['AI Reality Check'];
    
    // Create design directive
    const designDirective = {
      content_id: contentId,
      template_id: templateConfig.templateId,
      design_token_set: templateConfig.designTokenSet,
      component_map: templateConfig.componentMap,
      category: category,
      design_philosophy: templateConfig.designPhilosophy
    };

    // Save design directive to database
    const { data: savedDirective, error: saveError } = await supabase
      .from('design_directives')
      .insert(designDirective)
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save design directive: ${saveError.message}`);
    }

    // Update content status to design_approved
    const { error: updateError } = await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'design_approved',
        updated_at: new Date().toISOString()
      })
      .eq('content_id', contentId);

    if (updateError) {
      throw new Error(`Failed to update content status: ${updateError.message}`);
    }

    await updateProcessingStage(contentId, 'design', 'completed');
    
    console.log(`[${contentId}] Design processing completed successfully`);
    return {
      success: true,
      contentId,
      template: templateConfig.templateId,
      category,
      designDirective: savedDirective
    };

  } catch (error) {
    console.error(`[${contentId}] Design processing failed:`, error);
    await updateProcessingStage(contentId, 'design', 'failed', error.message);
    
    // Update content status to failed
    await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'failed',
        error_logs: [{ stage: 'design', error: error.message, timestamp: new Date().toISOString() }],
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

    const result = await processDesign(content_id);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Design Director AI error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Design processing failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});