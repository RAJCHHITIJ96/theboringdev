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
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">General</span>
          <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>1 min read</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(42px, 5vw, 84px)',
          fontWeight: '700',
          lineHeight: '1.2',
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
              This is a placeholder article generated from empty content. The component has been structured to handle dynamic content when provided.
            </p>
            
            <p className="mb-6">
              The article follows the design system specifications with proper typography, spacing, and responsive design patterns.
            </p>
            
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: '600',
              lineHeight: '1.3',
              color: '#1a1a1a',
              marginTop: '2rem',
              marginBottom: '1rem'
            }}>
              Content Structure
            </h2>
            
            <p className="mb-6">
              When content is provided, this component will automatically process markdown, integrate assets, and maintain SEO optimization.
            </p>
            
            <h3 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '24px',
              fontWeight: '600',
              lineHeight: '1.4',
              color: '#1a1a1a',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            }}>
              Features Include
            </h3>
            
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Responsive typography system</li>
              <li>SEO optimization with meta tags</li>
              <li>Asset integration capabilities</li>
              <li>Mobile-first design approach</li>
            </ul>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratedArticle;