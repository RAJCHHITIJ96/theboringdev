-- Create existing_articles table for tracking crawled articles
CREATE TABLE public.existing_articles (
  url VARCHAR(512) PRIMARY KEY,
  title VARCHAR(512),
  last_crawled TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.existing_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (matching other tables)
CREATE POLICY "Allow all operations on existing_articles" 
ON public.existing_articles 
FOR ALL 
USING (true) 
WITH CHECK (true);