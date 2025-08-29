-- Create design_directives table for Agent 1: Design Director AI
CREATE TABLE IF NOT EXISTS public.design_directives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  template_id VARCHAR NOT NULL DEFAULT 'template_default_v1',
  design_token_set JSONB DEFAULT '{}',
  component_map JSONB DEFAULT '{}',
  category VARCHAR,
  design_philosophy TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create asset_data table for Agent 2: Media Intelligence Engine
CREATE TABLE IF NOT EXISTS public.asset_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL,
  asset_urls JSONB DEFAULT '[]',
  validated_assets JSONB DEFAULT '[]',
  asset_health_check JSONB DEFAULT '{}',
  alt_text_improvements JSONB DEFAULT '{}',
  validation_errors JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.design_directives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_data ENABLE ROW LEVEL SECURITY;

-- Create policies for open access (will be refined later)
CREATE POLICY "Allow all operations on design_directives" 
ON public.design_directives 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on asset_data" 
ON public.asset_data 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_design_directives_updated_at
BEFORE UPDATE ON public.design_directives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asset_data_updated_at
BEFORE UPDATE ON public.asset_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();