import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const CleanTestArticle2024 = () => {
  const publishDate = "2024-05-21";
  const title = "Clean Test Article 2024";
  const description = "This is a completely new test with clean encoding.";
  const category = "General";
  const readTime = "1 min";

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-gray-500">
          <span className="font-semibold text-blue-600 uppercase">{category}</span>
          <span className="text-gray-400">&bull;</span>
          <time dateTime={publishDate}>{new Date(publishDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <span className="text-gray-400">&bull;</span>
          <span>{readTime} read</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 5vw, 84px)', fontWeight: 700, lineHeight: 1.2, color: '#111827' }}>
          {title}
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', lineHeight: 1.7, color: '#374151' }}>
            This is a completely new test with clean encoding.
          </p>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default CleanTestArticle2024;