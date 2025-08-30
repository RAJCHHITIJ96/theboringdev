import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComponentTemplate {
  type: string;
  props: Record<string, any>;
  children?: ComponentTemplate[];
}

interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
  components: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { content_id } = await req.json();

    if (!content_id) {
      return new Response(
        JSON.stringify({ error: 'content_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🎨 Page Composer: Starting composition for content_id: ${content_id}`);

    // Fetch content processing data
    const { data: contentData, error: contentError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('content_id', content_id)
      .single();

    if (contentError || !contentData) {
      console.error('❌ Error fetching content data:', contentError);
      return new Response(
        JSON.stringify({ error: 'Content not found or error fetching data' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Track agent input (after data is fetched)
    await logAgentInteraction(supabase, {
      content_id: content_id,
      agent_name: 'zuhu-page-composer',
      interaction_type: 'input',
      interaction_data: { content_id, status: contentData.status },
      status: 'processing'
    });

    // Update pipeline monitoring
    await updatePipelineMonitoring(supabase, {
      content_id: content_id,
      current_agent: 'zuhu-page-composer',
      pipeline_stage: 'page_composition',
      stage_status: 'active',
      input_data: { content_id, expected_status: 'assets_processed' },
      processing_started_at: new Date().toISOString()
    });

    // Verify content has assets_processed status
    if (contentData.status !== 'assets_processed') {
      console.log(`⚠️ Content status is ${contentData.status}, expected assets_processed`);
      return new Response(
        JSON.stringify({ error: `Content status must be assets_processed, current: ${contentData.status}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch design directives
    const { data: designData, error: designError } = await supabase
      .from('design_directives')
      .select('*')
      .eq('content_id', content_id)
      .single();

    if (designError || !designData) {
      console.error('❌ Error fetching design directives:', designError);
      return new Response(
        JSON.stringify({ error: 'Design directives not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch validated assets
    const { data: assetData, error: assetError } = await supabase
      .from('asset_data')
      .select('*')
      .eq('content_id', content_id)
      .single();

    if (assetError || !assetData) {
      console.error('❌ Error fetching asset data:', assetError);
      return new Response(
        JSON.stringify({ error: 'Asset data not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ All data fetched successfully, starting page composition...');

    // Parse the processed content and design tokens
    const processedContent = contentData.processed_content;
    const designTokens: DesignTokens = designData.design_token_set || {};
    const componentMap = designData.component_map || {};
    const validatedAssets = assetData.validated_assets || [];

    // Compose the page dynamically
    const composedPage = await composePage(
      processedContent,
      designTokens,
      componentMap,
      validatedAssets,
      contentData.category || 'default'
    );

    // Generate page metadata
    const pageMetadata = {
      title: processedContent?.title || 'Untitled',
      description: processedContent?.summary || '',
      keywords: processedContent?.keywords || [],
      category: contentData.category,
      template_id: designData.template_id,
      composition_timestamp: new Date().toISOString(),
      assets_count: validatedAssets.length,
      components_used: Object.keys(componentMap)
    };

    // Save to generated_pages table
    const { data: pageData, error: pageError } = await supabase
      .from('generated_pages')
      .upsert({
        content_id,
        page_content: composedPage,
        page_metadata: pageMetadata,
        status: 'page_created',
        version: 1
      })
      .select()
      .single();

    if (pageError) {
      console.error('❌ Error saving page:', pageError);
      return new Response(
        JSON.stringify({ error: 'Failed to save composed page' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update content processing status
    const { error: updateError } = await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'page_created',
        processing_end: new Date().toISOString()
      })
      .eq('content_id', content_id);

    if (updateError) {
      console.error('❌ Error updating processing status:', updateError);
    }

    console.log('🎉 Page composition completed successfully!');

    // Track successful output
    await logAgentInteraction(supabase, {
      content_id: content_id,
      agent_name: 'zuhu-page-composer',
      interaction_type: 'output',
      interaction_data: {
        page_id: pageData.id,
        metadata: pageMetadata,
        composition_stats: {
          components_used: Object.keys(componentMap).length,
          assets_integrated: validatedAssets.length,
          page_size: composedPage.length
        }
      },
      processing_time_ms: Date.now() - new Date(contentData.processing_start || Date.now()).getTime(),
      status: 'page_created'
    });

    // Update pipeline monitoring to completed
    await updatePipelineMonitoring(supabase, {
      content_id: content_id,
      current_agent: null,
      pipeline_stage: 'page_composition',
      stage_status: 'completed',
      output_data: {
        page_id: pageData.id,
        status: 'page_created',
        metadata: pageMetadata
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        content_id,
        status: 'page_created',
        page_id: pageData.id,
        metadata: pageMetadata,
        composition_stats: {
          components_used: Object.keys(componentMap).length,
          assets_integrated: validatedAssets.length,
          page_size: composedPage.length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Page Composer Error:', error);
    
    // Track error
    await logAgentInteraction(supabase, {
      content_id: content_id || 'unknown',
      agent_name: 'zuhu-page-composer',
      interaction_type: 'error',
      interaction_data: { error: error.message, stack: error.stack },
      status: 'failed'
    });

    // Update pipeline monitoring to error state
    if (content_id) {
      await updatePipelineMonitoring(supabase, {
        content_id: content_id,
        current_agent: null,
        pipeline_stage: 'page_composition',
        stage_status: 'error',
        error_data: { error: error.message, timestamp: new Date().toISOString() }
      });
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during page composition',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper functions for agent tracking
async function logAgentInteraction(supabase: any, interaction: any) {
  try {
    await supabase.functions.invoke('zuhu-agent-tracker', {
      body: {
        action: 'log_interaction',
        data: interaction
      }
    });
  } catch (error) {
    console.error('Failed to log agent interaction:', error);
  }
}

async function updatePipelineMonitoring(supabase: any, update: any) {
  try {
    await supabase.functions.invoke('zuhu-agent-tracker', {
      body: {
        action: 'update_pipeline',
        data: update
      }
    });
  } catch (error) {
    console.error('Failed to update pipeline monitoring:', error);
  }
}

async function composePage(
  content: any,
  designTokens: DesignTokens,
  componentMap: Record<string, any>,
  assets: any[],
  category: string
): Promise<string> {
  console.log('🔨 Composing page with design tokens and components...');

  // Extract design tokens for styling
  const colors = designTokens.colors || {};
  const typography = designTokens.typography || {};
  const spacing = designTokens.spacing || {};

  // Build CSS variables from design tokens
  const cssVariables = Object.entries(colors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n  ');

  // Create component styles based on design tokens
  const componentStyles = generateComponentStyles(designTokens);

  // Build the page header with meta tags and styles
  const pageHeader = `---
title: "${content?.title || 'Untitled'}"
description: "${content?.summary || ''}"
category: "${category}"
publishDate: "${new Date().toISOString()}"
---

<style>
:root {
  ${cssVariables}
}

${componentStyles}
</style>

`;

  // Compose main content sections
  let pageBody = '';

  // Hero section with dynamic layout
  if (content?.title) {
    const heroComponent = componentMap.hero || 'default-hero';
    pageBody += `<section class="hero ${heroComponent}">
  <h1 class="hero-title">${content.title}</h1>
  ${content.summary ? `<p class="hero-description">${content.summary}</p>` : ''}
</section>

`;
  }

  // Main content with intelligent asset placement
  if (content?.sections) {
    pageBody += '<main class="article-content">\n';
    
    content.sections.forEach((section: any, index: number) => {
      // Add section with appropriate styling
      pageBody += `<section class="content-section section-${index + 1}">
`;
      
      if (section.heading) {
        const headingLevel = Math.min(section.level || 2, 6);
        pageBody += `  <h${headingLevel} class="section-heading">${section.heading}</h${headingLevel}>
`;
      }
      
      if (section.content) {
        pageBody += `  <div class="section-content">
    ${section.content}
  </div>
`;
      }

      // Intelligently place assets based on content context
      const relevantAssets = findRelevantAssets(section, assets);
      relevantAssets.forEach(asset => {
        pageBody += `  <figure class="asset-container">
    <img src="${asset.url}" alt="${asset.alt_text || 'Content image'}" class="content-image" loading="lazy" />
    ${asset.caption ? `<figcaption>${asset.caption}</figcaption>` : ''}
  </figure>
`;
      });

      pageBody += '</section>\n\n';
    });

    pageBody += '</main>\n';
  }

  // Add FAQ section if present
  if (content?.faqs && content.faqs.length > 0) {
    const faqComponent = componentMap.faq || 'default-faq';
    pageBody += `<section class="faq-section ${faqComponent}">
  <h2 class="faq-title">Frequently Asked Questions</h2>
  <div class="faq-container">
`;
    
    content.faqs.forEach((faq: any) => {
      pageBody += `    <details class="faq-item">
      <summary class="faq-question">${faq.question}</summary>
      <div class="faq-answer">${faq.answer}</div>
    </details>
`;
    });
    
    pageBody += '  </div>\n</section>\n\n';
  }

  // Add code examples if present
  if (content?.code_examples && content.code_examples.length > 0) {
    const codeComponent = componentMap.code || 'default-code';
    pageBody += `<section class="code-section ${codeComponent}">
  <h2 class="code-title">Code Examples</h2>
`;
    
    content.code_examples.forEach((example: any) => {
      pageBody += `  <div class="code-block">
    ${example.title ? `<h3 class="code-subtitle">${example.title}</h3>` : ''}
    <pre class="code-pre"><code class="language-${example.language || 'javascript'}">${example.code}</code></pre>
    ${example.explanation ? `<p class="code-explanation">${example.explanation}</p>` : ''}
  </div>
`;
    });
    
    pageBody += '</section>\n\n';
  }

  return pageHeader + pageBody;
}

function generateComponentStyles(designTokens: DesignTokens): string {
  const typography = designTokens.typography || {};
  const spacing = designTokens.spacing || {};
  
  return `
/* Hero Styles */
.hero {
  padding: var(--spacing-xl, 4rem) var(--spacing-lg, 2rem);
  text-align: center;
  background: linear-gradient(135deg, var(--primary, #3b82f6), var(--primary-dark, #1e40af));
  color: var(--text-on-primary, white);
}

.hero-title {
  font-size: ${typography.h1?.fontSize || '3rem'};
  font-weight: ${typography.h1?.fontWeight || '700'};
  margin-bottom: var(--spacing-md, 1rem);
  line-height: 1.2;
}

.hero-description {
  font-size: ${typography.lead?.fontSize || '1.25rem'};
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Content Styles */
.article-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl, 3rem) var(--spacing-lg, 2rem);
}

.content-section {
  margin-bottom: var(--spacing-xl, 3rem);
}

.section-heading {
  font-size: ${typography.h2?.fontSize || '2rem'};
  font-weight: ${typography.h2?.fontWeight || '600'};
  margin-bottom: var(--spacing-md, 1rem);
  color: var(--text-primary, #1f2937);
}

.section-content {
  line-height: 1.7;
  color: var(--text-secondary, #4b5563);
}

/* Asset Styles */
.asset-container {
  margin: var(--spacing-lg, 2rem) 0;
  text-align: center;
}

.content-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius, 0.5rem);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

/* FAQ Styles */
.faq-section {
  background: var(--bg-secondary, #f9fafb);
  padding: var(--spacing-xl, 3rem) var(--spacing-lg, 2rem);
  border-radius: var(--border-radius-lg, 1rem);
  margin: var(--spacing-xl, 3rem) 0;
}

.faq-item {
  border-bottom: 1px solid var(--border, #e5e7eb);
  padding: var(--spacing-md, 1rem) 0;
}

.faq-question {
  font-weight: 600;
  cursor: pointer;
  color: var(--text-primary, #1f2937);
}

.faq-answer {
  padding-top: var(--spacing-sm, 0.5rem);
  color: var(--text-secondary, #4b5563);
}

/* Code Styles */
.code-section {
  margin: var(--spacing-xl, 3rem) 0;
}

.code-block {
  background: var(--bg-code, #1f2937);
  border-radius: var(--border-radius, 0.5rem);
  padding: var(--spacing-lg, 2rem);
  margin: var(--spacing-md, 1rem) 0;
  overflow-x: auto;
}

.code-pre {
  margin: 0;
  color: var(--text-code, #f3f4f6);
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-lg, 2rem) var(--spacing-md, 1rem);
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .article-content {
    padding: var(--spacing-lg, 2rem) var(--spacing-md, 1rem);
  }
}
`;
}

function findRelevantAssets(section: any, assets: any[]): any[] {
  // Simple relevance matching - in a real implementation, this would be more sophisticated
  const sectionText = (section.content || '').toLowerCase();
  const sectionHeading = (section.heading || '').toLowerCase();
  
  return assets.filter(asset => {
    const altText = (asset.alt_text || '').toLowerCase();
    const filename = (asset.url || '').toLowerCase();
    
    // Check if asset is mentioned in the section
    return sectionText.includes(altText) || 
           sectionHeading.includes(altText) ||
           sectionText.includes(filename.split('/').pop()?.split('.')[0] || '');
  }).slice(0, 2); // Limit to 2 assets per section for performance
}