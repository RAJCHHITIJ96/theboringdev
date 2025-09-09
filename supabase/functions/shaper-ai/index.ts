import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Validation functions
function validateInput(input: any): { valid: boolean; data?: ShaperAIInput; error?: string } {
  try {
    console.log('🔍 Validating Shaper AI input:', typeof input);
    
    // Handle string input (JSON)
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }

    // Handle AI Coder Agent output format
    // AI Coder Agent sends: { success: true, component: "...", metadata: {...}, message: "..." }
    // Shaper AI expects: { component: "...", metadata: {...} }
    let processedInput = input;
    
    if (input.success !== undefined && input.component && input.metadata) {
      console.log('🔄 Detected AI Coder Agent format, extracting component and metadata...');
      
      if (!input.success) {
        return { valid: false, error: `AI Coder failed: ${input.error || 'Unknown error'}` };
      }
      
      processedInput = {
        component: input.component,
        metadata: input.metadata
      };
      console.log('✅ AI Coder output transformed for Shaper AI compatibility');
    }

    // Validate required fields
    if (!processedInput.component || typeof processedInput.component !== 'string') {
      return { valid: false, error: 'Missing or invalid component field' };
    }

    if (!processedInput.metadata || typeof processedInput.metadata !== 'object') {
      return { valid: false, error: 'Missing or invalid metadata field' };
    }

    const meta = processedInput.metadata;
    const required = ['component_name', 'route_slug', 'category', 'title', 'description', 'publish_date', 'read_time'];
    
    for (const field of required) {
      if (!meta[field] || typeof meta[field] !== 'string') {
        return { valid: false, error: `Missing or invalid metadata.${field}` };
      }
    }

    // Validate assets_count structure
    if (!meta.assets_count || typeof meta.assets_count !== 'object') {
      meta.assets_count = { images: 0, videos: 0, tables: 0, charts: 0, code_snippets: 0 };
    }

    console.log('✅ Shaper AI input validation successful');
    return { valid: true, data: processedInput as ShaperAIInput };
  } catch (error) {
    console.error('❌ Shaper AI input validation failed:', error);
    return { valid: false, error: `Input validation failed: ${error.message}` };
  }
}

function validateComponentName(name: string): boolean {
  // Must be PascalCase and valid React component name
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  
  // Check length limits for Windows compatibility
  if (name.length > 50) {
    console.warn(`Component name too long (${name.length} chars): ${name.substring(0, 50)}...`);
    return false;
  }
  
  return pascalCaseRegex.test(name) && !name.includes(' ');
}

function validateRouteSlug(slug: string): boolean {
  // Must be kebab-case URL friendly
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  
  // Check length limits for URLs
  if (slug.length > 100) {
    console.warn(`Route slug too long (${slug.length} chars): ${slug.substring(0, 50)}...`);
    return false;
  }
  
  return kebabCaseRegex.test(slug);
}

// Windows filename validation
function validateWindowsFilename(filename: string): { valid: boolean; error?: string; suggested?: string } {
  // Windows path length limit (including full path)
  const MAX_PATH_LENGTH = 200; // Conservative limit
  const fullPath = `src/pages/${filename}.tsx`;
  
  if (fullPath.length > MAX_PATH_LENGTH) {
    // Generate a shortened version
    const baseName = filename.substring(0, 30);
    const hash = filename.slice(-8); // Keep last 8 chars for uniqueness
    const suggested = `${baseName}_${hash}`;
    
    return {
      valid: false,
      error: `Filename too long for Windows (${fullPath.length} chars). Windows limit is ~260 characters.`,
      suggested: suggested
    };
  }
  
  // Check for invalid Windows characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/g;
  if (invalidChars.test(filename)) {
    return {
      valid: false,
      error: 'Filename contains invalid Windows characters: < > : " | ? *'
    };
  }
  
  return { valid: true };
}

