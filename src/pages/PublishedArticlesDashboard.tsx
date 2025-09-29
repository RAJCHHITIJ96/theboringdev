import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';
import { getAllArticles, ARTICLE_REGISTRY, CATEGORY_CONFIG } from '@/data/articles';
import { ExternalLink, Calendar, Clock, Tag, Globe, CheckCircle } from 'lucide-react';

const PublishedArticlesDashboard = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    published: 0
  });

  // Generate the correct Netlify URL based on repo
  // You can update this to the actual Netlify URL once you know it
  const getNetlifyBaseUrl = () => {
    // Common Netlify patterns:
    // 1. https://[repo-name].netlify.app
    // 2. https://[random-name].netlify.app  
    // 3. Custom domain
    
    // For now, we'll use the most likely pattern
    return 'https://theboringdev.netlify.app';
    // TODO: Update this with your actual Netlify URL
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

  useEffect(() => {
    const loadArticles = async () => {
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
          }
        }));

        // Sort by publish date (newest first)
        publishedArticles.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        setArticles(publishedArticles);
        
        // Calculate stats
        const categories = Object.keys(ARTICLE_REGISTRY).filter(
          cat => ARTICLE_REGISTRY[cat].length > 0
        ).length;
        
        setStats({
          total: publishedArticles.length,
          categories: categories,
          published: publishedArticles.length
        });

      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-gray-600">Total Articles</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.categories}</div>
              <div className="text-gray-600">Active Categories</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.published}</div>
              <div className="text-gray-600">Live & Accessible</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="text-lg text-gray-600">Loading articles...</div>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div key={`${article.category}-${article.slug}-${index}`} 
                     className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  
                  {/* Article Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category}
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-500" title="Published & Live" />
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
          )}

          {/* Empty State */}
          {!loading && articles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-4">No published articles found</div>
              <div className="text-gray-400">
                Articles will appear here once they're published through the autonomous system
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🤖 Autonomous Publishing System
              </h3>
              <p className="text-blue-700 text-sm">
                All articles shown here were automatically generated by AI Coder 2, 
                processed by Shaper AI, committed to GitHub, and deployed to Netlify 
                without human intervention.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublishedArticlesDashboard;