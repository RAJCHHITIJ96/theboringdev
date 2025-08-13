-- Remove ID generation functions (Make.com will handle IDs)
DROP FUNCTION IF EXISTS public.generate_trend_id(text, timestamp with time zone, text);
DROP FUNCTION IF EXISTS public.generate_keyword_id(text, text);
DROP FUNCTION IF EXISTS public.generate_competitor_id(text, integer);
DROP FUNCTION IF EXISTS public.generate_brief_id(text);
DROP FUNCTION IF EXISTS public.generate_tracking_id(text);

-- Drop existing view to recreate it
DROP VIEW IF EXISTS public.batch_content_selection;

-- Create optimized batch_content_selection view with robust selection algorithm
CREATE VIEW public.batch_content_selection AS
WITH scored_content AS (
  SELECT 
    -- Core identifiers
    tm.trend_id,
    tm.trend_topic,
    tm.trend_description,
    tm.trend_context,
    ki.keyword_id,
    ki.primary_keyword,
    cb.brief_id,
    cb.content_angle,
    
    -- Quality scoring fields (with NULL handling)
    COALESCE(cb.content_urgency_score, 0) as content_urgency_score,
    COALESCE(ki.opportunity_score, 0) as opportunity_score,
    COALESCE(ki.search_volume_monthly, 0) as search_volume_monthly,
    COALESCE(tm.final_trend_score, 0) as final_trend_score,
    COALESCE(cb.expected_traffic_estimate, 0) as expected_traffic_estimate,
    
    -- Additional context
    tm.trend_keywords,
    cb.recommended_structure,
    cb.claude_prompt_optimized,
    
    -- Calculate composite quality score with weighted factors
    (
      -- Urgency (40% weight) - time-sensitive content gets priority
      (COALESCE(cb.content_urgency_score, 0) * 0.4) +
      
      -- Opportunity (25% weight) - how easy to rank
      (COALESCE(ki.opportunity_score, 0) * 0.25) +
      
      -- Traffic potential (20% weight) - search volume + expected traffic
      (
        (COALESCE(ki.search_volume_monthly, 0) / 1000.0 * 10) + 
        (COALESCE(cb.expected_traffic_estimate, 0) / 1000.0 * 10)
      ) * 0.2 +
      
      -- Trend strength (15% weight) - how hot is the trend
      (COALESCE(tm.final_trend_score, 0) * 0.15)
    ) as composite_quality_score,
    
    -- Fallback scoring for edge cases
    CASE 
      WHEN COALESCE(cb.content_urgency_score, 0) > 0 THEN 'urgency_based'
      WHEN COALESCE(ki.search_volume_monthly, 0) > 0 THEN 'volume_based' 
      WHEN COALESCE(tm.final_trend_score, 0) > 0 THEN 'trend_based'
      ELSE 'fallback'
    END as scoring_method,
    
    -- Processing metadata
    tm.discovery_date,
    cb.creation_date,
    
    -- Content ranking for today's batch
    ROW_NUMBER() OVER (
      ORDER BY 
        -- Primary sort: composite quality score
        (
          (COALESCE(cb.content_urgency_score, 0) * 0.4) +
          (COALESCE(ki.opportunity_score, 0) * 0.25) +
          (
            (COALESCE(ki.search_volume_monthly, 0) / 1000.0 * 10) + 
            (COALESCE(cb.expected_traffic_estimate, 0) / 1000.0 * 10)
          ) * 0.2 +
          (COALESCE(tm.final_trend_score, 0) * 0.15)
        ) DESC,
        
        -- Secondary sort: freshness (newer trends get slight preference)
        tm.discovery_date DESC,
        
        -- Tertiary sort: creation order
        cb.creation_date DESC,
        
        -- Final tiebreaker: alphabetical by trend topic
        tm.trend_topic ASC
    ) as content_rank
    
  FROM public.trend_master tm
  JOIN public.keyword_intelligence ki ON tm.trend_id = ki.trend_id
  JOIN public.content_briefs cb ON ki.keyword_id = cb.keyword_id
  
  -- Only include today's processing batch
  WHERE DATE(tm.discovery_date) = CURRENT_DATE
    AND DATE(cb.creation_date) = CURRENT_DATE
    AND cb.status IN ('DRAFT', 'READY_FOR_PROCESSING')
)

-- Select top 17 with emergency fallback
SELECT * FROM scored_content 
WHERE content_rank <= 17

UNION ALL

