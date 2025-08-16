import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BatchOperation {
  operation: 'insert';
  table: 'TREND_MASTER' | 'KEYWORD_INTELLIGENCE' | 'COMPETITOR_INTELLIGENCE' | 'CONTENT_BRIEFS';
  data: any;
}

interface IntelligenceRequest {
  database_id: number;
  raw_data: any;
}

type BatchIntelligenceRequest = BatchOperation[];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.json();

    // Check if request is in batch format (array) or legacy format (object)
    const isBatchRequest = Array.isArray(requestBody);

    if (isBatchRequest) {
      // Handle batch request format
      const operations: BatchIntelligenceRequest = requestBody;
      
      console.log(`Processing batch intelligence request with ${operations.length} operations`);

      // Validate batch size (1-10 operations)
      if (operations.length < 1 || operations.length > 10) {
        return new Response(
          JSON.stringify({ 
            error: 'Batch size must be between 1 and 10 operations',
            success: false,
            received_operations: operations.length
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Process all operations
      const results = [];
      let totalInserted = 0;
      let hasErrors = false;

      for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        
        try {
          // Validate operation structure
          if (!operation.operation || !operation.table || !operation.data) {
            results.push({
              operation_index: i,
              success: false,
              error: 'Missing required fields: operation, table, and data'
            });
            hasErrors = true;
            continue;
          }

          if (operation.operation !== 'insert') {
            results.push({
              operation_index: i,
              success: false,
              error: 'Only "insert" operation is currently supported'
            });
            hasErrors = true;
            continue;
          }

          // Map table name to database function
          let result;
          let tableName = '';
          
          switch (operation.table) {
            case 'TREND_MASTER':
              tableName = 'trend_master';
              result = await processTrendMasterData(supabaseClient, operation.data);
              break;
            case 'KEYWORD_INTELLIGENCE':
              tableName = 'keyword_intelligence';
              result = await processKeywordIntelligenceData(supabaseClient, operation.data);
              break;
            case 'COMPETITOR_INTELLIGENCE':
              tableName = 'competitor_intelligence';
              result = await processCompetitorIntelligenceData(supabaseClient, operation.data);
              break;
            case 'CONTENT_BRIEFS':
              tableName = 'content_briefs';
              result = await processContentBriefsData(supabaseClient, operation.data);
              break;
            default:
              results.push({
                operation_index: i,
                success: false,
                error: 'Invalid table name. Use: TREND_MASTER, KEYWORD_INTELLIGENCE, COMPETITOR_INTELLIGENCE, or CONTENT_BRIEFS'
              });
              hasErrors = true;
              continue;
          }

          if (result.error) {
            console.error(`Error in operation ${i} for ${tableName}:`, result.error);
            results.push({
              operation_index: i,
              table: tableName,
              success: false,
              error: result.error.message
            });
            hasErrors = true;
          } else {
            const insertedCount = result.data?.length || 1;
            totalInserted += insertedCount;
            results.push({
              operation_index: i,
              table: tableName,
              success: true,
              inserted_records: insertedCount
            });
          }
        } catch (operationError) {
          console.error(`Error processing operation ${i}:`, operationError);
          results.push({
            operation_index: i,
            success: false,
            error: operationError.message
          });
          hasErrors = true;
        }
      }

      // Return batch results
      const responseStatus = hasErrors ? 207 : 200; // 207 Multi-Status for partial success
      return new Response(
        JSON.stringify({
          success: !hasErrors,
          message: hasErrors 
            ? `Batch processed with ${results.filter(r => r.success).length}/${operations.length} successful operations`
            : `All ${operations.length} operations completed successfully`,
          total_operations: operations.length,
          successful_operations: results.filter(r => r.success).length,
          failed_operations: results.filter(r => !r.success).length,
          total_inserted_records: totalInserted,
          results: results
        }),
        { 
          status: responseStatus,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      // Handle legacy single request format
      const { database_id, raw_data }: IntelligenceRequest = requestBody;

      console.log(`Processing legacy intelligence request for database_id: ${database_id}`);

      // Validate input
      if (!database_id || !raw_data) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields: database_id and raw_data',
            success: false 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Process data based on database_id
      let result;
      let tableName = '';

      switch (database_id) {
        case 1: // TREND_MASTER
          tableName = 'trend_master';
          result = await processTrendMasterData(supabaseClient, raw_data);
          break;
        case 2: // KEYWORD_INTELLIGENCE
          tableName = 'keyword_intelligence';
          result = await processKeywordIntelligenceData(supabaseClient, raw_data);
          break;
        case 3: // COMPETITOR_INTELLIGENCE
          tableName = 'competitor_intelligence';
          result = await processCompetitorIntelligenceData(supabaseClient, raw_data);
          break;
        case 4: // CONTENT_BRIEFS
          tableName = 'content_briefs';
          result = await processContentBriefsData(supabaseClient, raw_data);
          break;
        default:
          return new Response(
            JSON.stringify({ 
              error: 'Invalid database_id. Use: 1=TREND_MASTER, 2=KEYWORD_INTELLIGENCE, 3=COMPETITOR_INTELLIGENCE, 4=CONTENT_BRIEFS',
              success: false 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
      }

      if (result.error) {
        console.error(`Error inserting into ${tableName}:`, result.error);
        return new Response(
          JSON.stringify({ 
            error: result.error.message,
            success: false,
            table: tableName 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Successfully processed data for ${tableName}`);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Data successfully processed and inserted into ${tableName}`,
          table: tableName,
          inserted_records: result.data?.length || 1
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in ai-intelligence-processor:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Category mapping function to ensure valid trend_category values
function mapTrendCategory(inputCategory: string): string {
  if (!inputCategory) return 'AI_DEVELOPMENT'; // default fallback
  
  const normalizedCategory = inputCategory.toUpperCase();
  
  // Map common AI-related categories to valid database values
  const categoryMappings = {
    // AI Development related
    'AI_PRODUCT_NEWS': 'AI_DEVELOPMENT',
    'AI_INNOVATION': 'AI_DEVELOPMENT', 
    'AI_PRODUCT_UPDATE': 'AI_DEVELOPMENT',
    'AI_TOOLS': 'AI_DEVELOPMENT',
    'AI_MODELS': 'AI_DEVELOPMENT',
    'AI_RESEARCH': 'AI_DEVELOPMENT',
    'LLM_UPDATE': 'AI_DEVELOPMENT',
    'MACHINE_LEARNING': 'AI_DEVELOPMENT',
    
    // AI Business related
    'AI_ETHICS': 'AI_BUSINESS',
    'AI_IMPACT': 'AI_BUSINESS',
    'AI_SOCIETAL_IMPACT': 'AI_BUSINESS', 
    'AI_POLICY': 'AI_BUSINESS',
    'AI_REGULATION': 'AI_BUSINESS',
    'AI_MARKET': 'AI_BUSINESS',
    'AI_INDUSTRY': 'AI_BUSINESS',
    'AI_INVESTMENT': 'AI_BUSINESS',
    
    // Automation related
    'AI_AUTOMATION': 'AUTOMATION',
    'PROCESS_AUTOMATION': 'AUTOMATION',
    'WORKFLOW_AUTOMATION': 'AUTOMATION',
    'RPA': 'AUTOMATION',
    
    // No-Code related
    'NO_CODE_AI': 'NO_CODE',
    'LOW_CODE': 'NO_CODE',
    'VISUAL_PROGRAMMING': 'NO_CODE',
    'DRAG_DROP': 'NO_CODE'
  };
  
  // Return mapped category or fallback to direct match if it's already valid
  if (categoryMappings[normalizedCategory]) {
    console.log(`Category mapping: ${inputCategory} -> ${categoryMappings[normalizedCategory]}`);
    return categoryMappings[normalizedCategory];
  }
  
  // Check if it's already a valid category
  const validCategories = ['AI_DEVELOPMENT', 'NO_CODE', 'AUTOMATION', 'AI_BUSINESS'];
  if (validCategories.includes(normalizedCategory)) {
    return normalizedCategory;
  }
  
  // Default fallback with logging
  console.log(`Unknown category '${inputCategory}' mapped to default 'AI_DEVELOPMENT'`);
  return 'AI_DEVELOPMENT';
}

// Process TREND_MASTER data (database_id: 1)
async function processTrendMasterData(supabaseClient: any, rawData: any) {
  const structuredData = {
    trend_id: rawData.trend_id || `trend_${Date.now()}`,
    trend_topic: rawData.trend_topic || rawData.topic || 'Unknown Trend',
    trend_description: rawData.trend_description || rawData.description,
    status: rawData.status || 'ACTIVE',
    trend_category: mapTrendCategory(rawData.trend_category || rawData.category),
    trend_momentum_score: rawData.trend_momentum_score || rawData.momentum_score,
    trend_sustainability_score: rawData.trend_sustainability_score || rawData.sustainability_score,
    final_trend_score: rawData.final_trend_score || rawData.score,
    google_trends_score: rawData.google_trends_score || rawData.google_score,
    social_mentions_count: rawData.social_mentions_count || rawData.mentions_count || 0,
    twitter_hashtag_volume: rawData.twitter_hashtag_volume || rawData.twitter_volume || 0,
    reddit_engagement_score: rawData.reddit_engagement_score || rawData.reddit_score,
    trend_keywords: rawData.trend_keywords || rawData.keywords,
    trend_hashtags: rawData.trend_hashtags || rawData.hashtags,
    trend_technologies: rawData.trend_technologies || rawData.technologies,
    trend_companies_mentioned: rawData.trend_companies_mentioned || rawData.companies,
    trend_influencers: rawData.trend_influencers || rawData.influencers,
    trend_source: rawData.trend_source || rawData.source,
    discovery_date: rawData.discovery_date || new Date().toISOString(),
    estimated_peak_date: rawData.estimated_peak_date || rawData.peak_date,
    trend_peak_period: rawData.trend_peak_period || rawData.peak_period,
    trend_sentiment: rawData.trend_sentiment || rawData.sentiment,
    trend_audience: rawData.trend_audience || rawData.audience,
    trend_context: rawData.trend_context || rawData.context,
    trend_geographic_focus: rawData.trend_geographic_focus || rawData.geographic_focus,
    trend_industry_tags: rawData.trend_industry_tags || rawData.industry_tags,
    trend_content_types: rawData.trend_content_types || rawData.content_types,
    trend_related_topics: rawData.trend_related_topics || rawData.related_topics,
    news_articles_count: rawData.news_articles_count || rawData.articles_count || 0,
    github_repo_count: rawData.github_repo_count || rawData.github_count || 0,
    consistency_multiplier: rawData.consistency_multiplier || 1.0,
    daily_momentum_history: rawData.daily_momentum_history || rawData.momentum_history,
    discovery_time_period: rawData.discovery_time_period || rawData.time_period,
    last_updated: new Date().toISOString()
  };

  return await supabaseClient
    .from('trend_master')
    .insert([structuredData]);
}

// Process KEYWORD_INTELLIGENCE data (database_id: 2)
async function processKeywordIntelligenceData(supabaseClient: any, rawData: any) {
  const structuredData = {
    keyword_id: rawData.keyword_id || `keyword_${Date.now()}`,
    trend_id: rawData.trend_id || `trend_${Date.now()}`,
    primary_keyword: rawData.primary_keyword || rawData.keyword,
    search_volume_monthly: rawData.search_volume_monthly || rawData.search_volume || 0,
    keyword_difficulty: rawData.keyword_difficulty || rawData.difficulty,
    cpc_value: rawData.cpc_value || rawData.cpc || 0,
    commercial_intent_score: rawData.commercial_intent_score || rawData.intent_score,
    search_intent: rawData.search_intent || rawData.intent,
    priority_level: rawData.priority_level || rawData.priority,
    opportunity_score: rawData.opportunity_score || rawData.opportunity,
    search_volume_trend: rawData.search_volume_trend || rawData.volume_trend,
    content_creation_status: rawData.content_creation_status || 'QUEUED',
    semantic_keywords: rawData.semantic_keywords || rawData.semantics,
    keyword_variations: rawData.keyword_variations || rawData.variations,
    serp_features: rawData.serp_features || rawData.features,
    related_questions: rawData.related_questions || rawData.questions,
    seasonal_pattern: rawData.seasonal_pattern || rawData.seasonality,
    ahrefs_data: rawData.ahrefs_data || rawData.ahrefs,
    semrush_data: rawData.semrush_data || rawData.semrush,
    ubersuggest_data: rawData.ubersuggest_data || rawData.ubersuggest,
    last_updated: new Date().toISOString()
  };

  return await supabaseClient
    .from('keyword_intelligence')
    .insert([structuredData]);
}

// Process COMPETITOR_INTELLIGENCE data (database_id: 3)
async function processCompetitorIntelligenceData(supabaseClient: any, rawData: any) {
  const structuredData = {
    competitor_id: rawData.competitor_id || `comp_${Date.now()}`,
    keyword_id: rawData.keyword_id || `keyword_${Date.now()}`,
    competitor_domain: rawData.competitor_domain || rawData.domain,
    page_url: rawData.page_url || rawData.url,
    page_title: rawData.page_title || rawData.title,
    meta_description: rawData.meta_description || rawData.description,
    competitor_rank: rawData.competitor_rank || 1,
    current_ranking_position: rawData.current_ranking_position || rawData.position,
    content_word_count: rawData.content_word_count || rawData.word_count || 0,
    content_structure: rawData.content_structure || rawData.structure,
    internal_links_count: rawData.internal_links_count || rawData.internal_links || 0,
    external_links_count: rawData.external_links_count || rawData.external_links || 0,
    images_count: rawData.images_count || rawData.images || 0,
    videos_count: rawData.videos_count || rawData.videos || 0,
    code_snippets_count: rawData.code_snippets_count || rawData.code_snippets || 0,
    cta_elements_count: rawData.cta_elements_count || rawData.cta_count || 0,
    page_load_speed: rawData.page_load_speed || rawData.load_speed,
    mobile_score: rawData.mobile_score || rawData.mobile,
    domain_authority: rawData.domain_authority || rawData.authority,
    backlinks_count: rawData.backlinks_count || rawData.backlinks || 0,
    social_shares_total: rawData.social_shares_total || rawData.social_shares || 0,
    estimated_monthly_traffic: rawData.estimated_monthly_traffic || rawData.traffic || 0,
    content_gaps_identified: rawData.content_gaps_identified || rawData.gaps,
    content_weaknesses: rawData.content_weaknesses || rawData.weaknesses,
    optimization_opportunities: rawData.optimization_opportunities || rawData.opportunities,
    content_last_updated: rawData.content_last_updated || rawData.updated_date,
    analysis_date: new Date().toISOString()
  };

  return await supabaseClient
    .from('competitor_intelligence')
    .insert([structuredData]);
}

// Process CONTENT_BRIEFS data (database_id: 4)
async function processContentBriefsData(supabaseClient: any, rawData: any) {
  const structuredData = {
    brief_id: rawData.brief_id || `brief_${Date.now()}`,
    keyword_id: rawData.keyword_id || `keyword_${Date.now()}`,
    trend_id: rawData.trend_id || `trend_${Date.now()}`,
    content_angle: rawData.content_angle || rawData.angle,
    target_word_count: rawData.target_word_count || rawData.word_count || 2000,
    status: rawData.status || 'DRAFT',
    recommended_structure: rawData.recommended_structure || rawData.structure,
    must_include_topics: rawData.must_include_topics || rawData.topics,
    semantic_keywords: rawData.semantic_keywords || rawData.keywords,
    faq_questions: rawData.faq_questions || rawData.faqs,
    code_examples_needed: rawData.code_examples_needed || rawData.code_examples,
    video_requirements: rawData.video_requirements || rawData.videos,
    image_requirements: rawData.image_requirements || rawData.images,
    internal_linking_strategy: rawData.internal_linking_strategy || rawData.internal_links,
    external_linking_targets: rawData.external_linking_targets || rawData.external_links,
    competitor_gaps_to_exploit: rawData.competitor_gaps_to_exploit || rawData.gaps,
    gumroad_placement_strategy: rawData.gumroad_placement_strategy || rawData.gumroad,
    scheduled_publish_date: rawData.scheduled_publish_date || rawData.publish_date,
    estimated_time_to_rank_weeks: rawData.estimated_time_to_rank_weeks || rawData.rank_time || 8,
    content_urgency_score: rawData.content_urgency_score || rawData.urgency,
    expected_traffic_estimate: rawData.expected_traffic_estimate || rawData.traffic_estimate || 0,
    expected_revenue_estimate: rawData.expected_revenue_estimate || rawData.revenue_estimate || 0,
    juhu_processing_notes: rawData.juhu_processing_notes || rawData.notes,
    claude_prompt_optimized: rawData.claude_prompt_optimized || rawData.prompt,
    creation_date: new Date().toISOString()
  };

  return await supabaseClient
    .from('content_briefs')
    .insert([structuredData]);
}