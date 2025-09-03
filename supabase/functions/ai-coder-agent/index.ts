import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlexibleInputData {
  category: string;
  shipped_content: string;
  assets_manager_details?: {
    images?: Array<{
      [key: string]: {
        src: string;
        alt: string;
        where_to_place?: string;
        description?: string;
      };
    }>;
    tables?: Array<{
      [key: string]: {
        title: string;
        where_to_place?: string;
        description?: string;
      };
    }>;
    charts?: Array<{
      [key: string]: {
        chart_data: string;
        where_to_place?: string;
        description?: string;
      };
    }>;
    code_snippets?: Array<{
      [key: string]: {
        snippet: string;
        where_to_place?: string;
        description?: string;
      };
    }>;
    videos?: Array<{
      [key: string]: {
        embed_url: string;
        where_to_place?: string;
        description?: string;
      };
    }>;
  };
  seo_details?: {
    html_head_section?: {
      meta_tags?: {
        title?: string;
        description?: string;
        'og:title'?: string;
        'og:description'?: string;
        'og:image'?: string;
      };
      schema_markup?: any;
    };
  };
}

interface ComponentMetadata {
  component_name: string;
  route_slug: string;
  category: string;
  title: string;
  description: string;
  publish_date: string;
  read_time: string;
  assets_count: {
    images: number;
    code_blocks: number;
    tables: number;
  };
}

function validateAndNormalizeInput(input: any): FlexibleInputData {
  console.log('🔍 Validating input:', typeof input);

  // Handle string input (JSON string)
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    } catch (error) {
      throw new Error(`Invalid JSON string: ${error.message}`);
    }
  }

  // Ensure input is an object
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be a valid object or JSON string');
  }

  // Validate required fields
  if (!input.category || typeof input.category !== 'string') {
    throw new Error('Field "category" is required and must be a string');
  }

  if (!input.shipped_content || typeof input.shipped_content !== 'string') {
    throw new Error('Field "shipped_content" is required and must be a string');
  }

  // Normalize optional fields with defaults
  const normalized: FlexibleInputData = {
    category: input.category.trim(),
    shipped_content: input.shipped_content.trim(),
    assets_manager_details: {
      images: Array.isArray(input.assets_manager_details?.images) ? input.assets_manager_details.images : [],
      tables: Array.isArray(input.assets_manager_details?.tables) ? input.assets_manager_details.tables : [],
      charts: Array.isArray(input.assets_manager_details?.charts) ? input.assets_manager_details.charts : [],
      code_snippets: Array.isArray(input.assets_manager_details?.code_snippets) ? input.assets_manager_details.code_snippets : [],
      videos: Array.isArray(input.assets_manager_details?.videos) ? input.assets_manager_details.videos : [],
    },
    seo_details: {
      html_head_section: {
        meta_tags: {
          title: input.seo_details?.html_head_section?.meta_tags?.title || 'Default Title',
          description: input.seo_details?.html_head_section?.meta_tags?.description || 'Default description',
          'og:title': input.seo_details?.html_head_section?.meta_tags?.['og:title'] || input.seo_details?.html_head_section?.meta_tags?.title || 'Default Title',
          'og:description': input.seo_details?.html_head_section?.meta_tags?.['og:description'] || input.seo_details?.html_head_section?.meta_tags?.description || 'Default description',
          'og:image': input.seo_details?.html_head_section?.meta_tags?.['og:image'] || '/default-og-image.png',
        },
        schema_markup: input.seo_details?.html_head_section?.schema_markup || {},
      },
    },
  };

  console.log('✅ Input validated and normalized successfully');
  return normalized;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function generateComponentName(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/\s/g, '');
}

function generateRouteSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

