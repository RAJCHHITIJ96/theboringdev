-- Fix security issues by dropping triggers first, then function, then recreating properly

-- Drop triggers first
DROP TRIGGER IF EXISTS update_zuhu_content_processing_updated_at ON public.zuhu_content_processing;
DROP TRIGGER IF EXISTS update_zuhu_system_metrics_updated_at ON public.zuhu_system_metrics;
DROP TRIGGER IF EXISTS update_zuhu_api_config_updated_at ON public.zuhu_api_config;

-- Drop the function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_zuhu_content_processing_updated_at
BEFORE UPDATE ON public.zuhu_content_processing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_zuhu_system_metrics_updated_at
BEFORE UPDATE ON public.zuhu_system_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_zuhu_api_config_updated_at
BEFORE UPDATE ON public.zuhu_api_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();