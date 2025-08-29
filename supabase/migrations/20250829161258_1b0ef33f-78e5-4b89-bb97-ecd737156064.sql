-- Create ZUHU Publishing System Tables

-- Main content processing table
CREATE TABLE public.zuhu_content_processing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL UNIQUE,
  raw_content JSONB NOT NULL,
  processed_content JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'received',
  category VARCHAR(50),
  confidence_score DECIMAL(3,2),
  seo_elements JSONB,
  content_intelligence JSONB,
  quality_metrics JSONB,
  error_logs JSONB,
  processing_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processing_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Processing stages tracking
CREATE TABLE public.zuhu_processing_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  stage_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System metrics and dashboard data
CREATE TABLE public.zuhu_system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_processed INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  avg_processing_time INTEGER DEFAULT 0,
  category_breakdown JSONB,
  error_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- API endpoints and configuration
CREATE TABLE public.zuhu_api_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint_name VARCHAR(100) NOT NULL UNIQUE,
  endpoint_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 100,
  timeout_seconds INTEGER DEFAULT 30,
  auth_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.zuhu_content_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zuhu_processing_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zuhu_system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zuhu_api_config ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (allowing all operations)
CREATE POLICY "Allow all operations on zuhu_content_processing" 
ON public.zuhu_content_processing 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on zuhu_processing_stages" 
ON public.zuhu_processing_stages 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on zuhu_system_metrics" 
ON public.zuhu_system_metrics 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on zuhu_api_config" 
ON public.zuhu_api_config 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
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

-- Insert default API configuration
INSERT INTO public.zuhu_api_config (endpoint_name, endpoint_url, rate_limit, timeout_seconds) VALUES
('content_classifier', '/functions/v1/zuhu-content-classifier', 50, 45),
('page_generator', '/functions/v1/zuhu-page-generator', 30, 60),
('quality_checker', '/functions/v1/zuhu-quality-checker', 40, 30),
('deployment_handler', '/functions/v1/zuhu-deployment-handler', 20, 120);