// JSX repair function to fix malformed JSX
function repairMalformedJSX(component: string): string {
  console.log('🔧 Repairing malformed JSX...');
  
  let repairedComponent = component;
  
  // Fix #1: Close unclosed img tags
  repairedComponent = repairedComponent.replace(
    /<img([^>]*?)(?<!\/)\s*\n\s*(?=<[^/])/g, 
    '<img$1 />\n\n          '
  );
  
  // Fix #2: Close unclosed self-closing tags
  repairedComponent = repairedComponent.replace(
    /<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)\s*\n\s*(?=<[^/])/g,
    '<$1$2 />\n\n          '
  );
  
  // Fix #3: Remove duplicate closing tags
  repairedComponent = repairedComponent.replace(
    /\/>\s*(loading="lazy")\s*\/>/g,
    ' $1 />'
  );
  
  // Fix #4: Ensure proper img tag closure
  repairedComponent = repairedComponent.replace(
    /className="w-full h-auto rounded-lg shadow-lg"\s*\n\s*<div/g,
    'className="w-full h-auto rounded-lg shadow-lg"\n              loading="lazy"\n            />\n          </div>\n\n          <div'
  );
  
  console.log('✅ JSX repaired successfully');
  return repairedComponent;
}

// JSX validation function
function validateJSX(component: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unclosed img tags
  const unclosedImgRegex = /<img[^>]*(?<!\/)\s*\n\s*</g;
  if (unclosedImgRegex.test(component)) {
    errors.push('Found unclosed img tags');
  }
  
  // Check for malformed self-closing tags
  const malformedSelfClosing = /<(img|br|hr|input|meta|link)[^>]*(?<!\/)\s*\n\s*</g;
  if (malformedSelfClosing.test(component)) {
    errors.push('Found malformed self-closing tags');
  }
  
  // Check for duplicate attributes
  const duplicateAttrs = /(\w+)=["'][^"']*["']\s+\1=/g;
  if (duplicateAttrs.test(component)) {
    errors.push('Found duplicate attributes');
  }
  
  // Check for common JSX syntax issues
  if (component.includes('className="w-full h-auto rounded-lg shadow-lg"\n\n          <div')) {
    errors.push('Found unclosed img tag before div');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

function enhanceComponent(component: string, metadata: ShaperAIInput['metadata']): string {
  console.log('🔧 Enhancing component with JSX validation and repair...');
  
  // Step 1: Validate incoming JSX
  const validation = validateJSX(component);
  
  if (!validation.isValid) {
    console.warn('⚠️ Malformed JSX detected:', validation.errors);
    
    // Step 2: Attempt to repair JSX
    component = repairMalformedJSX(component);
    
    // Step 3: Re-validate after repair
    const revalidation = validateJSX(component);
    if (!revalidation.isValid) {
      console.error('❌ JSX repair failed:', revalidation.errors);
      throw new Error(`JSX validation failed after repair: ${revalidation.errors.join(', ')}`);
    }
    
    console.log('✅ JSX successfully repaired');
  }
  
  // Step 4: Safe enhancement (minimal changes to avoid corruption)
  let enhancedComponent = component;
  
  // Only fix import issues if needed (safer approach)
  if (enhancedComponent.includes('{ NewHeader }') && !enhancedComponent.includes('import NewHeader from')) {
    enhancedComponent = enhancedComponent.replace(
      /import { NewHeader } from "@\/components\/NewHeader";/,
      'import NewHeader from "@/components/NewHeader";'
    );
  }
  
  // Add standardized imports with correct default import syntax (only if missing)
  if (!enhancedComponent.includes('import React from')) {
    const imports = `import React from 'react';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

`;
    enhancedComponent = imports + enhancedComponent;
  }

  // Fix JSON-LD schema generation to prevent build errors (safer replacement)
  const jsonLdScript = `<script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "${metadata.title}",
            "author": {"name": "futureopsTeam"},
            "datePublished": "${metadata.publish_date}"
          })
        }}
      />`;

  enhancedComponent = enhancedComponent.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    jsonLdScript
  );

  // Add SEO meta tags if not present  
  const seoTags = `<Helmet>
        <title>${metadata.title}</title>
        <meta name="description" content="${metadata.description}" />
        <meta property="og:title" content="${metadata.title}" />
        <meta property="og:description" content="${metadata.description}" />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content="${metadata.publish_date}" />
        <meta name="article:section" content="${metadata.category}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${metadata.title}" />
        <meta name="twitter:description" content="${metadata.description}" />
      </Helmet>`;

  // Inject SEO tags into component if not present
  if (!enhancedComponent.includes('<Helmet>')) {
    enhancedComponent = enhancedComponent.replace(
      /(<NewHeader\s*\/>)/,
      `$1\n      ${seoTags}`
    );
  }

  // Ensure responsive classes are applied (safer approach)
  if (!enhancedComponent.includes('min-h-screen')) {
    enhancedComponent = enhancedComponent.replace(
      /(<div className=")([^"]*)(">)/,
      '$1min-h-screen bg-background $2$3'
    );
  }
  
  // Step 5: Final validation
  const finalValidation = validateJSX(enhancedComponent);
  if (!finalValidation.isValid) {
    throw new Error(`Final JSX validation failed: ${finalValidation.errors.join(', ')}`);
  }
  
  console.log('✅ Component enhanced successfully');
  return enhancedComponent;
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

async function updateArticlesRegistry(newEntry: ArticleRegistryEntry): Promise<string> {
  // Read existing articles.ts file
  const { data: existingFile, error: readError } = await supabase
    .storage
    .from('project-files')
    .download('src/data/articles.ts');

  let existingRegistry: Record<string, ArticleRegistryEntry[]> = {
    'ai-automation': [],
    'ai-news': [],
    'tool-comparisons': [],
    'builder-stories': [],
    'ai-reality-check': [],
    'trending-opportunities': [],
  };

  if (existingFile && !readError) {
    try {
      const content = await existingFile.text();
      // Parse existing registry (simplified parsing)
      const match = content.match(/export const ARTICLE_REGISTRY[^=]*=\s*({[^}]+})/s);
      if (match) {
        // This is a simplified approach - in production, use a proper parser
        existingRegistry = eval('(' + match[1] + ')');
      }
    } catch (error) {
      console.warn('Failed to parse existing registry, using default:', error);
    }
  }

  // Add new entry to the appropriate category
  if (!existingRegistry[newEntry.category]) {
    existingRegistry[newEntry.category] = [];
  }
  
  // Check for duplicates
  const existingIndex = existingRegistry[newEntry.category].findIndex(
    article => article.slug === newEntry.slug
  );
  
  if (existingIndex >= 0) {
    // Update existing entry
    existingRegistry[newEntry.category][existingIndex] = newEntry;
  } else {
    // Add new entry
    existingRegistry[newEntry.category].push(newEntry);
  }

  // Generate the updated registry file
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

export const ARTICLE_REGISTRY: Record<string, ArticleEntry[]> = ${JSON.stringify(existingRegistry, null, 2)};

export function getArticleBySlug(category: string, slug: string): ArticleEntry | undefined {
  return ARTICLE_REGISTRY[category]?.find(article => article.slug === slug);
}

export function getAllArticles(): ArticleEntry[] {
  return Object.values(ARTICLE_REGISTRY).flat();
}

export function getArticlesByCategory(category: string): ArticleEntry[] {
  return ARTICLE_REGISTRY[category] || [];
}

// Category mapping for navigation
export const CATEGORY_CONFIG = {
  'ai-automation': {
    name: 'AI Automation',
    description: 'Practical AI automation strategies and tools',
    path: '/ai-automation'
  },
  'ai-news': {
    name: 'AI News',
    description: 'Latest developments in artificial intelligence',
    path: '/ai-news'
  },
  'tool-comparisons': {
    name: 'Tool Comparisons',
    description: 'In-depth comparisons of AI tools and platforms',
    path: '/tool-comparisons'
  },
  'builder-stories': {
    name: 'Builder Stories',
    description: 'Stories from AI builders and entrepreneurs',
    path: '/builder-stories'
  },
  'ai-reality-check': {
    name: 'AI Reality Check',
    description: 'Critical analysis of AI trends and claims',
    path: '/ai-reality-check'
  },
  'trending-opportunities': {
    name: 'Trending Opportunities',
    description: 'Emerging opportunities in the AI space',
    path: '/trending-opportunities'
  }
} as const;
`;
}

async function writeFileToLovable(filePath: string, content: string): Promise<boolean> {
  try {
    const githubToken = Deno.env.get('GITHUB_API_TOKEN');
    const repoOwner = Deno.env.get('GITHUB_REPO_OWNER');
    const repoName = Deno.env.get('GITHUB_REPO_NAME');
    
    if (!githubToken || !repoOwner || !repoName) {
      console.error('Missing GitHub configuration:', { 
        hasToken: !!githubToken, 
        hasOwner: !!repoOwner, 
        hasRepo: !!repoName 
      });
      return false;
    }

    console.log(`📝 Writing REAL file: ${filePath} (${Math.round(content.length / 1024)}KB)`);
    
    // Check if file exists first
    let existingSha = null;
    try {
      const getFileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      
      if (getFileResponse.ok) {
        const existingFile = await getFileResponse.json();
        existingSha = existingFile.sha;
      }
    } catch (error) {
      console.log(`    File ${filePath} doesn't exist, creating new...`);
    }

    // Create/update file via GitHub API
    const fileContent = btoa(unescape(encodeURIComponent(content))); // Base64 encode
    
    const updateFileData: any = {
      message: `🤖 Shaper AI: ${existingSha ? 'Update' : 'Add'} ${filePath}`,
      content: fileContent,
      branch: 'main'
    };
    
    if (existingSha) {
      updateFileData.sha = existingSha;
    }

    const updateFileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateFileData)
    });

    if (updateFileResponse.ok) {
      console.log(`✅ Successfully wrote ${filePath} to GitHub repository`);
      return true;
    } else {
      const errorText = await updateFileResponse.text();
      console.error(`Failed to write ${filePath}:`, updateFileResponse.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
    return false;
  }
}

