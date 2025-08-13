-- Fix the batch_content_selection issue and continue security fixes

-- Drop the batch_content_selection view since it can't have columns added
DROP VIEW IF EXISTS public.batch_content_selection;

-- Create batch_content_selection as a proper table instead of view
CREATE TABLE public.batch_content_selection (
  content_urgency_score INTEGER,
  trend_id VARCHAR,
  scoring_method TEXT,
  claude_prompt_optimized TEXT,
  content_angle VARCHAR,
  brief_id VARCHAR,
  primary_keyword VARCHAR,
  opportunity_score INTEGER,
  search_volume_monthly INTEGER,
  final_trend_score INTEGER,
  expected_traffic_estimate INTEGER,
  trend_keywords JSONB,
  recommended_structure JSONB,
  composite_quality_score NUMERIC,
  discovery_date TIMESTAMP WITH TIME ZONE,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  content_rank BIGINT,
  keyword_id VARCHAR,
  trend_context TEXT,
  trend_description TEXT,
  trend_topic VARCHAR,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on the new table
ALTER TABLE public.batch_content_selection ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for batch_content_selection
CREATE POLICY "Users can view their own batch selections" 
ON public.batch_content_selection 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own batch selections" 
ON public.batch_content_selection 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add user_id to batch_processing_analytics if not already done
ALTER TABLE public.batch_processing_analytics ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;