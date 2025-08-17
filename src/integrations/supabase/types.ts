export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      competitor_intelligence: {
        Row: {
          analysis_date: string | null
          backlinks_count: number | null
          code_snippets_count: number | null
          competitor_domain: string | null
          competitor_id: string
          competitor_rank: number
          content_gaps_identified: Json | null
          content_last_updated: string | null
          content_structure: Json | null
          content_weaknesses: Json | null
          content_word_count: number | null
          cta_elements_count: number | null
          current_ranking_position: number | null
          domain_authority: number | null
          estimated_monthly_traffic: number | null
          external_links_count: number | null
          images_count: number | null
          internal_links_count: number | null
          keyword_id: string
          meta_description: string | null
          mobile_score: number | null
          optimization_opportunities: Json | null
          page_load_speed: number | null
          page_title: string | null
          page_url: string | null
          social_shares_total: number | null
          videos_count: number | null
        }
        Insert: {
          analysis_date?: string | null
          backlinks_count?: number | null
          code_snippets_count?: number | null
          competitor_domain?: string | null
          competitor_id: string
          competitor_rank: number
          content_gaps_identified?: Json | null
          content_last_updated?: string | null
          content_structure?: Json | null
          content_weaknesses?: Json | null
          content_word_count?: number | null
          cta_elements_count?: number | null
          current_ranking_position?: number | null
          domain_authority?: number | null
          estimated_monthly_traffic?: number | null
          external_links_count?: number | null
          images_count?: number | null
          internal_links_count?: number | null
          keyword_id: string
          meta_description?: string | null
          mobile_score?: number | null
          optimization_opportunities?: Json | null
          page_load_speed?: number | null
          page_title?: string | null
          page_url?: string | null
          social_shares_total?: number | null
          videos_count?: number | null
        }
        Update: {
          analysis_date?: string | null
          backlinks_count?: number | null
          code_snippets_count?: number | null
          competitor_domain?: string | null
          competitor_id?: string
          competitor_rank?: number
          content_gaps_identified?: Json | null
          content_last_updated?: string | null
          content_structure?: Json | null
          content_weaknesses?: Json | null
          content_word_count?: number | null
          cta_elements_count?: number | null
          current_ranking_position?: number | null
          domain_authority?: number | null
          estimated_monthly_traffic?: number | null
          external_links_count?: number | null
          images_count?: number | null
          internal_links_count?: number | null
          keyword_id?: string
          meta_description?: string | null
          mobile_score?: number | null
          optimization_opportunities?: Json | null
          page_load_speed?: number | null
          page_title?: string | null
          page_url?: string | null
          social_shares_total?: number | null
          videos_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_intelligence_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keyword_intelligence"
            referencedColumns: ["keyword_id"]
          },
        ]
      }
      content_briefs: {
        Row: {
          brief_id: string
          claude_prompt_optimized: string | null
          code_examples_needed: Json | null
          competitor_gaps_to_exploit: Json | null
          content_angle: string | null
          content_urgency_score: number | null
          creation_date: string | null
          estimated_time_to_rank_weeks: number | null
          expected_revenue_estimate: number | null
          expected_traffic_estimate: number | null
          external_linking_targets: Json | null
          faq_questions: Json | null
          gumroad_placement_strategy: Json | null
          image_requirements: Json | null
          internal_linking_strategy: Json | null
          juhu_processing_notes: string | null
          keyword_id: string
          must_include_topics: Json | null
          recommended_structure: Json | null
          scheduled_publish_date: string | null
          semantic_keywords: Json | null
          status: string | null
          target_word_count: number | null
          trend_id: string
          video_requirements: Json | null
        }
        Insert: {
          brief_id: string
          claude_prompt_optimized?: string | null
          code_examples_needed?: Json | null
          competitor_gaps_to_exploit?: Json | null
          content_angle?: string | null
          content_urgency_score?: number | null
          creation_date?: string | null
          estimated_time_to_rank_weeks?: number | null
          expected_revenue_estimate?: number | null
          expected_traffic_estimate?: number | null
          external_linking_targets?: Json | null
          faq_questions?: Json | null
          gumroad_placement_strategy?: Json | null
          image_requirements?: Json | null
          internal_linking_strategy?: Json | null
          juhu_processing_notes?: string | null
          keyword_id: string
          must_include_topics?: Json | null
          recommended_structure?: Json | null
          scheduled_publish_date?: string | null
          semantic_keywords?: Json | null
          status?: string | null
          target_word_count?: number | null
          trend_id: string
          video_requirements?: Json | null
        }
        Update: {
          brief_id?: string
          claude_prompt_optimized?: string | null
          code_examples_needed?: Json | null
          competitor_gaps_to_exploit?: Json | null
          content_angle?: string | null
          content_urgency_score?: number | null
          creation_date?: string | null
          estimated_time_to_rank_weeks?: number | null
          expected_revenue_estimate?: number | null
          expected_traffic_estimate?: number | null
          external_linking_targets?: Json | null
          faq_questions?: Json | null
          gumroad_placement_strategy?: Json | null
          image_requirements?: Json | null
          internal_linking_strategy?: Json | null
          juhu_processing_notes?: string | null
          keyword_id?: string
          must_include_topics?: Json | null
          recommended_structure?: Json | null
          scheduled_publish_date?: string | null
          semantic_keywords?: Json | null
          status?: string | null
          target_word_count?: number | null
          trend_id?: string
          video_requirements?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_briefs_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keyword_intelligence"
            referencedColumns: ["keyword_id"]
          },
          {
            foreignKeyName: "content_briefs_trend_id_fkey"
            columns: ["trend_id"]
            isOneToOne: false
            referencedRelation: "trend_master"
            referencedColumns: ["trend_id"]
          },
        ]
      }
      existing_articles: {
        Row: {
          last_crawled: string | null
          title: string | null
          url: string
        }
        Insert: {
          last_crawled?: string | null
          title?: string | null
          url: string
        }
        Update: {
          last_crawled?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      keyword_intelligence: {
        Row: {
          ahrefs_data: Json | null
          commercial_intent_score: number | null
          content_creation_status: string | null
          cpc_value: number | null
          keyword_difficulty: number | null
          keyword_id: string
          keyword_variations: Json | null
          last_updated: string | null
          opportunity_score: number | null
          primary_keyword: string
          priority_level: string | null
          related_questions: Json | null
          search_intent: string | null
          search_volume_monthly: number | null
          search_volume_trend: string | null
          seasonal_pattern: Json | null
          semantic_keywords: Json | null
          semrush_data: Json | null
          serp_features: Json | null
          trend_id: string
          ubersuggest_data: Json | null
        }
        Insert: {
          ahrefs_data?: Json | null
          commercial_intent_score?: number | null
          content_creation_status?: string | null
          cpc_value?: number | null
          keyword_difficulty?: number | null
          keyword_id: string
          keyword_variations?: Json | null
          last_updated?: string | null
          opportunity_score?: number | null
          primary_keyword: string
          priority_level?: string | null
          related_questions?: Json | null
          search_intent?: string | null
          search_volume_monthly?: number | null
          search_volume_trend?: string | null
          seasonal_pattern?: Json | null
          semantic_keywords?: Json | null
          semrush_data?: Json | null
          serp_features?: Json | null
          trend_id: string
          ubersuggest_data?: Json | null
        }
        Update: {
          ahrefs_data?: Json | null
          commercial_intent_score?: number | null
          content_creation_status?: string | null
          cpc_value?: number | null
          keyword_difficulty?: number | null
          keyword_id?: string
          keyword_variations?: Json | null
          last_updated?: string | null
          opportunity_score?: number | null
          primary_keyword?: string
          priority_level?: string | null
          related_questions?: Json | null
          search_intent?: string | null
          search_volume_monthly?: number | null
          search_volume_trend?: string | null
          seasonal_pattern?: Json | null
          semantic_keywords?: Json | null
          semrush_data?: Json | null
          serp_features?: Json | null
          trend_id?: string
          ubersuggest_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_intelligence_trend_id_fkey"
            columns: ["trend_id"]
            isOneToOne: false
            referencedRelation: "trend_master"
            referencedColumns: ["trend_id"]
          },
        ]
      }
      performance_tracking: {
        Row: {
          backlinks_earned: number | null
          bounce_rate: number | null
          click_through_rate: number | null
          content_url: string | null
          conversion_rate: number | null
          current_ranking_position: number | null
          gumroad_sales_attributed: number | null
          keyword_id: string
          last_updated: string | null
          monthly_organic_traffic: number | null
          monthly_organic_traffic_value: number | null
          publish_date: string | null
          ranking_history: Json | null
          revenue_generated: number | null
          social_shares_total: number | null
          time_on_page_seconds: number | null
          tracking_id: string
          traffic_history: Json | null
        }
        Insert: {
          backlinks_earned?: number | null
          bounce_rate?: number | null
          click_through_rate?: number | null
          content_url?: string | null
          conversion_rate?: number | null
          current_ranking_position?: number | null
          gumroad_sales_attributed?: number | null
          keyword_id: string
          last_updated?: string | null
          monthly_organic_traffic?: number | null
          monthly_organic_traffic_value?: number | null
          publish_date?: string | null
          ranking_history?: Json | null
          revenue_generated?: number | null
          social_shares_total?: number | null
          time_on_page_seconds?: number | null
          tracking_id: string
          traffic_history?: Json | null
        }
        Update: {
          backlinks_earned?: number | null
          bounce_rate?: number | null
          click_through_rate?: number | null
          content_url?: string | null
          conversion_rate?: number | null
          current_ranking_position?: number | null
          gumroad_sales_attributed?: number | null
          keyword_id?: string
          last_updated?: string | null
          monthly_organic_traffic?: number | null
          monthly_organic_traffic_value?: number | null
          publish_date?: string | null
          ranking_history?: Json | null
          revenue_generated?: number | null
          social_shares_total?: number | null
          time_on_page_seconds?: number | null
          tracking_id?: string
          traffic_history?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_tracking_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keyword_intelligence"
            referencedColumns: ["keyword_id"]
          },
        ]
      }
      trend_master: {
        Row: {
          consistency_multiplier: number | null
          daily_momentum_history: Json | null
          discovery_date: string | null
          discovery_time_period: string | null
          estimated_peak_date: string | null
          final_trend_score: number | null
          github_repo_count: number | null
          google_trends_score: number | null
          last_updated: string | null
          news_articles_count: number | null
          reddit_engagement_score: number | null
          social_mentions_count: number | null
          status: string | null
          trend_audience: string | null
          trend_category: string | null
          trend_companies_mentioned: Json | null
          trend_content_types: Json | null
          trend_context: string | null
          trend_description: string | null
          trend_geographic_focus: Json | null
          trend_hashtags: Json | null
          trend_id: string
          trend_industry_tags: Json | null
          trend_influencers: Json | null
          trend_keywords: Json | null
          trend_momentum_score: number | null
          trend_peak_period: string | null
          trend_related_topics: Json | null
          trend_sentiment: string | null
          trend_source: string | null
          trend_sustainability_score: number | null
          trend_technologies: Json | null
          trend_topic: string
          twitter_hashtag_volume: number | null
        }
        Insert: {
          consistency_multiplier?: number | null
          daily_momentum_history?: Json | null
          discovery_date?: string | null
          discovery_time_period?: string | null
          estimated_peak_date?: string | null
          final_trend_score?: number | null
          github_repo_count?: number | null
          google_trends_score?: number | null
          last_updated?: string | null
          news_articles_count?: number | null
          reddit_engagement_score?: number | null
          social_mentions_count?: number | null
          status?: string | null
          trend_audience?: string | null
          trend_category?: string | null
          trend_companies_mentioned?: Json | null
          trend_content_types?: Json | null
          trend_context?: string | null
          trend_description?: string | null
          trend_geographic_focus?: Json | null
          trend_hashtags?: Json | null
          trend_id: string
          trend_industry_tags?: Json | null
          trend_influencers?: Json | null
          trend_keywords?: Json | null
          trend_momentum_score?: number | null
          trend_peak_period?: string | null
          trend_related_topics?: Json | null
          trend_sentiment?: string | null
          trend_source?: string | null
          trend_sustainability_score?: number | null
          trend_technologies?: Json | null
          trend_topic: string
          twitter_hashtag_volume?: number | null
        }
        Update: {
          consistency_multiplier?: number | null
          daily_momentum_history?: Json | null
          discovery_date?: string | null
          discovery_time_period?: string | null
          estimated_peak_date?: string | null
          final_trend_score?: number | null
          github_repo_count?: number | null
          google_trends_score?: number | null
          last_updated?: string | null
          news_articles_count?: number | null
          reddit_engagement_score?: number | null
          social_mentions_count?: number | null
          status?: string | null
          trend_audience?: string | null
          trend_category?: string | null
          trend_companies_mentioned?: Json | null
          trend_content_types?: Json | null
          trend_context?: string | null
          trend_description?: string | null
          trend_geographic_focus?: Json | null
          trend_hashtags?: Json | null
          trend_id?: string
          trend_industry_tags?: Json | null
          trend_influencers?: Json | null
          trend_keywords?: Json | null
          trend_momentum_score?: number | null
          trend_peak_period?: string | null
          trend_related_topics?: Json | null
          trend_sentiment?: string | null
          trend_source?: string | null
          trend_sustainability_score?: number | null
          trend_technologies?: Json | null
          trend_topic?: string
          twitter_hashtag_volume?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      batch_content_selection: {
        Row: {
          brief_id: string | null
          claude_prompt_optimized: string | null
          code_examples_needed: Json | null
          competitor_gaps_to_exploit: Json | null
          content_angle: string | null
          content_urgency_score: number | null
          creation_date: string | null
          estimated_time_to_rank_weeks: number | null
          expected_revenue_estimate: number | null
          expected_traffic_estimate: number | null
          external_linking_targets: Json | null
          faq_questions: Json | null
          final_trend_score: number | null
          gumroad_placement_strategy: Json | null
          image_requirements: Json | null
          internal_linking_strategy: Json | null
          juhu_processing_notes: string | null
          keyword_id: string | null
          must_include_topics: Json | null
          opportunity_score: number | null
          primary_keyword: string | null
          quality_score: number | null
          recommended_structure: Json | null
          scheduled_publish_date: string | null
          search_volume_monthly: number | null
          selection_rank: number | null
          semantic_keywords: Json | null
          status: string | null
          target_word_count: number | null
          trend_id: string | null
          trend_topic: string | null
          video_requirements: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_briefs_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keyword_intelligence"
            referencedColumns: ["keyword_id"]
          },
          {
            foreignKeyName: "content_briefs_trend_id_fkey"
            columns: ["trend_id"]
            isOneToOne: false
            referencedRelation: "trend_master"
            referencedColumns: ["trend_id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