async function updateAppRouting(metadata: ShaperAIInput['metadata']): Promise<boolean> {
  try {
    const githubToken = Deno.env.get('GITHUB_API_TOKEN');
    const repoOwner = Deno.env.get('GITHUB_REPO_OWNER');
    const repoName = Deno.env.get('GITHUB_REPO_NAME');
    
    if (!githubToken || !repoOwner || !repoName) {
      console.error('Missing GitHub configuration for routing update');
      return false;
    }

    console.log(`🔗 Adding REAL route: /${metadata.category}/${metadata.route_slug} -> ${metadata.component_name}`);
    
    // Get current App.tsx content
    const getAppResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/App.tsx`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!getAppResponse.ok) {
      console.error('Failed to get App.tsx:', getAppResponse.status);
      return false;
    }

    const appFile = await getAppResponse.json();
    const currentContent = atob(appFile.content);
    
    // Check if route already exists
    const routePattern = `<Route path="/${metadata.category}/:slug" element={<ArticleRenderer category="${metadata.category}" />} />`;
    
    if (currentContent.includes(routePattern)) {
      console.log('✅ Route already exists in App.tsx');
      return true;
    }
    
    // Add the route before the 404 route
    const routeToAdd = `        <Route path="/${metadata.category}/:slug" element={<ArticleRenderer category="${metadata.category}" />} />`;
    
    let updatedContent = currentContent;
    
    // Find the position to insert the route (before the NotFound route)
    const notFoundRouteIndex = updatedContent.indexOf('<Route path="*" element={<NotFound />} />');
    if (notFoundRouteIndex !== -1) {
      updatedContent = updatedContent.slice(0, notFoundRouteIndex) + 
                      routeToAdd + '\n        ' + 
                      updatedContent.slice(notFoundRouteIndex);
    } else {
      console.warn('Could not find NotFound route, appending at end');
      // Fallback: add before closing Routes tag
      const routesEndIndex = updatedContent.indexOf('</Routes>');
      if (routesEndIndex !== -1) {
        updatedContent = updatedContent.slice(0, routesEndIndex) + 
                        routeToAdd + '\n      ' + 
                        updatedContent.slice(routesEndIndex);
      }
    }

    // Update App.tsx
    const updateAppData = {
      message: `🤖 Shaper AI: Add route for ${metadata.category}/${metadata.route_slug}`,
      content: btoa(unescape(encodeURIComponent(updatedContent))),
      sha: appFile.sha,
      branch: 'main'
    };

    const updateAppResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/App.tsx`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateAppData)
    });

    if (updateAppResponse.ok) {
      console.log('✅ Successfully updated App.tsx routing');
      return true;
    } else {
      const errorText = await updateAppResponse.text();
      console.error('Failed to update App.tsx:', updateAppResponse.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('Failed to update App routing:', error);
    return false;
  }
}

