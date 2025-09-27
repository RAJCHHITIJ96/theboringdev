import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

const SampleContentForTesting = () => {
  const category = "General";
  const publish_date = "2023-10-27";
  const read_time = "1 min";
  const title = "Sample Content for Testing";
  const description = "This is a sample content block to test the AI CODER 2 function...";

  return (
    <div className="min-h-screen bg-white">
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
        <div className="flex items-center justify-center space-x-4 text-gray-500">
          <span className="font-semibold text-blue-600 uppercase">{category}</span>
          <span className="text-gray-400">&bull;</span>
          <span>{publish_date}</span>
          <span className="text-gray-400">&bull;</span>
          <span>{read_time}</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.625rem, 8vw, 5.25rem)", fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8" style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', lineHeight: 1.7 }}>
          <p>This is a sample content block to test the AI CODER 2 function...</p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default SampleContentForTesting;
