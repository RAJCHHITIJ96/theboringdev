import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QualityMetrics {
  word_count?: number;
  seo_score?: number;
  readability_score?: number;
  image_count?: number;
  code_examples?: number;
}

interface QualityApprovalResult {
  success: boolean;
  content_id: string;
  old_status: string;
  new_status: string;
  quality_score: number;
  approval_reason: string;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Quality Approval Agent: Starting quality check process...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all content with seo_optimized status
    const { data: pendingContent, error: fetchError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('status', 'seo_optimized');

    if (fetchError) {
      throw new Error(`Failed to fetch pending content: ${fetchError.message}`);
    }

    if (!pendingContent || pendingContent.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No content pending quality approval',
        processed_count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📋 Found ${pendingContent.length} items for quality approval`);
    const results: QualityApprovalResult[] = [];

    for (const content of pendingContent) {
      try {
        console.log(`🔍 Evaluating content: ${content.content_id}`);

        // Extract quality metrics
        const qualityMetrics: QualityMetrics = content.quality_metrics || {};
        const seoElements = content.seo_elements || {};
        
        // Calculate quality score based on multiple factors
        let qualityScore = 0;
        let approvalReasons: string[] = [];

        // Word count check (minimum 1500 words)
        const wordCount = qualityMetrics.word_count || 0;
        if (wordCount >= 1500) {
          qualityScore += 25;
          approvalReasons.push(`Good word count (${wordCount} words)`);
        } else {
          console.warn(`⚠️ Low word count for ${content.content_id}: ${wordCount}`);
        }

        // SEO elements check
        if (seoElements.title && seoElements.description) {
          qualityScore += 20;
          approvalReasons.push('SEO elements present');
        }

        // Images check
        const imageCount = qualityMetrics.image_count || 0;
        if (imageCount >= 2) {
          qualityScore += 15;
          approvalReasons.push(`Good visual content (${imageCount} images)`);
        }

        // Code examples check
        const codeExamples = qualityMetrics.code_examples || 0;
        if (codeExamples >= 1) {
          qualityScore += 10;
          approvalReasons.push(`Includes code examples (${codeExamples})`);
        }

        // Content intelligence check
        if (content.content_intelligence && Object.keys(content.content_intelligence).length > 0) {
          qualityScore += 15;
          approvalReasons.push('Content intelligence processed');
        }

        // Processing time check (not too fast = more likely to be quality)
        const processingStart = new Date(content.processing_start);
        const processingEnd = new Date(content.processing_end || new Date());
        const processingMinutes = (processingEnd.getTime() - processingStart.getTime()) / (1000 * 60);
        
        if (processingMinutes >= 2) {
          qualityScore += 15;
          approvalReasons.push(`Adequate processing time (${Math.round(processingMinutes)}min)`);
        }

        console.log(`📊 Quality score for ${content.content_id}: ${qualityScore}/100`);

        // Approve if quality score is 70 or higher, or if it's been processed for over 24 hours
        const contentAge = (new Date().getTime() - new Date(content.created_at).getTime()) / (1000 * 60 * 60);
        const shouldApprove = qualityScore >= 70 || contentAge >= 24;

        if (shouldApprove) {
          // Update status to approved_for_publishing
          const { error: updateError } = await supabase
            .from('zuhu_content_processing')
            .update({
              status: 'approved_for_publishing',
              quality_metrics: {
                ...qualityMetrics,
                quality_approval_score: qualityScore,
                approved_at: new Date().toISOString()
              }
            })
            .eq('content_id', content.content_id);

          if (updateError) {
            console.error(`❌ Failed to update status for ${content.content_id}:`, updateError);
            continue;
          }

          const result: QualityApprovalResult = {
            success: true,
            content_id: content.content_id,
            old_status: 'seo_optimized',
            new_status: 'approved_for_publishing',
            quality_score: qualityScore,
            approval_reason: contentAge >= 24 ? 'Auto-approved after 24h' : approvalReasons.join(', '),
            timestamp: new Date().toISOString()
          };

          results.push(result);
          console.log(`✅ Approved content: ${content.content_id} (Score: ${qualityScore})`);

        } else {
          console.log(`⏳ Content ${content.content_id} needs more quality improvements (Score: ${qualityScore})`);
        }

      } catch (error) {
        console.error(`❌ Error processing ${content.content_id}:`, error);
        continue;
      }
    }

    // If we approved any content, trigger the autonomous publishing scheduler
    if (results.length > 0) {
      console.log(`🚀 Triggering autonomous publishing for ${results.length} approved items...`);
      
      try {
        const schedulerResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/autonomous-publishing-scheduler`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ trigger_source: 'quality_approval_agent' })
        });

        if (!schedulerResponse.ok) {
          console.warn('⚠️ Failed to trigger autonomous publishing scheduler');
        }
      } catch (triggerError) {
        console.warn('⚠️ Error triggering autonomous publishing:', triggerError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed_count: pendingContent.length,
      approved_count: results.length,
      approved_content: results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Quality Approval Agent Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});