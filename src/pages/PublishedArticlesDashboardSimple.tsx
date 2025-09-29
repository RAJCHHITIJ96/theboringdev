import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

const PublishedArticlesDashboardSimple = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Published Articles Dashboard - The Boring Dev</title>
        <meta name="description" content="Dashboard showing all published articles on The Boring Dev with direct links to live content." />
      </Helmet>

      <NewHeader />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Published Articles Dashboard - DEBUGGING VERSION
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Minimal version to test if the basic dashboard loads correctly
            </p>
          </div>

          {/* Simple Content */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 Dashboard Debug Status
            </h2>
            <p className="text-gray-600 mb-4">
              If you can see this page loading correctly, the issue is with the complex dashboard logic.
            </p>
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Basic React rendering works
              </p>
              <p className="text-green-700">
                ✅ Header and Footer components load
              </p>
              <p className="text-green-700">
                ✅ Tailwind CSS styling works
              </p>
              <p className="text-green-700">
                ✅ Helmet (meta tags) work
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublishedArticlesDashboardSimple;