import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Input normalization - handle ANY JSON format
function normalizeInput(rawInput: unknown): any {
  try {
    let input = rawInput;
    
    // Handle stringified JSON
    if (typeof input === "string") {
      try {
        input = JSON.parse(input);
      } catch (e) {
        // Try to fix common JSON issues
        const fixed = (input as string)
          .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Add quotes to keys
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/'/g, '"'); // Replace single quotes with double quotes
        input = JSON.parse(fixed);
      }
    }
    
    if (!input || typeof input !== "object") {
      throw new Error("Input must be a valid object");
    }
    
    const normalized = input as any;
    
    // Provide defaults for required fields
    return {
      category: normalized.category || "General",
      shipped_content: normalized.shipped_content || "",
      assets_manager_details: {
        images: Array.isArray(normalized.assets_manager_details?.images) ? normalized.assets_manager_details.images : [],
        tables: Array.isArray(normalized.assets_manager_details?.tables) ? normalized.assets_manager_details.tables : [],
        charts: Array.isArray(normalized.assets_manager_details?.charts) ? normalized.assets_manager_details.charts : [],
        code_snippets: Array.isArray(normalized.assets_manager_details?.code_snippets) ? normalized.assets_manager_details.code_snippets : [],
        videos: Array.isArray(normalized.assets_manager_details?.videos) ? normalized.assets_manager_details.videos : []
      },
      seo_details: normalized.seo_details || {
        html_head_section: {
          meta_tags: {
            title: "Generated Article",
            description: "Auto-generated article description"
          }
        }
      }
    };
  } catch (error) {
    console.error("Input normalization error:", error);
    throw new Error(`Invalid input format: ${error.message}`);
  }
}

// Claude API integration
async function generateWithClaude(normalizedInput: any) {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `Role Definition
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
      "code_blocks": 0,
      "tables": 0,
      "charts": 0,
      "videos": 0
    }
  }
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

Remember: Your output is production code that thousands of users will see. There are no second chances. Every component must be perfect on first generation.

User Input Data:
${JSON.stringify(normalizedInput, null, 2)}

IMPORTANT: Return ONLY valid JSON in the exact format specified above. No additional text or explanations.`;

  try {
    console.log("Calling Claude API with normalized input:", normalizedInput);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        temperature: 0.1,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude API response:", data);

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }

    const generatedContent = data.content[0].text.trim();
    
    // Parse Claude's JSON response
    let claudeOutput;
    try {
      // Extract JSON from Claude's response (handle potential markdown formatting)
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        claudeOutput = JSON.parse(jsonMatch[0]);
      } else {
        claudeOutput = JSON.parse(generatedContent);
      }
    } catch (e) {
      console.error("Failed to parse Claude output:", generatedContent);
      throw new Error("Claude returned invalid JSON format");
    }

    // Validate Claude's output format
    if (!claudeOutput.success || !claudeOutput.component || !claudeOutput.metadata) {
      throw new Error("Claude output missing required fields");
    }

    return claudeOutput;

  } catch (error) {
    console.error("Claude generation error:", error);
    throw error;
  }
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const rawInput = await req.json();
    console.log("Received raw input:", rawInput);

    // Step 1: Normalize input (handle ANY format)
    const normalizedInput = normalizeInput(rawInput);
    console.log("Normalized input:", normalizedInput);

    // Step 2: Generate component with Claude
    const claudeResult = await generateWithClaude(normalizedInput);
    console.log("Claude result:", claudeResult);

    // Step 3: Return in Shaper AI compatible format
    const response = {
      success: true,
      component: claudeResult.component,
      metadata: {
        component_name: claudeResult.metadata.component_name,
        route_slug: claudeResult.metadata.route_slug,
        category: claudeResult.metadata.category,
        title: claudeResult.metadata.title,
        description: claudeResult.metadata.description,
        publish_date: claudeResult.metadata.publish_date,
        read_time: claudeResult.metadata.read_time,
        assets_count: {
          images: claudeResult.metadata.assets_count.images || 0,
          videos: claudeResult.metadata.assets_count.videos || 0,
          tables: claudeResult.metadata.assets_count.tables || 0,
          charts: claudeResult.metadata.assets_count.charts || 0,
          code_snippets: claudeResult.metadata.assets_count.code_blocks || claudeResult.metadata.assets_count.code_snippets || 0
        }
      }
    };

    console.log("Final response:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Coder Agent error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: "AI Coder Agent v2.0 processing failed"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});