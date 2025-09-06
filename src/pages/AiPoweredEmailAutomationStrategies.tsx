import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const AiPoweredEmailAutomationStrategies = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Email Automation Guide - Boost Conversions by 4x</title>
        <meta name="description" content="Learn how to use AI to personalize and automate email marketing campaigns. Save time and increase conversions with real-world strategies." />
        <meta property="og:title" content="AI Email Automation Strategies" />
        <meta property="og:description" content="Case study: 120,000 emails/month with AI personalization. Boost open rates and conversions effortlessly." />
        <meta property="og:image" content="/meeting-hero.png" />
        <meta property="og:type" content="article" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"BlogPosting\",\"headline\":\"AI-Powered Email Automation Strategies\",\"author\":{\"name\":\"FutureOps Team\"},\"datePublished\":\"2025-04-20\"}" }}
        />
      </Helmet>

      <NewHeader />
      {/* ...full article content... */}
      <Footer />
    </div>
  );
};

export default AiPoweredEmailAutomationStrategies;