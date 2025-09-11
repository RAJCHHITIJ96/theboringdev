import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('⏰ Starting Autonomous Publishing Scheduler...');

    const results: any[] = [];

    // Step 1: Run Quality Approval Agent
    console.log('🔍 Running Quality Approval Agent...');
    try {
      const qualityResponse = await supabase.functions.invoke('quality-approval-agent');
      const qualityResult = await qualityResponse.data;
      
      results.push({
        agent: 'quality-approval-agent',
        success: !qualityResponse.error,
        result: qualityResult,
        error: qualityResponse.error?.message
      });
      
      console.log(`✅ Quality Approval completed: ${qualityResult?.processed || 0} items processed`);
    } catch (error) {
      console.error('Quality Approval Agent failed:', error);
      results.push({
        agent: 'quality-approval-agent',
        success: false,
        error: error.message
      });
    }

    // Step 2: Run Enhanced GitHub Publisher
    console.log('🚀 Running Enhanced GitHub Publisher...');
    try {
      const publishResponse = await supabase.functions.invoke('enhanced-github-publisher');
      const publishResult = await publishResponse.data;
      
      results.push({
        agent: 'enhanced-github-publisher',
        success: !publishResponse.error,
        result: publishResult,
        error: publishResponse.error?.message
      });
      
      console.log(`✅ Publishing completed: ${publishResult?.processed || 0} items processed`);
    } catch (error) {
      console.error('Enhanced GitHub Publisher failed:', error);
      results.push({
        agent: 'enhanced-github-publisher',
        success: false,
        error: error.message
      });
    }

    // Step 3: System Health Check
    console.log('🏥 Running system health check...');
    try {
      const healthCheck = await performSystemHealthCheck(supabase);
      results.push({
        agent: 'system-health-check',
        success: true,
        result: healthCheck
      });
      
      console.log(`✅ Health check completed`);
    } catch (error) {
      console.error('System health check failed:', error);
      results.push({
        agent: 'system-health-check',
        success: false,
        error: error.message
      });
    }

    // Step 4: Update system metrics
    try {
      await updateSystemMetrics(supabase, results);
    } catch (error) {
      console.error('Failed to update system metrics:', error);
    }

    const successfulAgents = results.filter(r => r.success).length;
    const totalProcessed = results.reduce((acc, r) => acc + (r.result?.processed || 0), 0);

    console.log(`⏰ Autonomous Publishing Scheduler completed. ${successfulAgents}/${results.length} agents successful, ${totalProcessed} items processed`);

    return new Response(JSON.stringify({
      message: 'Autonomous publishing cycle completed',
      successful_agents: successfulAgents,
      total_agents: results.length,
      total_items_processed: totalProcessed,
      results: results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Autonomous Publishing Scheduler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Autonomous publishing scheduler failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performSystemHealthCheck(supabase: any) {
  const healthData: any = {
    timestamp: new Date().toISOString(),
    pipeline_status: {},
    content_distribution: {},
    recent_activity: {},
    issues: []
  };

  try {
    // Check content distribution by status
    const { data: statusDistribution } = await supabase
      .from('zuhu_content_processing')
      .select('status')
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (statusDistribution) {
      healthData.content_distribution = statusDistribution.reduce((acc: any, item: any) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
    }

    // Check for stuck content (hasn't been updated in 2+ hours)
    const { data: stuckContent } = await supabase
      .from('zuhu_content_processing')
      .select('content_id, status, updated_at')
      .not('status', 'in', '("live","failed","rejected")')
      .lt('updated_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

    if (stuckContent && stuckContent.length > 0) {
      healthData.issues.push({
        type: 'stuck_content',
        count: stuckContent.length,
        details: stuckContent.slice(0, 5) // First 5 items
      });
    }

    // Check recent successful deployments
    const { data: recentDeployments } = await supabase
      .from('deployment_batches')
      .select('*')
      .eq('batch_status', 'completed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    healthData.recent_activity.successful_deployments = recentDeployments?.length || 0;

    // Check error rates
    const { data: recentErrors } = await supabase
      .from('zuhu_content_processing')
      .select('content_id')
      .eq('status', 'failed')
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const errorRate = recentErrors?.length || 0;
    if (errorRate > 5) {
      healthData.issues.push({
        type: 'high_error_rate',
        count: errorRate,
        details: 'More than 5 failures in the last 24 hours'
      });
    }

    healthData.pipeline_status = {
      healthy: healthData.issues.length === 0,
      error_rate: errorRate,
      stuck_items: stuckContent?.length || 0
    };

    return healthData;

  } catch (error) {
    healthData.issues.push({
      type: 'health_check_error',
      details: error.message
    });
    return healthData;
  }
}

async function updateSystemMetrics(supabase: any, results: any[]) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate metrics from today's activity
    const totalProcessed = results.reduce((acc, r) => acc + (r.result?.processed || 0), 0);
    const successfulAgents = results.filter(r => r.success).length;
    const successRate = results.length > 0 ? (successfulAgents / results.length) * 100 : 0;

    // Get existing metrics for today
    const { data: existingMetrics } = await supabase
      .from('zuhu_system_metrics')
      .select('*')
      .eq('date', today)
      .single();

    const metricsData = {
      date: today,
      total_processed: (existingMetrics?.total_processed || 0) + totalProcessed,
      success_rate: successRate,
      avg_processing_time: 0, // We don't track this in this agent
      category_breakdown: {
        scheduler_runs: (existingMetrics?.category_breakdown?.scheduler_runs || 0) + 1,
        quality_approvals: results.find(r => r.agent === 'quality-approval-agent')?.result?.processed || 0,
        publications: results.find(r => r.agent === 'enhanced-github-publisher')?.result?.processed || 0
      },
      error_breakdown: {
        agent_failures: results.filter(r => !r.success).map(r => r.agent)
      },
      updated_at: new Date().toISOString()
    };

    if (existingMetrics) {
      // Update existing metrics
      await supabase
        .from('zuhu_system_metrics')
        .update(metricsData)
        .eq('date', today);
    } else {
      // Create new metrics record
      await supabase
        .from('zuhu_system_metrics')
        .insert(metricsData);
    }

  } catch (error) {
    console.error('Error updating system metrics:', error);
  }
}