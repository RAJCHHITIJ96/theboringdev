import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

const SampleContentForTesting = () => {
  const seoTitle = "Sample Content for Testing";
  const seoDescription = "This is a sample content block to test the AI CODER 2 function...";
  const publishDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-sm font-medium text-gray-500">
          <span className="text-purple-600 font-semibold">GENERAL</span>
          <span className="text-gray-400">|</span>
          <span>{publishDate}</span>
          <span className="text-gray-400">|</span>
          <span>1 MIN READ</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.625rem, 6vw, 5.25rem)", fontWeight: 700, lineHeight: 1.2, color: '#111' }}>
          {seoTitle}
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: '#111' }}>Sample Content for Testing</h2>
<p style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', lineHeight: 1.7, color: '#333' }}>This is a sample content block to test the AI CODER 2 function...</p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default SampleContentForTesting;
