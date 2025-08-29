-- Fix the migration by including all existing statuses in the CHECK constraint
-- First create new table with expanded statuses including existing ones
CREATE TABLE zuhu_content_processing_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  raw_content JSONB NOT NULL DEFAULT '{}',
  processed_content JSONB DEFAULT NULL,
  content_intelligence JSONB DEFAULT NULL,
  seo_elements JSONB DEFAULT NULL,
  status VARCHAR NOT NULL DEFAULT 'received' CHECK (status IN (
    'received', 'processing', 'classified', 'design_approved', 'assets_processed', 'assets_validated',
    'page_created', 'seo_optimized', 'quality_approved', 'requires_manual_review', 
    'approved_for_publishing', 'live', 'failed', 'completed'
  )),
  category VARCHAR DEFAULT NULL,
  confidence_score NUMERIC DEFAULT NULL,
  quality_metrics JSONB DEFAULT NULL,
  error_logs JSONB DEFAULT NULL,
  processing_start TIMESTAMPTZ DEFAULT now(),
  processing_end TIMESTAMPTZ DEFAULT NULL,
  quality_audit_id UUID REFERENCES quality_audits(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copy all data from old table to new table
INSERT INTO zuhu_content_processing_new (
  id, content_id, raw_content, processed_content, content_intelligence, seo_elements,
  status, category, confidence_score, quality_metrics, error_logs, processing_start,
  processing_end, created_at, updated_at
)
SELECT 
  id, content_id, raw_content, processed_content, content_intelligence, seo_elements,
  status, category, confidence_score, quality_metrics, error_logs, processing_start,
  processing_end, created_at, updated_at
FROM zuhu_content_processing;

-- Drop old table and rename new one
DROP TABLE zuhu_content_processing;
ALTER TABLE zuhu_content_processing_new RENAME TO zuhu_content_processing;

-- Recreate RLS policy
ALTER TABLE zuhu_content_processing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on zuhu_content_processing" 
ON zuhu_content_processing 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create deployment_batches table for autonomous publishing
CREATE TABLE IF NOT EXISTS deployment_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id VARCHAR NOT NULL UNIQUE,
  content_ids JSONB NOT NULL DEFAULT '[]',
  batch_status VARCHAR NOT NULL DEFAULT 'pending' CHECK (batch_status IN (
    'pending', 'processing', 'github_commit', 'netlify_deploy', 'completed', 'failed'
  )),
  github_commit_sha VARCHAR DEFAULT NULL,
  netlify_deploy_id VARCHAR DEFAULT NULL,
  deployment_started_at TIMESTAMPTZ DEFAULT NULL,
  deployment_completed_at TIMESTAMPTZ DEFAULT NULL,
  published_urls JSONB DEFAULT '[]',
  error_logs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on deployment_batches
ALTER TABLE deployment_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on deployment_batches" 
ON deployment_batches 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for updated_at on both tables
CREATE TRIGGER update_zuhu_content_processing_updated_at
  BEFORE UPDATE ON zuhu_content_processing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployment_batches_updated_at
  BEFORE UPDATE ON deployment_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_zuhu_content_processing_status ON zuhu_content_processing(status);
CREATE INDEX IF NOT EXISTS idx_zuhu_content_processing_content_id ON zuhu_content_processing(content_id);
CREATE INDEX IF NOT EXISTS idx_quality_audits_content_id ON quality_audits(content_id);
CREATE INDEX IF NOT EXISTS idx_deployment_batches_batch_status ON deployment_batches(batch_status);