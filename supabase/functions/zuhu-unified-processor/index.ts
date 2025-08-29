import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Pipeline stages configuration
const PIPELINE_STAGES = [
  {
    name: 'content_classification',
    function: 'zuhu-content-classifier',
    description: 'AI Content Classification & SEO Analysis',
    expectedStatus: 'classified'
  },
  {
    name: 'design_direction',
    function: 'zuhu-design-director', 
    description: 'AI Design Director Template Assignment',
    expectedStatus: 'design_approved'
  },
  {
    name: 'asset_management',
    function: 'zuhu-asset-manager',
    description: 'AI Asset Validation & Media Intelligence',
    expectedStatus: 'assets_processed'
  },
  {
    name: 'page_composition',
    function: 'zuhu-page-composer',
    description: 'Dynamic Page Composer with Design Tokens',
    expectedStatus: 'page_created'
  },
  {
    name: 'seo_synthesis',
    function: 'zuhu-seo-synthesizer',
    description: 'SEO & Design Synthesis Engine',
    expectedStatus: 'seo_optimized'
  },
  {
    name: 'quality_fortress',
    function: 'quality-fortress',
    description: 'Quality Fortress - Comprehensive Content Audit',
    expectedStatus: 'quality_approved'
  }
];

// Update processing stage with detailed logging
async function updateProcessingStage(contentId: string, stage: string, status: string, errorMessage?: string, stageData?: any) {
  try {
    const stageRecord = {
      content_id: contentId,
      stage,
      status,
      started_at: status === 'processing' ? new Date().toISOString() : undefined,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined,
      error_message: errorMessage || null,
      stage_data: stageData || null
    };

    const { error } = await supabase
      .from('zuhu_processing_stages')
      .insert(stageRecord);

    if (error) {
      console.error(`[${contentId}] Error logging stage ${stage}:`, error);
    } else {
      console.log(`[${contentId}] Pipeline Stage: ${stage} → ${status}`);
    }
  } catch (error) {
    console.error(`[${contentId}] Stage logging error:`, error);
  }
}

// Update main processing status
async function updateProcessingStatus(contentId: string, status: string, data?: any) {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'processing') {
      updateData.processing_start = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.processing_end = new Date().toISOString();
    }

    if (data) {
      Object.assign(updateData, data);
    }

    const { error } = await supabase
      .from('zuhu_content_processing')
      .update(updateData)
      .eq('content_id', contentId);

    if (error) {
      console.error(`[${contentId}] Status update error:`, error);
    }
  } catch (error) {
    console.error(`[${contentId}] Processing status error:`, error);
  }
}

// Initialize content processing record
async function initializeProcessing(contentId: string, rawContent: any) {
  try {
    const { error } = await supabase
      .from('zuhu_content_processing')
      .insert({
        content_id: contentId,
        raw_content: rawContent,
        status: 'received',
        processing_start: new Date().toISOString()
      });

    if (error) {
      console.error(`[${contentId}] Initialization error:`, error);
      throw error;
    }

    console.log(`[${contentId}] Content processing initialized`);
  } catch (error) {
    throw new Error(`Failed to initialize processing: ${error.message}`);
  }
}

// Call individual agent function
async function callAgent(functionName: string, payload: any): Promise<any> {
  try {
    console.log(`Calling agent: ${functionName} with payload:`, JSON.stringify(payload, null, 2));
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });

    if (error) {
      console.error(`Agent ${functionName} error:`, error);
      throw new Error(`${functionName} failed: ${error.message}`);
    }

    console.log(`Agent ${functionName} completed successfully:`, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(`Agent invocation error for ${functionName}:`, error);
    throw error;
  }
}

