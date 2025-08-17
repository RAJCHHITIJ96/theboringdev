
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { insertTestData } from '@/utils/insertTestData';
import { toast } from 'sonner';

export const TestDataInserter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInsertData = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await insertTestData();
      setResult(response);
      
      if (response.success) {
        toast.success('Data inserted successfully!');
      } else {
        toast.error(`Failed to insert data: ${response.error}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Insert Test Data</CardTitle>
        <CardDescription>
          Insert AI coding keyword and GitHub Copilot competitor data into the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleInsertData} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Inserting Data...' : 'Insert Test Data'}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">
              {result.success ? '✅ Success' : '❌ Error'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
