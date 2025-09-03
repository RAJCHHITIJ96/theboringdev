import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const ShaperTester = () => {
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!inputData.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('shaper-ai', {
        body: inputData
      });

      if (error) {
        setResult({ error: error.message, success: false });
      } else {
        setResult(data);
      }
    } catch (error: any) {
      setResult({ error: error.message, success: false });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    const sampleData = {
      component: `import React from 'react';\n\nconst BuildingAIWorkflows = () => {\n  return (\n    <div className="container mx-auto px-4 py-8">\n      <NewHeader />\n      <article className="max-w-4xl mx-auto">\n        <header className="mb-8">\n          <h1 className="text-4xl font-bold mb-4">Building AI Workflows That Actually Work</h1>\n          <p className="text-lg text-muted-foreground">A comprehensive guide to creating reliable AI automation systems.</p>\n        </header>\n        <div className="prose prose-lg max-w-none">\n          <p>AI workflows are revolutionizing how we approach complex tasks...</p>\n        </div>\n      </article>\n      <Footer />\n    </div>\n  );\n};\n\nexport default BuildingAIWorkflows;`,
      metadata: {
        component_name: "BuildingAIWorkflows",
        route_slug: "building-ai-workflows-that-actually-work",
        category: "ai-automation", 
        title: "Building AI Workflows That Actually Work",
        description: "A comprehensive guide to creating reliable AI automation systems that deliver real business value.",
        publish_date: "2025-01-15",
        read_time: "8 min",
        assets_count: {
          images: 3,
          videos: 1,
          tables: 2,
          charts: 1,
          code_snippets: 4
        }
      }
    };

    setInputData(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewHeader />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Shaper AI Tester</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test the Shaper AI function that transforms AI Coder output into deployable files and routes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input Data</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste AI Coder Agent output (component + metadata JSON)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Paste AI Coder output here..."
                  className="min-h-[300px] font-mono text-sm"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={loadSample}
                    variant="outline"
                    className="flex-1"
                  >
                    Load Sample Data
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={!inputData.trim() || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process with Shaper AI'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>Shaper AI Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Purpose</h4>
                  <p className="text-sm text-muted-foreground">
                    Transforms AI Coder output into deployable file structure with routing and registry management.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Input Format</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    {`{
  "component": "React component code",
  "metadata": {
    "component_name": "PascalCase",
    "route_slug": "kebab-case",
    "category": "category-name",
    "title": "Article Title",
    "description": "Meta description",
    "publish_date": "YYYY-MM-DD",
    "read_time": "X min",
    "assets_count": {...}
  }
}`}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary">Component Enhancement</Badge>
                    <Badge variant="secondary">Route Generation</Badge>
                    <Badge variant="secondary">Registry Management</Badge>
                    <Badge variant="secondary">Validation Pipeline</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Output</h4>
                  <p className="text-sm text-muted-foreground">
                    • Files to create (component + registry)<br/>
                    • Routes to update in App.tsx<br/>
                    • Validation results<br/>
                    • Deployment readiness status
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {result && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Processing Result
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Success" : "Error"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShaperTester;