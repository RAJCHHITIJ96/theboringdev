import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const SampleContentForTesting = () => {
  const title = "Sample Content for Testing";
  const description = "This is a sample content block to test the AI CODER 2 function...";
  const publishDate = "2023-10-27";
  const category = "General";
  const readTime = "1 min";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-lg text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span>{category}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{publishDate}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{readTime} read</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.625rem, 10vw, 5.25rem)', fontWeight: 700, lineHeight: 1.1, color: '#111' }}>
          {title}
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '21px', lineHeight: 1.7, color: '#333' }}>
            This is a sample content block to test the AI CODER 2 function...
          </p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default SampleContentForTesting;