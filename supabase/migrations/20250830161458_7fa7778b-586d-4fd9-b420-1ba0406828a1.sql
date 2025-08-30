-- Phase 1: Bulletproof Database Schema Alignment
-- Fix the status constraint issue and standardize all statuses

-- Create status validation function for consistent transitions
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
$$ LANGUAGE plpgsql;

-- Update the zuhu_content_processing table to remove CHECK constraint and add trigger validation
ALTER TABLE zuhu_content_processing DROP CONSTRAINT IF EXISTS zuhu_content_processing_new_status_check;

-- Create status validation trigger
CREATE OR REPLACE FUNCTION zuhu_content_processing_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate status transition
  IF NOT validate_status_transition(OLD.status, NEW.status) THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
DROP TRIGGER IF EXISTS validate_zuhu_content_status ON zuhu_content_processing;
CREATE TRIGGER validate_zuhu_content_status
  BEFORE UPDATE ON zuhu_content_processing
  FOR EACH ROW
  EXECUTE FUNCTION zuhu_content_processing_status_trigger();

-- Add index for status queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_zuhu_content_processing_status ON zuhu_content_processing(status);
CREATE INDEX IF NOT EXISTS idx_zuhu_content_processing_created_at ON zuhu_content_processing(created_at);

-- Add status transition logging table for audit trail
CREATE TABLE IF NOT EXISTS zuhu_status_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id varchar NOT NULL,
  from_status varchar,
  to_status varchar NOT NULL,
  transition_time timestamp with time zone DEFAULT now(),
  agent_name varchar,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on status transitions table
ALTER TABLE zuhu_status_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on zuhu_status_transitions" ON zuhu_status_transitions FOR ALL USING (true);

-- Create function to log status transitions automatically
CREATE OR REPLACE FUNCTION log_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO zuhu_status_transitions (content_id, from_status, to_status, agent_name)
    VALUES (NEW.content_id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically log status changes
DROP TRIGGER IF EXISTS log_zuhu_status_changes ON zuhu_content_processing;
CREATE TRIGGER log_zuhu_status_changes
  AFTER UPDATE ON zuhu_content_processing
  FOR EACH ROW
  EXECUTE FUNCTION log_status_transition();