-- Emergency fallback: if we have less than 17 records, get recent high-quality content
SELECT 
  tm.trend_id,
  tm.trend_topic,
  tm.trend_description,
  tm.trend_context,
  ki.keyword_id,
  ki.primary_keyword,
  cb.brief_id,
  cb.content_angle,
  COALESCE(cb.content_urgency_score, 0) as content_urgency_score,
  COALESCE(ki.opportunity_score, 0) as opportunity_score,
  COALESCE(ki.search_volume_monthly, 0) as search_volume_monthly,
  COALESCE(tm.final_trend_score, 0) as final_trend_score,
  COALESCE(cb.expected_traffic_estimate, 0) as expected_traffic_estimate,
  tm.trend_keywords,
  cb.recommended_structure,
  cb.claude_prompt_optimized,
  50 as composite_quality_score, -- Default fallback score
  'emergency_fallback' as scoring_method,
  tm.discovery_date,
  cb.creation_date,
  (18 + ROW_NUMBER() OVER (ORDER BY tm.discovery_date DESC)) as content_rank
  
FROM public.trend_master tm
JOIN public.keyword_intelligence ki ON tm.trend_id = ki.trend_id  
JOIN public.content_briefs cb ON ki.keyword_id = cb.keyword_id

WHERE cb.status IN ('DRAFT', 'READY_FOR_PROCESSING')
  AND tm.discovery_date >= CURRENT_DATE - INTERVAL '7 days'
  AND NOT EXISTS (SELECT 1 FROM scored_content WHERE content_rank <= 17)

ORDER BY content_rank
LIMIT 17;

-- Create performance analytics table for tracking daily batch processing
CREATE TABLE IF NOT EXISTS public.batch_processing_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scenario_name VARCHAR(50) NOT NULL, -- 'trend_collection', 'keyword_research', etc.
  
  -- Timing metrics
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  processing_duration_seconds INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER) STORED,
  
  -- Volume metrics
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN records_processed > 0 THEN (records_successful::NUMERIC / records_processed::NUMERIC * 100)
      ELSE 0 
    END
  ) STORED,
  
  -- Quality metrics
  average_quality_score NUMERIC(10,2),
  top_17_selected INTEGER DEFAULT 0,
  
  -- Error tracking
  error_messages JSONB,
  recovery_actions JSONB,
  
  -- Metadata
  system_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(processing_date, scenario_name)
);

-- Enable RLS for analytics table only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE n.nspname = 'public' 
      AND c.relname = 'batch_processing_analytics' 
      AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.batch_processing_analytics ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policy for analytics if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p 
    JOIN pg_class c ON p.polrelid = c.oid 
    JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE n.nspname = 'public' 
      AND c.relname = 'batch_processing_analytics' 
      AND p.polname = 'Allow service role full access to batch_processing_analytics'
  ) THEN
    CREATE POLICY "Allow service role full access to batch_processing_analytics" 
    ON public.batch_processing_analytics FOR ALL 
    TO service_role 
    USING (true);
  END IF;
END $$;

-- Create backup recovery function for emergency content selection
CREATE OR REPLACE FUNCTION public.get_emergency_content_batch(target_count INTEGER DEFAULT 17)
RETURNS TABLE (
  trend_id VARCHAR,
  trend_topic VARCHAR,
  keyword_id VARCHAR,  
  primary_keyword VARCHAR,
  brief_id VARCHAR,
  content_angle VARCHAR,
  emergency_rank INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tm.trend_id::VARCHAR,
    tm.trend_topic::VARCHAR,
    ki.keyword_id::VARCHAR,
    ki.primary_keyword::VARCHAR,
    cb.brief_id::VARCHAR,
    cb.content_angle::VARCHAR,
    ROW_NUMBER() OVER (
      ORDER BY 
        COALESCE(tm.final_trend_score, 0) DESC,
        COALESCE(ki.search_volume_monthly, 0) DESC,
        tm.discovery_date DESC
    )::INTEGER as emergency_rank
    
  FROM public.trend_master tm
  JOIN public.keyword_intelligence ki ON tm.trend_id = ki.trend_id
  JOIN public.content_briefs cb ON ki.keyword_id = cb.keyword_id
  
  WHERE cb.status IN ('DRAFT', 'READY_FOR_PROCESSING', 'QUEUED')
    AND tm.discovery_date >= CURRENT_DATE - INTERVAL '30 days'
  
  ORDER BY emergency_rank
  LIMIT target_count;
END;
$$;