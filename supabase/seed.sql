-- Seed data for development and testing
-- This file runs after migrations to populate your local database with sample data

-- Insert sample trends for development
INSERT INTO public.trend_master (
  trend_id, trend_topic, trend_description, trend_keywords, trend_hashtags,
  trend_context, trend_audience, trend_sentiment, trend_category, trend_source,
  trend_momentum_score, trend_sustainability_score, final_trend_score, status
) VALUES 
(
  'trend_20250927_mor_ai_agent_development_1234',
  'AI Agent Development with Supabase',
  'Growing trend of building intelligent AI agents using modern backend-as-a-service platforms',
  '["ai agents", "supabase", "backend development", "automation"]',
  '["#aiagents", "#supabase", "#backenddev", "#nocode"]',
  'Developers are increasingly building AI agents that can interact with databases and APIs automatically',
  'developers',
  'POSITIVE',
  'AI_DEVELOPMENT',
  'Reddit + GitHub',
  85,
  75,
  125,
  'ACTIVE'
),
(
  'trend_20250927_mor_no_code_ai_tools_5678',
  'No-Code AI Tool Integration',
  'Rise of drag-and-drop AI tool builders for non-technical users',
  '["no code", "ai tools", "automation", "drag drop"]',
  '["#nocode", "#aitools", "#automation"]',
  'Business users want to build AI workflows without coding knowledge',
  'business users',
  'POSITIVE',
  'NO_CODE',
  'Twitter + LinkedIn',
  92,
  68,
  135,
  'ACTIVE'
),
(
  'trend_20250927_aft_ai_content_generation_9999',
  'AI-Powered Content Generation for SEO',
  'Automated content creation systems for better search rankings',
  '["content generation", "seo", "ai writing", "blog automation"]',
  '["#contentmarketing", "#seo", "#aiwriting"]',
  'Marketing teams are adopting AI for scalable, SEO-optimized content creation',
  'marketers',
  'MIXED',
  'AI_BUSINESS',
  'Google Trends + Ahrefs',
  78,
  82,
  115,
  'ACTIVE'
);

-- Insert related keywords
INSERT INTO public.keyword_intelligence (
  keyword_id, trend_id, primary_keyword, search_volume_monthly, keyword_difficulty,
  commercial_intent_score, search_intent, opportunity_score, priority_level,
  content_creation_status
) VALUES
(
  'kw_ai_agent_supabase_tutorial_1234',
  'trend_20250927_mor_ai_agent_development_1234',
  'AI agent Supabase tutorial',
  2400,
  35,
  75,
  'INFORMATIONAL',
  88,
  'HIGH',
  'QUEUED'
),
(
  'kw_build_ai_agent_database_1234',
  'trend_20250927_mor_ai_agent_development_1234',
  'build AI agent with database',
  1800,
  42,
  68,
  'INFORMATIONAL',
  82,
  'HIGH',
  'QUEUED'
),
(
  'kw_no_code_ai_builder_5678',
  'trend_20250927_mor_no_code_ai_tools_5678',
  'no code AI builder',
  3200,
  28,
  85,
  'COMMERCIAL',
  92,
  'URGENT',
  'QUEUED'
),
(
  'kw_ai_content_seo_optimization_9999',
  'trend_20250927_aft_ai_content_generation_9999',
  'AI content SEO optimization',
  1950,
  48,
  72,
  'INFORMATIONAL',
  79,
  'MEDIUM',
  'QUEUED'
);

