import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InputData {
  category: string;
  shipped_content: string;
  assets_manager_details: {
    images: Array<{
      [key: string]: {
        src: string;
        alt: string;
        where_to_place: string;
        description: string;
      };
    }>;
    tables: Array<{
      [key: string]: {
        title: string;
        where_to_place: string;
        description: string;
      };
    }>;
    charts: Array<{
      [key: string]: {
        chart_data: string;
        where_to_place: string;
        description: string;
      };
    }>;
    code_snippets: Array<{
      [key: string]: {
        snippet: string;
        where_to_place: string;
        description: string;
      };
    }>;
    videos: Array<{
      [key: string]: {
        embed_url: string;
        where_to_place: string;
        description: string;
      };
    }>;
  };
  seo_details: {
    html_head_section: {
      meta_tags: {
        title: string;
        description: string;
        "og:title": string;
        "og:description": string;
        "og:image": string;
      };
      schema_markup: {
        "@context": string;
        "@type": string;
        headline: string;
        author: {
          name: string;
        };
        datePublished: string;
      };
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
    .slice(0, 50);
};

const generateRouteSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return `${readTime} min`;
};

const extractTitle = (content: string): string => {
  // Extract first H1 or use first line
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  const lines = content.split('\n').filter(line => line.trim());
  return lines[0]?.replace(/^#+\s*/, '') || 'Untitled Article';
};

const processContent = (content: string): string => {
  let processedContent = content;
  
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
            ${heading}
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
            ${heading}
          </h3>`;
  });
  
  // Convert paragraphs
  processedContent = processedContent.replace(/^(?!#|<|\s*$)(.+)$/gm, (_, paragraph) => {
    if (paragraph.trim()) {
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
    return '';
  });
  
  return processedContent;
};

const processAssets = (assets: InputData['assets_manager_details'], content: string): string => {
  let processedContent = content;
  
  // Process images
  assets.images.forEach((imageObj, index) => {
    const image = Object.values(imageObj)[0];
    const imagePlacement = `
          <div className="blog-image-container" style={{ margin: '48px 0', textAlign: 'center' }}>
            <img 
              src="${image.src}" 
              alt="${image.alt}" 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>`;
    
    processedContent += imagePlacement;
  });
  
  // Process code snippets
  assets.code_snippets.forEach((codeObj, index) => {
    const code = Object.values(codeObj)[0];
    const codeBlock = `
          <div className="my-12">
            <pre className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <code className="text-sm font-mono text-gray-100">
                ${escapeHtml(code.snippet)}
              </code>
            </pre>
          </div>`;
    
    processedContent += codeBlock;
  });
  
  // Process tables
  assets.tables.forEach((tableObj, index) => {
    const table = Object.values(tableObj)[0];
    const tableMarkup = `
          <div className="overflow-x-auto my-12 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="p-4 text-center text-lg font-semibold border-b border-gray-200">
              ${table.title}
            </div>
          </div>`;
    
    processedContent += tableMarkup;
  });
  
  // Process videos
  assets.videos.forEach((videoObj, index) => {
    const video = Object.values(videoObj)[0];
    const videoEmbed = `
          <div className="youtube-embed-container my-12">
            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="${video.embed_url}"
                title="${video.description}"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>`;
    
    processedContent += videoEmbed;
  });
  
  return processedContent;
};

const generateReactComponent = (data: InputData): { component: string; metadata: ComponentMetadata } => {
  const title = extractTitle(data.shipped_content);
  const componentName = generateComponentName(title);
  const routeSlug = generateRouteSlug(title);
  const readTime = calculateReadTime(data.shipped_content);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Process content and assets
  let processedContent = processContent(data.shipped_content);
  processedContent = processAssets(data.assets_manager_details, processedContent);
  
  // Get hero image
  const heroImage = data.assets_manager_details.images[0] 
    ? Object.values(data.assets_manager_details.images[0])[0].src 
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
    category: data.category,
    title: title,
    description: data.seo_details.html_head_section.meta_tags.description,
    publish_date: new Date().toISOString().split('T')[0],
    read_time: readTime,
    assets_count: {
      images: data.assets_manager_details.images.length,
      code_blocks: data.assets_manager_details.code_snippets.length,
      tables: data.assets_manager_details.tables.length
    }
  };

  return { component, metadata };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

    const inputData: InputData = await req.json();

    // Validate required fields
    if (!inputData.category || !inputData.shipped_content || !inputData.seo_details) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: category, shipped_content, and seo_details are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate React component using AI Coder Agent logic
    const result = generateReactComponent(inputData);

    return new Response(
      JSON.stringify({
        success: true,
        component: result.component,
        metadata: result.metadata,
        message: 'React component generated successfully'
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
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});