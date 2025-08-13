-- Fix security warnings from the linter

-- Fix the function search path issue
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
SET search_path = public  -- Fixed: Set search_path to make function secure
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