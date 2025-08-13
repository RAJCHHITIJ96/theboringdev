-- GOLDMINE SYSTEM: Complete 5-Table Database Schema
-- Optimized for batch processing, Make.com integration, and 17-article selection

-- Table 1: TREND_MASTER
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

-- Table 2: KEYWORD_INTELLIGENCE
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

-- Table 3: COMPETITOR_INTELLIGENCE
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

-- Table 4: CONTENT_BRIEFS
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

-- Table 5: PERFORMANCE_TRACKING
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

-- PERFORMANCE INDEXES FOR BATCH PROCESSING
-- TREND_MASTER Indexes
CREATE INDEX idx_trend_status_score ON TREND_MASTER(status, final_trend_score DESC);
CREATE INDEX idx_trend_discovery_date ON TREND_MASTER(discovery_date DESC);
CREATE INDEX idx_trend_time_period ON TREND_MASTER(discovery_time_period, discovery_date DESC);
CREATE INDEX idx_trend_topic_date ON TREND_MASTER(trend_topic, discovery_date DESC);
CREATE INDEX idx_trend_keywords ON TREND_MASTER USING GIN (trend_keywords);
CREATE INDEX idx_trend_hashtags ON TREND_MASTER USING GIN (trend_hashtags);
CREATE INDEX idx_trend_sentiment ON TREND_MASTER(trend_sentiment, final_trend_score DESC);
CREATE INDEX idx_trend_category_sentiment ON TREND_MASTER(trend_category, trend_sentiment);
CREATE INDEX idx_trend_audience ON TREND_MASTER(trend_audience, discovery_date DESC);

-- KEYWORD_INTELLIGENCE Indexes
CREATE INDEX idx_keyword_trend ON KEYWORD_INTELLIGENCE(trend_id);
CREATE INDEX idx_keyword_priority ON KEYWORD_INTELLIGENCE(priority_level, opportunity_score DESC);
CREATE INDEX idx_keyword_status ON KEYWORD_INTELLIGENCE(content_creation_status);
CREATE INDEX idx_keyword_updated ON KEYWORD_INTELLIGENCE(last_updated DESC);

-- COMPETITOR_INTELLIGENCE Indexes
CREATE INDEX idx_competitor_keyword ON COMPETITOR_INTELLIGENCE(keyword_id);
CREATE INDEX idx_competitor_rank ON COMPETITOR_INTELLIGENCE(keyword_id, competitor_rank);
CREATE INDEX idx_competitor_domain ON COMPETITOR_INTELLIGENCE(competitor_domain);

-- CONTENT_BRIEFS Indexes
CREATE INDEX idx_brief_keyword ON CONTENT_BRIEFS(keyword_id);
CREATE INDEX idx_brief_trend ON CONTENT_BRIEFS(trend_id);
CREATE INDEX idx_brief_status_urgency ON CONTENT_BRIEFS(status, content_urgency_score DESC);
CREATE INDEX idx_brief_creation_date ON CONTENT_BRIEFS(creation_date DESC);

-- PERFORMANCE_TRACKING Indexes
CREATE INDEX idx_tracking_keyword ON PERFORMANCE_TRACKING(keyword_id);
CREATE INDEX idx_tracking_publish_date ON PERFORMANCE_TRACKING(publish_date DESC);
CREATE INDEX idx_tracking_revenue ON PERFORMANCE_TRACKING(revenue_generated DESC);

-- BATCH CONTENT SELECTION VIEW (17-Article Algorithm)
CREATE VIEW batch_content_selection AS
WITH smart_selection AS (
  SELECT 
    cb.*,
    ki.primary_keyword,
    ki.opportunity_score,
    ki.search_volume_monthly,
    tm.trend_topic,
    tm.final_trend_score,
    -- Smart scoring with NULL handling
    (COALESCE(cb.content_urgency_score, 50) * 0.35 +
     COALESCE(ki.opportunity_score, 40) * 0.25 +
     COALESCE(ki.search_volume_monthly, 100) / 100 * 0.20 +
     COALESCE(tm.final_trend_score, 60) * 0.15 +
     COALESCE(cb.expected_traffic_estimate, 500) / 100 * 0.05
    ) AS quality_score,
    ROW_NUMBER() OVER (
      ORDER BY 
        COALESCE(cb.content_urgency_score, 50) DESC,
        COALESCE(ki.opportunity_score, 40) DESC,
        COALESCE(ki.search_volume_monthly, 100) DESC,
        COALESCE(tm.final_trend_score, 60) DESC,
        cb.creation_date DESC
    ) as selection_rank
  FROM content_briefs cb
  JOIN keyword_intelligence ki ON cb.keyword_id = ki.keyword_id
  JOIN trend_master tm ON cb.trend_id = tm.trend_id
  WHERE cb.status = 'READY' 
    AND DATE(cb.creation_date) = CURRENT_DATE
)
SELECT * FROM smart_selection 
WHERE selection_rank <= 17
ORDER BY selection_rank;

-- ENABLE ROW LEVEL SECURITY (but no policies - open access for automation)
ALTER TABLE TREND_MASTER ENABLE ROW LEVEL SECURITY;
ALTER TABLE KEYWORD_INTELLIGENCE ENABLE ROW LEVEL SECURITY;
ALTER TABLE COMPETITOR_INTELLIGENCE ENABLE ROW LEVEL SECURITY;
ALTER TABLE CONTENT_BRIEFS ENABLE ROW LEVEL SECURITY;
ALTER TABLE PERFORMANCE_TRACKING ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for automation access
CREATE POLICY "Allow all operations on trend_master" ON TREND_MASTER FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on keyword_intelligence" ON KEYWORD_INTELLIGENCE FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on competitor_intelligence" ON COMPETITOR_INTELLIGENCE FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on content_briefs" ON CONTENT_BRIEFS FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on performance_tracking" ON PERFORMANCE_TRACKING FOR ALL USING (true) WITH CHECK (true);