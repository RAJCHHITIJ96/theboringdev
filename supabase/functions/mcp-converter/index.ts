import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Complete database schema definitions with all tables and validation rules
const DATABASE_SCHEMAS = {
  TREND_MASTER: {
    foreignKeys: [],
    fields: {
      trend_id: { type: 'string', maxLength: 100, required: true },
      trend_topic: { type: 'string', maxLength: 200, required: true },
      trend_description: { type: 'text', required: false },
      trend_context: { type: 'text', required: false },
      trend_source: { type: 'string', maxLength: 100, required: false },
      trend_category: { 
        type: 'enum', 
        values: ['AI_DEVELOPMENT', 'NO_CODE', 'AUTOMATION', 'AI_BUSINESS'],
        required: false,
        default: 'AI_DEVELOPMENT'
      },
      discovery_time_period: { 
        type: 'enum', 
        values: ['morning', 'afternoon', 'evening'],
        required: false,
        default: 'afternoon',
        smartMappings: {
          'day': 'afternoon',
          'night': 'evening',
          'dawn': 'morning',
          'noon': 'afternoon',
          'dusk': 'evening',
          'midnight': 'evening'
        }
      },
      trend_momentum_score: { type: 'integer', min: 0, max: 100, required: false },
      trend_sustainability_score: { type: 'integer', min: 0, max: 100, required: false },
      final_trend_score: { type: 'integer', min: 0, max: 150, required: false },
      google_trends_score: { 
        type: 'integer', 
        min: 0, 
        max: 100, 
        required: false,
        smartMappings: {
          'breakout': 100,
          'trending': 95,
          'viral': 100,
          'popular': 80,
          'rising': 75,
          'hot': 90
        }
      },
      social_mentions_count: { type: 'integer', min: 0, required: false, default: 0 },
      twitter_hashtag_volume: { type: 'integer', min: 0, required: false, default: 0 },
      reddit_engagement_score: { type: 'integer', min: 0, max: 100, required: false },
      news_articles_count: { type: 'integer', min: 0, required: false, default: 0 },
      github_repo_count: { type: 'integer', min: 0, required: false, default: 0 },
      consistency_multiplier: { type: 'decimal', min: 0, max: 5, required: false, default: 1.0 },
      status: { 
        type: 'enum', 
        values: ['ACTIVE', 'INACTIVE', 'PENDING'],
        required: false,
        default: 'ACTIVE'
      },
      trend_sentiment: { 
        type: 'enum', 
        values: ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'],
        required: false
      },
      trend_audience: { type: 'string', maxLength: 500, required: false },
      trend_keywords: { type: 'jsonb', required: false },
      trend_hashtags: { type: 'jsonb', required: false },
      trend_related_topics: { type: 'jsonb', required: false },
      trend_industry_tags: { type: 'jsonb', required: false },
      trend_technologies: { type: 'jsonb', required: false },
      trend_companies_mentioned: { type: 'jsonb', required: false },
      trend_influencers: { type: 'jsonb', required: false },
      trend_content_types: { type: 'jsonb', required: false },
      trend_geographic_focus: { type: 'jsonb', required: false },
      daily_momentum_history: { type: 'jsonb', required: false },
      trend_peak_period: { type: 'string', maxLength: 50, required: false },
      estimated_peak_date: { type: 'date', required: false },
      discovery_date: { type: 'timestamp', required: false },
      last_updated: { type: 'timestamp', required: false }
    }
  },
  KEYWORD_INTELLIGENCE: {
    foreignKeys: [{ field: 'trend_id', references: 'TREND_MASTER', referencedField: 'trend_id' }],
    fields: {
      keyword_id: { type: 'string', maxLength: 50, required: true },
      trend_id: { type: 'string', maxLength: 50, required: true },
      primary_keyword: { type: 'string', maxLength: 200, required: true },
      search_volume_monthly: { type: 'integer', min: 0, required: false, default: 0 },
      keyword_difficulty: { type: 'integer', min: 0, max: 100, required: false },
      cpc_value: { type: 'decimal', min: 0, required: false, default: 0 },
      commercial_intent_score: { type: 'integer', min: 0, max: 100, required: false },
      search_volume_trend: { 
        type: 'enum', 
        values: ['GROWING', 'DECLINING', 'STABLE', 'VOLATILE'],
        required: false,
        default: 'STABLE'
      },
      search_intent: { 
        type: 'enum', 
        values: ['INFORMATIONAL', 'COMMERCIAL', 'NAVIGATIONAL', 'TRANSACTIONAL', 'MIXED'],
        required: false,
        default: 'INFORMATIONAL'
      },
      priority_level: { 
        type: 'enum', 
        values: ['HIGH', 'MEDIUM', 'LOW'],
        required: false,
        default: 'MEDIUM'
      },
      content_creation_status: { 
        type: 'enum', 
        values: ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'PUBLISHED', 'PLANNED'],
        required: false,
        default: 'QUEUED'
      },
      opportunity_score: { type: 'integer', min: 0, max: 100, required: false },
      seasonal_pattern: { type: 'jsonb', required: false },
      keyword_variations: { type: 'jsonb', required: false },
      serp_features: { type: 'jsonb', required: false },
      related_questions: { type: 'jsonb', required: false },
      semantic_keywords: { type: 'jsonb', required: false },
      ahrefs_data: { type: 'jsonb', required: false },
      semrush_data: { type: 'jsonb', required: false },
      ubersuggest_data: { type: 'jsonb', required: false },
      last_updated: { type: 'timestamp', required: false }
    }
  },
  COMPETITOR_INTELLIGENCE: {
    foreignKeys: [{ field: 'keyword_id', references: 'KEYWORD_INTELLIGENCE', referencedField: 'keyword_id' }],
    fields: {
      competitor_id: { type: 'string', maxLength: 50, required: true },
      keyword_id: { type: 'string', maxLength: 50, required: true },
      competitor_domain: { type: 'string', maxLength: 255, required: false },
      page_url: { type: 'text', required: false },
      page_title: { type: 'string', maxLength: 500, required: false },
      meta_description: { type: 'text', required: false },
      competitor_rank: { type: 'integer', min: 1, required: true },
      current_ranking_position: { type: 'integer', min: 1, required: false },
      content_word_count: { type: 'integer', min: 0, required: false, default: 0 },
      content_structure: { type: 'jsonb', required: false },
      internal_links_count: { type: 'integer', min: 0, required: false, default: 0 },
      external_links_count: { type: 'integer', min: 0, required: false, default: 0 },
      images_count: { type: 'integer', min: 0, required: false, default: 0 },
      videos_count: { type: 'integer', min: 0, required: false, default: 0 },
      code_snippets_count: { type: 'integer', min: 0, required: false, default: 0 },
      cta_elements_count: { type: 'integer', min: 0, required: false, default: 0 },
      page_load_speed: { type: 'decimal', min: 0, required: false },
      mobile_score: { type: 'integer', min: 0, max: 100, required: false },
      backlinks_count: { type: 'integer', min: 0, required: false, default: 0 },
      domain_authority: { type: 'integer', min: 0, max: 100, required: false },
      social_shares_total: { type: 'integer', min: 0, required: false, default: 0 },
      estimated_monthly_traffic: { type: 'integer', min: 0, required: false, default: 0 },
      content_gaps_identified: { type: 'jsonb', required: false },
      content_weaknesses: { type: 'jsonb', required: false },
      optimization_opportunities: { type: 'jsonb', required: false },
      content_last_updated: { type: 'date', required: false },
      analysis_date: { type: 'timestamp', required: false }
    }
  },
  CONTENT_BRIEFS: {
    foreignKeys: [
      { field: 'keyword_id', references: 'KEYWORD_INTELLIGENCE', referencedField: 'keyword_id' },
      { field: 'trend_id', references: 'TREND_MASTER', referencedField: 'trend_id' }
    ],
    fields: {
      brief_id: { type: 'string', maxLength: 50, required: true },
      keyword_id: { type: 'string', maxLength: 50, required: true },
      trend_id: { type: 'string', maxLength: 50, required: true },
      content_angle: { type: 'string', maxLength: 500, required: false },
      target_word_count: { type: 'integer', min: 0, required: false, default: 2000 },
      recommended_structure: { type: 'jsonb', required: false },
      must_include_topics: { type: 'jsonb', required: false },
      competitor_gaps_to_exploit: { type: 'jsonb', required: false },
      status: { 
        type: 'enum', 
        values: ['DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'],
        required: false,
        default: 'DRAFT'
      },
      creation_date: { type: 'timestamp', required: false },
      scheduled_publish_date: { type: 'timestamp', required: false },
      estimated_time_to_rank_weeks: { type: 'integer', min: 1, required: false, default: 8 },
      expected_revenue_estimate: { type: 'decimal', min: 0, required: false, default: 0 },
      expected_traffic_estimate: { type: 'integer', min: 0, required: false, default: 0 },
      content_urgency_score: { type: 'integer', min: 0, max: 100, required: false },
      gumroad_placement_strategy: { type: 'jsonb', required: false },
      semantic_keywords: { type: 'jsonb', required: false },
      faq_questions: { type: 'jsonb', required: false },
      code_examples_needed: { type: 'jsonb', required: false },
      video_requirements: { type: 'jsonb', required: false },
      image_requirements: { type: 'jsonb', required: false },
      external_linking_targets: { type: 'jsonb', required: false },
      internal_linking_strategy: { type: 'jsonb', required: false },
      juhu_processing_notes: { type: 'text', required: false },
      claude_prompt_optimized: { type: 'text', required: false }
    }
  },
  PERFORMANCE_TRACKING: {
    foreignKeys: [{ field: 'keyword_id', references: 'KEYWORD_INTELLIGENCE', referencedField: 'keyword_id' }],
    fields: {
      tracking_id: { type: 'string', maxLength: 50, required: true },
      keyword_id: { type: 'string', maxLength: 50, required: true },
      content_url: { type: 'string', maxLength: 500, required: false },
      publish_date: { type: 'timestamp', required: false },
      current_ranking_position: { type: 'integer', min: 1, required: false },
      monthly_organic_traffic: { type: 'integer', min: 0, required: false, default: 0 },
      monthly_organic_traffic_value: { type: 'decimal', min: 0, required: false, default: 0 },
      click_through_rate: { type: 'decimal', min: 0, max: 1, required: false, default: 0 },
      conversion_rate: { type: 'decimal', min: 0, max: 1, required: false, default: 0 },
      bounce_rate: { type: 'decimal', min: 0, max: 1, required: false, default: 0 },
      time_on_page_seconds: { type: 'integer', min: 0, required: false, default: 0 },
      backlinks_earned: { type: 'integer', min: 0, required: false, default: 0 },
      social_shares_total: { type: 'integer', min: 0, required: false, default: 0 },
      revenue_generated: { type: 'decimal', min: 0, required: false, default: 0 },
      gumroad_sales_attributed: { type: 'integer', min: 0, required: false, default: 0 },
      ranking_history: { type: 'jsonb', required: false },
      traffic_history: { type: 'jsonb', required: false },
      last_updated: { type: 'timestamp', required: false }
    }
  }
};

function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

function validateAndConvertField(value: any, fieldSchema: any, fieldName: string): any {
  if (value === null || value === undefined) {
    return fieldSchema.default !== undefined ? fieldSchema.default : null;
  }

  switch (fieldSchema.type) {
    case 'string':
      const strValue = String(value);
      return fieldSchema.maxLength ? truncateString(strValue, fieldSchema.maxLength) : strValue;
    
    case 'text':
      return String(value);
    
    case 'integer':
      let intValue: number;
      
      // Check for smart mappings first
      if (fieldSchema.smartMappings) {
        const lowerValue = String(value).toLowerCase();
        if (fieldSchema.smartMappings[lowerValue] !== undefined) {
          intValue = fieldSchema.smartMappings[lowerValue];
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          intValue = parseInt(value, 10);
        } else if (typeof value === 'number') {
          intValue = Math.round(value);
        } else {
          intValue = fieldSchema.default !== undefined ? fieldSchema.default : 0;
        }
      } else if (typeof value === 'string' && !isNaN(Number(value))) {
        intValue = parseInt(value, 10);
      } else if (typeof value === 'number') {
        intValue = Math.round(value);
      } else {
        intValue = fieldSchema.default !== undefined ? fieldSchema.default : 0;
      }
      
      // Apply min/max constraints
      if (fieldSchema.min !== undefined && intValue < fieldSchema.min) {
        intValue = fieldSchema.min;
      }
      if (fieldSchema.max !== undefined && intValue > fieldSchema.max) {
        intValue = fieldSchema.max;
      }
      
      return intValue;
    
    case 'decimal':
      let decValue = typeof value === 'number' ? value : parseFloat(String(value)) || (fieldSchema.default !== undefined ? fieldSchema.default : 0);
      
      if (fieldSchema.min !== undefined && decValue < fieldSchema.min) {
        decValue = fieldSchema.min;
      }
      if (fieldSchema.max !== undefined && decValue > fieldSchema.max) {
        decValue = fieldSchema.max;
      }
      
      return decValue;
    
    case 'enum':
      const enumValue = String(value).toLowerCase();
      
      // Check for smart mappings first
      if (fieldSchema.smartMappings && fieldSchema.smartMappings[enumValue]) {
        return fieldSchema.smartMappings[enumValue];
      }
      
      // Try to find exact match (case insensitive)
      const exactMatch = fieldSchema.values.find((v: string) => v.toLowerCase() === enumValue);
      if (exactMatch) return exactMatch;
      
      // Legacy mappings for backward compatibility
      if (fieldName === 'discovery_time_period') {
        const timeMapping: { [key: string]: string } = {
          'day': 'afternoon',
          'morning': 'morning',
          'afternoon': 'afternoon', 
          'evening': 'evening',
          'night': 'evening',
          'dawn': 'morning',
          'noon': 'afternoon',
          'dusk': 'evening',
          'midnight': 'evening'
        };
        
        const mapped = timeMapping[enumValue];
        if (mapped && fieldSchema.values.includes(mapped)) {
          return mapped;
        }
      }
      
      if (fieldName === 'trend_category') {
        const categoryMapping: { [key: string]: string } = {
          'ai_infrastructure': 'AI_DEVELOPMENT',
          'ai_security_governance': 'AI_BUSINESS',
          'ai_applications': 'AI_DEVELOPMENT',
          'ai_hardware_software': 'AI_DEVELOPMENT',
          'ai_development_research': 'AI_DEVELOPMENT',
          'ai_industry_dynamics': 'AI_BUSINESS',
          'ai_ethics_regulation': 'AI_BUSINESS'
        };
        
        const mapped = categoryMapping[enumValue];
        if (mapped && fieldSchema.values.includes(mapped)) {
          return mapped;
        }
      }
      
      return fieldSchema.default || fieldSchema.values[0];
    
    case 'jsonb':
      if (typeof value === 'object') return value;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      return value ? [value] : [];
    
    case 'timestamp':
      return value ? new Date(value).toISOString() : new Date().toISOString();
    
    case 'date':
      return value ? new Date(value).toISOString().split('T')[0] : null;
    
    default:
      return value;
  }
}

async function convertWithGemini(inputData: any, conversionMode: string = 'smart', targetTables?: string[]): Promise<any> {
  let modeInstructions = '';
  let tableInstructions = '';
  
  // Mode-specific instructions
  switch (conversionMode) {
    case 'strict':
      modeInstructions = `
STRICT MODE: 
- Only convert data for the EXACT tables specified in the input
- Do NOT create any additional records or tables
- Fail validation if foreign key references are missing
- Apply minimal conversions, prefer exact input values`;
      break;
    case 'batch':
      modeInstructions = `
BATCH MODE:
- Process multiple operations efficiently 
- Ensure proper ordering (TREND_MASTER before KEYWORD_INTELLIGENCE, etc.)
- Create missing foreign key records with intelligent defaults when needed
- Optimize for bulk processing`;
      break;
    default: // smart mode
      modeInstructions = `
SMART MODE (Default):
- Intelligently analyze input data and create missing dependencies
- Apply smart field mappings and conversions
- Create TREND_MASTER records if KEYWORD_INTELLIGENCE references missing trend_id
- Use contextual understanding to fill missing required fields`;
  }
  
  // Table-specific instructions
  if (targetTables && targetTables.length > 0) {
    tableInstructions = `
TARGET TABLES: Only convert data for these tables: ${targetTables.join(', ')}
Do NOT create records for any other tables unless they are required foreign key dependencies.`;
  }

  const prompt = `You are an expert database schema converter with complete knowledge of all database schemas.

${modeInstructions}

${tableInstructions}

COMPLETE SCHEMA RULES:

1. TREND_MASTER (Primary table, no dependencies):
   - trend_id: string, max 100 chars, required, unique identifier
   - trend_topic: string, max 200 chars, required
   - discovery_time_period: enum ['morning', 'afternoon', 'evening'] (convert 'day'→'afternoon', 'night'→'evening')
   - google_trends_score: integer 0-100 (convert 'Breakout'→100, 'viral'→100, 'trending'→95)
   - trend_category: enum ['AI_DEVELOPMENT', 'NO_CODE', 'AUTOMATION', 'AI_BUSINESS']
   - All other fields optional with intelligent defaults

2. KEYWORD_INTELLIGENCE (Depends on TREND_MASTER):
   - Foreign Key: trend_id → TREND_MASTER.trend_id
   - keyword_id: string, max 50 chars, required
   - primary_keyword: string, max 200 chars, required
   - All score fields: integers 0-100
   - search_intent: enum ['INFORMATIONAL', 'COMMERCIAL', 'NAVIGATIONAL', 'TRANSACTIONAL', 'MIXED']
   - priority_level: enum ['HIGH', 'MEDIUM', 'LOW']

3. COMPETITOR_INTELLIGENCE (Depends on KEYWORD_INTELLIGENCE):
   - Foreign Key: keyword_id → KEYWORD_INTELLIGENCE.keyword_id
   - competitor_id: string, max 50 chars, required
   - competitor_rank: integer, min 1, required

4. CONTENT_BRIEFS (Depends on KEYWORD_INTELLIGENCE & TREND_MASTER):
   - Foreign Keys: keyword_id → KEYWORD_INTELLIGENCE, trend_id → TREND_MASTER
   - brief_id: string, max 50 chars, required
   - status: enum ['DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED']

5. PERFORMANCE_TRACKING (Depends on KEYWORD_INTELLIGENCE):
   - Foreign Key: keyword_id → KEYWORD_INTELLIGENCE.keyword_id
   - tracking_id: string, max 50 chars, required

FOREIGN KEY INTELLIGENCE:
- If KEYWORD_INTELLIGENCE references a trend_id that doesn't exist, create the TREND_MASTER record
- Use intelligent defaults and contextual clues from the keyword data to populate TREND_MASTER
- Ensure proper dependency ordering in output

SMART CONVERSIONS:
- String length truncation with "..." for overflow
- Enum value mappings with intelligent defaults
- Score normalization (percentages to 0-100 scale)
- JSON field handling for arrays and objects
- Timestamp standardization to ISO format

Input Data:
${JSON.stringify(inputData, null, 2)}

Return ONLY the corrected JSON array with proper operation structure, no explanation.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      })
    });

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || generatedText.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : generatedText;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Gemini conversion error:', error);
    throw error;
  }
}

function manualConvert(inputData: any, conversionMode: string = 'smart'): any {
  console.log(`🔄 Starting manual conversion fallback (${conversionMode} mode)`);
  
  if (Array.isArray(inputData)) {
    return inputData.map((item) => convertSingleItem(item, conversionMode));
  } else {
    return convertSingleItem(inputData, conversionMode);
  }
}

function convertSingleItem(item: any, conversionMode: string = 'smart'): any {
  const operation = item.operation || 'insert';
  const table = item.table || 'TREND_MASTER';
  const data = item.data || item;
  
  const tableSchema = DATABASE_SCHEMAS[table as keyof typeof DATABASE_SCHEMAS];
  if (!tableSchema) {
    throw new Error(`Unknown table: ${table}`);
  }
  
  const convertedData: any = {};
  const validationWarnings: string[] = [];
  
  // Convert each field according to schema
  for (const [fieldName, fieldSchema] of Object.entries(tableSchema.fields)) {
    const originalValue = data[fieldName];
    const convertedValue = validateAndConvertField(originalValue, fieldSchema, fieldName);
    
    // Track significant conversions for reporting
    if (originalValue !== convertedValue && originalValue !== undefined && originalValue !== null) {
      validationWarnings.push(`${fieldName}: "${originalValue}" → "${convertedValue}"`);
    }
    
    convertedData[fieldName] = convertedValue;
  }
  
  // Add timestamp fields with current time
  const now = new Date().toISOString();
  if (table === 'TREND_MASTER') {
    convertedData.discovery_date = convertedData.discovery_date || now;
    convertedData.last_updated = now;
  } else if (table === 'KEYWORD_INTELLIGENCE' || table === 'PERFORMANCE_TRACKING') {
    convertedData.last_updated = now;
  } else if (table === 'CONTENT_BRIEFS') {
    convertedData.creation_date = convertedData.creation_date || now;
  } else if (table === 'COMPETITOR_INTELLIGENCE') {
    convertedData.analysis_date = convertedData.analysis_date || now;
  }
  
  const result = {
    operation,
    table,
    data: convertedData
  };
  
  // Add validation warnings in development mode
  if (validationWarnings.length > 0) {
    console.log(`⚠️ Field conversions for ${table}:`, validationWarnings);
  }
  
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      inputData, 
      conversionMode = 'smart', 
      targetTables,
      enableValidationReport = false 
    } = await req.json();
    
    if (!inputData) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No input data provided',
          message: 'Please provide inputData in the request body'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();
    console.log(`🚀 Starting MCP conversion (${conversionMode} mode) for:`, 
      typeof inputData, 
      Array.isArray(inputData) ? `${inputData.length} items` : '1 item'
    );

    let convertedData;
    let conversionMethod = 'unknown';
    let validationReport = null;
    
    try {
      // Try Gemini conversion first (unless in strict mode with simple data)
      if (conversionMode !== 'strict' || (Array.isArray(inputData) && inputData.length > 5)) {
        console.log('🤖 Attempting Gemini AI conversion...');
        convertedData = await convertWithGemini(inputData, conversionMode, targetTables);
        conversionMethod = 'gemini';
        console.log('✅ Gemini conversion successful');
      } else {
        throw new Error('Using manual conversion for strict mode');
      }
    } catch (geminiError) {
      console.log('⚠️ Gemini conversion failed, using manual conversion:', geminiError.message);
      // Fallback to manual conversion
      convertedData = manualConvert(inputData, conversionMode);
      conversionMethod = 'manual';
      console.log('✅ Manual conversion successful');
    }

    // Generate validation report if requested
    if (enableValidationReport) {
      validationReport = generateValidationReport(inputData, convertedData);
    }

    const processingTime = Date.now() - startTime;
    console.log(`⚡ Conversion completed in ${processingTime}ms using ${conversionMethod} method`);

    return new Response(
      JSON.stringify({
        success: true,
        convertedData,
        metadata: {
          conversionMethod,
          processingTimeMs: processingTime,
          conversionMode,
          itemsProcessed: Array.isArray(convertedData) ? convertedData.length : 1,
          targetTables: targetTables || 'all'
        },
        validationReport,
        message: `Data successfully converted using ${conversionMethod} conversion (${processingTime}ms)`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('❌ MCP Converter error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        errorType: error.name || 'ConversionError',
        message: 'Failed to convert data - check input format and try again'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateValidationReport(inputData: any, outputData: any) {
  const report = {
    inputItemCount: Array.isArray(inputData) ? inputData.length : 1,
    outputItemCount: Array.isArray(outputData) ? outputData.length : 1,
    tablesProcessed: [],
    fieldTransformations: [],
    foreignKeyDependencies: [],
    warnings: []
  };

  try {
    const items = Array.isArray(outputData) ? outputData : [outputData];
    
    items.forEach((item, index) => {
      if (item.table && !report.tablesProcessed.includes(item.table)) {
        report.tablesProcessed.push(item.table);
      }
    });

    // Add more detailed validation analysis here if needed
    
  } catch (error) {
    report.warnings.push(`Validation report generation failed: ${error.message}`);
  }

  return report;
}