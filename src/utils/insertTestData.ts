import { supabase } from "@/integrations/supabase/client";

const API_URL = "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGZhanRpYmtxeXRydnZ2aXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTA5MzgsImV4cCI6MjA3MDY4NjkzOH0.I87jM-QRNDJcjxMrVhA8l44RG3fhPmJ7nsn9UaNe8-4";

export const insertTestData = async () => {
  try {
    const batchData = [
      {
        operation: "insert",
        table: "KEYWORD_INTELLIGENCE",
        data: {
          keyword_id: "kw_20250816_ai_coding",
          trend_id: "trend_20250816_ai_coding_tools",
          primary_keyword: "AI coding",
          keyword_variations: ["AI coding tools", "AI for coding", "AI-assisted programming"],
          search_volume_monthly: 12000,
          search_volume_trend: "RISING",
          keyword_difficulty: 65,
          cpc_value: 1.20,
          commercial_intent_score: 75,
          search_intent: "INFORMATIONAL",
          serp_features: ["featured_snippet", "people_also_ask"],
          related_questions: ["What is AI coding?", "Best AI tools for coding?"],
          semantic_keywords: ["machine learning coding", "developer AI tools"],
          seasonal_pattern: [],
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
          content_structure: {"sections": ["intro", "features", "pricing", "faq"]},
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

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(batchData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    console.log("✅ Test data inserted successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error inserting test data:", error);
    throw error;
  }
};