// Lovable integration - write files directly to Lovable
async function writeToLovable(filePath: string, content: string): Promise<boolean> {
  try {
    const lovableApiUrl = Deno.env.get('LOVABLE_API_URL') || 'https://lovable.dev';
    const lovableToken = Deno.env.get('LOVABLE_API_TOKEN') || Deno.env.get('LOVABLE_TOKEN');
    
    if (!lovableToken) {
      console.log(`⚠️ Lovable API token not configured, skipping Lovable write for ${filePath}`);
      return false;
    }
    
    // Use Lovable's native file writing system
    const response = await fetch(`${lovableApiUrl}/api/v1/files`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${lovableToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: filePath,
        content: content
      })
    });
    
    if (!response.ok) {
      console.log(`⚠️ Lovable write failed for ${filePath} (${response.status}), falling back to GitHub only`);
      return false;
    } else {
      console.log(`✅ Successfully wrote ${filePath} to Lovable`);
      return true;
    }
  } catch (error) {
    console.log(`⚠️ Lovable integration error for ${filePath}:`, error);
    return false;
  }
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
    naming_conflicts: false,
    route_conflicts: false,
    typescript_valid: true,
    component_imports_valid: true
  };

  if (!validateComponentName(metadata.component_name)) {
    validation.typescript_valid = false;
    throw new Error(`Invalid component name: ${metadata.component_name}`);
  }

  if (!validateRouteSlug(metadata.route_slug)) {
    throw new Error(`Invalid route slug: ${metadata.route_slug}`);
  }
  
  // Windows filename validation
  const filenameValidation = validateWindowsFilename(metadata.component_name);
  if (!filenameValidation.valid) {
    if (filenameValidation.suggested) {
      console.warn(`Using suggested filename: ${filenameValidation.suggested}`);
      metadata.component_name = filenameValidation.suggested;
    } else {
      throw new Error(`Invalid filename for Windows: ${filenameValidation.error}`);
    }
  }

  // Step 2: Enhance component
  const enhancedComponent = enhanceComponent(component, metadata);
  
  // Step 3: Write actual files to the codebase
  const componentPath = `src/pages/${metadata.component_name}.tsx`;
  const registryPath = `src/data/articles.ts`;
  
  const registryEntry = generateArticleRegistryEntry(metadata);
  const registryContent = await updateArticlesRegistry(registryEntry);
  
  // Actually write files to BOTH Lovable and GitHub for dual sync
  console.log('📝 Writing component file to Lovable and GitHub...');
  
  // Write to Lovable first for immediate editor updates
  const lovableComponentWrite = await writeToLovable(componentPath, enhancedComponent);
  
  // Then write to GitHub for version control  
  const componentWritten = await writeFileToLovable(componentPath, enhancedComponent);
  
  console.log('📝 Updating articles registry in Lovable and GitHub...');
  
  // Write registry to Lovable first
  const lovableRegistryWrite = await writeToLovable(registryPath, registryContent);
  
  // Then write to GitHub
  const registryWritten = await writeFileToLovable(registryPath, registryContent);
  
  console.log('🔗 Updating App.tsx routing...');
  const routingUpdated = await updateAppRouting(metadata);
  
  if (!componentWritten || !registryWritten) {
    throw new Error('Failed to write files to the codebase');
  }

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
      status: 'updated' as const
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
    total_articles: 1,
    new_entry: registryEntry
  };

  const result: ShaperAIOutput = {
    success: true,
    files_created,
    routes_updated,
    registry_updated,
    validation,
    deployment_ready: validation.typescript_valid && validation.component_imports_valid && routingUpdated
  };

  console.log('✅ Shaper AI processing completed - Files written to codebase');
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
    console.log('Shaper AI received request for file writing');

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

    // Process the validated input and write files
    const result = await processInput(validation.data!);
    
    console.log('✅ Shaper AI success - Files written to codebase:', { 
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
    console.error('❌ Shaper AI error:', error);
    
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