
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AIUGC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="px-6 py-16 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold mb-6" style={{ color: '#000000', lineHeight: '1.6' }}>
            AI User-Generated Content
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
            Comprehensive analysis of AI-powered user-generated content platforms, trends, and market opportunities
          </p>
        </div>

        {/* Market Overview Card */}
        <Card className="mb-12" style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardHeader style={{ padding: '24px' }}>
            <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '24px', lineHeight: '1.6' }}>
              Market Overview
            </CardTitle>
            <CardDescription style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
              Current state of AI UGC platforms and market dynamics
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: '0 24px 24px 24px' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6" style={{ 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ color: '#000000', fontSize: '32px', fontWeight: 600, lineHeight: '1.6' }}>
                  $2.4B
                </div>
                <div style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                  Market Size 2024
                </div>
              </div>
              <div className="text-center p-6" style={{ 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ color: '#000000', fontSize: '32px', fontWeight: 600, lineHeight: '1.6' }}>
                  47%
                </div>
                <div style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                  YoY Growth Rate
                </div>
              </div>
              <div className="text-center p-6" style={{ 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ color: '#000000', fontSize: '32px', fontWeight: 600, lineHeight: '1.6' }}>
                  340M+
                </div>
                <div style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                  Active Users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Analysis Table */}
        <Card className="mb-12" style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardHeader style={{ padding: '24px' }}>
            <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '24px', lineHeight: '1.6' }}>
              Leading AI UGC Platforms
            </CardTitle>
            <CardDescription style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
              Analysis of top platforms driving AI-generated user content
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: '0 24px 24px 24px' }}>
            <div style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e5e5e5' }}>
                    <TableHead style={{ 
                      padding: '16px', 
                      color: '#000000', 
                      fontWeight: 600,
                      lineHeight: '1.6'
                    }}>
                      Platform
                    </TableHead>
                    <TableHead style={{ 
                      padding: '16px', 
                      color: '#000000', 
                      fontWeight: 600,
                      lineHeight: '1.6'
                    }}>
                      Content Type
                    </TableHead>
                    <TableHead style={{ 
                      padding: '16px', 
                      color: '#000000', 
                      fontWeight: 600,
                      lineHeight: '1.6'
                    }}>
                      Monthly Users
                    </TableHead>
                    <TableHead style={{ 
                      padding: '16px', 
                      color: '#000000', 
                      fontWeight: 600,
                      lineHeight: '1.6'
                    }}>
                      Revenue Model
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { platform: "Character.AI", type: "AI Conversations", users: "20M+", model: "Freemium" },
                    { platform: "Midjourney", type: "AI Art Generation", users: "15M+", model: "Subscription" },
                    { platform: "Replika", type: "AI Companions", users: "10M+", model: "Premium" },
                    { platform: "Janitor AI", type: "Character Chat", users: "8M+", model: "API Credits" },
                    { platform: "Poe by Quora", type: "Multi-AI Chat", users: "5M+", model: "Subscription" }
                  ].map((row, index) => (
                    <TableRow 
                      key={index}
                      style={{ 
                        borderBottom: index < 4 ? '1px solid #e5e5e5' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                      className="hover:bg-gray-50"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f8f8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <TableCell style={{ 
                        padding: '16px', 
                        color: '#000000', 
                        fontWeight: 500,
                        lineHeight: '1.6'
                      }}>
                        {row.platform}
                      </TableCell>
                      <TableCell style={{ 
                        padding: '16px', 
                        color: '#666666', 
                        fontWeight: 400,
                        lineHeight: '1.6'
                      }}>
                        {row.type}
                      </TableCell>
                      <TableCell style={{ 
                        padding: '16px', 
                        color: '#000000', 
                        fontWeight: 500,
                        lineHeight: '1.6'
                      }}>
                        {row.users}
                      </TableCell>
                      <TableCell style={{ 
                        padding: '16px', 
                        color: '#666666', 
                        fontWeight: 400,
                        lineHeight: '1.6'
                      }}>
                        {row.model}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Content Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e5e5', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <CardHeader style={{ padding: '24px' }}>
              <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '20px', lineHeight: '1.6' }}>
                Popular Content Types
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <div className="space-y-4">
                {[
                  { type: "AI-Generated Art", percentage: "34%" },
                  { type: "Character Conversations", percentage: "28%" },
                  { type: "AI Writing/Stories", percentage: "19%" },
                  { type: "Music & Audio", percentage: "12%" },
                  { type: "Video Content", percentage: "7%" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3" style={{
                    borderBottom: index < 4 ? '1px solid #e5e5e5' : 'none'
                  }}>
                    <span style={{ color: '#000000', fontWeight: 400, lineHeight: '1.6' }}>
                      {item.type}
                    </span>
                    <span style={{ color: '#666666', fontWeight: 500, lineHeight: '1.6' }}>
                      {item.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e5e5', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <CardHeader style={{ padding: '24px' }}>
              <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '20px', lineHeight: '1.6' }}>
                User Demographics
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <div className="space-y-4">
                {[
                  { demo: "Gen Z (18-24)", percentage: "42%" },
                  { demo: "Millennials (25-34)", percentage: "31%" },
                  { demo: "Gen X (35-44)", percentage: "18%" },
                  { demo: "Others", percentage: "9%" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3" style={{
                    borderBottom: index < 3 ? '1px solid #e5e5e5' : 'none'
                  }}>
                    <span style={{ color: '#000000', fontWeight: 400, lineHeight: '1.6' }}>
                      {item.demo}
                    </span>
                    <span style={{ color: '#666666', fontWeight: 500, lineHeight: '1.6' }}>
                      {item.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Trends */}
        <Card className="mb-12" style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardHeader style={{ padding: '24px' }}>
            <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '24px', lineHeight: '1.6' }}>
              Emerging Trends in AI UGC
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: '0 24px 24px 24px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 style={{ color: '#000000', fontWeight: 600, fontSize: '18px', marginBottom: '16px', lineHeight: '1.6' }}>
                  Technology Trends
                </h4>
                <ul className="space-y-3">
                  {[
                    "Multimodal AI content generation",
                    "Real-time collaborative AI creation",
                    "Personalized AI content curation",
                    "Cross-platform AI content sharing"
                  ].map((trend, index) => (
                    <li key={index} style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                      • {trend}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#000000', fontWeight: 600, fontSize: '18px', marginBottom: '16px', lineHeight: '1.6' }}>
                  Business Models
                </h4>
                <ul className="space-y-3">
                  {[
                    "Subscription-based premium features",
                    "API credit monetization",
                    "Creator revenue sharing",
                    "Enterprise licensing deals"
                  ].map((model, index) => (
                    <li key={index} style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                      • {model}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Opportunities */}
        <Card style={{ 
          backgroundColor: '#f9f9f9', 
          border: '1px solid #e5e5e5', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardHeader style={{ padding: '24px' }}>
            <CardTitle style={{ color: '#000000', fontWeight: 600, fontSize: '24px', lineHeight: '1.6' }}>
              Market Opportunities
            </CardTitle>
            <CardDescription style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
              Identified gaps and growth opportunities in the AI UGC space
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: '0 24px 24px 24px' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Niche Communities",
                  desc: "Specialized AI content platforms for specific industries and interests"
                },
                {
                  title: "B2B Solutions",
                  desc: "Enterprise-focused AI UGC tools for marketing and content creation"
                },
                {
                  title: "Mobile-First Platforms",
                  desc: "Quick, mobile-optimized AI content generation for social media"
                }
              ].map((opportunity, index) => (
                <div key={index} className="p-6" style={{ 
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h4 style={{ color: '#000000', fontWeight: 600, fontSize: '16px', marginBottom: '12px', lineHeight: '1.6' }}>
                    {opportunity.title}
                  </h4>
                  <p style={{ color: '#666666', fontWeight: 400, lineHeight: '1.6' }}>
                    {opportunity.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIUGC;
