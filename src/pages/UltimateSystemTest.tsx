import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const UltimateSystemTest = () => {
  const pageTitle = "Ultimate System Test";
  const pageDescription = "This is the final battle test of our autonomous publishing system. If this works, we celebrate with coffee! If not, we debug like legends!";
  const publishDate = "2023-10-27";
  const readTime = "1 min";
  const category = "General";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-lg text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span>{category}</span>
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          <span>{publishDate}</span>
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          <span>{readTime}</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 8vw, 84px)', fontWeight: 700, lineHeight: 1.2, color: '#111' }}>
          {pageTitle}
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', lineHeight: 1.7, color: '#333' }}>
            This is the final battle test of our autonomous publishing system. If this works, we celebrate with coffee! If not, we debug like legends!
          </p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default UltimateSystemTest;
