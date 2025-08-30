import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Bulletproof Pipeline Validator
// Tests all edge functions and validates the complete ZUHU pipeline

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const validationStart = Date.now();
  const results: any = {
    timestamp: new Date().toISOString(),
    validation_results: {},
    overall_status: 'unknown',
    total_time: 0
  };

  try {
    console.log('🔍 Starting ZUHU Pipeline Validation...');

    // Test 1: Database Status Validation
    console.log('📋 Testing database status validation...');
    try {
      // Test valid status transition
      const testId = `validation-${Date.now()}`;
      
      const { error: insertError } = await supabase
        .from('zuhu_content_processing')
        .insert({
          content_id: testId,
          raw_content: { test: 'validation' },
          status: 'received'
        });

      if (insertError) throw insertError;

      // Test valid transition: received -> processing
      const { error: updateError } = await supabase
        .from('zuhu_content_processing')
        .update({ status: 'processing' })
        .eq('content_id', testId);

      if (updateError) throw updateError;

      // Clean up test data
      await supabase
        .from('zuhu_content_processing')
        .delete()
        .eq('content_id', testId);

      results.validation_results.database_validation = {
        status: 'pass',
        message: 'Status validation working correctly'
      };

    } catch (error) {
      results.validation_results.database_validation = {
        status: 'fail',
        error: error.message
      };
    }

    // Test 2: Content Classifier Agent
    console.log('🤖 Testing Content Classifier...');
    try {
      const classifierResponse = await supabase.functions.invoke('zuhu-content-classifier', {
        body: {
          content_id: 'validator-test',
          raw_content: {
            shipped_content: '# Test Content\nThis is a test article.',
            seo_details_of_content: { status: 'ACTIVE' }
          }
        }
      });

      results.validation_results.content_classifier = {
        status: classifierResponse.error ? 'fail' : 'pass',
        response_time: Date.now() - validationStart,
        error: classifierResponse.error?.message
      };

    } catch (error) {
      results.validation_results.content_classifier = {
        status: 'fail',
        error: error.message
      };
    }

    // Test 3: Unified Processor
    console.log('⚙️ Testing Unified Processor...');
    try {
      const processorResponse = await supabase.functions.invoke('zuhu-unified-processor', {
        body: {
          raw_content: {
            shipped_content: '# Validation Test\nTesting the bulletproof pipeline.',
            seo_details_of_content: { status: 'ACTIVE' }
          }
        }
      });

      results.validation_results.unified_processor = {
        status: processorResponse.error ? 'fail' : 'pass',
        response_time: Date.now() - validationStart,
        error: processorResponse.error?.message
      };

    } catch (error) {
      results.validation_results.unified_processor = {
        status: 'fail',
        error: error.message
      };
    }

    // Test 4: Pipeline Health Check
    console.log('🏥 Checking pipeline health...');
    try {
      const { data: recentProcessing } = await supabase
        .from('zuhu_processing_stages')
        .select('status, stage, created_at')
        .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('created_at', { ascending: false });

      const totalProcesses = recentProcessing?.length || 0;
      const successfulProcesses = recentProcessing?.filter(p => p.status === 'completed').length || 0;
      const failedProcesses = recentProcessing?.filter(p => p.status === 'failed').length || 0;
      
      const successRate = totalProcesses > 0 ? successfulProcesses / totalProcesses : 0;

      results.validation_results.pipeline_health = {
        status: successRate >= 0.8 ? 'pass' : 'warning',
        total_processes: totalProcesses,
        successful: successfulProcesses,
        failed: failedProcesses,
        success_rate: successRate,
        last_hour: true
      };

    } catch (error) {
      results.validation_results.pipeline_health = {
        status: 'fail',
        error: error.message
      };
    }

    // Test 5: Agent Connectivity
    console.log('🌐 Testing agent connectivity...');
    const agents = [
      'zuhu-content-classifier',
      'zuhu-design-director', 
      'zuhu-asset-manager',
      'zuhu-page-composer',
      'zuhu-seo-synthesizer',
      'quality-fortress',
      'autonomous-publishing-engine'
    ];

    results.validation_results.agent_connectivity = {};

    for (const agent of agents) {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/${agent}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ health_check: true })
        });

        results.validation_results.agent_connectivity[agent] = {
          status: response.status < 500 ? 'pass' : 'fail',
          http_status: response.status,
          response_time: Date.now() - validationStart
        };

      } catch (error) {
        results.validation_results.agent_connectivity[agent] = {
          status: 'fail',
          error: error.message
        };
      }
    }

    // Calculate overall status
    const allTests = Object.values(results.validation_results);
    const failedTests = allTests.filter((test: any) => 
      typeof test === 'object' && test.status === 'fail'
    );
    
    const warningTests = allTests.filter((test: any) => 
      typeof test === 'object' && test.status === 'warning'
    );

    if (failedTests.length === 0 && warningTests.length === 0) {
      results.overall_status = 'healthy';
    } else if (failedTests.length === 0) {
      results.overall_status = 'warning';
    } else {
      results.overall_status = 'critical';
    }

    results.total_time = Date.now() - validationStart;
    results.summary = {
      total_tests: allTests.length,
      passed: allTests.filter((t: any) => t.status === 'pass').length,
      warnings: warningTests.length,
      failed: failedTests.length
    };

    console.log('✅ Pipeline validation completed:', results.overall_status);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Validation error:', error);
    
    return new Response(JSON.stringify({
      error: 'Validation failed',
      details: error.message,
      timestamp: new Date().toISOString(),
      total_time: Date.now() - validationStart
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});