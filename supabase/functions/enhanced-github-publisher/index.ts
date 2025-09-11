import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeploymentResult {
  success: boolean;
  live_url?: string;
  netlify_deploy_id?: string;
  github_commit_sha?: string;
  verification_results?: any;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const githubToken = Deno.env.get('GITHUB_API_TOKEN')!;
    const repoOwner = Deno.env.get('GITHUB_REPO_OWNER')!;
    const repoName = Deno.env.get('GITHUB_REPO_NAME')!;
    const netlifyBuildHook = Deno.env.get('NETLIFY_BUILD_HOOK')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🚀 Starting Enhanced GitHub Publisher...');

    // Find content approved for publishing
    const { data: approvedContent, error: fetchError } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .eq('status', 'approved_for_publishing')
      .order('updated_at', { ascending: true })
      .limit(3); // Process in smaller batches

    if (fetchError) {
      console.error('Error fetching approved content:', fetchError);
      throw fetchError;
    }

    if (!approvedContent || approvedContent.length === 0) {
      console.log('No content ready for publishing');
      return new Response(JSON.stringify({ 
        message: 'No content ready for publishing',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const content of approvedContent) {
      console.log(`📝 Publishing content: ${content.content_id}`);
      
      try {
        // Get the generated page for this content
        const { data: generatedPage } = await supabase
          .from('generated_pages')
          .select('*')
          .eq('content_id', content.content_id)
          .single();

        if (!generatedPage) {
          console.log(`No generated page found for ${content.content_id}`);
          continue;
        }

        // Create deployment batch
        const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const { data: batchRecord } = await supabase
          .from('deployment_batches')
          .insert({
            batch_id: batchId,
            batch_status: 'processing',
            content_ids: [content.content_id],
            deployment_started_at: new Date().toISOString()
          })
          .select()
          .single();

        // Publish to GitHub and trigger deployment
        const deploymentResult = await publishToGitHubAndDeploy(
          content, 
          generatedPage, 
          githubToken, 
          repoOwner, 
          repoName, 
          netlifyBuildHook,
          batchId
        );

        if (deploymentResult.success) {
          // Wait for deployment to complete and verify
          console.log(`⏳ Waiting for deployment verification for ${content.content_id}...`);
          
          // Wait a bit for build to start
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          // Verify deployment
          const verificationResult = await verifyDeployment(deploymentResult.live_url!);
          
          if (verificationResult.accessible) {
            // Update content status to live
            await supabase
              .from('zuhu_content_processing')
              .update({ 
                status: 'live',
                updated_at: new Date().toISOString()
              })
              .eq('content_id', content.content_id);

            // Update generated page
            await supabase
              .from('generated_pages')
              .update({ 
                status: 'live',
                updated_at: new Date().toISOString()
              })
              .eq('content_id', content.content_id);

            // Update batch status
            await supabase
              .from('deployment_batches')
              .update({
                batch_status: 'completed',
                deployment_completed_at: new Date().toISOString(),
                published_urls: [deploymentResult.live_url],
                netlify_deploy_id: deploymentResult.netlify_deploy_id,
                github_commit_sha: deploymentResult.github_commit_sha
              })
              .eq('batch_id', batchId);

            // Log successful transition
            await supabase
              .from('zuhu_status_transitions')
              .insert({
                content_id: content.content_id,
                from_status: 'approved_for_publishing',
                to_status: 'live',
                agent_name: 'enhanced-github-publisher',
                metadata: { 
                  live_url: deploymentResult.live_url,
                  deploy_id: deploymentResult.netlify_deploy_id,
                  commit_sha: deploymentResult.github_commit_sha,
                  batch_id: batchId,
                  verification: verificationResult
                }
              });

            console.log(`✅ Successfully published ${content.content_id} to ${deploymentResult.live_url}`);
            
            results.push({
              content_id: content.content_id,
              success: true,
              live_url: deploymentResult.live_url,
              deploy_id: deploymentResult.netlify_deploy_id
            });

          } else {
            throw new Error(`Deployment verification failed for ${deploymentResult.live_url}`);
          }

        } else {
          throw new Error(deploymentResult.error || 'Deployment failed');
        }

      } catch (contentError) {
        console.error(`Error publishing ${content.content_id}:`, contentError);
        
        // Mark as failed
        await supabase
          .from('zuhu_content_processing')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
            error_logs: [{
              timestamp: new Date().toISOString(),
              agent: 'enhanced-github-publisher',
              message: 'Publishing failed',
              error: contentError.message
            }]
          })
          .eq('content_id', content.content_id);

        results.push({
          content_id: content.content_id,
          success: false,
          error: contentError.message
        });
      }
    }

    console.log(`✅ Enhanced GitHub Publisher completed. Processed ${results.length} items`);

    return new Response(JSON.stringify({
      message: 'Publishing process completed',
      processed: results.length,
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced GitHub Publisher error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Publishing process failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function publishToGitHubAndDeploy(
  content: any, 
  generatedPage: any, 
  githubToken: string,
  repoOwner: string, 
  repoName: string, 
  netlifyBuildHook: string,
  batchId: string
): Promise<DeploymentResult> {
  
  try {
    const metadata = generatedPage.page_metadata;
    
    // Generate proper file structure
    const category = metadata?.category || 'General';
    const title = metadata?.title || 'Untitled';
    
    // Create clean slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Generate React component
    const componentName = slug.split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const componentContent = generateReactComponent(generatedPage, componentName, metadata);
    
    // Create file in GitHub
    const filePath = `src/pages/${componentName}.tsx`;
    
    console.log(`📁 Creating file: ${filePath}`);
    
    // Check if file exists
    const checkResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let sha: string | undefined;
    if (checkResponse.ok) {
      const fileData = await checkResponse.json();
      sha = fileData.sha;
      console.log(`📝 File exists, will update with sha: ${sha}`);
    }

    // Create/Update file
    const createResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add/Update article: ${title} (Batch: ${batchId})`,
          content: btoa(componentContent),
          ...(sha && { sha })
        }),
      }
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`GitHub API error: ${createResponse.status} - ${errorText}`);
    }

    const createResult = await createResponse.json();
    const commitSha = createResult.commit.sha;
    
    console.log(`✅ File created/updated with commit: ${commitSha}`);

    // Update articles registry
    await updateArticlesRegistry(
      githubToken, 
      repoOwner, 
      repoName, 
      category, 
      slug, 
      componentName, 
      metadata,
      batchId
    );

    // Trigger Netlify build
    console.log('🚀 Triggering Netlify deployment...');
    const netlifyResponse = await fetch(netlifyBuildHook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        trigger_title: `Deploy ${title}`,
        trigger_branch: 'main'
      })
    });

    if (!netlifyResponse.ok) {
      throw new Error(`Netlify build trigger failed: ${netlifyResponse.status}`);
    }

    const netlifyResult = await netlifyResponse.text();
    console.log('Netlify build triggered:', netlifyResult);

    // Generate live URL
    const liveUrl = `https://theboringdev.com/${category.toLowerCase().replace(/\s+/g, '-')}/${slug}`;

    return {
      success: true,
      live_url: liveUrl,
      github_commit_sha: commitSha,
      netlify_deploy_id: netlifyResult || 'unknown'
    };

  } catch (error) {
    console.error('Deployment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function updateArticlesRegistry(
  githubToken: string,
  repoOwner: string, 
  repoName: string,
  category: string,
  slug: string,
  componentName: string,
  metadata: any,
  batchId: string
) {
  try {
    console.log('📋 Updating articles registry...');
    
    // Get current articles.ts file
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/data/articles.ts`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.error('Could not fetch articles.ts');
      return;
    }

    const fileData = await response.json();
    const currentContent = atob(fileData.content);
    
    // Parse and update the registry
    const newEntry = {
      slug,
      component: componentName,
      title: metadata?.title || 'Untitled',
      publishDate: new Date().toISOString().split('T')[0],
      category,
      description: metadata?.description || 'Auto-generated article description',
      readTime: `${metadata?.readingTime || 1} min`,
      url: `/${category}/${slug}`,
      assetsCount: {
        images: metadata?.seo?.imageCount || 0,
        videos: 0,
        tables: 0,
        charts: 0,
        code_snippets: 0
      }
    };

    // Simple string replacement to add the new entry
    const categoryKey = `"${category}"`;
    const entryString = JSON.stringify(newEntry, null, 6).replace(/^/gm, '    ');
    
    let updatedContent = currentContent;
    if (currentContent.includes(`${categoryKey}: [`)) {
      // Add to existing category
      updatedContent = currentContent.replace(
        new RegExp(`(${categoryKey}:\\s*\\[)`),
        `$1\n${entryString},`
      );
    } else {
      // Add new category
      const categorySection = `  ${categoryKey}: [\n${entryString}\n  ],`;
      updatedContent = currentContent.replace(
        /^export const ARTICLE_REGISTRY/m,
        `${categorySection}\n\nexport const ARTICLE_REGISTRY`
      );
    }

    // Update the file
    await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/data/articles.ts`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update articles registry for ${metadata?.title} (Batch: ${batchId})`,
          content: btoa(updatedContent),
          sha: fileData.sha
        }),
      }
    );

    console.log('✅ Articles registry updated');

  } catch (error) {
    console.error('Error updating articles registry:', error);
  }
}

function generateReactComponent(generatedPage: any, componentName: string, metadata: any): string {
  const title = metadata?.title || 'Untitled';
  const description = metadata?.description || '';
  const category = metadata?.category || 'General';
  
  return `import React from 'react';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <Helmet>
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content="${new Date().toISOString().split('T')[0]}" />
        <meta name="article:section" content="${category.toLowerCase()}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${title}",
              "author": {"name": "futureopsTeam"},
              "datePublished": "${new Date().toISOString().split('T')[0]}"
            })
          }}
        />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">${title}</h1>
            <p className="text-xl text-muted-foreground">${description}</p>
          </header>
          
          <div className="prose prose-lg max-w-none">
            ${generateContentFromPageData(generatedPage.page_content)}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default ${componentName};`;
}

function generateContentFromPageData(pageContent: string): string {
  // Convert the page content to JSX-friendly format
  return pageContent
    .replace(/<title>.*?<\/title>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/className=/g, 'className=')
    .replace(/style="/g, 'style={{')
    .replace(/"/g, '""')
    .replace(/{{/g, '{')
    .replace(/}}/g, '}')
    || '<p>Content coming soon...</p>';
}

async function verifyDeployment(url: string): Promise<{ accessible: boolean; response_time?: number }> {
  try {
    console.log(`🔍 Verifying deployment: ${url}`);
    
    const startTime = Date.now();
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    const responseTime = Date.now() - startTime;

    const accessible = response.ok;
    
    console.log(`✅ Verification result: ${accessible ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`);
    
    return {
      accessible,
      response_time: responseTime
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { accessible: false };
  }
}