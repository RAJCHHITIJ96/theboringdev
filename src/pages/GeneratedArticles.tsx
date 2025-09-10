import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Eye, BarChart3, Search } from "lucide-react";
import { toast } from "sonner";

interface GeneratedPage {
  id: string;
  content_id: string;
  page_content: string;
  page_metadata: any;
  performance_metrics: any;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

const GeneratedArticles = () => {
  const [articles, setArticles] = useState<GeneratedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchGeneratedArticles();
  }, []);

  const fetchGeneratedArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        toast.error('Failed to load generated articles');
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load generated articles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'live': 'bg-green-500 text-white',
      'seo_optimized': 'bg-blue-500 text-white',
      'page_created': 'bg-yellow-500 text-white',
      'quality_approved': 'bg-purple-500 text-white',
      'approved_for_publishing': 'bg-indigo-500 text-white',
      'failed': 'bg-red-500 text-white',
      'draft': 'bg-gray-500 text-white'
    };
    return statusColors[status] || 'bg-gray-500 text-white';
  };

  const generateLiveURL = (article: GeneratedPage) => {
    const metadata = article.page_metadata;
    if (metadata?.category && metadata?.title) {
      const category = metadata.category.toLowerCase().replace(/\s+/g, '-');
      const slug = metadata.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `/${category}/${slug}`;
    }
    return `#no-url-available`;
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.content_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.page_metadata?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.page_metadata?.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(articles.map(a => a.status)));

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NewHeader />
        <div className="max-w-[1200px] mx-auto pt-32 pb-16 px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading generated articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Generated Articles Dashboard - AI Content Management</title>
        <meta name="description" content="View and manage all AI-generated articles, track their status, and access live URLs." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <NewHeader />
      
      {/* Header Section */}
      <header className="max-w-[1200px] mx-auto pt-32 pb-16 text-center px-10">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">
          Generated Articles Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track and manage all AI-generated articles, monitor their status, and access live URLs.
        </p>
      </header>

      {/* Filters Section */}
      <div className="max-w-[1200px] mx-auto px-10 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by title, category, or content ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All ({articles.length})
            </Button>
            {uniqueStatuses.map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                {status} ({articles.filter(a => a.status === status).length})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-[1200px] mx-auto px-10 pb-32">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {articles.length === 0 ? 'No articles generated yet.' : 'No articles match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(article.status)}>
                      {article.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      v{article.version}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.page_metadata?.title || 'Untitled Article'}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {article.page_metadata?.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      Score: {article.performance_metrics?.overallScore || 'N/A'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Category:</span> {article.page_metadata?.category || 'General'}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Content ID:</span> {article.content_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Reading Time:</span> {article.performance_metrics?.readingTime || 'N/A'} min
                    </div>
                  </div>

                  {article.status === 'live' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const url = generateLiveURL(article);
                        if (url !== '#no-url-available') {
                          window.open(url, '_blank');
                        } else {
                          toast.error('Live URL not available for this article');
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Article
                    </Button>
                  )}

                  {article.status !== 'live' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Not Published Yet
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratedArticles;