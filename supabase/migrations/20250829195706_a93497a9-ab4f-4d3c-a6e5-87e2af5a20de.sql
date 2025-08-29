-- Create generated_pages table for storing final composed pages
CREATE TABLE public.generated_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR NOT NULL UNIQUE,
  page_content TEXT,
  page_metadata JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  status VARCHAR NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY "Allow all operations on generated_pages" 
ON public.generated_pages 
FOR ALL 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_generated_pages_updated_at
BEFORE UPDATE ON public.generated_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();