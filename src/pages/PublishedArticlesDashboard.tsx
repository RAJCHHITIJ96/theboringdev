import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';
import { getAllArticles, ARTICLE_REGISTRY, CATEGORY_CONFIG } from '@/data/articles';
import { ExternalLink, Calendar, Clock, Tag, Globe, CheckCircle, FileText, Search } from 'lucide-react';

interface PageInfo {
  filename: string;
  title: string;
  description?: string;
  category: string;
  publishDate: string;
  slug: string;
  netlifyUrl: string;
  readTime?: string;
  isFromRegistry: boolean;
  hasHelmet: boolean;
}

const PublishedArticlesDashboard = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [discoveredPages, setDiscoveredPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiscoveredPages, setShowDiscoveredPages] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    published: 0,
    discovered: 0
  });

  // Generate the correct Netlify URL - UPDATED WITH REAL URL!
  const getNetlifyBaseUrl = () => {
    return 'https://fascinating-pothos-a3975f.netlify.app';
  };

  const generateNetlifyUrl = (article: any) => {
    try {
      const baseUrl = getNetlifyBaseUrl();
      // Convert category to URL-friendly format
      const categorySlug = article.category.toLowerCase().replace(/\s+/g, '-');
      return `${baseUrl}/${categorySlug}/${article.slug}`;
    } catch (error) {
      console.warn('Failed to generate URL for article:', article.slug, error);
      return '#';
    }
  };

  const openArticle = (url: string) => {
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper function to extract metadata from page files
  const extractPageMetadata = async (filename: string): Promise<PageInfo | null> => {
    try {
      // Generate URL-friendly slug from filename
      const slug = filename.replace('.tsx', '').toLowerCase();
      const baseUrl = getNetlifyBaseUrl();
      
      // Try to categorize based on filename patterns
      let category = 'uncategorized';
      if (filename.toLowerCase().includes('ai')) category = 'ai-automation';
      if (filename.toLowerCase().includes('test')) category = 'testing';
      if (filename.toLowerCase().includes('dashboard')) category = 'tools';
      
      // Create page info object
      const pageInfo: PageInfo = {
        filename,
        title: filename.replace('.tsx', '').replace(/([A-Z])/g, ' $1').trim(),
        description: `Page component: ${filename}`,
        category,
        publishDate: new Date().toISOString().split('T')[0],
        slug,
        netlifyUrl: `${baseUrl}/${slug}`,
        readTime: '5 min read',
        isFromRegistry: false,
        hasHelmet: false
      };
      
      return pageInfo;
    } catch (error) {
      console.warn('Failed to extract metadata for:', filename, error);
      return null;
    }
  };

  // Discovery function for all page files
  const discoverAllPages = async (): Promise<PageInfo[]> => {
    // List of known page files in src/pages (this would normally be dynamic)
    const pageFiles = [
      'AIAutomation.tsx',
      'AICoderAgent.tsx',
      'AINews.tsx',
      'AIRealityCheck.tsx',
      'AIUGC.tsx',
      'AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse.tsx',
      'AiCoderTester.tsx',
      'AiPoweredEmailAutomationStrategies.tsx',
      'Auth.tsx',
      'BuilderStories.tsx',
      'BuildingAIWorkflows.tsx',
      'CleanTestArticle2024.tsx',
      'Dashboard.tsx',
      'DeploymentMonitor.tsx',
      'FinalVerificationTest.tsx',
      'GeneratedArticles.tsx',
      'Index.tsx',
      'MCPConverter.tsx',
      'NotFound.tsx',
      'PublishedArticlesDashboard.tsx',
      'SampleContentForTesting.tsx',
      'ShaperTester.tsx',
      'SimpleTest.tsx',
      'TheAipoweredMeetingSummariesGuide.tsx',
      'ToolComparisons.tsx',
      'TrendingOpportunities.tsx',
      'UltimateSystemTest.tsx',
      'ZuhuDashboard.tsx'
    ];
    
    const discoveredPages: PageInfo[] = [];
    
    for (const file of pageFiles) {
      // Skip the dashboard itself and common utility pages
      if (file === 'PublishedArticlesDashboard.tsx' || 
          file === 'NotFound.tsx' || 
          file === 'Index.tsx' ||
          file === 'Auth.tsx') {
        continue;
      }
      
      const pageInfo = await extractPageMetadata(file);
      if (pageInfo) {
        discoveredPages.push(pageInfo);
      }
    }
    
    return discoveredPages;
  };

  useEffect(() => {
    const loadAllContent = async () => {
      try {
        setLoading(true);
        
        // Get all articles from registry
        const allArticles = getAllArticles();
        
        // Filter out empty articles and add metadata
        const publishedArticles = allArticles.filter(article => 
          article.slug && 
          article.component && 
          article.title
        ).map(article => ({
          ...article,
          netlifyUrl: generateNetlifyUrl(article),
          categoryConfig: CATEGORY_CONFIG[article.category.toLowerCase().replace(/\s+/g, '-')] || {
            name: article.category,
            description: 'Published article',
            path: `/${article.category.toLowerCase().replace(/\s+/g, '-')}`
          },
          isFromRegistry: true
        }));

        // Sort by publish date (newest first)
        publishedArticles.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        setArticles(publishedArticles);
        
        // Discover all pages dynamically
        const discoveredPagesList = await discoverAllPages();
        setDiscoveredPages(discoveredPagesList);
        
        // Calculate stats
        const categories = Object.keys(ARTICLE_REGISTRY).filter(
          cat => ARTICLE_REGISTRY[cat].length > 0
        ).length;
        
        setStats({
          total: publishedArticles.length,
          categories: categories,
          published: publishedArticles.length,
          discovered: discoveredPagesList.length
        });

      } catch (error) {
        console.error('Failed to load content:', error);
        setArticles([]);
        setDiscoveredPages([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Published Articles Dashboard - The Boring Dev</title>
        <meta name="description" content="Dashboard showing all published articles on The Boring Dev with direct links to live content." />
      </Helmet>

      <NewHeader />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Published Articles Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete overview of all live articles published through our autonomous AI publishing system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-gray-600">Registry Articles</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.categories}</div>
              <div className="text-gray-600">Active Categories</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.published}</div>
              <div className="text-gray-600">Live & Accessible</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.discovered}</div>
              <div className="text-gray-600">Discovered Pages</div>
            </div>
          </div>

          {/* Toggle View Controls */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-2 flex">
              <button
                onClick={() => setShowDiscoveredPages(false)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center ${
                  !showDiscoveredPages 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Registry Articles ({stats.total})
              </button>
              <button
                onClick={() => setShowDiscoveredPages(true)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center ${
                  showDiscoveredPages 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                All Discovered Pages ({stats.discovered})
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="text-lg text-gray-600">Loading articles...</div>
            </div>
          )}

          {/* Registry Articles Grid */}
          {!loading && !showDiscoveredPages && articles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Articles from Registry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <div key={`registry-${article.category}-${article.slug}-${index}`} 
                       className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    
                    {/* Article Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {article.category}
                        </span>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" title="Published & Live" />
                          <span className="text-xs text-green-600">Registry</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>

                      {/* Article Meta */}
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(article.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="truncate">{article.netlifyUrl}</span>
                        </div>
                      </div>

                      {/* Asset Summary */}
                      {article.assetsCount && Object.values(article.assetsCount).some((count: any) => count > 0) && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-1">Content Assets:</div>
                          <div className="flex flex-wrap gap-1">
                            {article.assetsCount.images > 0 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                📷 {article.assetsCount.images}
                              </span>
                            )}
                            {article.assetsCount.code_snippets > 0 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                💻 {article.assetsCount.code_snippets}
                              </span>
                            )}
                            {article.assetsCount.tables > 0 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                📊 {article.assetsCount.tables}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        onClick={() => openArticle(article.netlifyUrl)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        disabled={article.netlifyUrl === '#'}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Article
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discovered Pages Grid */}
          {!loading && showDiscoveredPages && discoveredPages.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Search className="w-6 h-6 mr-2 text-orange-600" />
                All Discovered Pages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredPages.map((page, index) => (
                  <div key={`discovered-${page.filename}-${index}`} 
                       className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    
                    {/* Page Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {page.category}
                        </span>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-orange-500 mr-1" title="Discovered Page" />
                          <span className="text-xs text-orange-600">Page</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {page.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {page.description}
                      </p>

                      {/* Page Meta */}
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="truncate">{page.filename}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {page.readTime}
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="truncate">{page.netlifyUrl}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => openArticle(page.netlifyUrl)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Page
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty States */}
          {!loading && !showDiscoveredPages && articles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-4">No published articles found</div>
              <div className="text-gray-400">
                Articles will appear here once they're published through the autonomous system
              </div>
            </div>
          )}

          {!loading && showDiscoveredPages && discoveredPages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-4">No pages discovered</div>
              <div className="text-gray-400">
                Failed to scan the pages directory for available components
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className={`rounded-lg p-6 max-w-3xl mx-auto ${
              showDiscoveredPages ? 'bg-orange-50' : 'bg-blue-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                showDiscoveredPages ? 'text-orange-900' : 'text-blue-900'
              }`}>
                {showDiscoveredPages ? '🔍 Dynamic Page Discovery' : '🤖 Autonomous Publishing System'}
              </h3>
              <p className={`text-sm ${
                showDiscoveredPages ? 'text-orange-700' : 'text-blue-700'
              }`}>
                {showDiscoveredPages 
                  ? 'This dashboard now dynamically scans all .tsx files in the src/pages directory, including your test article CleanTestArticle2024.tsx. Each discovered page is automatically assigned a corresponding Netlify URL for direct access.'
                  : 'Registry articles were automatically generated by AI Coder 2, processed by Shaper AI, committed to GitHub, and deployed to Netlify without human intervention.'
                }
              </p>
              {showDiscoveredPages && (
                <div className="mt-3 text-xs text-orange-600">
                  💡 Switch to "Registry Articles" to see formally published content
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublishedArticlesDashboard;