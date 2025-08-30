-- Fix security issues from previous migration

-- Fix the cleanup function security issue by adding proper search_path
CREATE OR REPLACE FUNCTION cleanup_expired_agent_interactions()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.zuhu_agent_interactions 
  WHERE expires_at < now();
END;
$$;