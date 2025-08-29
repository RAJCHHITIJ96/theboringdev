-- Fix security issues identified by the linter

-- Fix the function search path mutable warning by updating the trigger function
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate with proper search_path setting
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