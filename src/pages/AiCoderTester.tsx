import React, { useState } from 'react';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AiCoderTester = () => {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sampleInput = {
    "category": "AI Automation",
    "shipped_content": `# The Complete AI UGC Factory Guide

## What This AI UGC Factory Actually Is (Dead Simple)

The concept is embarrassingly simple: AI "workers" generating user-generated content at industrial scale.

Think assembly line, but for viral content creation.

### The Assembly Line Process

1. **Content Strategy AI** - Analyzes trending topics and competitor content
2. **Script Generation AI** - Creates engaging video scripts based on trending data
3. **Voice Synthesis AI** - Converts scripts to natural-sounding narration
4. **Visual Generation AI** - Creates compelling thumbnails and video assets
5. **Video Assembly AI** - Combines all elements into finished videos
6. **Platform Distribution AI** - Optimizes and publishes across platforms

## The Conversion Math That Changes Everything

Here's where most people's minds explode: the revenue multiplier effect.

**Traditional UGC Creation:**
- 1 creator = 1 video per day maximum
- Cost per video: $500-2000 (creator fees, editing, etc.)
- Monthly output: 30 videos maximum

**AI UGC Factory:**
- 1 AI system = 100+ videos per day
- Cost per video: $2-5 (API costs only)
- Monthly output: 3000+ videos

The math is stupid simple: 100x output at 1/100th the cost.

## The Technical Implementation (Simplified)

### Required Tools Stack

1. **OpenAI GPT-4** - Script generation and strategy
2. **ElevenLabs** - Voice synthesis
3. **Stable Diffusion** - Thumbnail generation
4. **FFmpeg** - Video assembly
5. **YouTube/TikTok APIs** - Distribution

### Basic Workflow Code

\`\`\`python
def generate_ugc_video(topic, target_audience):
    # Step 1: Generate script
    script = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"Create engaging video script about {topic} for {target_audience}"}]
    )
    
    # Step 2: Generate voice
    audio = elevenlabs.generate(
        text=script.choices[0].message.content,
        voice="Adam",
        model="eleven_monolingual_v1"
    )
    
    # Step 3: Generate thumbnail
    thumbnail = stability.generate(
        prompt=f"Professional thumbnail for video about {topic}",
        width=1280,
        height=720
    )
    
    # Step 4: Assemble video
    video = ffmpeg.compose_video(audio, thumbnail, script)
    
    return video
\`\`\`

## Performance Data: 47 Days of Real Results

After running this system for 47 consecutive days, here are the actual numbers:

- **Videos Generated:** 3,180 total
- **Average Daily Output:** 67 videos
- **Total API Costs:** $8,940
- **Cost Per Video:** $2.81
- **Revenue Generated:** $127,000
- **ROI:** 1,420%

The system maintained 94% upload success rate across all platforms.

## Common Pitfalls (And How to Avoid Them)

### Pitfall #1: API Rate Limiting
Most people hit API limits within hours. Solution: Implement proper rate limiting and queue management.

### Pitfall #2: Content Detection
Platforms are getting smarter about AI-generated content. Solution: Add human review layers and variation algorithms.

### Pitfall #3: Quality Degradation
High volume often means low quality. Solution: Implement quality scoring and automated rejection thresholds.`,
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
      "tables": [
        {
          "table_1": {
            "title": "Cost Comparison: Traditional vs AI UGC",
            "where_to_place": "After conversion math section",
            "description": "Side-by-side comparison of costs and output"
          }
        }
      ],
      "charts": [
        {
          "chart_1": {
            "chart_data": "Revenue progression over 47 days",
            "where_to_place": "In performance data section",
            "description": "Graph showing daily revenue growth"
          }
        }
      ],
      "code_snippets": [
        {
          "code_1": {
            "snippet": "def generate_ugc_video(topic, target_audience):\\n    script = openai.ChatCompletion.create(...)\\n    return video",
            "where_to_place": "In technical implementation",
            "description": "Core function for video generation"
          }
        }
      ],
      "videos": [
        {
          "video_1": {
            "embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "where_to_place": "After performance data",
            "description": "Live demo of the system in action"
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
        },
        "schema_markup": {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "The Complete AI UGC Factory Guide",
          "author": {
            "name": "theboringdevTeam"
          },
          "datePublished": "2025-01-08"
        }
      }
    }
  };

  const handleTest = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Error",
        description: "Please provide input data",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const parsedInput = JSON.parse(inputData);
      
      const response = await fetch('/functions/v1/ai-coder-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput)
      });

      const result = await response.json();
      setResponse(result);

      if (result.success) {
        toast({
          title: "Success",
          description: "Component generated successfully!",
        });
      } else {
        toast({
          title: "Error", 
          description: result.error || "Failed to generate component",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid JSON or network error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const loadSampleData = () => {
    setInputData(JSON.stringify(sampleInput, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Coder Agent Tester</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test the AI Coder Agent API that transforms content + SEO data into production-ready React components
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                API Input
              </CardTitle>
              <CardDescription>
                Send content data to the AI Coder Agent API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={loadSampleData} variant="outline" size="sm">
                  Load Sample Data
                </Button>
                <Badge variant="secondary">POST /functions/v1/ai-coder-agent</Badge>
              </div>
              
              <Textarea
                placeholder="Paste your JSON input data here..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              
              <Button 
                onClick={handleTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Component"}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {response?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : response && !response.success ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                API Response
              </CardTitle>
              <CardDescription>
                Generated React component and metadata from AI Coder Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  {response.success ? (
                    <>
                      {/* Metadata */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Component Metadata</h3>
                        <div className="space-y-1 text-sm">
                          <div><span className="font-medium">Name:</span> {response.metadata.component_name}</div>
                          <div><span className="font-medium">Route:</span> /{response.metadata.route_slug}</div>
                          <div><span className="font-medium">Category:</span> {response.metadata.category}</div>
                          <div><span className="font-medium">Read Time:</span> {response.metadata.read_time}</div>
                          <div><span className="font-medium">Assets:</span> {response.metadata.assets_count.images} images, {response.metadata.assets_count.code_blocks} code blocks</div>
                        </div>
                      </div>

                      <Separator />

                      {/* Component Code */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Generated React Component</h3>
                          <Button 
                            onClick={() => copyToClipboard(response.component)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                          <code>{response.component}</code>
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                      <p className="text-red-700">{response.error}</p>
                      {response.details && (
                        <p className="text-red-600 text-sm mt-1">{response.details}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Copy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a component to see the output</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>Complete API endpoint specification for the AI Coder Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold mb-2">Endpoint</h3>
              <code className="bg-muted px-3 py-1 rounded text-sm">POST /functions/v1/ai-coder-agent</code>
            </div>

            {/* Request Schema */}
            <div>
              <h3 className="font-semibold mb-2">Request Schema</h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
{`{
  "category": "string",           // Required: Content category
  "shipped_content": "string",   // Required: Raw markdown content
  "assets_manager_details": {    // Required: Asset information
    "images": [{
      "image_1": {
        "src": "string",           // Image URL
        "alt": "string",           // Alt text
        "where_to_place": "string", // Placement instruction
        "description": "string"     // Description
      }
    }],
    "tables": [...],             // Table data
    "charts": [...],             // Chart specifications  
    "code_snippets": [...],      // Code snippets to embed
    "videos": [...]              // Video embed URLs
  },
  "seo_details": {              // Required: SEO metadata
    "html_head_section": {
      "meta_tags": {
        "title": "string",       // Page title
        "description": "string", // Meta description
        "og:title": "string",    // Open Graph title
        "og:description": "string", // OG description
        "og:image": "string"     // OG image URL
      },
      "schema_markup": {         // JSON-LD structured data
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "string",
        "author": {"name": "string"},
        "datePublished": "string"
      }
    }
  }
}`}
              </pre>
            </div>

            {/* Response Schema */}
            <div>
              <h3 className="font-semibold mb-2">Response Schema</h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
{`{
  "success": boolean,
  "component": "string",        // Generated React component code
  "metadata": {
    "component_name": "string", // PascalCase component name
    "route_slug": "string",     // URL-safe route slug
    "category": "string",       // Content category
    "title": "string",          // Extracted title
    "description": "string",    // Meta description
    "publish_date": "string",   // ISO date
    "read_time": "string",      // Estimated read time
    "assets_count": {
      "images": number,
      "code_blocks": number,
      "tables": number
    }
  },
  "message": "string"
}`}
              </pre>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Converts markdown content to React components</li>
                <li>• Follows TheBoringSev design system strictly</li>
                <li>• Generates SEO-optimized meta tags</li>
                <li>• Processes images, code blocks, tables, and videos</li>
                <li>• Creates mobile-responsive layouts</li>
                <li>• Generates PascalCase component names and URL slugs</li>
                <li>• Calculates read time automatically</li>
                <li>• Production-ready TypeScript code output</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AiCoderTester;