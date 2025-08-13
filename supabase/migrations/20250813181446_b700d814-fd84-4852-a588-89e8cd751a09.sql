
-- Create TREND_MASTER table - Core trending AI topics collection
CREATE TABLE TREND_MASTER (
  trend_id VARCHAR(50) PRIMARY KEY,
  trend_topic VARCHAR(200) NOT NULL,
  trend_description TEXT,
  trend_keywords JSONB,
  trend_hashtags JSONB,
  trend_related_topics JSONB,
  trend_context TEXT,
  trend_audience VARCHAR(100),
  trend_industry_tags JSONB,
  trend_sentiment VARCHAR(20) CHECK (trend_sentiment IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED')),
  trend_geographic_focus JSONB,
  trend_content_types JSONB,
  trend_influencers JSONB,
  trend_companies_mentioned JSONB,
  trend_technologies JSONB,
  discovery_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discovery_time_period VARCHAR(20) CHECK (discovery_time_period IN ('morning', 'afternoon', 'evening')),
  trend_category VARCHAR(50) CHECK (trend_category IN ('AI_DEVELOPMENT', 'NO_CODE', 'AUTOMATION', 'AI_BUSINESS')),
  trend_source VARCHAR(100),
  trend_momentum_score INTEGER CHECK (trend_momentum_score BETWEEN 0 AND 100),
  trend_sustainability_score INTEGER CHECK (trend_sustainability_score BETWEEN 0 AND 100),
  social_mentions_count INTEGER DEFAULT 0,
  google_trends_score INTEGER CHECK (google_trends_score BETWEEN 0 AND 100),
  reddit_engagement_score INTEGER CHECK (reddit_engagement_score BETWEEN 0 AND 100),
  twitter_hashtag_volume INTEGER DEFAULT 0,
  github_repo_count INTEGER DEFAULT 0,
  news_articles_count INTEGER DEFAULT 0,
  estimated_peak_date DATE,
  trend_peak_period VARCHAR(20),
  daily_momentum_history JSONB,
  consistency_multiplier DECIMAL(3,2) DEFAULT 1.0,
  final_trend_score INTEGER CHECK (final_trend_score BETWEEN 0 AND 150),
  status VARCHAR(20) CHECK (status IN ('ACTIVE', 'DECLINING', 'ARCHIVED')) DEFAULT 'ACTIVE',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create KEYWORD_INTELLIGENCE table - SEO keyword analysis and opportunities
CREATE TABLE KEYWORD_INTELLIGENCE (
  keyword_id VARCHAR(50) PRIMARY KEY,
  trend_id VARCHAR(50) NOT NULL REFERENCES TREND_MASTER(trend_id) ON DELETE CASCADE,
  primary_keyword VARCHAR(200) NOT NULL,
  keyword_variations JSONB,
  search_volume_monthly INTEGER DEFAULT 0,
  search_volume_trend VARCHAR(20) CHECK (search_volume_trend IN ('RISING', 'STABLE', 'DECLINING')),
  keyword_difficulty INTEGER CHECK (keyword_difficulty BETWEEN 0 AND 100),
  cpc_value DECIMAL(10,2) DEFAULT 0,
  commercial_intent_score INTEGER CHECK (commercial_intent_score BETWEEN 0 AND 100),
  search_intent VARCHAR(20) CHECK (search_intent IN ('INFORMATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'NAVIGATIONAL')),
  serp_features JSONB,
  related_questions JSONB,
  semantic_keywords JSONB,
  seasonal_pattern JSONB,
  opportunity_score INTEGER CHECK (opportunity_score BETWEEN 0 AND 100),
  priority_level VARCHAR(10) CHECK (priority_level IN ('URGENT', 'HIGH', 'MEDIUM', 'LOW')),
  content_creation_status VARCHAR(20) CHECK (content_creation_status IN ('QUEUED', 'IN_PROGRESS', 'PUBLISHED', 'OPTIMIZING')) DEFAULT 'QUEUED',
  ahrefs_data JSONB,
  semrush_data JSONB,
  ubersuggest_data JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create COMPETITOR_INTELLIGENCE table - Competitive analysis data
CREATE TABLE COMPETITOR_INTELLIGENCE (
  competitor_id VARCHAR(50) PRIMARY KEY,
  keyword_id VARCHAR(50) NOT NULL REFERENCES KEYWORD_INTELLIGENCE(keyword_id) ON DELETE CASCADE,
  competitor_rank INTEGER NOT NULL CHECK (competitor_rank BETWEEN 1 AND 10),
  competitor_domain VARCHAR(200),
  current_ranking_position INTEGER,
  page_url TEXT,
  page_title VARCHAR(500),
  meta_description TEXT,
  content_word_count INTEGER DEFAULT 0,
  content_structure JSONB,
  internal_links_count INTEGER DEFAULT 0,
  external_links_count INTEGER DEFAULT 0,
  images_count INTEGER DEFAULT 0,
  videos_count INTEGER DEFAULT 0,
  code_snippets_count INTEGER DEFAULT 0,
  cta_elements_count INTEGER DEFAULT 0,
  page_load_speed DECIMAL(4,2),
  mobile_score INTEGER CHECK (mobile_score BETWEEN 0 AND 100),
  backlinks_count INTEGER DEFAULT 0,
  domain_authority INTEGER CHECK (domain_authority BETWEEN 0 AND 100),
  social_shares_total INTEGER DEFAULT 0,
  estimated_monthly_traffic INTEGER DEFAULT 0,
  content_gaps_identified JSONB,
  content_weaknesses JSONB,
  optimization_opportunities JSONB,
  content_last_updated DATE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_keyword_competitor_rank UNIQUE (keyword_id, competitor_rank)
);

-- Create CONTENT_BRIEFS table - AI-optimized content creation briefs
CREATE TABLE CONTENT_BRIEFS (
  brief_id VARCHAR(50) PRIMARY KEY,
  keyword_id VARCHAR(50) NOT NULL REFERENCES KEYWORD_INTELLIGENCE(keyword_id) ON DELETE CASCADE,
  trend_id VARCHAR(50) NOT NULL REFERENCES TREND_MASTER(trend_id) ON DELETE CASCADE,
  content_angle VARCHAR(500),
  target_word_count INTEGER DEFAULT 2000,
  recommended_structure JSONB,
  must_include_topics JSONB,
  competitor_gaps_to_exploit JSONB,
  internal_linking_strategy JSONB,
  external_linking_targets JSONB,
  image_requirements JSONB,
  video_requirements JSONB,
  code_examples_needed JSONB,
  faq_questions JSONB,
  semantic_keywords JSONB,
  gumroad_placement_strategy JSONB,
  expected_traffic_estimate INTEGER DEFAULT 0,
  expected_revenue_estimate DECIMAL(10,2) DEFAULT 0,
  content_urgency_score INTEGER CHECK (content_urgency_score BETWEEN 0 AND 100),
  estimated_time_to_rank_weeks INTEGER DEFAULT 8,
  claude_prompt_optimized TEXT,
  juhu_processing_notes TEXT,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_publish_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) CHECK (status IN ('DRAFT', 'READY', 'SENT_TO_AI', 'REVIEWING', 'APPROVED')) DEFAULT 'DRAFT'
);

-- Create PERFORMANCE_TRACKING table - Content performance analytics
CREATE TABLE PERFORMANCE_TRACKING (
  tracking_id VARCHAR(50) PRIMARY KEY,
  keyword_id VARCHAR(50) NOT NULL REFERENCES KEYWORD_INTELLIGENCE(keyword_id) ON DELETE CASCADE,
  content_url VARCHAR(500),
  publish_date TIMESTAMP WITH TIME ZONE,
  current_ranking_position INTEGER,
  monthly_organic_traffic INTEGER DEFAULT 0,
  monthly_organic_traffic_value DECIMAL(10,2) DEFAULT 0,
  click_through_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  time_on_page_seconds INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  gumroad_sales_attributed INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  backlinks_earned INTEGER DEFAULT 0,
  social_shares_total INTEGER DEFAULT 0,
  ranking_history JSONB,
  traffic_history JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create optimized indexes for TREND_MASTER
CREATE INDEX idx_trend_status_score ON TREND_MASTER(status, final_trend_score DESC);
CREATE INDEX idx_trend_discovery_date ON TREND_MASTER(discovery_date DESC);
CREATE INDEX idx_trend_time_period ON TREND_MASTER(discovery_time_period, discovery_date DESC);
CREATE INDEX idx_trend_topic_date ON TREND_MASTER(trend_topic, discovery_date DESC);
CREATE INDEX idx_trend_keywords ON TREND_MASTER USING GIN (trend_keywords);
CREATE INDEX idx_trend_hashtags ON TREND_MASTER USING GIN (trend_hashtags);
CREATE INDEX idx_trend_sentiment ON TREND_MASTER(trend_sentiment, final_trend_score DESC);
CREATE INDEX idx_trend_category_sentiment ON TREND_MASTER(trend_category, trend_sentiment);
CREATE INDEX idx_trend_audience ON TREND_MASTER(trend_audience, discovery_date DESC);

-- Create optimized indexes for KEYWORD_INTELLIGENCE
CREATE INDEX idx_keyword_trend ON KEYWORD_INTELLIGENCE(trend_id);
CREATE INDEX idx_keyword_priority ON KEYWORD_INTELLIGENCE(priority_level, opportunity_score DESC);
CREATE INDEX idx_keyword_status ON KEYWORD_INTELLIGENCE(content_creation_status);
CREATE INDEX idx_keyword_updated ON KEYWORD_INTELLIGENCE(last_updated DESC);

-- Create optimized indexes for COMPETITOR_INTELLIGENCE
CREATE INDEX idx_competitor_keyword ON COMPETITOR_INTELLIGENCE(keyword_id);
CREATE INDEX idx_competitor_rank ON COMPETITOR_INTELLIGENCE(keyword_id, competitor_rank);
CREATE INDEX idx_competitor_domain ON COMPETITOR_INTELLIGENCE(competitor_domain);

-- Create optimized indexes for CONTENT_BRIEFS
CREATE INDEX idx_brief_keyword ON CONTENT_BRIEFS(keyword_id);
CREATE INDEX idx_brief_trend ON CONTENT_BRIEFS(trend_id);
CREATE INDEX idx_brief_status_urgency ON CONTENT_BRIEFS(status, content_urgency_score DESC);
CREATE INDEX idx_brief_creation_date ON CONTENT_BRIEFS(creation_date DESC);

-- Create optimized indexes for PERFORMANCE_TRACKING
CREATE INDEX idx_tracking_keyword ON PERFORMANCE_TRACKING(keyword_id);
CREATE INDEX idx_tracking_publish_date ON PERFORMANCE_TRACKING(publish_date DESC);
CREATE INDEX idx_tracking_revenue ON PERFORMANCE_TRACKING(revenue_generated DESC);

-- Enable Row Level Security on all tables
ALTER TABLE TREND_MASTER ENABLE ROW LEVEL SECURITY;
ALTER TABLE KEYWORD_INTELLIGENCE ENABLE ROW LEVEL SECURITY;
ALTER TABLE COMPETITOR_INTELLIGENCE ENABLE ROW LEVEL SECURITY;
ALTER TABLE CONTENT_BRIEFS ENABLE ROW LEVEL SECURITY;
ALTER TABLE PERFORMANCE_TRACKING ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated access (service role can bypass these)
CREATE POLICY "Allow service role full access to TREND_MASTER" ON TREND_MASTER FOR ALL USING (true);
CREATE POLICY "Allow service role full access to KEYWORD_INTELLIGENCE" ON KEYWORD_INTELLIGENCE FOR ALL USING (true);
CREATE POLICY "Allow service role full access to COMPETITOR_INTELLIGENCE" ON COMPETITOR_INTELLIGENCE FOR ALL USING (true);
CREATE POLICY "Allow service role full access to CONTENT_BRIEFS" ON CONTENT_BRIEFS FOR ALL USING (true);
CREATE POLICY "Allow service role full access to PERFORMANCE_TRACKING" ON PERFORMANCE_TRACKING FOR ALL USING (true);

-- Create the critical batch selection view for exactly 17 articles
CREATE OR REPLACE VIEW batch_content_selection AS
WITH priority_content AS (
  SELECT 
    cb.brief_id,
    cb.keyword_id,
    cb.trend_id,
    cb.content_angle,
    cb.recommended_structure,
    cb.claude_prompt_optimized,
    cb.content_urgency_score,
    ki.primary_keyword,
    ki.opportunity_score,
    ki.search_volume_monthly,
    tm.trend_topic,
    tm.trend_description,
    tm.trend_keywords,
    tm.trend_context,
    tm.final_trend_score,
    ROW_NUMBER() OVER (
      ORDER BY 
        cb.content_urgency_score DESC,
        ki.opportunity_score DESC,
        tm.final_trend_score DESC,
        ki.search_volume_monthly DESC
    ) as content_rank
  FROM CONTENT_BRIEFS cb
  JOIN KEYWORD_INTELLIGENCE ki ON cb.keyword_id = ki.keyword_id  
  JOIN TREND_MASTER tm ON cb.trend_id = tm.trend_id
  WHERE 
    cb.status = 'READY'
    AND DATE(cb.creation_date) = CURRENT_DATE
)
SELECT * FROM priority_content 
WHERE content_rank <= 17
ORDER BY content_rank;

-- Create helper functions for ID generation
CREATE OR REPLACE FUNCTION generate_trend_id(
  trend_topic TEXT,
  discovery_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_period TEXT DEFAULT 'morning'
) RETURNS TEXT AS $$
DECLARE
  date_str TEXT;
  topic_slug TEXT;
  time_prefix TEXT;
  timestamp_suffix TEXT;
BEGIN
  date_str := TO_CHAR(discovery_date, 'YYYYMMDD');
  topic_slug := LOWER(REGEXP_REPLACE(trend_topic, '[^a-z0-9]', '_', 'g'));
  topic_slug := REGEXP_REPLACE(topic_slug, '_+', '_', 'g');
  topic_slug := SUBSTRING(topic_slug, 1, 25);
  time_prefix := SUBSTRING(time_period, 1, 3);
  timestamp_suffix := RIGHT(EXTRACT(EPOCH FROM NOW())::TEXT, 4);
  
  RETURN 'trend_' || date_str || '_' || time_prefix || '_' || topic_slug || '_' || timestamp_suffix;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_keyword_id(
  primary_keyword TEXT,
  trend_id_ref TEXT
) RETURNS TEXT AS $$
DECLARE
  keyword_slug TEXT;
  trend_suffix TEXT;
BEGIN
  keyword_slug := LOWER(REGEXP_REPLACE(primary_keyword, '[^a-z0-9]', '_', 'g'));
  keyword_slug := REGEXP_REPLACE(keyword_slug, '_+', '_', 'g');
  keyword_slug := SUBSTRING(keyword_slug, 1, 30);
  trend_suffix := SPLIT_PART(trend_id_ref, '_', -1);
  
  RETURN 'kw_' || keyword_slug || '_' || trend_suffix;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_competitor_id(
  keyword_id_ref TEXT,
  competitor_rank_val INTEGER
) RETURNS TEXT AS $$
DECLARE
  rank_padded TEXT;
  keyword_suffix TEXT;
  timestamp_suffix TEXT;
BEGIN
  rank_padded := LPAD(competitor_rank_val::TEXT, 2, '0');
  keyword_suffix := SPLIT_PART(keyword_id_ref, '_', -1);
  timestamp_suffix := RIGHT(EXTRACT(EPOCH FROM NOW())::TEXT, 3);
  
  RETURN 'comp_' || keyword_suffix || '_rank' || rank_padded || '_' || timestamp_suffix;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_brief_id(
  keyword_id_ref TEXT
) RETURNS TEXT AS $$
DECLARE
  date_str TEXT;
  keyword_suffix TEXT;
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  keyword_suffix := SPLIT_PART(keyword_id_ref, '_', -1);
  
  RETURN 'brief_' || date_str || '_' || keyword_suffix;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_tracking_id(
  keyword_id_ref TEXT
) RETURNS TEXT AS $$
DECLARE
  date_str TEXT;
  keyword_suffix TEXT;
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  keyword_suffix := SPLIT_PART(keyword_id_ref, '_', -1);
  
  RETURN 'track_' || date_str || '_' || keyword_suffix;
END;
$$ LANGUAGE plpgsql;
