import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubFileCleanupInput {
  files_to_delete: string[];
  commit_message?: string;
}

async function deleteGitHubFile(owner: string, repo: string, filePath: string, token: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting file: ${filePath}`);
    
    // First, get the file to obtain its SHA
    const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!getFileResponse.ok) {
      if (getFileResponse.status === 404) {
        console.log(`✅ File ${filePath} already doesn't exist`);
        return true;
      }
      throw new Error(`Failed to get file ${filePath}: ${getFileResponse.status}`);
    }

    const fileData = await getFileResponse.json();
    const sha = fileData.sha;

    // Delete the file
    const deleteResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `🧹 Delete corrupted file: ${filePath}`,
        sha: sha,
        branch: 'main'
      })
    });

    if (deleteResponse.ok) {
      console.log(`✅ Successfully deleted: ${filePath}`);
      return true;
    } else {
      const errorText = await deleteResponse.text();
      console.error(`❌ Failed to delete ${filePath}:`, errorText);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error deleting ${filePath}:`, error);
    return false;
  }
}

async function processFileCleanup(input: GitHubFileCleanupInput) {
  console.log('🧹 GitHub File Cleanup - Starting...');
  
  const githubToken = Deno.env.get('GITHUB_API_TOKEN');
  const owner = Deno.env.get('GITHUB_REPO_OWNER');
  const repo = Deno.env.get('GITHUB_REPO_NAME');
  
  if (!githubToken || !owner || !repo) {
    throw new Error('Missing GitHub configuration');
  }

  console.log(`📂 Repository: ${owner}/${repo}`);
  console.log(`📋 Files to delete: ${input.files_to_delete.length}`);

  const results = {
    success: true,
    deleted_files: [] as string[],
    failed_files: [] as string[],
    total_processed: input.files_to_delete.length
  };

  for (const filePath of input.files_to_delete) {
    const success = await deleteGitHubFile(owner, repo, filePath, githubToken);
    
    if (success) {
      results.deleted_files.push(filePath);
    } else {
      results.failed_files.push(filePath);
      results.success = false;
    }
  }

  console.log(`✅ Deleted: ${results.deleted_files.length}`);
  console.log(`❌ Failed: ${results.failed_files.length}`);

  return results;
}

serve(async (req) => {
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
    const body = await req.json();
    console.log('GitHub File Cleanup received request');

    if (!body.files_to_delete || !Array.isArray(body.files_to_delete)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'files_to_delete array is required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await processFileCleanup(body as GitHubFileCleanupInput);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('GitHub File Cleanup error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: `Cleanup failed: ${error.message}`
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});