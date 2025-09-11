import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QualityCheckResult {
  approved: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Starting Quality Approval Agent...');

    // Find content ready for quality review
    const { data: seoOptimizedContent, error: fetchError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('status', 'seo_optimized')
      .order('updated_at', { ascending: true })
      .limit(5);

    if (fetchError) {
      console.error('Error fetching SEO optimized content:', fetchError);
      throw fetchError;
    }

    if (!seoOptimizedContent || seoOptimizedContent.length === 0) {
      console.log('No content ready for quality approval');
      return new Response(JSON.stringify({ 
        message: 'No content ready for quality approval',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const content of seoOptimizedContent) {
      console.log(`🔍 Quality checking content: ${content.content_id}`);
      
      try {
        // Get the generated page for this content
        const { data: generatedPage } = await supabase
          .from('generated_pages')
          .select('*')
          .eq('content_id', content.content_id)
          .single();

        if (!generatedPage) {
          console.log(`No generated page found for ${content.content_id}`);
          continue;
        }

        // Perform quality checks
        const qualityResult = await performQualityCheck(generatedPage, content);
        
        // Create quality audit record
        const { data: auditRecord } = await supabase
          .from('quality_audits')
          .insert({
            content_id: content.content_id,
            audit_type: 'comprehensive',
            quality_score: qualityResult.score,
            audit_results: {
              seo_score: generatedPage.performance_metrics?.seoScore || 0,
              content_quality: qualityResult.score,
              technical_issues: qualityResult.issues.length,
              readability: calculateReadabilityScore(generatedPage.page_content)
            },
            issues_found: qualityResult.issues,
            recommendations: qualityResult.recommendations,
            status: qualityResult.approved ? 'passed' : 'failed'
          })
          .select()
          .single();

        if (qualityResult.approved) {
          // Auto-approve for publishing
          const { error: updateError } = await supabase
            .from('zuhu_content_processing')
            .update({ 
              status: 'approved_for_publishing',
              updated_at: new Date().toISOString(),
              quality_audit_id: auditRecord?.id
            })
            .eq('content_id', content.content_id);

          if (updateError) {
            console.error(`Error updating status for ${content.content_id}:`, updateError);
          } else {
            console.log(`✅ Auto-approved ${content.content_id} for publishing`);
            
            // Log status transition
            await supabase
              .from('zuhu_status_transitions')
              .insert({
                content_id: content.content_id,
                from_status: 'seo_optimized',
                to_status: 'approved_for_publishing',
                agent_name: 'quality-approval-agent',
                metadata: { 
                  quality_score: qualityResult.score,
                  auto_approved: true,
                  audit_id: auditRecord?.id
                }
              });
          }
        } else {
          // Mark for manual review
          const { error: updateError } = await supabase
            .from('zuhu_content_processing')
            .update({ 
              status: 'requires_manual_review',
              updated_at: new Date().toISOString(),
              quality_audit_id: auditRecord?.id,
              error_logs: [{
                timestamp: new Date().toISOString(),
                agent: 'quality-approval-agent',
                message: 'Quality check failed',
                details: qualityResult.issues
              }]
            })
            .eq('content_id', content.content_id);

          if (!updateError) {
            console.log(`⚠️ Content ${content.content_id} requires manual review`);
            
            // Log status transition
            await supabase
              .from('zuhu_status_transitions')
              .insert({
                content_id: content.content_id,
                from_status: 'seo_optimized',
                to_status: 'requires_manual_review',
                agent_name: 'quality-approval-agent',
                metadata: { 
                  quality_score: qualityResult.score,
                  issues_count: qualityResult.issues.length,
                  audit_id: auditRecord?.id
                }
              });
          }
        }

        results.push({
          content_id: content.content_id,
          approved: qualityResult.approved,
          quality_score: qualityResult.score,
          issues_count: qualityResult.issues.length
        });

      } catch (contentError) {
        console.error(`Error processing ${content.content_id}:`, contentError);
        results.push({
          content_id: content.content_id,
          error: contentError.message
        });
      }
    }

    console.log(`✅ Quality Approval Agent completed. Processed ${results.length} items`);

    return new Response(JSON.stringify({
      message: 'Quality approval process completed',
      processed: results.length,
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Quality Approval Agent error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Quality approval process failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performQualityCheck(generatedPage: any, content: any): Promise<QualityCheckResult> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check if page has content
  if (!generatedPage.page_content || generatedPage.page_content.length < 500) {
    issues.push('Page content is too short (< 500 characters)');
    score -= 30;
  }

  // Check metadata completeness
  const metadata = generatedPage.page_metadata;
  if (!metadata?.title || metadata.title === 'Untitled') {
    issues.push('Missing or invalid title');
    score -= 25;
  }

  if (!metadata?.description) {
    issues.push('Missing meta description');
    score -= 20;
  }

  if (!metadata?.category) {
    issues.push('Missing category');
    score -= 15;
  }

  // Check SEO score
  const seoScore = generatedPage.performance_metrics?.seoScore || 0;
  if (seoScore < 70) {
    issues.push(`Low SEO score: ${seoScore}/100`);
    score -= 20;
  }

  // Check for required elements
  const pageContent = generatedPage.page_content.toLowerCase();
  if (!pageContent.includes('<h1')) {
    issues.push('Missing H1 tag');
    score -= 10;
  }

  if (!pageContent.includes('meta name="description"')) {
    issues.push('Missing meta description tag');
    score -= 10;
  }

  // Generate recommendations
  if (issues.length > 0) {
    recommendations.push('Fix all identified issues before publishing');
  }
  
  if (seoScore < 80) {
    recommendations.push('Improve SEO optimization');
  }

  if (score < 50) {
    recommendations.push('Content requires significant improvements');
  }

  // Auto-approve if score is above threshold and no critical issues
  const approved = score >= 70 && !issues.some(issue => 
    issue.includes('Missing or invalid title') || 
    issue.includes('too short')
  );

  return {
    approved,
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

function calculateReadabilityScore(content: string): number {
  // Simple readability calculation
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / sentences;
  
  // Ideal: 15-20 words per sentence
  if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
    return 90;
  } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
    return 70;
  } else {
    return 50;
  }
}