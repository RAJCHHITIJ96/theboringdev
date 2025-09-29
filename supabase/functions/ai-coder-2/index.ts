// ============= AI CODER 2.0 - Gemini 2.5 PRO Powered =============
// Enterprise-grade React component generator with bulletproof validation
// Zero tolerance for compilation errors - Production ready on first generation
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// ============= INPUT SANITIZATION & VALIDATION =============
class InputSanitizer {
  static normalizeJSON(input) {
    // Handle stringified JSON
    if (typeof input === 'string') {
      try {
        input = JSON.parse(input);
      } catch (e) {
        // Try to fix common JSON malformations
        input = this.repairMalformedJSON(input);
      }
    }
    // Ensure object structure
    if (!input || typeof input !== 'object') {
      throw new Error('Input must be a valid object or JSON string');
    }
    return input;
  }
  static repairMalformedJSON(jsonString) {
    try {
      // Fix common issues
      let repaired = jsonString// Fix unquoted property names
      .replace(/(\w+):/g, '"$1":')// Fix single quotes
      .replace(/'/g, '"')// Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')// Fix escaped quotes issues
      .replace(/\\"/g, '"');
      return JSON.parse(repaired);
    } catch (e) {
      throw new Error(`Cannot repair malformed JSON: ${e.message}`);
    }
  }
  static validateAndNormalize(input) {
    const normalized = this.normalizeJSON(input);
    // Required field validation
    if (!normalized.shipped_content || typeof normalized.shipped_content !== 'string') {
      throw new Error('Field "shipped_content" is required and must be a string');
    }
    // Normalize structure with defaults
    return {
      category: normalized.category?.trim() || 'General',
      shipped_content: normalized.shipped_content.trim(),
      assets_manager_details: {
        images: Array.isArray(normalized.assets_manager_details?.images) ? normalized.assets_manager_details.images : [],
        tables: Array.isArray(normalized.assets_manager_details?.tables) ? normalized.assets_manager_details.tables : [],
        charts: Array.isArray(normalized.assets_manager_details?.charts) ? normalized.assets_manager_details.charts : [],
        code_snippets: Array.isArray(normalized.assets_manager_details?.code_snippets) ? normalized.assets_manager_details.code_snippets : [],
        videos: Array.isArray(normalized.assets_manager_details?.videos) ? normalized.assets_manager_details.videos : []
      },
      seo_details: {
        html_head_section: {
          meta_tags: {
            title: normalized.seo_details?.html_head_section?.meta_tags?.title || '',
            description: normalized.seo_details?.html_head_section?.meta_tags?.description || '',
            ...normalized.seo_details?.html_head_section?.meta_tags || {}
          },
          schema_markup: normalized.seo_details?.html_head_section?.schema_markup || {}
        }
      }
    };
  }
  static sanitizeContent(input) {
    // Content sanitization
    input.shipped_content = input.shipped_content// Normalize unicode
    .replace(/\u2019/g, "'").replace(/\u2013|\u2014/g, "-").replace(/\u00a0/g, " ").replace(/\u2022/g, "•")// Remove problematic patterns
    .replace(/^Hero Image:.*$/gm, "").replace(/^.*}\s*$/gm, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    return input;
  }
}
// ============= GEMINI 2.5 PRO INTEGRATION =============
class GeminiIntegrationService {
  apiKey;
  maxRetries = 3;
  timeout = 60000;
  constructor(){
    this.apiKey = Deno.env.get('GEMINI_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
  }
  getSystemPrompt() {
    return `Role Definition
You are a Senior React Component Generator specialized in creating bulletproof, production-ready React components from blog content and assets. You must achieve 0% compilation errors and 100% design system compliance on first generation.

Core Mission
Transform blog content with assets into fully functional React components that integrate seamlessly with existing design systems and routing infrastructure.

Input Flexibility (Accept ANY of these formats)
Flexible Input Handling
// Handle ALL these input variations:
1. Pure JSON object
2. Stringified JSON
3. Malformed JSON (auto-fix)
4. Missing fields (auto-populate defaults)
5. Nested object variations
6. Mixed content types

Required Core Fields (Auto-extract if missing)
- category: String (default: "General")
- shipped_content: Markdown content (required)
- assets_manager_details: Object with arrays (auto-create empty if missing)
- seo_details: SEO metadata (auto-populate defaults)

STRICT Output Format (NO EXCEPTIONS)
Primary Output Schema
{
  "success": true,
  "component": "import React from 'react';\\n// FULL COMPONENT CODE",
  "metadata": {
    "component_name": "PascalCaseComponentName",
    "route_slug": "kebab-case-url-slug",
    "category": "Category Name",
    "title": "Extracted Article Title",
    "description": "SEO description",
    "publish_date": "YYYY-MM-DD",
    "read_time": "X min",
    "assets_count": {
      "images": 0,
      "code_snippets": 0,
      "tables": 0,
      "charts": 0,
      "videos": 0
    }
  }
}

Error Output Schema (Only if critical failure)
{
  "success": false,
  "error": "Specific error message",
  "details": "Additional context"
}

Critical Requirements (ZERO TOLERANCE)
1. JSX Perfection
- NO unescaped braces in text content: { → &#123;, } → &#125;
- NO className conflicts: Use only className, never class
- NO unclosed tags: Every <tag> must have </tag> or be self-closing <tag />
- NO attribute errors: All attributes properly quoted and valid

2. Content Processing Rules
- Extract title from first # heading in markdown
- Convert markdown to JSX with proper escaping
- Handle bold markdown: **text** → <strong>text</strong>
- Process code blocks with syntax highlighting
- Handle lists with proper bullet points
- Escape ALL user content for XSS prevention

3. Asset Integration (Placement Logic)
- Images: Find placement by keyword matching in where_to_place
- Code Snippets: Generate realistic code examples
- Tables: Create responsive table markup
- Charts: Placeholder with description
- Videos: Embed with iframe validation

4. SEO Integration
- Extract meta tags from input
- Generate OpenGraph properties
- Create JSON-LD schema if provided
- Ensure mobile-friendly viewport

Component Structure Template
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const ComponentName = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        {/* SEO META TAGS */}
      </Helmet>
      
      <NewHeader />
      
      {/* ARTICLE HEADER */}
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        {/* CATEGORY, DATE, READ TIME */}
      </header>
      
      {/* TITLE SECTION */}
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{/* TYPOGRAPHY STYLES */}}>
          {/* ESCAPED TITLE */}
        </h1>
      </div>
      
      {/* MAIN CONTENT */}
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          {/* PROCESSED CONTENT WITH ASSETS */}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComponentName;

Typography System (Mandatory)
- H1: Playfair Display, 42-84px, responsive
- H2: Playfair Display, 28-40px, serif
- H3: Inter, 24px, sans-serif
- Body: Inter, 21px, line-height 1.7
- Code: Monospace, gray-900 background

Error Prevention Checklist
Before Output Generation:
✅ Validate all JSX syntax
✅ Escape all user content
✅ Check component naming (PascalCase)
✅ Verify all assets have valid placement
✅ Test route slug generation
✅ Confirm read time calculation
✅ Validate SEO metadata
✅ Check responsive classes

Content Validation:
✅ No unescaped special characters
✅ No malformed markdown conversion
✅ No missing closing tags
✅ No invalid attribute syntax
✅ No XSS vulnerabilities

Quality Assurance Protocol
Pre-Flight Checks:
☑ Component compiles without TypeScript errors
☑ All imports are valid and available
☑ Mobile responsiveness verified
☑ SEO metadata complete
☑ Performance optimized (lazy loading, etc.)

Post-Generation Validation:
☑ JSX syntax validated
☑ Content properly escaped
☑ Assets correctly placed
☑ Metadata accurate
☑ Route slug SEO-friendly

Performance Requirements:
- Generate component in <30 seconds
- Handle content up to 50KB
- Support 20+ assets per article
- Zero memory leaks
- Efficient string processing

Success Metrics:
- 0% JSX compilation errors
- 100% successful Shaper AI handoff
- <1% GitHub Agent deployment failures
- 90%+ asset placement accuracy
- 100% XSS vulnerability prevention

Remember: Your output is production code that thousands of users will see. There are no second chances. Every component must be perfect on first generation.`;
  }
  async generateComponent(input) {
    const prompt = `${this.getSystemPrompt()}

Please generate a bulletproof React component from this input:

${JSON.stringify(input, null, 2)}

Requirements:
1. Follow the EXACT output format specified in your system prompt
2. Generate PERFECT JSX with zero compilation errors
3. Include ALL required metadata fields
4. Properly escape ALL content for XSS prevention
5. Create responsive, accessible markup
6. Generate realistic code examples for any code snippets mentioned

Output ONLY valid JSON in the specified format. No additional text or explanation.`;
    for(let attempt = 1; attempt <= this.maxRetries; attempt++){
      try {
        console.log(`🤖 Gemini 2.5 PRO API call attempt ${attempt}/${this.maxRetries}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.timeout);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 65536,
              responseMimeType: "application/json"
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Gemini 2.5 PRO API error ${response.status}: ${errorData}`);
        }
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!content) {
          throw new Error('No content received from Gemini 2.5 PRO API');
        }
        // Parse and validate Gemini's response
        return this.validateGeminiResponse(content);
      } catch (error) {
        console.error(`❌ Gemini 2.5 PRO API attempt ${attempt} failed:`, error.message);
        if (attempt === this.maxRetries) {
          return {
            success: false,
            error: `Gemini 2.5 PRO API failed after ${this.maxRetries} attempts`,
            details: error.message
          };
        }
        // Wait before retry with exponential backoff
        await new Promise((resolve)=>setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    return {
      success: false,
      error: 'Unexpected error in Gemini 2.5 PRO integration',
      details: 'All retry attempts exhausted'
    };
  }
  validateGeminiResponse(content) {
    try {
      // Extract JSON from Gemini's response (handle markdown code blocks)
      let jsonStr = content.trim();
      // Remove markdown code block markers if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const parsed = JSON.parse(jsonStr);
      // Validate required structure
      if (parsed.success === false) {
        return {
          success: false,
          error: parsed.error || 'Gemini 2.5 PRO reported failure',
          details: parsed.details || 'No additional details'
        };
      }
      if (!parsed.success || !parsed.component || !parsed.metadata) {
        throw new Error('Invalid response structure from Gemini 2.5 PRO');
      }
      // Additional JSX validation
      this.validateJSXStructure(parsed.component);
      return {
        success: true,
        component: parsed.component,
        metadata: parsed.metadata
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse or validate Gemini 2.5 PRO response',
        details: error.message
      };
    }
  }
  validateJSXStructure(component) {
    // Basic JSX validation checks
    const checks = [
      {
        test: ()=>component.includes('export default'),
        error: 'Missing default export'
      },
      {
        test: ()=>!component.includes('class='),
        error: 'Found "class" attribute instead of "className"'
      }
    ];
    for (const check of checks){
      if (!check.test()) {
        throw new Error(`JSX validation failed: ${check.error}`);
      }
    }
  }
}
// ============= OUTPUT VALIDATION & CLEANING =============
class OutputValidator {
  static validateAndClean(geminiResponse) {
    if (!geminiResponse.success || !geminiResponse.component) {
      return geminiResponse;
    }
    try {
      // Clean component code
      let cleanedComponent = geminiResponse.component// Remove any potential code injection attempts
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')// Normalize line endings
      .replace(/\r\n/g, '\n').replace(/\r/g, '\n')// Remove excessive whitespace but preserve structure
      .replace(/\n\s*\n\s*\n/g, '\n\n');
      // Validate component structure
      if (!cleanedComponent.includes('import React')) {
        throw new Error('Component missing React import');
      }
      if (!cleanedComponent.includes('NewHeader')) {
        throw new Error('Component missing NewHeader import');
      }
      if (!cleanedComponent.includes('Footer')) {
        throw new Error('Component missing Footer import');
      }
      // Validate metadata completeness
      const metadata = geminiResponse.metadata;
      if (!metadata?.component_name || !metadata?.route_slug || !metadata?.title) {
        throw new Error('Incomplete metadata structure');
      }
      // Ensure component name is valid
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(metadata.component_name)) {
        throw new Error(`Invalid component name: ${metadata.component_name}`);
      }
      // Ensure route slug is valid
      if (!/^[a-z0-9-]+$/.test(metadata.route_slug)) {
        throw new Error(`Invalid route slug: ${metadata.route_slug}`);
      }
      return {
        success: true,
        component: cleanedComponent,
        metadata: metadata
      };
    } catch (error) {
      return {
        success: false,
        error: 'Output validation failed',
        details: error.message
      };
    }
  }
}
// ============= MAIN PROCESSING FUNCTION =============
async function processAICoderRequest(input) {
  console.log('🚀 AI Coder 2.0 - Starting Gemini 2.5 PRO powered generation...');
  try {
    // Phase 1: Input sanitization and validation
    console.log('📝 Phase 1: Input validation and sanitization...');
    const validatedInput = InputSanitizer.validateAndNormalize(input);
    const sanitizedInput = InputSanitizer.sanitizeContent(validatedInput);
    // Phase 2: Gemini 2.5 PRO integration
    console.log('🤖 Phase 2: Gemini 2.5 PRO component generation...');
    const geminiService = new GeminiIntegrationService();
    const geminiResponse = await geminiService.generateComponent(sanitizedInput);
    if (!geminiResponse.success) {
      return {
        success: false,
        error: geminiResponse.error || 'Gemini 2.5 PRO generation failed',
        details: geminiResponse.details
      };
    }
    // Phase 3: Output validation and cleaning
    console.log('✅ Phase 3: Output validation and cleaning...');
    const validatedOutput = OutputValidator.validateAndClean(geminiResponse);
    if (!validatedOutput.success) {
      return {
        success: false,
        error: validatedOutput.error || 'Output validation failed',
        details: validatedOutput.details
      };
    }
    console.log(`🎉 AI Coder 2.0 - Successfully generated component: ${validatedOutput.metadata?.component_name}`);
    return {
      success: true,
      component: validatedOutput.component,
      metadata: validatedOutput.metadata
    };
  } catch (error) {
    console.error('💥 AI Coder 2.0 - Critical error:', error);
    return {
      success: false,
      error: `Critical error: ${error.message}`,
      details: error.stack || 'No stack trace available'
    };
  }
}
// ============= HTTP SERVER =============
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed. Use POST.'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    const requestBody = await req.text();
    console.log('🔍 AI Coder 2.0 received request');
    // Process the request
    const result = await processAICoderRequest(requestBody);
    const status = result.success ? 200 : 500;
    return new Response(JSON.stringify(result), {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ AI Coder 2.0 server error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `Server error: ${error.message}`,
      details: error.stack || 'No stack trace available'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
