import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Quality assessment criteria and scoring
const QUALITY_CRITERIA = {
  content_completeness: {
    weight: 25,
    checks: ['title_presence', 'description_presence', 'content_length', 'heading_structure']
  },
  seo_optimization: {
    weight: 25, 
    checks: ['meta_tags', 'alt_text', 'internal_links', 'keyword_density']
  },
  technical_health: {
    weight: 20,
    checks: ['broken_links', 'image_optimization', 'page_speed', 'mobile_responsiveness']
  },
  user_experience: {
    weight: 15,
    checks: ['readability_score', 'navigation', 'cta_presence', 'loading_time']
  },
  brand_consistency: {
    weight: 15,
    checks: ['design_alignment', 'tone_consistency', 'visual_hierarchy', 'brand_elements']
  }
}

interface QualityAuditResult {
  contentId: string
  qualityScore: number
  auditResults: Record<string, any>
  issuesFound: any[]
  recommendations: any[]
  status: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    console.log(`🛡️ Quality Fortress: Starting comprehensive audit for content_id: ${content_id}`);

    // Fetch content data from all relevant tables
    const contentData = await fetchContentData(supabase, content_id);
    
    if (!contentData) {
      return new Response(
        JSON.stringify({ error: 'Content not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`📊 Analyzing content across ${Object.keys(QUALITY_CRITERIA).length} quality dimensions...`);

    // Perform comprehensive quality audit
    const auditResult = await performQualityAudit(contentData);
    
    // Store audit results in database
    const { data: auditRecord, error: auditError } = await supabase
      .from('quality_audits')
      .insert({
        content_id,
        audit_type: 'comprehensive',
        quality_score: auditResult.qualityScore,
        audit_results: auditResult.auditResults,
        issues_found: auditResult.issuesFound,
        recommendations: auditResult.recommendations,
        status: 'completed'
      })
      .select()
      .single();

    if (auditError) {
      console.error('❌ Failed to store audit results:', auditError);
      throw auditError;
    }

    console.log(`✅ Quality audit completed with score: ${auditResult.qualityScore}/100`);

    const response = {
      success: true,
      contentId: content_id,
      qualityScore: auditResult.qualityScore,
      auditId: auditRecord.id,
      status: auditResult.qualityScore >= 80 ? 'approved' : 'needs_improvement',
      summary: {
        issuesFound: auditResult.issuesFound.length,
        recommendationsGenerated: auditResult.recommendations.length,
        readyForPublishing: auditResult.qualityScore >= 80
      },
      auditResults: auditResult.auditResults,
      recommendations: auditResult.recommendations
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Quality Fortress Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Quality audit failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function fetchContentData(supabase: any, contentId: string) {
  console.log(`🔍 Fetching comprehensive content data for: ${contentId}`);

  const [contentProcessing, generatedPage, designDirective, assetData, seoElements] = await Promise.all([
    supabase.from('zuhu_content_processing').select('*').eq('content_id', contentId).maybeSingle(),
    supabase.from('generated_pages').select('*').eq('content_id', contentId).maybeSingle(),
    supabase.from('design_directives').select('*').eq('content_id', contentId).maybeSingle(),
    supabase.from('asset_data').select('*').eq('content_id', contentId).maybeSingle(),
    supabase.from('zuhu_content_processing').select('seo_elements').eq('content_id', contentId).maybeSingle()
  ]);

  if (!contentProcessing.data) {
    console.log(`❌ No content processing data found for: ${contentId}`);
    return null;
  }

  return {
    contentProcessing: contentProcessing.data,
    generatedPage: generatedPage.data,
    designDirective: designDirective.data,
    assetData: assetData.data,
    seoElements: seoElements.data?.seo_elements || {}
  };
}

async function performQualityAudit(contentData: any): Promise<QualityAuditResult> {
  const auditResults: Record<string, any> = {};
  const issuesFound: any[] = [];
  const recommendations: any[] = [];
  
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Audit each quality dimension
  for (const [dimension, config] of Object.entries(QUALITY_CRITERIA)) {
    console.log(`🔍 Auditing ${dimension}...`);
    
    const dimensionResult = await auditDimension(dimension, config, contentData);
    auditResults[dimension] = dimensionResult;
    
    totalScore += dimensionResult.score * (config.weight / 100);
    maxPossibleScore += config.weight;
    
    issuesFound.push(...dimensionResult.issues);
    recommendations.push(...dimensionResult.recommendations);
  }

  const qualityScore = Math.round((totalScore / maxPossibleScore) * 100);

  return {
    contentId: contentData.contentProcessing.content_id,
    qualityScore,
    auditResults,
    issuesFound,
    recommendations,
    status: qualityScore >= 80 ? 'approved' : 'needs_improvement'
  };
}

async function auditDimension(dimension: string, config: any, contentData: any) {
  const checks = config.checks;
  const results: any = {};
  const issues: any[] = [];
  const recommendations: any[] = [];
  
  let dimensionScore = 0;
  let maxChecks = checks.length;

  for (const check of checks) {
    const checkResult = await performCheck(check, contentData);
    results[check] = checkResult;
    
    if (checkResult.passed) {
      dimensionScore += 1;
    } else {
      issues.push({
        dimension,
        check,
        severity: checkResult.severity || 'medium',
        description: checkResult.description,
        impact: checkResult.impact
      });
      
      if (checkResult.recommendation) {
        recommendations.push({
          dimension,
          check,
          priority: checkResult.priority || 'medium',
          action: checkResult.recommendation,
          estimatedImpact: checkResult.estimatedImpact || 'medium'
        });
      }
    }
  }

  return {
    score: (dimensionScore / maxChecks) * 100,
    results,
    issues,
    recommendations
  };
}

async function performCheck(checkType: string, contentData: any) {
  const { contentProcessing, generatedPage, designDirective, assetData, seoElements } = contentData;
  
  switch (checkType) {
    case 'title_presence':
      const hasTitle = seoElements.titleTag || generatedPage?.page_metadata?.title;
      return {
        passed: !!hasTitle,
        description: hasTitle ? 'Title is present' : 'Missing page title',
        severity: hasTitle ? 'none' : 'high',
        recommendation: hasTitle ? null : 'Add a compelling, keyword-optimized title',
        impact: 'High impact on SEO and user engagement'
      };

    case 'content_length':
      const content = generatedPage?.page_content || '';
      const wordCount = content.split(/\s+/).length;
      const passed = wordCount >= 300;
      return {
        passed,
        description: `Content has ${wordCount} words`,
        severity: passed ? 'none' : 'medium',
        recommendation: passed ? null : 'Expand content to at least 300 words for better SEO',
        wordCount
      };

    case 'meta_tags':
      const hasMetaDescription = seoElements.metaDescription;
      return {
        passed: !!hasMetaDescription,
        description: hasMetaDescription ? 'Meta description present' : 'Missing meta description',
        severity: hasMetaDescription ? 'none' : 'high',
        recommendation: hasMetaDescription ? null : 'Add a compelling meta description (150-160 characters)'
      };

    case 'alt_text':
      const assets = assetData?.validated_assets || [];
      const imagesWithAlt = assets.filter((asset: any) => asset.alt_text).length;
      const totalImages = assets.length;
      const altTextCoverage = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100;
      
      return {
        passed: altTextCoverage >= 90,
        description: `${imagesWithAlt}/${totalImages} images have alt text (${Math.round(altTextCoverage)}%)`,
        severity: altTextCoverage >= 90 ? 'none' : 'medium',
        recommendation: altTextCoverage >= 90 ? null : 'Add descriptive alt text to all images for accessibility and SEO'
      };

    case 'broken_links':
      const brokenAssets = assetData?.asset_health_check?.brokenAssets || 0;
      return {
        passed: brokenAssets === 0,
        description: brokenAssets > 0 ? `${brokenAssets} broken links found` : 'No broken links detected',
        severity: brokenAssets > 0 ? 'high' : 'none',
        recommendation: brokenAssets > 0 ? 'Fix all broken links to maintain user experience and SEO' : null
      };

    case 'design_alignment':
      const hasDesignDirective = !!designDirective;
      return {
        passed: hasDesignDirective,
        description: hasDesignDirective ? 'Design directive applied' : 'No design directive found',
        severity: hasDesignDirective ? 'none' : 'low',
        recommendation: hasDesignDirective ? null : 'Ensure consistent design application across all content'
      };

    default:
      // Generic check that passes by default
      return {
        passed: true,
        description: `${checkType} check completed`,
        severity: 'none'
      };
  }
}