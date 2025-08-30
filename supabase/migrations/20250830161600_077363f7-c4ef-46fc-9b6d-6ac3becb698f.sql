-- Fix security issues identified by linter

-- Fix function search_path security issues
CREATE OR REPLACE FUNCTION validate_status_transition(
  old_status text,
  new_status text
) RETURNS boolean AS $$
BEGIN
  -- Allow any transition if old_status is NULL (initial insert)
  IF old_status IS NULL THEN
    RETURN new_status IN ('received', 'processing');
  END IF;
  
  -- Define valid status transitions
  CASE old_status
    WHEN 'received' THEN
      RETURN new_status IN ('processing', 'failed');
    WHEN 'processing' THEN
      RETURN new_status IN ('classified', 'failed');
    WHEN 'classified' THEN
      RETURN new_status IN ('design_approved', 'failed');
    WHEN 'design_approved' THEN
      RETURN new_status IN ('assets_processed', 'failed');
    WHEN 'assets_processed' THEN
      RETURN new_status IN ('page_created', 'failed');
    WHEN 'page_created' THEN
      RETURN new_status IN ('seo_optimized', 'failed');
    WHEN 'seo_optimized' THEN
      RETURN new_status IN ('quality_approved', 'failed');
    WHEN 'quality_approved' THEN
      RETURN new_status IN ('approved_for_publishing', 'requires_manual_review', 'failed');
    WHEN 'approved_for_publishing' THEN
      RETURN new_status IN ('live', 'failed');
    WHEN 'requires_manual_review' THEN
      RETURN new_status IN ('approved_for_publishing', 'rejected', 'failed');
    WHEN 'failed' THEN
      RETURN new_status IN ('processing', 'rejected');
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Fix zuhu_content_processing_status_trigger function
CREATE OR REPLACE FUNCTION zuhu_content_processing_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate status transition
  IF NOT validate_status_transition(OLD.status, NEW.status) THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Fix log_status_transition function
CREATE OR REPLACE FUNCTION log_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO zuhu_status_transitions (content_id, from_status, to_status, agent_name)
    VALUES (NEW.content_id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;