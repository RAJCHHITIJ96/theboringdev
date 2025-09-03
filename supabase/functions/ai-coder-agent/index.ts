import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced flexible input interface
interface FlexibleInputData {
  category?: string;
  shipped_content?: string;
  assets_manager_details?: {
    images?: Array<any>;
    tables?: Array<any>;
    charts?: Array<any>;
    code_snippets?: Array<any>;
    videos?: Array<any>;
  };
  seo_details?: {
    html_head_section?: {
      meta_tags?: {
        title?: string;
        description?: string;
        "og:title"?: string;
        "og:description"?: string;
        "og:image"?: string;
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

// Enhanced input validation and normalization
const validateAndNormalizeInput = (rawInput: any): FlexibleInputData => {
  console.log('Raw input received:', JSON.stringify(rawInput, null, 2));
  
  // Handle string inputs that might be JSON
  let input = rawInput;
  if (typeof rawInput === 'string') {
    try {
      input = JSON.parse(rawInput);
    } catch (e) {
      // If it's not JSON, treat as shipped_content
      input = { shipped_content: rawInput };
    }
  }

  // Provide defaults for missing fields
  const normalized: FlexibleInputData = {
    category: input?.category || 'General',
    shipped_content: input?.shipped_content || input?.content || 'Default content',
    assets_manager_details: {
      images: Array.isArray(input?.assets_manager_details?.images) ? input.assets_manager_details.images : [],
      tables: Array.isArray(input?.assets_manager_details?.tables) ? input.assets_manager_details.tables : [],
      charts: Array.isArray(input?.assets_manager_details?.charts) ? input.assets_manager_details.charts : [],
      code_snippets: Array.isArray(input?.assets_manager_details?.code_snippets) ? input.assets_manager_details.code_snippets : [],
      videos: Array.isArray(input?.assets_manager_details?.videos) ? input.assets_manager_details.videos : [],
    },
    seo_details: {
      html_head_section: {
        meta_tags: {
          title: input?.seo_details?.html_head_section?.meta_tags?.title || extractTitle(input?.shipped_content || input?.content || ''),
          description: input?.seo_details?.html_head_section?.meta_tags?.description || 'Generated article description',
          "og:title": input?.seo_details?.html_head_section?.meta_tags?.["og:title"] || input?.seo_details?.html_head_section?.meta_tags?.title || extractTitle(input?.shipped_content || input?.content || ''),
          "og:description": input?.seo_details?.html_head_section?.meta_tags?.["og:description"] || input?.seo_details?.html_head_section?.meta_tags?.description || 'Generated article description',
          "og:image": input?.seo_details?.html_head_section?.meta_tags?.["og:image"] || '/placeholder.svg'
        },
        schema_markup: input?.seo_details?.html_head_section?.schema_markup || {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": input?.seo_details?.html_head_section?.meta_tags?.title || extractTitle(input?.shipped_content || input?.content || ''),
          "author": { "name": "theboringdevTeam" },
          "datePublished": new Date().toISOString()
        }
      }
    }
  };

  console.log('Normalized input:', JSON.stringify(normalized, null, 2));
  return normalized;
};

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const generateComponentName = (title: string): string => {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .slice(0, 50) || 'GeneratedComponent';
};

const generateRouteSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'generated-article';
};

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return `${readTime} min`;
};

const extractTitle = (content: string): string => {
  if (!content) return 'Untitled Article';
  
  // Extract first H1 or use first line
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  const lines = content.split('\n').filter(line => line.trim());
  return lines[0]?.replace(/^#+\s*/, '') || 'Untitled Article';
};

const processMarkdownContent = (content: string): string => {
  if (!content) return '';
  
  let processedContent = content;
  
  // Remove title (first H1) from content since it's displayed separately
  processedContent = processedContent.replace(/^#\s+.+$/m, '');
  
  // Convert H2 headings
  processedContent = processedContent.replace(/^##\s+(.+)$/gm, (_, heading) => {
    return `          <h2 style={{
            fontFamily: "'Playfair Display', 'Crimson Text', serif",
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: '500',
            lineHeight: '1.2',
            marginBottom: '32px',
            marginTop: '96px'
          }} className="text-black">
            ${heading.trim()}
          </h2>`;
  });
  
  // Convert H3 headings
  processedContent = processedContent.replace(/^###\s+(.+)$/gm, (_, heading) => {
    return `          <h3 style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '24px',
            marginTop: '48px'
          }} className="text-black">
            ${heading.trim()}
          </h3>`;
  });
  
  // Convert lists (bulleted)
  processedContent = processedContent.replace(/^[\*\-]\s+(.+)$/gm, (_, item) => {
    return `          <li style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '21px',
            lineHeight: '1.7',
            marginBottom: '16px',
            paddingLeft: '8px'
          }}>
            ${item.trim()}
          </li>`;
  });
  
  // Wrap lists in ul tags
  processedContent = processedContent.replace(/((\s*<li[^>]*>.*?<\/li>\s*)+)/gs, (match) => {
    return `          <ul style={{ marginBottom: '32px', paddingLeft: '24px' }}>
${match}
          </ul>`;
  });
  
  // Convert paragraphs (must be after headings and lists)
  processedContent = processedContent.replace(/^(?!#|<|\s*$)(.+)$/gm, (_, paragraph) => {
    if (paragraph.trim() && !paragraph.includes('<')) {
      return `          <p style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '21px',
            lineHeight: '1.7',
            marginBottom: '32px',
            color: '#374151'
          }}>
            ${paragraph.trim()}
          </p>`;
    }
    return paragraph;
  });
  
  return processedContent;
};

const processAssets = (assets: FlexibleInputData['assets_manager_details'], content: string): string => {
  if (!assets) return content;
  
  let processedContent = content;
  
  // Process images
  if (assets.images && assets.images.length > 0) {
    assets.images.forEach((imageObj, index) => {
      const image = typeof imageObj === 'object' && imageObj !== null 
        ? Object.values(imageObj)[0] || imageObj
        : imageObj;
      
      if (image && (image.src || image.url)) {
        const imagePlacement = `
          <div className="blog-image-container" style={{ margin: '48px 0', textAlign: 'center' }}>
            <img 
              src="${image.src || image.url}" 
              alt="${image.alt || image.description || 'Article image'}" 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>`;
        
        processedContent += imagePlacement;
      }
    });
  }
  
  // Process code snippets
  if (assets.code_snippets && assets.code_snippets.length > 0) {
    assets.code_snippets.forEach((codeObj, index) => {
      const code = typeof codeObj === 'object' && codeObj !== null 
        ? Object.values(codeObj)[0] || codeObj
        : codeObj;
      
      if (code && (code.snippet || code.code)) {
        const codeBlock = `
          <div className="my-12">
            <pre className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <code className="text-sm font-mono text-gray-100">
                ${escapeHtml(code.snippet || code.code)}
              </code>
            </pre>
          </div>`;
        
        processedContent += codeBlock;
      }
    });
  }
  
  // Process tables
  if (assets.tables && assets.tables.length > 0) {
    assets.tables.forEach((tableObj, index) => {
      const table = typeof tableObj === 'object' && tableObj !== null 
        ? Object.values(tableObj)[0] || tableObj
        : tableObj;
      
      if (table && (table.title || table.name)) {
        const tableMarkup = `
          <div className="overflow-x-auto my-12 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="p-4 text-center text-lg font-semibold border-b border-gray-200">
              ${table.title || table.name}
            </div>
          </div>`;
        
        processedContent += tableMarkup;
      }
    });
  }
  
  // Process videos
  if (assets.videos && assets.videos.length > 0) {
    assets.videos.forEach((videoObj, index) => {
      const video = typeof videoObj === 'object' && videoObj !== null 
        ? Object.values(videoObj)[0] || videoObj
        : videoObj;
      
      if (video && (video.embed_url || video.url)) {
        const videoEmbed = `
          <div className="youtube-embed-container my-12">
            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="${video.embed_url || video.url}"
                title="${video.description || video.title || 'Video embed'}"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>`;
        
        processedContent += videoEmbed;
      }
    });
  }
  
  return processedContent;
};

const generateReactComponent = (data: FlexibleInputData): { component: string; metadata: ComponentMetadata } => {
  const title = extractTitle(data.shipped_content || '');
  const componentName = generateComponentName(title);
  const routeSlug = generateRouteSlug(title);
  const readTime = calculateReadTime(data.shipped_content || '');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Process content and assets
  let processedContent = processMarkdownContent(data.shipped_content || '');
  processedContent = processAssets(data.assets_manager_details, processedContent);
  
  // Get hero image
  const heroImage = data.assets_manager_details?.images?.[0] 
    ? (typeof data.assets_manager_details.images[0] === 'object' 
       ? Object.values(data.assets_manager_details.images[0])[0]?.src || Object.values(data.assets_manager_details.images[0])[0]?.url
       : data.assets_manager_details.images[0]?.src || data.assets_manager_details.images[0]?.url)
    : '/placeholder.svg';
  
  const component = `import React from 'react';
import { NewHeader } from "@/components/NewHeader";
import Footer from "@/components/Footer";

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      
      {/* Hero Image - CRITICAL: Use blog-image-container class */}
      <div className="blog-image-container">
        <img src="${heroImage}" alt="${title}" />
      </div>

      {/* Article Header - EXACT SPACING */}
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="mb-12">
          <p className="text-xs mb-4 text-gray-500 font-mono uppercase tracking-widest">
            ${data.category}
          </p>
          <p className="text-sm font-mono text-gray-600">
            Published on ${currentDate}
          </p>
          <p className="text-sm mt-2 text-gray-500 font-mono">
            • ${readTime} read •
          </p>
        </div>
      </header>

      {/* Title Section - CRITICAL STYLING */}
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{
          fontFamily: "'Playfair Display', 'Crimson Text', serif",
          fontSize: 'clamp(42px, 8vw, 84px)',
          fontWeight: '500',
          lineHeight: '1.1',
          letterSpacing: '-0.01em',
          marginBottom: '80px'
        }} className="text-black">
          ${title}
        </h1>
      </div>

      {/* Main Content - EXACT AIUGC.tsx PATTERN */}
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-32">
${processedContent}
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
    category: data.category || 'General',
    title: title,
    description: data.seo_details?.html_head_section?.meta_tags?.description || 'Generated article description',
    publish_date: new Date().toISOString().split('T')[0],
    read_time: readTime,
    assets_count: {
      images: data.assets_manager_details?.images?.length || 0,
      code_blocks: data.assets_manager_details?.code_snippets?.length || 0,
      tables: data.assets_manager_details?.tables?.length || 0
    }
  };

  return { component, metadata };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('AI Coder Agent request received:', req.method);

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced input parsing
    let rawInput: any;
    try {
      const body = await req.text();
      console.log('Raw request body:', body);
      
      if (!body || body.trim() === '') {
        throw new Error('Empty request body');
      }
      
      rawInput = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON format in request body',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and normalize input
    const inputData = validateAndNormalizeInput(rawInput);

    // Basic validation - only check for essential content
    if (!inputData.shipped_content || inputData.shipped_content.trim() === '') {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required content: shipped_content is required and cannot be empty',
          received: {
            category: inputData.category,
            shipped_content_length: inputData.shipped_content?.length || 0,
            has_seo_details: !!inputData.seo_details
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating component for:', inputData.category, 'with content length:', inputData.shipped_content.length);

    // Generate React component using AI Coder Agent logic
    const result = generateReactComponent(inputData);

    console.log('Component generated successfully:', result.metadata.component_name);

    return new Response(
      JSON.stringify({
        success: true,
        component: result.component,
        metadata: result.metadata,
        message: 'React component generated successfully using AI Coder Agent'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('AI Coder Agent Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during component generation',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});