function extractTitle(content: string): string {
  // Extract first H1 from markdown content
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // Fallback: use first line if no H1 found
  const firstLine = content.split('\n')[0];
  return firstLine.replace(/^#+\s*/, '').trim();
}

function processMarkdownContent(content: string): string {
  console.log('📝 Processing markdown content...');
  
  // Split content into sections
  const sections = content.split(/\n(?=#{1,3}\s)/);
  let processedSections: string[] = [];
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    const lines = section.split('\n');
    const firstLine = lines[0];
    
    // Process headers
    if (firstLine.startsWith('# ')) {
      // H1 - Main title (handled separately in component structure)
      continue;
    } else if (firstLine.startsWith('## ')) {
      // H2 - Section headers
      const headerText = firstLine.replace('## ', '').trim();
      processedSections.push(`
        <section className="mb-16">
          <h2 style={{
            fontFamily: "'Playfair Display', 'Crimson Text', serif",
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: '500',
            lineHeight: '1.2',
            marginBottom: '32px',
            marginTop: '64px'
          }} className="text-black">
            ${escapeHtml(headerText)}
          </h2>
      `);
      
      // Process remaining content in section
      const remainingContent = lines.slice(1).join('\n');
      if (remainingContent.trim()) {
        processedSections.push(processContentLines(remainingContent));
      }
      
      processedSections.push('</section>');
    } else if (firstLine.startsWith('### ')) {
      // H3 - Subsection headers
      const headerText = firstLine.replace('### ', '').trim();
      processedSections.push(`
          <h3 style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '24px',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: '20px',
            marginTop: '48px'
          }} className="text-black">
            ${escapeHtml(headerText)}
          </h3>
      `);
      
      // Process remaining content
      const remainingContent = lines.slice(1).join('\n');
      if (remainingContent.trim()) {
        processedSections.push(processContentLines(remainingContent));
      }
    } else {
      // Regular content without header
      processedSections.push(processContentLines(section));
    }
  }
  
  return processedSections.join('\n');
}

function processContentLines(content: string): string {
  const lines = content.split('\n');
  let processed: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let currentParagraph: string[] = [];
  
  for (const line of lines) {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeContent = codeBlockContent.join('\n');
        processed.push(`
          <div className="my-12">
            <pre className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <code className="text-sm font-mono text-gray-100">
                ${escapeHtml(codeContent)}
              </code>
            </pre>
          </div>
        `);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          processed.push(`
            <p style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '21px',
              lineHeight: '1.7',
              marginBottom: '24px',
              color: '#374151'
            }}>
              ${escapeHtml(currentParagraph.join(' '))}
            </p>
          `);
          currentParagraph = [];
        }
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Handle lists
    if (line.trim().match(/^[-*+]\s+/) || line.trim().match(/^\d+\.\s+/)) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        processed.push(`
          <p style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '21px',
            lineHeight: '1.7',
            marginBottom: '24px',
            color: '#374151'
          }}>
            ${escapeHtml(currentParagraph.join(' '))}
          </p>
        `);
        currentParagraph = [];
      }
      
      const listItem = line.trim().replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');
      processed.push(`
        <div className="mb-4 flex items-start">
          <span className="text-gray-400 mr-4">•</span>
          <span style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '21px',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            ${escapeHtml(listItem)}
          </span>
        </div>
      `);
      continue;
    }
    
    // Handle bold text
    let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle regular paragraphs
    if (line.trim() === '') {
      // Empty line - end current paragraph
      if (currentParagraph.length > 0) {
        processed.push(`
          <p style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '21px',
            lineHeight: '1.7',
            marginBottom: '32px',
            color: '#374151'
          }}>
            ${escapeHtml(currentParagraph.join(' '))}
          </p>
        `);
        currentParagraph = [];
      }
    } else if (!line.trim().startsWith('#')) {
      // Add to current paragraph
      currentParagraph.push(processedLine.trim());
    }
  }
  
  // Flush final paragraph
  if (currentParagraph.length > 0) {
    processed.push(`
      <p style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '21px',
        lineHeight: '1.7',
        marginBottom: '32px',
        color: '#374151'
      }}>
        ${escapeHtml(currentParagraph.join(' '))}
      </p>
    `);
  }
  
  return processed.join('\n');
}

function processAssets(assets: FlexibleInputData['assets_manager_details'], processedContent: string): string {
  let finalContent = processedContent;
  
  // Process images
  if (assets?.images) {
    for (const imageObj of assets.images) {
      for (const [key, image] of Object.entries(imageObj)) {
        const imagePlacement = `
          <div className="blog-image-container my-16">
            <img 
              src="${image.src}" 
              alt="${escapeHtml(image.alt)}" 
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        `;
        // Insert image based on where_to_place logic or append
        finalContent += imagePlacement;
      }
    }
  }
  
  // Process videos
  if (assets?.videos) {
    for (const videoObj of assets.videos) {
      for (const [key, video] of Object.entries(videoObj)) {
        const videoPlacement = `
          <div className="my-16">
            <div className="aspect-video">
              <iframe
                src="${video.embed_url}"
                title="Video content"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        `;
        finalContent += videoPlacement;
      }
    }
  }
  
  return finalContent;
}

