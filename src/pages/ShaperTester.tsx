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
  
  // GitHub Publisher state
  const [gitHubInputData, setGitHubInputData] = useState('');
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [gitHubResult, setGitHubResult] = useState<any>(null);

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

  const loadGitHubSample = () => {
    const gitHubSampleData = {
      files_created: [
        {
          path: "src/pages/BuildingAIWorkflows.tsx",
          content: `import React from 'react';
import { NewHeader } from "@/components/NewHeader";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const BuildingAIWorkflows = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Building AI Workflows That Actually Work</title>
        <meta name="description" content="A comprehensive guide to creating reliable AI automation systems." />
      </Helmet>
      <NewHeader />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Building AI Workflows That Actually Work</h1>
            <p className="text-lg text-muted-foreground">A comprehensive guide to creating reliable AI automation systems.</p>
          </header>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BuildingAIWorkflows;`,
          size_kb: 2.3,
          status: "created"
        }
      ],
      registry_updated: {
        category: "ai-automation",
        total_articles: 1,
        new_entry: {
          slug: "building-ai-workflows-that-actually-work",
          component: "BuildingAIWorkflows",
          title: "Building AI Workflows That Actually Work",
          publishDate: "2025-01-15",
          category: "ai-automation",
          description: "A comprehensive guide to creating reliable AI automation systems that deliver real business value.",
          readTime: "8 min",
          url: "/ai-automation/building-ai-workflows-that-actually-work",
          assetsCount: {
            images: 3,
            videos: 1,
            tables: 2,
            charts: 1,
            code_snippets: 4
          }
        }
      },
      validation: {
        naming_conflicts: false,
        route_conflicts: false,
        typescript_valid: true,
        component_imports_valid: true
      },
      deployment_ready: true
    };
    
    setGitHubInputData(JSON.stringify(gitHubSampleData, null, 2));
  };

  const testGitHubPublisher = async () => {
    if (!gitHubInputData.trim()) {
      alert('Please enter GitHub Publisher input data');
      return;
    }

    setIsGitHubLoading(true);
    setGitHubResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('github-publisher', {
        body: JSON.parse(gitHubInputData),
      });

      if (error) {
        setGitHubResult({ error: error.message || 'GitHub Publisher function failed' });
      } else {
        setGitHubResult(data);
      }
    } catch (error: any) {
      console.error('Error testing GitHub Publisher:', error);
      setGitHubResult({ error: error.message || 'An error occurred' });
    } finally {
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewHeader />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Agent Testing Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test the Shaper AI (Phase 2) and GitHub Publisher (Phase 3B) functions in our content pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Shaper AI Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Shaper AI (Phase 2)
                  <Badge variant="secondary">Active</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Transform AI Coder output into deployable files + routes
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Paste AI Coder output here..."
                  className="min-h-[200px] font-mono text-sm"
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

            {/* GitHub Publisher Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 GitHub Publisher (Phase 3B)
                  <Badge variant="default">New</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  5-phase deployment pipeline with quality assurance
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={gitHubInputData}
                  onChange={(e) => setGitHubInputData(e.target.value)}
                  placeholder="Paste Shaper AI output here..."
                  className="min-h-[200px] font-mono text-sm"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={loadGitHubSample}
                    variant="outline"
                    className="flex-1"
                  >
                    Load Sample Data
                  </Button>
                  
                  <Button 
                    onClick={testGitHubPublisher}
                    disabled={!gitHubInputData.trim() || isGitHubLoading}
                    className="flex-1"
                  >
                    {isGitHubLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Test GitHub Publisher'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shaper AI Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>📚 Shaper AI Documentation</CardTitle>
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
                  <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
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
              </CardContent>
            </Card>

            {/* GitHub Publisher Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>📚 GitHub Publisher Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">5-Phase Pipeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">1</Badge>
                      <span>Quality Assurance (TypeScript, ESLint, Build)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">2</Badge>
                      <span>Git Operations (Branch, Commit, Push)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">3</Badge>
                      <span>Deployment Trigger (Netlify Webhook)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">4</Badge>
                      <span>Verification (URL, Mobile, SEO)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">5</Badge>
                      <span>Rollback (On any failure)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Input Format</h4>
                  <p className="text-xs text-muted-foreground">
                    Takes Shaper AI output (files_created, registry_updated, validation, deployment_ready)
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Output</h4>
                  <p className="text-xs text-muted-foreground">
                    • Quality test results<br/>
                    • Git operation status<br/>
                    • Deployment URL & status<br/>
                    • Verification results<br/>
                    • Rollback status (if needed)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {(result || gitHubResult) && (
            <div className="mt-8 space-y-6">
              {/* Shaper AI Results */}
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🎯 Shaper AI Result
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

              {/* GitHub Publisher Results */}
              {gitHubResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🚀 GitHub Publisher Result
                      <Badge variant={gitHubResult.success ? "default" : "destructive"}>
                        {gitHubResult.success ? "Success" : "Error"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
                      {JSON.stringify(gitHubResult, null, 2)}
                    </pre>
                    
                    {/* Quality Tests Status */}
                    {gitHubResult.quality_tests && (
                      <div>
                        <h4 className="font-medium mb-2">Quality Tests Status:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <span className="text-xs text-muted-foreground">TypeScript</span>
                            <Badge variant={gitHubResult.quality_tests.typescript_check.passed ? "default" : "destructive"} className="text-xs">
                              {gitHubResult.quality_tests.typescript_check.passed ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <span className="text-xs text-muted-foreground">ESLint</span>
                            <Badge variant={gitHubResult.quality_tests.eslint_check.passed ? "default" : "destructive"} className="text-xs">
                              {gitHubResult.quality_tests.eslint_check.passed ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <span className="text-xs text-muted-foreground">Build</span>
                            <Badge variant={gitHubResult.quality_tests.build_test.passed ? "default" : "destructive"} className="text-xs">
                              {gitHubResult.quality_tests.build_test.passed ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <span className="text-xs text-muted-foreground">Imports</span>
                            <Badge variant={gitHubResult.quality_tests.import_validation.passed ? "default" : "destructive"} className="text-xs">
                              {gitHubResult.quality_tests.import_validation.passed ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <span className="text-xs text-muted-foreground">Component</span>
                            <Badge variant={gitHubResult.quality_tests.component_test.passed ? "default" : "destructive"} className="text-xs">
                              {gitHubResult.quality_tests.component_test.passed ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deployment Status */}
                    {gitHubResult.deployment && (
                      <div>
                        <h4 className="font-medium mb-2">Deployment Status:</h4>
                        <div className="flex items-center gap-4 p-3 bg-muted rounded">
                          <Badge variant={gitHubResult.deployment.status === 'deployed' ? "default" : "destructive"}>
                            {gitHubResult.deployment.status.toUpperCase()}
                          </Badge>
                          {gitHubResult.deployment.url && (
                            <span className="text-sm text-muted-foreground">
                              URL: {gitHubResult.deployment.url}
                            </span>
                          )}
                          {gitHubResult.deployment.build_time && (
                            <span className="text-sm text-muted-foreground">
                              Build Time: {gitHubResult.deployment.build_time}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShaperTester;