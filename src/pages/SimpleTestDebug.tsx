import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

const SimpleTestDebug = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Simple Test Debug - The Boring Dev</title>
        <meta name="description" content="Basic debugging test for React rendering" />
      </Helmet>
      
      <NewHeader />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔧 Simple Test Debug Page
            </h1>
            <p className="text-xl text-gray-600">
              Testing if basic page components work correctly
            </p>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Debug Status
            </h2>
            <div className="space-y-2">
              <p className="text-green-600">✅ React component renders</p>
              <p className="text-green-600">✅ Helmet works for meta tags</p>
              <p className="text-green-600">✅ NewHeader component loads</p>
              <p className="text-green-600">✅ Footer component loads</p>
              <p className="text-green-600">✅ Tailwind CSS styling works</p>
            </div>
          </div>

          {/* Test Functionality */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📋 Test Results
            </h3>
            <p className="text-blue-800">
              If you can see this page without errors, individual page components are working fine.
              The issue is likely in the complex dashboard logic or bundling.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SimpleTestDebug;