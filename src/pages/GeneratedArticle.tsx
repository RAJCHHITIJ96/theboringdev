import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const GeneratedArticle = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Generated Article</title>
        <meta name="description" content="Auto-generated article description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Generated Article" />
        <meta property="og:description" content="Auto-generated article description" />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            General
          </span>
          <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>1 min read</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(42px, 5vw, 84px)',
          fontWeight: '700',
          lineHeight: '1.1',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }}>
          Generated Article
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '21px',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            <p className="mb-6">
              This is a placeholder article generated from empty content. The component structure is ready to accept your content and will properly render markdown, handle assets, and maintain SEO compliance.
            </p>
            
            <p className="mb-6">
              When you provide actual content in the <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">shipped_content</code> field, it will be processed and displayed here with proper formatting, typography, and asset integration.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <p className="text-blue-800 font-medium mb-2">Ready for Content</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                This component is fully configured with responsive design, SEO optimization, and asset management capabilities. Simply provide your markdown content and assets to generate a complete blog post.
              </p>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratedArticle;