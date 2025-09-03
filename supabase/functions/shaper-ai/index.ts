import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input interface from AI Coder Agent
interface ShaperAIInput {
  component: string;
  metadata: {
    component_name: string;
    route_slug: string;
    category: string;
    title: string;
    description: string;
    publish_date: string;
    read_time: string;
    assets_count: {
      images: number;
      videos: number;
      tables: number;
      charts: number;
      code_snippets: number;
    };
  };
}

// Output interface
interface ShaperAIOutput {
  success: boolean;
  files_created: Array<{
    path: string;
    content: string;
    size_kb: number;
    status: 'created' | 'updated';
  }>;
  routes_updated: Array<{
    file: string;
    route: string;
    component: string;
    status: 'added';
  }>;
  registry_updated: {
    category: string;
    total_articles: number;
    new_entry: ArticleRegistryEntry;
  };
  validation: {
    naming_conflicts: boolean;
    route_conflicts: boolean;
    typescript_valid: boolean;
    component_imports_valid: boolean;
  };
  deployment_ready: boolean;
}

interface ArticleRegistryEntry {
  slug: string;
  component: string;
  title: string;
  publishDate: string;
  category: string;
  description: string;
  readTime: string;
  url: string;
  assetsCount: {
    images: number;
    videos: number;
    tables: number;
    charts: number;
    code_snippets: number;
  };
}

// Validation functions
function validateInput(input: any): { valid: boolean; data?: ShaperAIInput; error?: string } {
  try {
    // Handle string input (JSON)
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }

    // Validate required fields
    if (!input.component || typeof input.component !== 'string') {
      return { valid: false, error: 'Missing or invalid component field' };
    }

    if (!input.metadata || typeof input.metadata !== 'object') {
      return { valid: false, error: 'Missing or invalid metadata field' };
    }

    const meta = input.metadata;
    const required = ['component_name', 'route_slug', 'category', 'title', 'description', 'publish_date', 'read_time'];
    
    for (const field of required) {
      if (!meta[field] || typeof meta[field] !== 'string') {
        return { valid: false, error: `Missing or invalid metadata.${field}` };
      }
    }

    // Validate assets_count
    if (!meta.assets_count || typeof meta.assets_count !== 'object') {
      meta.assets_count = { images: 0, videos: 0, tables: 0, charts: 0, code_snippets: 0 };
    }

    return { valid: true, data: input as ShaperAIInput };
  } catch (error) {
    return { valid: false, error: `Input validation failed: ${error.message}` };
  }
}

function validateComponentName(name: string): boolean {
  // Must be PascalCase and valid React component name
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  return pascalCaseRegex.test(name) && !name.includes(' ');
}

function validateRouteSlug(slug: string): boolean {
  // Must be kebab-case URL friendly
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return kebabCaseRegex.test(slug);
}

function enhanceComponent(component: string, metadata: ShaperAIInput['metadata']): string {
  // Remove any existing imports to avoid duplicates
  let enhancedComponent = component.replace(/^import.*from.*["'].*["'];?\n?/gm, '');
  
  // Add standardized imports
  const imports = `import { NewHeader } from "@/components/NewHeader";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
`;

  // Add SEO meta tags if not present
  const seoTags = `<Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content="{metadata.description}" />
        <meta property="og:title" content="{metadata.title}" />
        <meta property="og:description" content="{metadata.description}" />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content="{metadata.publish_date}" />
        <meta name="article:section" content="{metadata.category}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{metadata.title}" />
        <meta name="twitter:description" content="{metadata.description}" />
      </Helmet>`;

  // Inject SEO tags into component if not present
  if (!enhancedComponent.includes('<Helmet>')) {
    enhancedComponent = enhancedComponent.replace(
      /(<NewHeader\s*\/>)/,
      `$1\n      ${seoTags}`
    );
  }

  // Ensure responsive classes are applied
  if (!enhancedComponent.includes('min-h-screen')) {
    enhancedComponent = enhancedComponent.replace(
      /<div className="([^"]*)">/,
      '<div className="min-h-screen bg-background $1">'
    );
  }

  return imports + enhancedComponent;
}

function generateAppRouteEntry(metadata: ShaperAIInput['metadata']): string {
  return `<Route path="/${metadata.category}/${metadata.route_slug}" element={<${metadata.component_name} />} />`;
}

function generateArticleRegistryEntry(metadata: ShaperAIInput['metadata']): ArticleRegistryEntry {
  return {
    slug: metadata.route_slug,
    component: metadata.component_name,
    title: metadata.title,
    publishDate: metadata.publish_date,
    category: metadata.category,
    description: metadata.description,
    readTime: metadata.read_time,
    url: `/${metadata.category}/${metadata.route_slug}`,
    assetsCount: metadata.assets_count,
  };
}

function generateRegistryFile(newEntry: ArticleRegistryEntry): string {
  return `// Auto-generated article registry
// This file is managed by Shaper AI - do not edit manually

export interface ArticleEntry {
  slug: string;
  component: string;
  title: string;
  publishDate: string;
  category: string;
  description: string;
  readTime: string;
  url: string;
  assetsCount: {
    images: number;
    videos: number;
    tables: number;
    charts: number;
    code_snippets: number;
  };
}

export const ARTICLE_REGISTRY: Record<string, ArticleEntry[]> = {
  'ai-automation': [],
  'ai-news': [],
  'tool-comparisons': [],
  'builder-stories': [],
  'ai-reality-check': [],
  'trending-opportunities': [],
  '${newEntry.category}': [
    ${JSON.stringify(newEntry, null, 4)}
  ],
};

export function getArticleBySlug(category: string, slug: string): ArticleEntry | undefined {
  return ARTICLE_REGISTRY[category]?.find(article => article.slug === slug);
}

export function getAllArticles(): ArticleEntry[] {
  return Object.values(ARTICLE_REGISTRY).flat();
}

export function getArticlesByCategory(category: string): ArticleEntry[] {
  return ARTICLE_REGISTRY[category] || [];
}
`;
}

async function processInput(input: ShaperAIInput): Promise<ShaperAIOutput> {
  const { component, metadata } = input;

  console.log('Processing Shaper AI input:', { 
    componentName: metadata.component_name, 
    category: metadata.category,
    slug: metadata.route_slug 
  });

  // Step 1: Validation
  const validation = {
    naming_conflicts: false, // TODO: Implement conflict detection
    route_conflicts: false,  // TODO: Implement route conflict detection
    typescript_valid: true,  // Assume valid for now
    component_imports_valid: true // Assume valid for now
  };

  if (!validateComponentName(metadata.component_name)) {
    validation.typescript_valid = false;
    throw new Error(`Invalid component name: ${metadata.component_name}`);
  }

  if (!validateRouteSlug(metadata.route_slug)) {
    throw new Error(`Invalid route slug: ${metadata.route_slug}`);
  }

  // Step 2: Enhance component
  const enhancedComponent = enhanceComponent(component, metadata);
  
  // Step 3: Generate files
  const componentPath = `src/pages/${metadata.component_name}.tsx`;
  const registryPath = `src/data/articles.ts`;
  
  const registryEntry = generateArticleRegistryEntry(metadata);
  const registryContent = generateRegistryFile(registryEntry);
  
  const files_created = [
    {
      path: componentPath,
      content: enhancedComponent,
      size_kb: Math.round(enhancedComponent.length / 1024 * 100) / 100,
      status: 'created' as const
    },
    {
      path: registryPath,
      content: registryContent,
      size_kb: Math.round(registryContent.length / 1024 * 100) / 100,
      status: 'created' as const
    }
  ];

  // Step 4: Route update info
  const routes_updated = [
    {
      file: 'src/App.tsx',
      route: `/${metadata.category}/${metadata.route_slug}`,
      component: metadata.component_name,
      status: 'added' as const
    }
  ];

  // Step 5: Registry update info  
  const registry_updated = {
    category: metadata.category,
    total_articles: 1, // Will be updated by GitHub Publisher
    new_entry: registryEntry
  };

  const result: ShaperAIOutput = {
    success: true,
    files_created,
    routes_updated,
    registry_updated,
    validation,
    deployment_ready: validation.typescript_valid && validation.component_imports_valid
  };

  console.log('Shaper AI processing completed successfully');
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const body = await req.text();
    console.log('Shaper AI received request:', body);

    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
      console.error('Shaper AI validation error:', validation.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validation.error,
          code: 'VALIDATION_ERROR'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process the validated input
    const result = await processInput(validation.data!);
    
    console.log('Shaper AI success:', { 
      filesCreated: result.files_created.length,
      deploymentReady: result.deployment_ready 
    });

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Shaper AI error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        code: 'PROCESSING_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});