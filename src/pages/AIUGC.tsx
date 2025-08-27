
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AIUGC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-semibold mb-8 text-black leading-tight">
            AI-Generated User Content: The New Creative Revolution
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore how artificial intelligence is transforming content creation, enabling users to generate everything from text and images to videos and interactive experiences with unprecedented ease and creativity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* What is AI UGC Section */}
        <section className="mb-20">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold text-black mb-4">
                What is AI-Generated User Content?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                AI-Generated User Content (AI UGC) represents a paradigm shift in digital creativity, where artificial intelligence tools empower everyday users to create professional-quality content across multiple mediums.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium text-black mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Democratized content creation tools
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Minimal technical expertise required
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Rapid iteration and experimentation
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Personalized and customizable outputs
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black mb-4">Content Types</h3>
                  <div className="space-y-3">
                    {['Text & Articles', 'Images & Artwork', 'Videos & Animations', 'Audio & Music', 'Code & Applications'].map((type) => (
                      <Badge key={type} variant="secondary" className="bg-gray-100 text-black border-0 px-4 py-2 font-normal">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Popular AI UGC Tools */}
        <section className="mb-20">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold text-black mb-4">
                Leading AI Content Creation Tools
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                A comprehensive overview of the most impactful AI tools that are reshaping how users create and share content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-medium text-black py-4 px-6">Tool</TableHead>
                      <TableHead className="font-medium text-black py-4 px-6">Content Type</TableHead>
                      <TableHead className="font-medium text-black py-4 px-6">Key Features</TableHead>
                      <TableHead className="font-medium text-black py-4 px-6">Use Cases</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-black py-4 px-6">ChatGPT</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Text</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Conversational AI, long-form content</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Articles, scripts, emails</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-black py-4 px-6">DALL-E 3</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Images</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Text-to-image, artistic styles</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Digital art, illustrations</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-black py-4 px-6">Midjourney</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Images</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">High-quality imagery, artistic control</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Concept art, photography</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-black py-4 px-6">Runway ML</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Video</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Video generation, editing tools</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Short films, social media</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-black py-4 px-6">ElevenLabs</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Audio</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Voice cloning, text-to-speech</TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">Podcasts, voiceovers</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Types Gallery */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-black mb-4">
              AI Content Creation Showcase
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Examples of the diverse range of content that users can create with AI tools, from visual art to written content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Generated Artwork",
                description: "Digital paintings and illustrations created through text prompts",
                image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Synthetic Photography",
                description: "Photorealistic images of people, places, and objects that don't exist",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Creative Writing",
                description: "Stories, poems, and articles generated through AI language models",
                image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Video Content",
                description: "Short films and animations created with AI video generation tools",
                image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Musical Compositions",
                description: "Original songs and soundtracks composed by artificial intelligence",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Code Generation",
                description: "Applications and websites built through AI-assisted programming",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ].map((item, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-black mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact and Statistics */}
        <section className="mb-20">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold text-black mb-4">
                The Impact of AI UGC
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Quantifying the transformative effect of AI-generated content on digital creativity and user engagement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { metric: "2.5B+", label: "Images Generated Daily" },
                  { metric: "89%", label: "Faster Content Creation" },
                  { metric: "156M+", label: "Active AI Tool Users" },
                  { metric: "73%", label: "Cost Reduction in Production" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-semibold text-black mb-2">{stat.metric}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Future Trends */}
        <section className="mb-20">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold text-black mb-4">
                Future of AI Content Creation
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Emerging trends and technologies that will shape the next generation of AI-powered user content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium text-black mb-6">Emerging Technologies</h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Multimodal AI",
                        description: "Tools that can generate and edit text, images, audio, and video simultaneously"
                      },
                      {
                        title: "Real-time Generation",
                        description: "Instant content creation and modification during live interactions"
                      },
                      {
                        title: "Personalized AI Models",
                        description: "AI systems trained on individual user preferences and styles"
                      }
                    ].map((trend, index) => (
                      <div key={index} className="border-l-4 border-black pl-6">
                        <h4 className="font-medium text-black mb-2">{trend.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{trend.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black mb-6">Market Predictions</h3>
                  <div className="space-y-4">
                    {[
                      "AI content creation market to reach $40B by 2027",
                      "90% of content will have AI assistance by 2025",
                      "New job categories emerging in AI content curation",
                      "Integration with AR/VR for immersive content experiences"
                    ].map((prediction, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 leading-relaxed">{prediction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Getting Started */}
        <section>
          <Card className="border border-gray-200 shadow-sm bg-gray-50 rounded-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold text-black mb-4">
                Start Creating with AI Today
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Begin your journey into AI-powered content creation with these essential steps and best practices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Choose Your Medium",
                    description: "Decide whether you want to create text, images, videos, audio, or code-based content."
                  },
                  {
                    step: "2",
                    title: "Select the Right Tool",
                    description: "Research and choose AI tools that best fit your creative goals and technical comfort level."
                  },
                  {
                    step: "3",
                    title: "Experiment and Iterate",
                    description: "Start with simple prompts and gradually develop more sophisticated techniques through practice."
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center p-8 bg-white rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-medium text-black mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AIUGC;