// Execute the complete ZUHU pipeline
async function executeZuhuPipeline(contentId: string, rawContent: any) {
  const pipelineStart = Date.now();
  
  try {
    // Initialize processing
    await initializeProcessing(contentId, rawContent);
    await updateProcessingStage(contentId, 'pipeline_start', 'processing', null, {
      pipeline_version: 'v1.0',
      total_stages: PIPELINE_STAGES.length,
      initiated_at: new Date().toISOString()
    });

    const results: any = {
      content_id: contentId,
      pipeline_results: {},
      success: true,
      processing_time: 0
    };

    // Execute each stage sequentially
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stage = PIPELINE_STAGES[i];
      const stageStart = Date.now();
      
      console.log(`[${contentId}] Starting ${stage.name} (${i + 1}/${PIPELINE_STAGES.length})`);
      
      await updateProcessingStage(contentId, stage.name, 'processing', null, {
        stage_index: i + 1,
        total_stages: PIPELINE_STAGES.length,
        function_name: stage.function,
        description: stage.description
      });

      try {
        let payload: any;
        
        // First stage gets raw content, others just need content_id
        if (i === 0) {
          payload = { content_id: contentId, raw_content: rawContent };
        } else {
          payload = { content_id: contentId };
        }

        // Call the agent
        const stageResult = await callAgent(stage.function, payload);
        
        // Store stage result
        results.pipeline_results[stage.name] = {
          ...stageResult,
          processing_time: `${(Date.now() - stageStart) / 1000}s`,
          completed_at: new Date().toISOString()
        };

        // Handle Quality Fortress results with threshold logic
        if (stage.name === 'quality_fortress') {
          const qualityScore = stageResult.quality_score || 0;
          let finalStatus = 'quality_approved';
          
          if (qualityScore < 80) {
            finalStatus = 'requires_manual_review';
            console.log(`[${contentId}] Quality score ${qualityScore} below threshold, requiring manual review`);
          } else {
            finalStatus = 'approved_for_publishing';
            console.log(`[${contentId}] Quality score ${qualityScore} passed, approved for publishing`);
          }

          // Update content processing status based on quality score
          await updateProcessingStatus(contentId, finalStatus, {
            quality_audit_id: stageResult.audit_id,
            quality_metrics: {
              quality_score: qualityScore,
              audit_summary: stageResult.audit_summary
            }
          });
        }

        // Update stage completion
        await updateProcessingStage(contentId, stage.name, 'completed', null, {
          processing_time_ms: Date.now() - stageStart,
          result_summary: {
            success: true,
            data_size: JSON.stringify(stageResult).length,
            quality_score: stageResult.quality_score
          }
        });

        console.log(`[${contentId}] Completed ${stage.name} in ${(Date.now() - stageStart) / 1000}s`);

      } catch (stageError: any) {
        console.error(`[${contentId}] Stage ${stage.name} failed:`, stageError);
        
        await updateProcessingStage(contentId, stage.name, 'failed', stageError.message, {
          processing_time_ms: Date.now() - stageStart,
          error_details: {
            message: stageError.message,
            stack: stageError.stack
          }
        });

        // Stop pipeline execution on failure
        results.success = false;
        results.failed_stage = stage.name;
        results.error = stageError.message;
        
        await updateProcessingStatus(contentId, 'failed', {
          error_logs: {
            failed_stage: stage.name,
            error_message: stageError.message,
            completed_stages: i,
            total_stages: PIPELINE_STAGES.length
          }
        });

        throw stageError;
      }
    }

    // Pipeline completed successfully
    results.processing_time = `${(Date.now() - pipelineStart) / 1000}s`;
    
    await updateProcessingStage(contentId, 'pipeline_complete', 'completed', null, {
      total_processing_time_ms: Date.now() - pipelineStart,
      stages_completed: PIPELINE_STAGES.length,
      success: true
    });

    await updateProcessingStatus(contentId, 'completed', {
      processing_end: new Date().toISOString()
    });

    console.log(`[${contentId}] ZUHU Pipeline completed successfully in ${results.processing_time}`);
    return results;

  } catch (error: any) {
    console.error(`[${contentId}] Pipeline execution failed:`, error);
    
    await updateProcessingStage(contentId, 'pipeline_error', 'failed', error.message, {
      total_processing_time_ms: Date.now() - pipelineStart,
      fatal_error: true
    });

    throw error;
  }
}

// Generate unique content ID
function generateContentId(): string {
  return `zuhu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestStart = Date.now();

  try {
    const requestBody = await req.json();
    const { content_id, raw_content } = requestBody;

    // Validate input
    if (!raw_content) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing raw_content', 
          message: 'raw_content is required to start ZUHU pipeline' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate content_id if not provided
    const finalContentId = content_id || generateContentId();
    
    console.log(`[${finalContentId}] ZUHU Unified Pipeline Request Started`);
    console.log(`[${finalContentId}] Input validation passed, starting pipeline execution`);

    // Execute the complete pipeline
    const results = await executeZuhuPipeline(finalContentId, raw_content);

    // Return success response
    return new Response(
      JSON.stringify({
        ...results,
        message: 'ZUHU pipeline completed successfully',
        request_processing_time: `${(Date.now() - requestStart) / 1000}s`,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('ZUHU Unified Pipeline Error:', error);

    return new Response(
      JSON.stringify({ 
        error: 'ZUHU pipeline execution failed', 
        details: error.message,
        request_processing_time: `${(Date.now() - requestStart) / 1000}s`,
        timestamp: new Date().toISOString(),
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});