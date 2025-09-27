import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  content_id: string;
  status: string;
  category: string;
  created_at: string;
  processing_start?: string;
  processing_end?: string;
  quality_metrics?: any;
  seo_elements?: any;
}

const GeneratedArticles = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Existing static pages to show as CTAs
  const existingPages = [
    {
      title: "AI Agent Security: The No-Nonsense Guide to Prompt Injection & Malicious Use",
      description: "Practical defense strategies for AI agent security using the BORINGDEV method. Learn about prompt injection, malicious use, and how to build bulletproof AI agents.",
      url: "/ai-automation/ai-agent-security-the-nononsense-guide-to-prompt-injection-malicious-use",
      category: "AI Security",
      status: "live"
    },
    {
      title: "AI Automation",
      description: "Building automated workflows that actually work. Real automation systems with measurable ROI from actual businesses, not theoretical frameworks.",
      url: "/ai-automation",
      category: "AI Automation", 
      status: "live"
    }
  ];

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('zuhu_content_processing')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerQualityApproval = async () => {
    try {
      setRefreshing(true);
      
      const response = await supabase.functions.invoke('quality-approval-agent', {});
      
      if (response.error) throw response.error;
      
      toast({
        title: "Quality Approval Triggered",
        description: `Processing ${response.data?.approved_count || 0} items for approval`,
      });
      
      // Refresh data
      await fetchContentItems();
    } catch (error) {
      console.error('Error triggering quality approval:', error);
      toast({
        title: "Error",
        description: "Failed to trigger quality approval",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const triggerPublishing = async () => {
    try {
      setRefreshing(true);
      
      const response = await supabase.functions.invoke('autonomous-publishing-scheduler', {});
      
      if (response.error) throw response.error;
      
      toast({
        title: "Publishing Triggered",
        description: `Processing ${response.data?.success_count || 0} items for publishing`,
      });
      
      // Refresh data
      await fetchContentItems();
    } catch (error) {
      console.error('Error triggering publishing:', error);
      toast({
        title: "Error",
        description: "Failed to trigger publishing",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'approved_for_publishing': return 'bg-blue-100 text-blue-800';
      case 'seo_optimized': return 'bg-purple-100 text-purple-800';
      case 'publishing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-4 h-4" />;
      case 'publishing': return <Loader className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Generated Articles Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              Monitor and manage your autonomous content pipeline
            </p>
            
            <div className="flex gap-4 mb-6">
              <Button 
                onClick={triggerQualityApproval}
                disabled={refreshing}
                variant="outline"
              >
                {refreshing ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                Trigger Quality Approval
              </Button>
              <Button 
                onClick={triggerPublishing}
                disabled={refreshing}
              >
                {refreshing ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                Trigger Publishing
              </Button>
              <Button 
                onClick={fetchContentItems}
                disabled={loading}
                variant="ghost"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Existing Live Articles */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Live Articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {existingPages.map((page, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">{page.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Live
                          </Badge>
                          <Badge variant="outline">{page.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full"
                    >
                      <a href={page.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Article
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pipeline Content */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Pipeline Status</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin mr-2" />
                <span>Loading pipeline status...</span>
              </div>
            ) : contentItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No content items found in the pipeline</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {contentItems.map((item) => (
                  <Card key={item.content_id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {item.seo_elements?.title || item.content_id}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status}</span>
                            </Badge>
                            {item.category && (
                              <Badge variant="outline">{item.category}</Badge>
                            )}
                          </div>
                          {item.quality_metrics?.word_count && (
                            <div className="text-sm text-muted-foreground">
                              {item.quality_metrics.word_count} words
                              {item.quality_metrics.seo_score && (
                                <span className="ml-2">• SEO: {item.quality_metrics.seo_score}/100</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
                          {item.quality_metrics?.deployed_at && (
                            <div>Deployed: {new Date(item.quality_metrics.deployed_at).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                      {item.seo_elements?.description && (
                        <CardDescription className="line-clamp-2">
                          {item.seo_elements.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {item.status === 'live' && item.quality_metrics?.deployment_url ? (
                        <Button 
                          asChild 
                          size="sm"
                          className="w-full"
                        >
                          <a 
                            href={item.quality_metrics.deployment_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Live Article
                          </a>
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {item.status === 'seo_optimized' && 'Ready for quality approval'}
                          {item.status === 'approved_for_publishing' && 'Ready for publishing'}
                          {item.status === 'publishing' && 'Currently being published...'}
                          {item.status === 'failed' && 'Publishing failed - check logs'}
                          {!['seo_optimized', 'approved_for_publishing', 'publishing', 'failed'].includes(item.status) && 
                            'In progress...'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GeneratedArticles;
