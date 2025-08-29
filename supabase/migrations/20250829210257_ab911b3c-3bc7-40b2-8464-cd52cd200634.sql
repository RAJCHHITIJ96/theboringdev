-- Create quality_audits table for Quality Fortress agent
CREATE TABLE public.quality_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  audit_type VARCHAR NOT NULL DEFAULT 'comprehensive',
  quality_score INTEGER NOT NULL DEFAULT 0,
  audit_results JSONB NOT NULL DEFAULT '{}',
  issues_found JSONB NOT NULL DEFAULT '[]',
  recommendations JSONB NOT NULL DEFAULT '[]',
  status VARCHAR NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create publishing_pipeline table for Autonomous Publishing Engine
CREATE TABLE public.publishing_pipeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  page_id UUID REFERENCES public.generated_pages(id),
  quality_audit_id UUID REFERENCES public.quality_audits(id),
  pipeline_stage VARCHAR NOT NULL DEFAULT 'quality_check',
  deployment_status VARCHAR NOT NULL DEFAULT 'pending',
  deployment_url TEXT,
  github_commit_sha VARCHAR,
  netlify_deploy_id VARCHAR,
  error_logs JSONB DEFAULT '[]',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.quality_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing_pipeline ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on quality_audits" 
ON public.quality_audits 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on publishing_pipeline" 
ON public.publishing_pipeline 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create update triggers for timestamp management
CREATE TRIGGER update_quality_audits_updated_at
BEFORE UPDATE ON public.quality_audits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publishing_pipeline_updated_at
BEFORE UPDATE ON public.publishing_pipeline
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_quality_audits_content_id ON public.quality_audits(content_id);
CREATE INDEX idx_quality_audits_status ON public.quality_audits(status);
CREATE INDEX idx_publishing_pipeline_content_id ON public.publishing_pipeline(content_id);
CREATE INDEX idx_publishing_pipeline_stage ON public.publishing_pipeline(pipeline_stage);
CREATE INDEX idx_publishing_pipeline_status ON public.publishing_pipeline(deployment_status);