import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PipelineExecution {
  content_id: string;
  ai_coder_result?: any;
  shaper_result?: any;
  github_result?: any;
  success: boolean;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Autonomous Publishing Scheduler: Starting pipeline execution...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get content ready for publishing
    const { data: readyContent, error: fetchError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('status', 'approved_for_publishing')
      .order('created_at', { ascending: true })
      .limit(3); // Process max 3 at a time

    if (fetchError) {
      throw new Error(`Failed to fetch ready content: ${fetchError.message}`);
    }

    if (!readyContent || readyContent.length === 0) {
      console.log('📋 No content ready for publishing');
      return new Response(JSON.stringify({
        success: true,
        message: 'No content ready for publishing',
        processed_count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📋 Found ${readyContent.length} items ready for publishing`);
    const executions: PipelineExecution[] = [];

    for (const content of readyContent) {
      const execution: PipelineExecution = {
        content_id: content.content_id,
        success: false
      };

      try {
        console.log(`🔄 Processing content: ${content.content_id}`);

        // Update status to publishing
        await supabase
          .from('zuhu_content_processing')
          .update({ status: 'publishing' })
          .eq('content_id', content.content_id);

        // Step 1: Execute AI Coder Agent
        console.log(`🤖 Step 1: Executing AI Coder Agent for ${content.content_id}...`);
        execution.ai_coder_result = await executeAICoderAgent(content);

        if (!execution.ai_coder_result?.success) {
          throw new Error(`AI Coder Agent failed: ${execution.ai_coder_result?.error}`);
        }

        // Step 2: Execute Shaper AI
        console.log(`🎨 Step 2: Executing Shaper AI for ${content.content_id}...`);
        execution.shaper_result = await executeShaperAI(content, execution.ai_coder_result);

        if (!execution.shaper_result?.success) {
          throw new Error(`Shaper AI failed: ${execution.shaper_result?.error}`);
        }

        // Step 3: Execute Enhanced GitHub Publisher
        console.log(`📚 Step 3: Executing Enhanced GitHub Publisher for ${content.content_id}...`);
        execution.github_result = await executeEnhancedGitHubPublisher(content, execution.shaper_result);

        if (!execution.github_result?.success) {
          throw new Error(`Enhanced GitHub Publisher failed: ${execution.github_result?.error}`);
        }

        execution.success = true;
        console.log(`✅ Pipeline completed successfully for ${content.content_id}`);

        // Update final status to live
        await supabase
          .from('zuhu_content_processing')
          .update({
            status: 'live',
            processing_end: new Date().toISOString(),
            quality_metrics: {
              ...content.quality_metrics,
              pipeline_completed: true,
              deployment_url: execution.github_result.deployment_url,
              final_published_at: new Date().toISOString()
            }
          })
          .eq('content_id', content.content_id);

      } catch (error) {
        console.error(`❌ Pipeline failed for ${content.content_id}:`, error);
        execution.error = error.message;
        execution.success = false;

        // Update status to failed
        await supabase
          .from('zuhu_content_processing')
          .update({
            status: 'failed',
            error_logs: [
              ...(content.error_logs || []),
              {
                error: error.message,
                stage: 'autonomous_publishing',
                timestamp: new Date().toISOString()
              }
            ]
          })
          .eq('content_id', content.content_id);
      }

      executions.push(execution);
    }

    const successCount = executions.filter(e => e.success).length;
    const failureCount = executions.length - successCount;

    console.log(`🎉 Autonomous Publishing completed: ${successCount} success, ${failureCount} failures`);

    return new Response(JSON.stringify({
      success: true,
      processed_count: readyContent.length,
      success_count: successCount,
      failure_count: failureCount,
      executions: executions,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Autonomous Publishing Scheduler Error:', error);
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

async function executeAICoderAgent(content: any): Promise<any> {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-coder-agent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_id: content.content_id,
        processed_content: content.processed_content,
        content_intelligence: content.content_intelligence,
        category: content.category
      })
    });

    if (!response.ok) {
      throw new Error(`AI Coder Agent HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function executeShaperAI(content: any, aiCoderResult: any): Promise<any> {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/shaper-ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_id: content.content_id,
        ai_coder_output: aiCoderResult,
        content_metadata: {
          category: content.category,
          quality_metrics: content.quality_metrics
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Shaper AI HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function executeEnhancedGitHubPublisher(content: any, shaperResult: any): Promise<any> {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/enhanced-github-publisher`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_id: content.content_id,
        files_created: shaperResult.files_created || [],
        registry_updated: shaperResult.registry_updated || {}
      })
    });

    if (!response.ok) {
      throw new Error(`Enhanced GitHub Publisher HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}