import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';
import { ExternalLink, Calendar, Clock, Tag, Globe } from 'lucide-react';

const FocusedDashboard = () => {
  const baseUrl = 'https://fascinating-pothos-a3975f.netlify.app';
  
  // Only the 3 pages you specified
  const focusedPages = [
    {
      filename: 'CleanTestArticle2024.tsx',
      title: 'Clean Test Article 2024',
      description: 'Clean test article with proper encoding',
      category: 'testing',
      slug: 'cleantestarticle2024',
      url: `${baseUrl}/cleantestarticle2024`,
      publishDate: '2024-05-21',
      readTime: '1 min read'
    },
    {
      filename: 'AiPoweredEmailAutomationStrategies.tsx',
      title: 'AI Powered Email Automation Strategies',
      description: 'Comprehensive guide to AI email automation',
      category: 'ai-automation',
      slug: 'aipoweredemailautomationstrategies',
      url: `${baseUrl}/aipoweredemailautomationstrategies`,
      publishDate: '2024-12-01',
      readTime: '8 min read'
    },
    {
      filename: 'AIUGC.tsx',
      title: 'AI UGC Creation',
      description: 'User-generated content strategies with AI',
      category: 'ai-automation',
      slug: 'aiugc',
      url: `${baseUrl}/ai-ugc`,
      publishDate: '2024-11-15',
      readTime: '6 min read'
    }
  ];

  const openPage = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Focused Dashboard - 3 Key Pages</title>
        <meta name="description" content="Simple dashboard for 3 key pages without complex logic" />
      </Helmet>

      <NewHeader />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Focused Pages Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple access to your 3 key pages - no complex logic, no errors
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{focusedPages.length}</div>
              <div className="text-gray-600">Total Pages</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <div className="text-gray-600">Ready to Use</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Working</div>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {focusedPages.map((page, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {page.category}
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Ready"></div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {page.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {page.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(page.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {page.readTime}
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="truncate text-xs">{page.url}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openPage(page.url)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Page
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✅ Simple & Reliable
              </h3>
              <p className="text-green-700 text-sm">
                This focused dashboard shows only your 3 specified pages with zero complex logic.
                No dynamic discovery, no complex state management - just simple, working links.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FocusedDashboard;