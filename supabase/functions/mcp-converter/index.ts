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

// Database schema definitions with validation rules
const DATABASE_SCHEMAS = {
  TREND_MASTER: {
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
        default: 'afternoon'
      },
      trend_momentum_score: { type: 'integer', min: 0, max: 100, required: false },
      trend_sustainability_score: { type: 'integer', min: 0, max: 100, required: false },
      final_trend_score: { type: 'integer', min: 0, max: 150, required: false },
      google_trends_score: { type: 'integer', min: 0, max: 100, required: false },
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
        required: false
      },
      search_intent: { 
        type: 'enum', 
        values: ['INFORMATIONAL', 'COMMERCIAL', 'NAVIGATIONAL', 'TRANSACTIONAL', 'MIXED'],
        required: false
      },
      priority_level: { 
        type: 'enum', 
        values: ['HIGH', 'MEDIUM', 'LOW'],
        required: false
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
      
      // Handle special cases
      if (fieldName === 'google_trends_score' && (value === 'Breakout' || value === 'breakout')) {
        intValue = 100;
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
      const enumValue = String(value).toUpperCase();
      
      // Special mappings for discovery_time_period
      if (fieldName === 'discovery_time_period') {
        const timeMapping: { [key: string]: string } = {
          'DAY': 'afternoon',
          'MORNING': 'morning',
          'AFTERNOON': 'afternoon', 
          'EVENING': 'evening',
          'NIGHT': 'evening'
        };
        
        const mapped = timeMapping[enumValue];
        if (mapped && fieldSchema.values.includes(mapped)) {
          return mapped;
        }
      }
      
      // Special mappings for trend_category
      if (fieldName === 'trend_category') {
        const categoryMapping: { [key: string]: string } = {
          'AI_INFRASTRUCTURE': 'AI_DEVELOPMENT',
          'AI_SECURITY_GOVERNANCE': 'AI_BUSINESS',
          'AI_APPLICATIONS': 'AI_DEVELOPMENT',
          'AI_HARDWARE_SOFTWARE': 'AI_DEVELOPMENT',
          'AI_DEVELOPMENT_RESEARCH': 'AI_DEVELOPMENT',
          'AI_INDUSTRY_DYNAMICS': 'AI_BUSINESS',
          'AI_ETHICS_REGULATION': 'AI_BUSINESS'
        };
        
        const mapped = categoryMapping[enumValue];
        if (mapped && fieldSchema.values.includes(mapped)) {
          return mapped;
        }
      }
      
      return fieldSchema.values.includes(enumValue) ? enumValue : (fieldSchema.default || fieldSchema.values[0]);
    
    case 'jsonb':
      return typeof value === 'object' ? value : (value ? [value] : []);
    
    case 'timestamp':
      return value ? new Date(value).toISOString() : new Date().toISOString();
    
    case 'date':
      return value ? new Date(value).toISOString().split('T')[0] : null;
    
    default:
      return value;
  }
}

async function convertWithGemini(inputData: any): Promise<any> {
  const prompt = `
You are an expert database schema converter. Convert the following JSON data to be fully compliant with the database schemas.

Key Rules:
1. For TREND_MASTER: 
   - discovery_time_period must be 'morning', 'afternoon', or 'evening' (convert 'day' to 'afternoon')
   - google_trends_score must be integer 0-100 (convert 'Breakout' to 100)
   - trend_category must be one of: AI_DEVELOPMENT, NO_CODE, AUTOMATION, AI_BUSINESS
   - String fields have length limits (trend_id: 100, trend_topic: 200, trend_source: 100)

2. For KEYWORD_INTELLIGENCE:
   - keyword_id max 50 characters
   - trend_id max 50 characters  
   - primary_keyword max 200 characters
   - All score fields must be integers 0-100

3. Ensure all foreign key references exist (trend_id must exist in trend_master for keyword_intelligence)

4. Convert any invalid data types and apply sensible defaults

Input Data:
${JSON.stringify(inputData, null, 2)}

Return only the corrected JSON data, no explanation.`;

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

function manualConvert(inputData: any): any {
  console.log('🔄 Starting manual conversion fallback');
  
  if (Array.isArray(inputData)) {
    return inputData.map((item) => convertSingleItem(item));
  } else {
    return convertSingleItem(inputData);
  }
}

function convertSingleItem(item: any): any {
  const operation = item.operation || 'insert';
  const table = item.table || 'TREND_MASTER';
  const data = item.data || item;
  
  const tableSchema = DATABASE_SCHEMAS[table as keyof typeof DATABASE_SCHEMAS];
  if (!tableSchema) {
    throw new Error(`Unknown table: ${table}`);
  }
  
  const convertedData: any = {};
  
  // Convert each field according to schema
  for (const [fieldName, fieldSchema] of Object.entries(tableSchema.fields)) {
    const value = data[fieldName];
    convertedData[fieldName] = validateAndConvertField(value, fieldSchema, fieldName);
  }
  
  // Add timestamp fields if missing
  if (table === 'TREND_MASTER') {
    convertedData.discovery_date = convertedData.discovery_date || new Date().toISOString();
    convertedData.last_updated = new Date().toISOString();
  } else if (table === 'KEYWORD_INTELLIGENCE') {
    convertedData.last_updated = new Date().toISOString();
  }
  
  return {
    operation,
    table,
    data: convertedData
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputData } = await req.json();
    
    if (!inputData) {
      return new Response(
        JSON.stringify({ error: 'No input data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🚀 Starting MCP conversion for:', typeof inputData, Array.isArray(inputData) ? `${inputData.length} items` : '1 item');

    let convertedData;
    
    try {
      // Try Gemini conversion first
      console.log('🤖 Attempting Gemini AI conversion...');
      convertedData = await convertWithGemini(inputData);
      console.log('✅ Gemini conversion successful');
    } catch (geminiError) {
      console.log('⚠️ Gemini conversion failed, using manual conversion:', geminiError.message);
      // Fallback to manual conversion
      convertedData = manualConvert(inputData);
      console.log('✅ Manual conversion successful');
    }

    return new Response(
      JSON.stringify({
        success: true,
        convertedData,
        message: 'Data successfully converted to database-compliant format'
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
        message: 'Failed to convert data'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});