-- Insert content briefs
INSERT INTO public.content_briefs (
  brief_id, keyword_id, trend_id, content_angle, target_word_count,
  must_include_topics, expected_traffic_estimate, expected_revenue_estimate,
  content_urgency_score, claude_prompt_optimized, status
) VALUES
(
  'brief_20250927_1234',
  'kw_ai_agent_supabase_tutorial_1234',
  'trend_20250927_mor_ai_agent_development_1234',
  'Complete guide to building AI agents that can read/write to Supabase databases',
  2500,
  '["supabase setup", "AI agent architecture", "database connections", "authentication", "real-time updates"]',
  1200,
  145.50,
  95,
  'Write a comprehensive tutorial showing developers how to build an AI agent that can interact with a Supabase database. Include setup, authentication, CRUD operations, and real-time features.',
  'READY_FOR_PROCESSING'
),
(
  'brief_20250927_5678',
  'kw_no_code_ai_builder_5678',
  'trend_20250927_mor_no_code_ai_tools_5678',
  'Best no-code platforms for building AI tools and workflows',
  2200,
  '["platform comparison", "drag-drop builders", "pricing", "templates", "integrations"]',
  1800,
  220.75,
  98,
  'Create a detailed comparison of the top no-code AI building platforms, focusing on ease of use, features, pricing, and real-world examples.',
  'READY_FOR_PROCESSING'
),
(
  'brief_20250927_9999',
  'kw_ai_content_seo_optimization_9999',
  'trend_20250927_aft_ai_content_generation_9999',
  'How to optimize AI-generated content for better SEO rankings',
  2100,
  '["content optimization", "SEO best practices", "AI detection", "human editing", "keyword placement"]',
  950,
  125.25,
  85,
  'Explain how to take AI-generated content and optimize it for search engines while maintaining quality and avoiding AI detection penalties.',
  'READY_FOR_PROCESSING'
);

-- Insert sample competitor analysis
INSERT INTO public.competitor_intelligence (
  competitor_id, keyword_id, competitor_rank, competitor_domain,
  current_ranking_position, page_title, content_word_count,
  domain_authority, estimated_monthly_traffic
) VALUES
(
  'comp_1234_rank01_001',
  'kw_ai_agent_supabase_tutorial_1234',
  1,
  'supabase.com',
  1,
  'Building AI Agents with Supabase - Official Guide',
  1800,
  95,
  5200
),
(
  'comp_5678_rank01_002',
  'kw_no_code_ai_builder_5678',
  1,
  'zapier.com',
  1,
  'No-Code AI: Build Intelligent Workflows Without Programming',
  2100,
  88,
  8500
);

-- Insert development user for testing (optional)
-- This creates a test user in the auth.users table for local development
-- Password: testpassword123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'dev@example.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Dev User", "role": "developer"}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create a few sample batch processing analytics records
INSERT INTO public.batch_processing_analytics (
  processing_date, scenario_name, start_time, end_time,
  records_processed, records_successful, records_failed,
  average_quality_score, top_17_selected, system_notes
) VALUES
(
  CURRENT_DATE,
  'trend_collection',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '25 minutes',
  3,
  3,
  0,
  118.33,
  3,
  'Development seed data - successful processing of initial trends'
),
(
  CURRENT_DATE - INTERVAL '1 day',
  'content_generation',
  NOW() - INTERVAL '1 day 2 hours',
  NOW() - INTERVAL '1 day 1 hour',
  17,
  17,
  0,
  125.45,
  17,
  'Previous batch processing simulation'
);

-- Add some helpful development comments
COMMENT ON TABLE public.trend_master IS 'Core table for tracking AI and development trends';
COMMENT ON TABLE public.keyword_intelligence IS 'SEO keyword research and opportunity tracking';
COMMENT ON TABLE public.content_briefs IS 'AI-optimized content creation briefs';
COMMENT ON TABLE public.competitor_intelligence IS 'Competitive analysis for keyword rankings';
COMMENT ON TABLE public.performance_tracking IS 'Content performance and revenue tracking';
COMMENT ON VIEW public.batch_content_selection IS 'Automatically selects top 17 content pieces for daily processing';
COMMENT ON TABLE public.batch_processing_analytics IS 'Tracks daily batch processing performance and metrics';

-- Create a helpful development view for quick status checking
CREATE OR REPLACE VIEW public.dev_status_dashboard AS
SELECT 
  'Trends' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_count,
  AVG(final_trend_score) as avg_score
FROM public.trend_master
UNION ALL
SELECT 
  'Keywords' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE content_creation_status = 'QUEUED') as active_count,
  AVG(opportunity_score) as avg_score
FROM public.keyword_intelligence
UNION ALL
SELECT 
  'Content Briefs' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'READY_FOR_PROCESSING') as active_count,
  AVG(content_urgency_score) as avg_score
FROM public.content_briefs;

-- Test the batch content selection view
SELECT 
  '=== BATCH CONTENT SELECTION TEST ===' as test_section,
  COUNT(*) as selected_content_pieces,
  AVG(composite_quality_score) as avg_quality_score
FROM public.batch_content_selection;