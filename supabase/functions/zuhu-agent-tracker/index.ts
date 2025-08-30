import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentInteraction {
  content_id: string;
  agent_name: string;
  interaction_type: 'input' | 'output' | 'error' | 'status_change';
  interaction_data: any;
  processing_time_ms?: number;
  status?: string;
}

interface PipelineUpdate {
  content_id: string;
  current_agent?: string;
  pipeline_stage: string;
  stage_status: string;
  input_data?: any;
  output_data?: any;
  error_data?: any;
  processing_started_at?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { action, data } = body;

    console.log(`🔍 Agent Tracker: ${action} for content_id: ${data?.content_id}`);

    switch (action) {
      case 'log_interaction':
        return await logAgentInteraction(supabase, data as AgentInteraction);
      
      case 'update_pipeline':
        return await updatePipelineMonitoring(supabase, data as PipelineUpdate);
      
      case 'get_agent_activities':
        return await getAgentActivities(supabase, data?.content_id, data?.limit || 50);
      
      case 'get_pipeline_status':
        return await getPipelineStatus(supabase, data?.content_id);
      
      case 'cleanup_expired':
        return await cleanupExpiredData(supabase);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('❌ Agent Tracker Error:', error);
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

async function logAgentInteraction(supabase: any, interaction: AgentInteraction) {
  const { error } = await supabase
    .from('zuhu_agent_interactions')
    .insert({
      content_id: interaction.content_id,
      agent_name: interaction.agent_name,
      interaction_type: interaction.interaction_type,
      interaction_data: interaction.interaction_data,
      processing_time_ms: interaction.processing_time_ms,
      status: interaction.status
    });

  if (error) {
    console.error('❌ Error logging interaction:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to log interaction' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Interaction logged' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function updatePipelineMonitoring(supabase: any, update: PipelineUpdate) {
  const { error } = await supabase
    .from('zuhu_pipeline_monitoring')
    .upsert({
      content_id: update.content_id,
      current_agent: update.current_agent,
      pipeline_stage: update.pipeline_stage,
      stage_status: update.stage_status,
      input_data: update.input_data,
      output_data: update.output_data,
      error_data: update.error_data,
      processing_started_at: update.processing_started_at,
      last_activity: new Date().toISOString()
    }, {
      onConflict: 'content_id'
    });

  if (error) {
    console.error('❌ Error updating pipeline:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update pipeline' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Pipeline updated' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getAgentActivities(supabase: any, content_id?: string, limit: number = 50) {
  let query = supabase
    .from('zuhu_agent_interactions')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (content_id) {
    query = query.eq('content_id', content_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching activities:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch activities' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getPipelineStatus(supabase: any, content_id?: string) {
  let query = supabase
    .from('zuhu_pipeline_monitoring')
    .select('*')
    .order('last_activity', { ascending: false });

  if (content_id) {
    query = query.eq('content_id', content_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching pipeline status:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch pipeline status' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function cleanupExpiredData(supabase: any) {
  // Clean expired interactions
  const { error: cleanupError } = await supabase.rpc('cleanup_expired_agent_interactions');
  
  if (cleanupError) {
    console.error('❌ Cleanup error:', cleanupError);
  }

  // Clean old pipeline monitoring data (keep last 100 entries)
  const { data: oldEntries } = await supabase
    .from('zuhu_pipeline_monitoring')
    .select('id')
    .order('last_activity', { ascending: false })
    .range(100, 1000);

  if (oldEntries && oldEntries.length > 0) {
    const idsToDelete = oldEntries.map(entry => entry.id);
    await supabase
      .from('zuhu_pipeline_monitoring')
      .delete()
      .in('id', idsToDelete);
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Cleanup completed' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
