
import { supabase } from "@/integrations/supabase/client";

export const insertTestData = async () => {
  try {
    console.log('🚀 Starting data insertion...');
    
    // Prepare batch request for both records
    const batchRequest = [
      {
        operation: "insert",
        table: "KEYWORD_INTELLIGENCE",
        data: {
          keyword_id: "kw_20250816_ai_coding",
          trend_id: "trend_20250816_ai_coding_tools",
          primary_keyword: "AI coding",
          keyword_variations: ["AI coding tools", "AI for coding", "AI-assisted programming"],
          search_volume_monthly: 12000,
          search_volume_trend: "rising",
          keyword_difficulty: 65,
          cpc_value: 1.20,
          commercial_intent_score: 75,
          search_intent: "informational",
          serp_features: ["featured_snippet", "people_also_ask"],
          related_questions: ["What is AI coding?", "Best AI tools for coding?"],
          semantic_keywords: ["machine learning coding", "developer AI tools"],
          seasonal_pattern: {},
          opportunity_score: 70,
          priority_level: "HIGH",
          content_creation_status: "QUEUED",
          ahrefs_data: {},
          semrush_data: {},
          ubersuggest_data: {},
          last_updated: "2025-08-16T15:08:01+05:30"
        }
      },
      {
        operation: "insert",
        table: "COMPETITOR_INTELLIGENCE", 
        data: {
          competitor_id: "comp_20250816_openai_copilot",
          keyword_id: "kw_20250816_ai_coding",
          competitor_rank: 1,
          competitor_domain: "github.com",
          current_ranking_position: 1,
          page_url: "https://github.com/features/copilot",
          page_title: "GitHub Copilot · Your AI pair programmer",
          meta_description: "GitHub Copilot helps you code faster with AI-powered suggestions.",
          content_word_count: 2200,
          content_structure: {
            sections: ["intro", "features", "pricing", "faq"]
          },
          internal_links_count: 45,
          external_links_count: 12,
          images_count: 8,
          videos_count: 2,
          code_snippets_count: 12,
          cta_elements_count: 4,
          page_load_speed: 1.2,
          mobile_score: 95,
          backlinks_count: 24000,
          domain_authority: 96,
          social_shares_total: 5500,
          estimated_monthly_traffic: 180000,
          content_gaps_identified: ["enterprise integrations"],
          content_weaknesses: ["pricing transparency"],
          optimization_opportunities: ["add tutorials"],
          content_last_updated: "2025-08-01",
          analysis_date: "2025-08-16T15:08:01+05:30"
        }
      }
    ];

    // Call the AI Intelligence Processor function
    const { data, error } = await supabase.functions.invoke('ai-intelligence-processor', {
      body: batchRequest
    });

    if (error) {
      console.error('❌ Error inserting data:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Data insertion successful:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error: error.message };
  }
};
