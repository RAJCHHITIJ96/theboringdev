-- CRITICAL SECURITY FIX: Replace public RLS policies with user-based access control

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add user_id columns to existing tables for proper data isolation
ALTER TABLE public.trend_master ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.keyword_intelligence ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.content_briefs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.competitor_intelligence ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.performance_tracking ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.batch_content_selection ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- CRITICAL: Replace all public access RLS policies with user-based access

-- Drop existing public access policies
DROP POLICY IF EXISTS "Allow service role full access to TREND_MASTER" ON public.trend_master;
DROP POLICY IF EXISTS "Allow service role full access to KEYWORD_INTELLIGENCE" ON public.keyword_intelligence;
DROP POLICY IF EXISTS "Allow service role full access to CONTENT_BRIEFS" ON public.content_briefs;
DROP POLICY IF EXISTS "Allow service role full access to COMPETITOR_INTELLIGENCE" ON public.competitor_intelligence;
DROP POLICY IF EXISTS "Allow service role full access to PERFORMANCE_TRACKING" ON public.performance_tracking;
DROP POLICY IF EXISTS "Allow service role full access to batch_processing_analytics" ON public.batch_processing_analytics;

-- Create secure user-based RLS policies for trend_master
CREATE POLICY "Users can view their own trends" 
ON public.trend_master 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trends" 
ON public.trend_master 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trends" 
ON public.trend_master 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure user-based RLS policies for keyword_intelligence
CREATE POLICY "Users can view their own keywords" 
ON public.keyword_intelligence 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own keywords" 
ON public.keyword_intelligence 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keywords" 
ON public.keyword_intelligence 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure user-based RLS policies for content_briefs
CREATE POLICY "Users can view their own content briefs" 
ON public.content_briefs 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content briefs" 
ON public.content_briefs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content briefs" 
ON public.content_briefs 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure user-based RLS policies for competitor_intelligence
CREATE POLICY "Users can view their own competitor data" 
ON public.competitor_intelligence 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own competitor data" 
ON public.competitor_intelligence 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own competitor data" 
ON public.competitor_intelligence 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure user-based RLS policies for performance_tracking
CREATE POLICY "Users can view their own performance data" 
ON public.performance_tracking 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own performance data" 
ON public.performance_tracking 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance data" 
ON public.performance_tracking 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure user-based RLS policies for batch_content_selection
CREATE POLICY "Users can view their own batch selections" 
ON public.batch_content_selection 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own batch selections" 
ON public.batch_content_selection 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create secure user-based RLS policies for batch_processing_analytics
CREATE POLICY "Users can view their own analytics" 
ON public.batch_processing_analytics 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
ON public.batch_processing_analytics 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add user_id column to batch_processing_analytics
ALTER TABLE public.batch_processing_analytics ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix Security Definer Function - Update to be user-specific and secure
CREATE OR REPLACE FUNCTION public.get_emergency_content_batch(target_count INTEGER DEFAULT 17)
RETURNS TABLE (
  trend_id VARCHAR,
  trend_topic VARCHAR,
  keyword_id VARCHAR,  
  primary_keyword VARCHAR,
  brief_id VARCHAR,
  content_angle VARCHAR,
  emergency_rank INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- SECURITY FIX: Only return data for the authenticated user
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied: Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    tm.trend_id::VARCHAR,
    tm.trend_topic::VARCHAR,
    ki.keyword_id::VARCHAR,
    ki.primary_keyword::VARCHAR,
    cb.brief_id::VARCHAR,
    cb.content_angle::VARCHAR,
    ROW_NUMBER() OVER (
      ORDER BY 
        COALESCE(tm.final_trend_score, 0) DESC,
        COALESCE(ki.search_volume_monthly, 0) DESC,
        tm.discovery_date DESC
    )::INTEGER as emergency_rank
    
  FROM public.trend_master tm
  JOIN public.keyword_intelligence ki ON tm.trend_id = ki.trend_id
  JOIN public.content_briefs cb ON ki.keyword_id = cb.keyword_id
  
  WHERE cb.status IN ('DRAFT', 'READY_FOR_PROCESSING', 'QUEUED')
    AND tm.discovery_date >= CURRENT_DATE - INTERVAL '30 days'
    AND tm.user_id = auth.uid()  -- SECURITY FIX: Only user's own data
    AND ki.user_id = auth.uid()  -- SECURITY FIX: Only user's own data
    AND cb.user_id = auth.uid()  -- SECURITY FIX: Only user's own data
  
  ORDER BY emergency_rank
  LIMIT target_count;
END;
$$;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();