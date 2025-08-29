import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SEOMetadata {
  title: string;
  description: string;
  openGraph: Record<string, string>;
  jsonLd: Record<string, any>[];
  structuredData: Record<string, any>;
  metaTags: Record<string, string>;
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

    console.log(`🔍 SEO Synthesizer: Starting optimization for content_id: ${content_id}`);

    // Fetch the composed page
    const { data: pageData, error: pageError } = await supabase
      .from('generated_pages')
      .select('*')
      .eq('content_id', content_id)
      .single();

    if (pageError || !pageData) {
      console.error('❌ Error fetching page data:', pageError);
      return new Response(
        JSON.stringify({ error: 'Page not found or error fetching data' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify page has page_created status
    if (pageData.status !== 'page_created') {
      console.log(`⚠️ Page status is ${pageData.status}, expected page_created`);
      return new Response(
        JSON.stringify({ error: `Page status must be page_created, current: ${pageData.status}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch original content data for additional context
    const { data: contentData, error: contentError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('content_id', content_id)
      .single();

    if (contentError || !contentData) {
      console.error('❌ Error fetching content data:', contentError);
      return new Response(
        JSON.stringify({ error: 'Content data not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Page and content data fetched, starting SEO synthesis...');

    // Analyze the page content and structure
    const pageAnalysis = analyzePageStructure(pageData.page_content);
    const processedContent = contentData.processed_content;
    
    // Generate comprehensive SEO metadata
    const seoMetadata = await generateSEOMetadata(
      pageAnalysis,
      processedContent,
      pageData.page_metadata,
      contentData.category || 'article'
    );

    // Optimize page content for SEO
    const optimizedPageContent = optimizePageForSEO(
      pageData.page_content,
      seoMetadata,
      pageAnalysis
    );

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(
      optimizedPageContent,
      pageAnalysis,
      seoMetadata
    );

    // Update the page with SEO optimizations
    const updatedPageMetadata = {
      ...pageData.page_metadata,
      seo: seoMetadata,
      lastOptimized: new Date().toISOString(),
      seoScore: calculateSEOScore(seoMetadata, pageAnalysis)
    };

    const { data: updatedPage, error: updateError } = await supabase
      .from('generated_pages')
      .update({
        page_content: optimizedPageContent,
        page_metadata: updatedPageMetadata,
        performance_metrics: performanceMetrics,
        status: 'seo_optimized',
        version: (pageData.version || 1) + 1
      })
      .eq('content_id', content_id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating page:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save SEO optimized page' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update content processing status
    const { error: statusUpdateError } = await supabase
      .from('zuhu_content_processing')
      .update({ 
        status: 'seo_optimized',
        processing_end: new Date().toISOString()
      })
      .eq('content_id', content_id);

    if (statusUpdateError) {
      console.error('❌ Error updating processing status:', statusUpdateError);
    }

    console.log('🎉 SEO synthesis completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        content_id,
        status: 'seo_optimized',
        page_id: updatedPage.id,
        seo_score: updatedPageMetadata.seoScore,
        optimization_stats: {
          title_optimized: true,
          meta_description_optimized: true,
          schema_generated: seoMetadata.jsonLd.length > 0,
          heading_structure_valid: pageAnalysis.headingStructure.isValid,
          performance_score: performanceMetrics.overallScore,
          structured_data_count: seoMetadata.jsonLd.length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ SEO Synthesizer Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during SEO synthesis',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function analyzePageStructure(pageContent: string) {
  console.log('🔍 Analyzing page structure for SEO optimization...');
  
  // Extract headings hierarchy
  const headingMatches = pageContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
  const headings = headingMatches.map(match => {
    const level = parseInt(match.match(/<h([1-6])/)?.[1] || '1');
    const text = match.replace(/<[^>]*>/g, '').trim();
    return { level, text };
  });

  // Check heading structure validity
  const headingStructure = validateHeadingStructure(headings);
  
  // Extract images and check alt attributes
  const imageMatches = pageContent.match(/<img[^>]*>/gi) || [];
  const images = imageMatches.map(img => {
    const src = img.match(/src="([^"]*)"/) ? img.match(/src="([^"]*)"/)![1] : '';
    const alt = img.match(/alt="([^"]*)"/) ? img.match(/alt="([^"]*)"/)![1] : '';
    const hasLazyLoading = img.includes('loading="lazy"');
    return { src, alt, hasAlt: !!alt, hasLazyLoading };
  });

  // Extract links
  const linkMatches = pageContent.match(/<a[^>]*href="[^"]*"[^>]*>.*?<\/a>/gi) || [];
  const links = linkMatches.map(link => {
    const href = link.match(/href="([^"]*)"/) ? link.match(/href="([^"]*)"/)![1] : '';
    const text = link.replace(/<[^>]*>/g, '').trim();
    const isExternal = href.startsWith('http') && !href.includes('theboringdev.com');
    return { href, text, isExternal };
  });

  // Extract components used
  const components = extractComponents(pageContent);

  return {
    headings,
    headingStructure,
    images,
    links,
    components,
    wordCount: pageContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
    hasCodeBlocks: pageContent.includes('<code'),
    hasFAQSection: pageContent.includes('faq-section'),
    hasTableOfContents: false // Could be enhanced to detect TOC
  };
}

function validateHeadingStructure(headings: Array<{level: number, text: string}>) {
  let isValid = true;
  let issues = [];
  let hasH1 = false;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    if (heading.level === 1) {
      if (hasH1) {
        isValid = false;
        issues.push(`Multiple H1 tags found: "${heading.text}"`);
      }
      hasH1 = true;
    }

    if (i > 0) {
      const prevHeading = headings[i - 1];
      if (heading.level > prevHeading.level + 1) {
        isValid = false;
        issues.push(`Heading hierarchy skip from H${prevHeading.level} to H${heading.level}: "${heading.text}"`);
      }
    }
  }

  if (!hasH1) {
    isValid = false;
    issues.push('No H1 tag found');
  }

  return { isValid, issues, hasH1 };
}

function extractComponents(pageContent: string): string[] {
  const components = [];
  
  if (pageContent.includes('hero')) components.push('hero');
  if (pageContent.includes('faq-section')) components.push('faq');
  if (pageContent.includes('code-section')) components.push('code');
  if (pageContent.includes('asset-container')) components.push('images');
  if (pageContent.includes('<table')) components.push('table');
  if (pageContent.includes('chart')) components.push('chart');
  
  return components;
}

async function generateSEOMetadata(
  pageAnalysis: any,
  processedContent: any,
  existingMetadata: any,
  category: string
): Promise<SEOMetadata> {
  console.log('🏷️ Generating comprehensive SEO metadata...');

  const title = processedContent?.title || existingMetadata?.title || 'Untitled';
  const description = processedContent?.summary || existingMetadata?.description || '';
  const keywords = processedContent?.keywords || [];

  // Generate optimized title (under 60 characters)
  const optimizedTitle = optimizeTitle(title, keywords[0]);
  
  // Generate optimized meta description (under 160 characters)
  const optimizedDescription = optimizeDescription(description, keywords.slice(0, 3));

  // Generate Open Graph metadata
  const openGraph = {
    'og:title': optimizedTitle,
    'og:description': optimizedDescription,
    'og:type': category === 'tutorial' ? 'article' : 'website',
    'og:site_name': 'The Boring Dev',
    'og:locale': 'en_US'
  };

  // Generate JSON-LD structured data based on components
  const jsonLd = generateStructuredData(
    pageAnalysis,
    processedContent,
    optimizedTitle,
    optimizedDescription,
    category
  );

  // Generate additional meta tags
  const metaTags = {
    'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    'author': 'The Boring Dev Team',
    'viewport': 'width=device-width, initial-scale=1.0',
    'theme-color': '#3b82f6',
    'keywords': keywords.slice(0, 10).join(', ')
  };

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    openGraph,
    jsonLd,
    structuredData: {
      category,
      readingTime: Math.ceil(pageAnalysis.wordCount / 200),
      lastModified: new Date().toISOString()
    },
    metaTags
  };
}

function optimizeTitle(title: string, primaryKeyword?: string): string {
  let optimized = title.trim();
  
  // Ensure title is under 60 characters
  if (optimized.length > 57) {
    optimized = optimized.substring(0, 57) + '...';
  }
  
  // Add primary keyword if not already present and space allows
  if (primaryKeyword && !optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    const withKeyword = `${optimized} | ${primaryKeyword}`;
    if (withKeyword.length <= 60) {
      optimized = withKeyword;
    }
  }
  
  return optimized;
}

function optimizeDescription(description: string, keywords: string[]): string {
  let optimized = description.trim();
  
  // Ensure description is under 160 characters
  if (optimized.length > 157) {
    optimized = optimized.substring(0, 157) + '...';
  }
  
  // Try to naturally include keywords if space allows
  keywords.forEach(keyword => {
    if (!optimized.toLowerCase().includes(keyword.toLowerCase()) && 
        optimized.length + keyword.length + 2 <= 157) {
      optimized += ` ${keyword}`;
    }
  });
  
  return optimized;
}

function generateStructuredData(
  pageAnalysis: any,
  processedContent: any,
  title: string,
  description: string,
  category: string
): Record<string, any>[] {
  const structuredData = [];

  // Base Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": category === 'tutorial' ? "TechArticle" : "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "The Boring Dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Boring Dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://theboringdev.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "wordCount": pageAnalysis.wordCount,
    "inLanguage": "en-US"
  };

  structuredData.push(articleSchema);

  // FAQ Schema if FAQ section present
  if (pageAnalysis.hasFAQSection && processedContent?.faqs) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": processedContent.faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    structuredData.push(faqSchema);
  }

  // HowTo Schema for tutorials
  if (category === 'tutorial' && processedContent?.sections) {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title,
      "description": description,
      "step": processedContent.sections.map((section: any, index: number) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": section.heading || `Step ${index + 1}`,
        "text": section.content || ''
      }))
    };
    structuredData.push(howToSchema);
  }

  return structuredData;
}

function optimizePageForSEO(
  pageContent: string,
  seoMetadata: SEOMetadata,
  pageAnalysis: any
): string {
  console.log('⚡ Optimizing page content for SEO and performance...');

  let optimizedContent = pageContent;

  // Add/update meta tags in head section
  const metaTagsHTML = generateMetaTagsHTML(seoMetadata);
  
  // Find or create head section
  if (optimizedContent.includes('</style>')) {
    optimizedContent = optimizedContent.replace(
      '</style>',
      `</style>\n\n${metaTagsHTML}`
    );
  } else {
    optimizedContent = metaTagsHTML + '\n\n' + optimizedContent;
  }

  // Optimize images for performance
  optimizedContent = optimizeImages(optimizedContent, pageAnalysis);

  // Add structured data
  const structuredDataHTML = `<script type="application/ld+json">
${JSON.stringify(seoMetadata.jsonLd, null, 2)}
</script>`;

  optimizedContent += '\n\n' + structuredDataHTML;

  // Add canonical URL if not present
  if (!optimizedContent.includes('rel="canonical"')) {
    const canonicalURL = `<link rel="canonical" href="https://theboringdev.com/articles/${pageAnalysis.slug || 'article'}" />`;
    optimizedContent = metaTagsHTML.replace(
      '<meta name="viewport"',
      `${canonicalURL}\n<meta name="viewport"`
    );
  }

  return optimizedContent;
}

function generateMetaTagsHTML(seoMetadata: SEOMetadata): string {
  const metaTags = [];
  
  // Essential meta tags
  metaTags.push(`<title>${seoMetadata.title}</title>`);
  metaTags.push(`<meta name="description" content="${seoMetadata.description}" />`);
  
  // Additional meta tags
  Object.entries(seoMetadata.metaTags).forEach(([name, content]) => {
    metaTags.push(`<meta name="${name}" content="${content}" />`);
  });

  // Open Graph tags
  Object.entries(seoMetadata.openGraph).forEach(([property, content]) => {
    metaTags.push(`<meta property="${property}" content="${content}" />`);
  });

  // Twitter Card tags
  metaTags.push('<meta name="twitter:card" content="summary_large_image" />');
  metaTags.push(`<meta name="twitter:title" content="${seoMetadata.title}" />`);
  metaTags.push(`<meta name="twitter:description" content="${seoMetadata.description}" />`);

  return metaTags.join('\n');
}

function optimizeImages(pageContent: string, pageAnalysis: any): string {
  let optimized = pageContent;

  // Add lazy loading to images (except first image which might be above fold)
  const imageRegex = /<img([^>]*)>/gi;
  let imageCount = 0;
  
  optimized = optimized.replace(imageRegex, (match, attributes) => {
    imageCount++;
    
    // First image (likely above fold) shouldn't be lazy loaded
    if (imageCount === 1) {
      if (!attributes.includes('loading=')) {
        return `<img${attributes} loading="eager">`;
      }
    } else {
      // All other images should be lazy loaded
      if (!attributes.includes('loading=')) {
        return `<img${attributes} loading="lazy">`;
      }
    }
    
    return match;
  });

  return optimized;
}

function calculatePerformanceMetrics(
  pageContent: string,
  pageAnalysis: any,
  seoMetadata: SEOMetadata
): Record<string, any> {
  const metrics = {
    contentSize: pageContent.length,
    imageCount: pageAnalysis.images.length,
    lazyLoadedImages: pageAnalysis.images.filter((img: any) => img.hasLazyLoading).length,
    externalLinks: pageAnalysis.links.filter((link: any) => link.isExternal).length,
    internalLinks: pageAnalysis.links.filter((link: any) => !link.isExternal).length,
    structuredDataSchemas: seoMetadata.jsonLd.length,
    readingTime: Math.ceil(pageAnalysis.wordCount / 200),
    seoScore: calculateSEOScore(seoMetadata, pageAnalysis),
    overallScore: 0
  };

  // Calculate overall performance score
  let score = 100;
  
  // Deduct for large content size
  if (metrics.contentSize > 100000) score -= 10;
  
  // Deduct for images without alt text
  const imagesWithoutAlt = pageAnalysis.images.filter((img: any) => !img.hasAlt).length;
  score -= imagesWithoutAlt * 5;
  
  // Bonus for structured data
  score += metrics.structuredDataSchemas * 5;
  
  // Bonus for proper heading structure
  if (pageAnalysis.headingStructure.isValid) score += 10;
  
  metrics.overallScore = Math.max(0, Math.min(100, score));
  
  return metrics;
}

function calculateSEOScore(seoMetadata: SEOMetadata, pageAnalysis: any): number {
  let score = 0;
  const maxScore = 100;

  // Title optimization (20 points)
  if (seoMetadata.title.length > 0 && seoMetadata.title.length <= 60) score += 20;
  else if (seoMetadata.title.length > 60) score += 10;

  // Description optimization (20 points)
  if (seoMetadata.description.length >= 120 && seoMetadata.description.length <= 160) score += 20;
  else if (seoMetadata.description.length > 0) score += 10;

  // Heading structure (20 points)
  if (pageAnalysis.headingStructure.isValid) score += 20;
  else score += 5;

  // Structured data (20 points)
  score += Math.min(20, seoMetadata.jsonLd.length * 10);

  // Image optimization (10 points)
  const imagesWithAlt = pageAnalysis.images.filter((img: any) => img.hasAlt).length;
  if (pageAnalysis.images.length > 0) {
    score += (imagesWithAlt / pageAnalysis.images.length) * 10;
  } else {
    score += 5; // Bonus for no images if content doesn't need them
  }

  // Performance optimization (10 points)
  const lazyImages = pageAnalysis.images.filter((img: any) => img.hasLazyLoading).length;
  if (pageAnalysis.images.length > 1) {
    score += (lazyImages / (pageAnalysis.images.length - 1)) * 10;
  } else {
    score += 10; // Bonus if few/no images
  }

  return Math.round(Math.min(maxScore, score));
}