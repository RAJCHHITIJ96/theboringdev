import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const SimpleTest = () => {
  // Typography styles from design system
  const h1Style = { 
    fontFamily: "'Playfair Display', serif", 
    fontSize: "clamp(42px, 8vw, 84px)", 
    fontWeight: 700, 
    lineHeight: 1.1, 
    color: "#111827" 
  };
  const h2Style = { 
    fontFamily: "'Playfair Display', serif", 
    fontSize: "clamp(28px, 5vw, 40px)", 
    fontWeight: 600, 
    marginTop: "2em", 
    marginBottom: "1em", 
    color: "#111827" 
  };
  const bodyStyle = { 
    fontFamily: "'Inter', sans-serif", 
    fontSize: "21px", 
    lineHeight: 1.7, 
    color: "#374151" 
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Simple Test - AI Coder 2</title>
        <meta name="description" content="Basic test for the autonomous AI publishing system" />
        <meta name="keywords" content="AI Coder 2, autonomous system, test" />
        <meta property="og:title" content="Simple Test - AI Coder 2" />
        <meta property="og:description" content="Basic test for the autonomous AI publishing system" />
        <meta property="og:type" content="article" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <NewHeader />
      
      <header className="max-w-[680px] mx-auto pt-32 pb-16 text-center px-10">
        <div className="flex items-center justify-center space-x-4 text-gray-500">
          <span className="font-semibold text-blue-600 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>General</span>
          <span>&bull;</span>
          <span style={{ fontFamily: "'Inter', sans-serif" }}>2025-01-15</span>
          <span>&bull;</span>
          <span style={{ fontFamily: "'Inter', sans-serif" }}>1 min</span>
        </div>
      </header>
      
      <div className="max-w-[680px] mx-auto text-center pb-20 px-10">
        <h1 style={h1Style}>
          Simple Test
        </h1>
      </div>
      
      <main className="max-w-[680px] mx-auto px-10 pb-32">
        <article className="space-y-8">
          <p style={bodyStyle}>This is a basic test for AI Coder 2.</p>
          
          <h2 style={h2Style}>Features</h2>
          
          <ul className="list-disc pl-8 space-y-2" style={bodyStyle}>
            <li><strong>Simple content</strong>: Basic structure for testing</li>
            <li><strong>Basic structure</strong>: Clean and organized layout</li>
            <li><strong>Minimal complexity</strong>: Perfect for validation</li>
          </ul>
          
          <p style={bodyStyle}>This should work perfectly and demonstrate that our autonomous AI publishing system is fully operational!</p>
          
          <div className="bg-green-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Inter', sans-serif", color: "#16a34a" }}>🎉 Success!</h3>
            <p style={{ ...bodyStyle, color: "#16a34a" }}>
              If you're reading this, it means our autonomous system successfully:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2" style={{ ...bodyStyle, color: "#16a34a" }}>
              <li>Generated React code with AI Coder 2</li>
              <li>Created files with Shaper AI</li>
              <li>Committed to GitHub automatically</li>
              <li>Deployed to Netlify successfully</li>
            </ul>
            <p style={{ ...bodyStyle, color: "#16a34a", marginTop: "1em" }}>
              <strong>The future of autonomous publishing is here! 🚀</strong>
            </p>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimpleTest;