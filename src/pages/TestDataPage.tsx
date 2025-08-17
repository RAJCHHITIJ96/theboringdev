
import React from 'react';
import { TestDataInserter } from '@/components/TestDataInserter';

const TestDataPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Data Insertion</h1>
        <p className="text-muted-foreground">
          Use this page to insert test data into the AI Intelligence database
        </p>
      </div>
      
      <TestDataInserter />
    </div>
  );
};

export default TestDataPage;
