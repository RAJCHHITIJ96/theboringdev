-- Phase 2: Agent Tracking Infrastructure (FREE TIER OPTIMIZED)

-- Create agent interactions table with auto-pruning for free tier efficiency
CREATE TABLE public.zuhu_agent_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  agent_name VARCHAR NOT NULL,
  interaction_type VARCHAR NOT NULL, -- 'input', 'output', 'error', 'status_change'
  interaction_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_time_ms INTEGER,
  status VARCHAR,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Auto-cleanup optimization: keep only recent data for free tier
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Create pipeline monitoring table for real-time state tracking
CREATE TABLE public.zuhu_pipeline_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL UNIQUE,
  current_agent VARCHAR,
  pipeline_stage VARCHAR NOT NULL,
  stage_status VARCHAR NOT NULL DEFAULT 'active',
  input_data JSONB,
  output_data JSONB,
  error_data JSONB,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for security
ALTER TABLE public.zuhu_agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zuhu_pipeline_monitoring ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for now, can be restricted later)
CREATE POLICY "Allow all operations on zuhu_agent_interactions" 
ON public.zuhu_agent_interactions 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on zuhu_pipeline_monitoring" 
ON public.zuhu_pipeline_monitoring 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create indexes for efficient querying (free tier optimized)
CREATE INDEX idx_agent_interactions_content_id ON public.zuhu_agent_interactions(content_id);
CREATE INDEX idx_agent_interactions_timestamp ON public.zuhu_agent_interactions(timestamp DESC);
CREATE INDEX idx_agent_interactions_expires_at ON public.zuhu_agent_interactions(expires_at);
CREATE INDEX idx_pipeline_monitoring_content_id ON public.zuhu_pipeline_monitoring(content_id);
CREATE INDEX idx_pipeline_monitoring_last_activity ON public.zuhu_pipeline_monitoring(last_activity DESC);

-- Create function for automatic cleanup (keeps free tier usage minimal)
CREATE OR REPLACE FUNCTION cleanup_expired_agent_interactions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.zuhu_agent_interactions 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add update trigger for pipeline monitoring
CREATE TRIGGER update_pipeline_monitoring_updated_at
  BEFORE UPDATE ON public.zuhu_pipeline_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();