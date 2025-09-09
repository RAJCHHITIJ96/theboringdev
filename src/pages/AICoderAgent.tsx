import React, { useState } from 'react';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AICoderAgent = () => {
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sampleInput = {
    "category": "AI Automation",
    "shipped_content": "# The Complete AI UGC Factory Guide\n\n## What This AI UGC Factory Actually Is (Dead Simple)\n\nThe concept is embarrassingly simple: AI \"workers\" generating user-generated content at industrial scale.\n\nThink assembly line, but for viral content creation.\n\n### The Assembly Line Process\n\n1. **Content Strategy AI** - Analyzes trending topics and competitor content\n2. **Script Generation AI** - Creates engaging video scripts based on trending data\n3. **Voice Synthesis AI** - Converts scripts to natural-sounding narration\n4. **Visual Generation AI** - Creates compelling thumbnails and video assets\n5. **Video Assembly AI** - Combines all elements into finished videos\n6. **Platform Distribution AI** - Optimizes and publishes across platforms\n\n## The Conversion Math That Changes Everything\n\nHere's where most people's minds explode: the revenue multiplier effect.\n\n**Traditional UGC Creation:**\n- 1 creator = 1 video per day maximum\n- Cost per video: $500-2000 (creator fees, editing, etc.)\n- Monthly output: 30 videos maximum\n\n**AI UGC Factory:**\n- 1 AI system = 100+ videos per day\n- Cost per video: $2-5 (API costs only)\n- Monthly output: 3000+ videos\n\nThe math is stupid simple: 100x output at 1/100th the cost.",
    "assets_manager_details": {
      "images": [
        {
          "image_1": {
            "src": "/trending-hero.png",
            "alt": "AI UGC Factory Workflow Diagram",
            "where_to_place": "After introduction",
            "description": "Visual representation of the AI content creation pipeline"
          }
        }
      ],
      "code_snippets": [
        {
          "code_1": {
            "snippet": "unit test generation",
            "where_to_place": "In technical implementation",
            "description": "Core function for video generation with unit tests"
          }
        }
      ]
    },
    "seo_details": {
      "html_head_section": {
        "meta_tags": {
          "title": "The Complete AI UGC Factory Guide - Scale Content Creation 100x",
          "description": "Learn how to build an AI-powered User Generated Content factory that produces 100+ videos daily at $2.81 per video. Complete technical implementation guide.",
          "og:title": "AI UGC Factory: 100x Your Content Output",
          "og:description": "Real case study: 3,180 videos generated in 47 days with 1,420% ROI. Complete technical implementation guide included.",
          "og:image": "/trending-hero.png"
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!inputData.trim()) {
      toast.error("Please enter input data");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(inputData);
      } catch (e) {
        // If it's not JSON, treat as shipped_content
        parsedData = { shipped_content: inputData };
      }

      console.log('🚀 Sending data to AI Coder Agent:', parsedData);

      const { data, error } = await supabase.functions.invoke('ai-coder-agent', {
        body: parsedData
      });

      if (error) {
        console.error('❌ AI Coder Agent Error:', error);
        toast.error(`AI Coder Agent Error: ${error.message}`);
        return;
      }

      console.log('✅ AI Coder Agent Response:', data);
      setResult(data);
      toast.success("React component generated successfully!");

    } catch (error) {
      console.error('💥 Request Error:', error);
      toast.error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setInputData(JSON.stringify(sampleInput, null, 2));
  };

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">AI Coder Agent</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The world's most precise content-to-code transformer. Convert raw content + SEO data + assets 
            into bulletproof React components with 0% compilation errors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>
                Paste your JSON data or use the sample to test the AI Coder Agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={loadSample} variant="outline" size="sm">
                  Load Sample
                </Button>
                <Button onClick={() => setInputData('')} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
              
              <Textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Paste your JSON input data here..."
                className="min-h-[400px] font-mono text-sm"
              />
              
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !inputData.trim()}
                className="w-full"
              >
                {isLoading ? 'Generating Component...' : 'Generate React Component'}
              </Button>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Complete API specification for the AI Coder Agent endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Badge variant="secondary">POST</Badge>
                <span className="ml-2 font-mono text-sm">/functions/v1/ai-coder-agent</span>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Input Schema</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
{`{
  "category": "AI Automation",
  "shipped_content": "# Article Title\\n\\nContent...",
  "assets_manager_details": {
    "images": [{
      "image_1": {
        "src": "https://example.com/image.png",
        "alt": "Description",
        "where_to_place": "After section 2"
      }
    }],
    "code_snippets": [{
      "code_1": {
        "snippet": "unit test generation",
        "where_to_place": "After implementation section",
        "description": "Example code snippet description"
      }
    }],
    "tables": [...],
    "videos": [...]
  },
  "seo_details": {
    "html_head_section": {
      "meta_tags": {
        "title": "Article Title",
        "description": "Meta description"
      }
    }
  }
}`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Output Schema</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
{`{
  "success": true,
  "component": "import React from 'react'...",
  "metadata": {
    "component_name": "ComponentName",
    "route_slug": "url-slug-here",
    "category": "AI Automation",
    "title": "Article Title",
    "description": "Article description",
    "publish_date": "2025-01-08",
    "read_time": "12 min",
    "assets_count": {
      "images": 3,
      "code_blocks": 2,
      "tables": 1
    }
  }
}`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 0% compilation errors (bulletproof TypeScript)</li>
                  <li>• 100% design system compliance</li>
                  <li>• Perfect mobile responsiveness</li>
                  <li>• SEO-optimized meta integration</li>
                  <li>• Production-ready on first generation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Component</CardTitle>
              <CardDescription>
                {result.success ? 'Component generated successfully' : 'Generation failed'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-6">
                  {/* Metadata */}
                  <div>
                    <h4 className="font-semibold mb-2">Component Metadata</h4>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Component:</strong> {result.metadata?.component_name}</div>
                        <div><strong>Route:</strong> /{result.metadata?.route_slug}</div>
                        <div><strong>Category:</strong> {result.metadata?.category}</div>
                        <div><strong>Read Time:</strong> {result.metadata?.read_time}</div>
                        <div><strong>Images:</strong> {result.metadata?.assets_count?.images}</div>
                        <div><strong>Code Blocks:</strong> {result.metadata?.assets_count?.code_blocks}</div>
                      </div>
                    </div>
                  </div>

                  {/* Component Code */}
                  <div>
                    <h4 className="font-semibold mb-2">React Component Code</h4>
                    <Textarea
                      value={result.component}
                      readOnly
                      className="min-h-[300px] font-mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded text-red-800">
                  <strong>Error:</strong> {result.error || 'Unknown error occurred'}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AICoderAgent;