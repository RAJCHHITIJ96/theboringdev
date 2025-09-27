import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

const SampleContentForTesting = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>Sample Content for Testing</title>
        <meta name="description" content="This is a sample content block to test the AI CODER 2 function..." />
        <meta property="og:title" content="Sample Content for Testing" />
        <meta property="og:description" content="This is a sample content block to test the AI CODER 2 function..." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sample Content for Testing" />
        <meta name="twitter:description" content="This is a sample content block to test the AI CODER 2 function..." />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-lg text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span>General</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>2023-10-27</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>1 min</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.625rem, 8vw, 5.25rem)", fontWeight: 700, lineHeight: 1.1 }}>
          Sample Content for Testing
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "21px", lineHeight: 1.7 }}>
            This is a sample content block to test the AI CODER 2 function...
          </p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default SampleContentForTesting;
