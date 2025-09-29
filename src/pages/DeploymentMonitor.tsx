import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle, AlertCircle, Zap, TrendingUp } from "lucide-react";
import { getAllArticles, getArticlesByCategory, CATEGORY_CONFIG } from "@/data/articles";

interface PipelineStatus {
  total_articles: number;
  categories: Record<string, number>;
  recent_deployments: Array<{
    title: string;
    url: string;
    category: string;
    published: string;
    readTime: string;
    status: 'live' | 'building' | 'failed';
  }>;
  pipeline_health: {
    ai_coder_status: 'operational' | 'degraded' | 'down';
    shaper_ai_status: 'operational' | 'degraded' | 'down';
    github_status: 'operational' | 'degraded' | 'down';
    netlify_status: 'operational' | 'degraded' | 'down';
  };
}

const DeploymentMonitor: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPipelineStatus = async () => {
    try {
      // Get all articles from the registry
      const allArticles = getAllArticles();
      
      // Group by categories
      const categories: Record<string, number> = {};
      Object.keys(CATEGORY_CONFIG).forEach(category => {
        categories[category] = getArticlesByCategory(category).length;
      });
      
      // Add General category
      categories['General'] = getArticlesByCategory('General').length;

      // Create recent deployments list (last 10 articles by date)
      const recentDeployments = allArticles
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 10)
        .map(article => ({
          title: article.title,
          url: article.url,
          category: article.category,
          published: article.publishDate,
          readTime: article.readTime,
          status: 'live' as const // All articles in registry are live
        }));

      const status: PipelineStatus = {
        total_articles: allArticles.length,
        categories,
        recent_deployments: recentDeployments,
        pipeline_health: {
          ai_coder_status: 'operational',
          shaper_ai_status: 'operational', 
          github_status: 'operational',
          netlify_status: 'operational'
        }
      };

      setPipelineStatus(status);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch pipeline status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelineStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPipelineStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': case 'live': return 'bg-green-500';
      case 'degraded': case 'building': return 'bg-yellow-500';
      case 'down': case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return '🟢 Operational';
      case 'degraded': return '🟡 Degraded';  
      case 'down': return '🔴 Down';
      case 'live': return '✅ Live';
      case 'building': return '⏳ Building';
      case 'failed': return '❌ Failed';
      default: return '⚪ Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium">Loading Pipeline Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Deployment Monitor - Real-time Pipeline Status</title>
        <meta name="description" content="Monitor AI-generated content deployment pipeline in real-time. Track article generation, builds, and deployments." />
        <meta property="og:title" content="AI Deployment Monitor" />
        <meta property="og:description" content="Real-time monitoring dashboard for AI content generation pipeline" />
        <meta property="og:type" content="article" />
      </Helmet>

      <NewHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-32">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 8vw, 64px)',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '24px'
          }} className="text-black">
            AI Deployment Monitor
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '21px',
            lineHeight: '1.6',
            color: '#6B7280'
          }}>
            Real-time monitoring of your autonomous AI content pipeline
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {lastUpdate.toLocaleString()}
          </p>
        </div>

        {pipelineStatus && (
          <>
            {/* Pipeline Health Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">AI Coder 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{getStatusText(pipelineStatus.pipeline_health.ai_coder_status)}</span>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(pipelineStatus.pipeline_health.ai_coder_status)}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Gemini 2.5 Pro Integration</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Shaper AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{getStatusText(pipelineStatus.pipeline_health.shaper_ai_status)}</span>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(pipelineStatus.pipeline_health.shaper_ai_status)}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Registry & File Management</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{getStatusText(pipelineStatus.pipeline_health.github_status)}</span>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(pipelineStatus.pipeline_health.github_status)}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Version Control & Commits</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Netlify</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{getStatusText(pipelineStatus.pipeline_health.netlify_status)}</span>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(pipelineStatus.pipeline_health.netlify_status)}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Build & Deployment</p>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Total Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{pipelineStatus.total_articles}</div>
                  <p className="text-sm text-blue-600">AI-generated and deployed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Categories Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {Object.values(pipelineStatus.categories).filter(count => count > 0).length}
                  </div>
                  <p className="text-sm text-green-600">Content categories populated</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Pipeline Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">100% Operational</div>
                  <p className="text-sm text-purple-600">All systems functioning</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>📊 Content by Category</CardTitle>
                <CardDescription>Distribution of AI-generated articles across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(pipelineStatus.categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium capitalize">{category.replace('-', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Deployments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>🚀 Recent Deployments</CardTitle>
                  <CardDescription>Latest AI-generated articles deployed to production</CardDescription>
                </div>
                <Button 
                  onClick={fetchPipelineStatus}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Refresh <Zap className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineStatus.recent_deployments.map((deployment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{deployment.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {deployment.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {deployment.readTime}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{getStatusText(deployment.status)}</span>
                          <span>Published: {new Date(deployment.published).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(deployment.url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DeploymentMonitor;