async function generateReactComponent(data: FlexibleInputData): Promise<{ component: string; metadata: ComponentMetadata }> {
  console.log('🎯 Generating component for:', data.category, 'with content length:', data.shipped_content.length);
  
  const title = extractTitle(data.shipped_content);
  const componentName = generateComponentName(title);
  const routeSlug = generateRouteSlug(title);
  const readTime = calculateReadTime(data.shipped_content);
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Count assets
  const assetsCount = {
    images: data.assets_manager_details?.images?.length || 0,
    code_blocks: Math.floor((data.shipped_content.match(/```/g) || []).length / 2),
    tables: data.assets_manager_details?.tables?.length || 0,
  };
  
  // Process content
  const processedContent = processMarkdownContent(data.shipped_content);
  const finalContent = processAssets(data.assets_manager_details, processedContent);
  
  // Get SEO data
  const seoTitle = data.seo_details?.html_head_section?.meta_tags?.title || title;
  const seoDescription = data.seo_details?.html_head_section?.meta_tags?.description || 'Default description';
  
  // Generate component
  const component = `import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NewHeader } from "@/components/NewHeader";
import Footer from "@/components/Footer";

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>${escapeHtml(seoTitle)}</title>
        <meta name="description" content="${escapeHtml(seoDescription)}" />
        <meta property="og:title" content="${escapeHtml(data.seo_details?.html_head_section?.meta_tags?.['og:title'] || seoTitle)}" />
        <meta property="og:description" content="${escapeHtml(data.seo_details?.html_head_section?.meta_tags?.['og:description'] || seoDescription)}" />
        <meta property="og:image" content="${data.seo_details?.html_head_section?.meta_tags?.['og:image'] || '/default-og-image.png'}" />
        <meta property="og:type" content="article" />
        ${data.seo_details?.html_head_section?.schema_markup ? `<script type="application/ld+json">
          ${JSON.stringify(data.seo_details.html_head_section.schema_markup)}
        </script>` : ''}
      </Helmet>
      
      <NewHeader />
      
      {/* Article Header */}
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="mb-12">
          <p className="text-xs mb-4 text-gray-500 font-mono uppercase tracking-widest">
            ${escapeHtml(data.category)}
          </p>
          <p className="text-sm font-mono text-gray-600">
            Published on ${currentDate}
          </p>
          <p className="text-sm mt-2 text-gray-500 font-mono">
            • ${readTime} read •
          </p>
        </div>
      </header>

      {/* Title Section */}
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{
          fontFamily: "'Playfair Display', 'Crimson Text', serif",
          fontSize: 'clamp(42px, 8vw, 84px)',
          fontWeight: '500',
          lineHeight: '1.1',
          letterSpacing: '-0.01em',
          marginBottom: '80px'
        }} className="text-black">
          ${escapeHtml(title)}
        </h1>
      </div>

      {/* Main Content */}
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          ${finalContent}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ${componentName};`;

  const metadata: ComponentMetadata = {
    component_name: componentName,
    route_slug: routeSlug,
    category: data.category,
    title: title,
    description: seoDescription,
    publish_date: currentDate,
    read_time: readTime,
    assets_count: assetsCount,
  };

  console.log('🎉 Component generated successfully:', componentName);
  
  return { component, metadata };
}

serve(async (req) => {
  console.log('🚀 AI Coder Agent - Request received:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed. Use POST.' 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Parse request body
    const rawBody = await req.text();
    console.log('📥 Raw request body length:', rawBody.length);
    
    let requestData;
    try {
      requestData = JSON.parse(rawBody);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid JSON: ${parseError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('AI Coder Agent - Raw input received:', JSON.stringify(requestData, null, 2));

    // Validate and normalize input
    const validatedData = validateAndNormalizeInput(requestData);
    console.log('AI Coder Agent - Normalized input:', JSON.stringify(validatedData, null, 2));

    // Generate React component
    const { component, metadata } = await generateReactComponent(validatedData);

    // Return success response
    const response = {
      success: true,
      component: component,
      metadata: metadata,
      message: `Component generated successfully: ${metadata.component_name}`,
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ AI Coder Agent Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.stack || 'No stack trace available'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});