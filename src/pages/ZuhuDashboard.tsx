import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Upload, 
  Zap, 
  Target, 
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Palette,
  Image,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface ProcessingStage {
  id: string;
  content_id: string;
  stage: string;
  status: string;
  started_at: string;
  completed_at?: string | null;
  error_message?: string | null;
  stage_data?: any;
  created_at: string;
}

interface ContentProcessing {
  id: string;
  content_id: string;
  status: string;
  category?: string;
  confidence_score?: number;
  processing_start: string;
  processing_end?: string;
  error_logs?: any;
}

interface SystemMetrics {
  total_processed: number;
  success_rate: number;
  avg_processing_time: number;
  category_breakdown: Record<string, number>;
  error_breakdown: Record<string, number>;
}

const PROCESSING_STAGES = [
  { key: 'analysis', label: 'Analysis', icon: Target },
  { key: 'generation', label: 'Generation', icon: Zap },
  { key: 'quality_check', label: 'Quality Check', icon: CheckCircle },
  { key: 'deployment', label: 'Deployment', icon: Upload }
];

const CONTENT_CATEGORIES = [
  'Trending AI Opportunities',
  'AI Automation',
  'Tool Comparisons', 
  'AI News',
  'AI Reality Check',
  'Builder Stories'
];

export default function ZuhuDashboard() {
  const [activeProcessing, setActiveProcessing] = useState<ContentProcessing[]>([]);
  const [recentStages, setRecentStages] = useState<ProcessingStage[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [rawContent, setRawContent] = useState('');
  const [contentId, setContentId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [designDirectives, setDesignDirectives] = useState<any[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);

  // Fetch real-time data
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const contentChannel = supabase
      .channel('content-processing')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'zuhu_content_processing'
      }, () => {
        fetchActiveProcessing();
      })
      .subscribe();

    const stagesChannel = supabase
      .channel('processing-stages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'zuhu_processing_stages'
      }, () => {
        fetchRecentStages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(contentChannel);
      supabase.removeChannel(stagesChannel);
    };
  }, []);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchActiveProcessing(),
      fetchRecentStages(),
      fetchMetrics(),
      fetchDesignDirectives(),
      fetchAssetData()
    ]);
  };

  const fetchActiveProcessing = async () => {
    const { data, error } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .in('status', ['received', 'processing', 'analyzing', 'generating', 'quality_checking', 'classified', 'design_approved', 'assets_validated'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setActiveProcessing(data);
    }
  };

  const fetchRecentStages = async () => {
    const { data, error } = await supabase
      .from('zuhu_processing_stages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setRecentStages(data);
    }
  };

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('zuhu_system_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setMetrics({
        total_processed: data[0].total_processed || 0,
        success_rate: data[0].success_rate || 0,
        avg_processing_time: data[0].avg_processing_time || 0,
        category_breakdown: (data[0].category_breakdown as Record<string, number>) || {},
        error_breakdown: (data[0].error_breakdown as Record<string, number>) || {}
      });
    }
  };

  const fetchDesignDirectives = async () => {
    const { data, error } = await supabase
      .from('design_directives')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setDesignDirectives(data);
    }
  };

  const fetchAssetData = async () => {
    const { data, error } = await supabase
      .from('asset_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setAssetData(data);
    }
  };

  const submitContent = async () => {
    if (!rawContent.trim() || !contentId.trim()) {
      toast.error('Please provide both content ID and raw content');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Parse JSON content
      let parsedContent;
      try {
        parsedContent = JSON.parse(rawContent);
      } catch {
        toast.error('Invalid JSON format');
        return;
      }

      // Insert into processing queue
      const { error: insertError } = await supabase
        .from('zuhu_content_processing')
        .insert({
          content_id: contentId,
          raw_content: parsedContent,
          status: 'received'
        });

      if (insertError) throw insertError;

      // Call the content classifier
      const { data, error } = await supabase.functions.invoke('zuhu-content-classifier', {
        body: {
          content_id: contentId,
          raw_content: parsedContent
        }
      });

      if (error) throw error;

      toast.success('Content submitted successfully!');
      setRawContent('');
      setContentId('');
      fetchActiveProcessing();
      
    } catch (error: any) {
      toast.error(`Failed to submit content: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger design processing for classified content
  const triggerDesignProcessing = async (contentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('zuhu-design-director', {
        body: { content_id: contentId }
      });

      if (error) throw error;

      toast.success('Design processing triggered!');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(`Failed to trigger design processing: ${error.message}`);
    }
  };

  // Trigger asset processing for design-approved content
  const triggerAssetProcessing = async (contentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('zuhu-asset-manager', {
        body: { content_id: contentId }
      });

      if (error) throw error;

      toast.success('Asset processing triggered!');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(`Failed to trigger asset processing: ${error.message}`);
    }
  };

  const getStageStatus = (contentId: string, stageName: string) => {
    const stage = recentStages.find(s => s.content_id === contentId && s.stage === stageName);
    return stage?.status || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">ZUHU Publishing System</h1>
            <p className="text-gray-400 text-lg">theboringdev • Intelligent Content Automation</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-900 text-green-200 border-green-700">
              <Activity className="w-4 h-4 mr-1" />
              System Active
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{metrics?.total_processed || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Articles this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{metrics?.success_rate || 0}%</div>
            <Progress value={metrics?.success_rate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Design Directives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{designDirectives.length}</div>
            <p className="text-xs text-gray-500 mt-1">Templates assigned</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Asset Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-400">{assetData.length}</div>
            <p className="text-xs text-gray-500 mt-1">Assets validated</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{activeProcessing.length}</div>
            <p className="text-xs text-gray-500 mt-1">In pipeline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Input */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Content Input
            </CardTitle>
            <CardDescription className="text-gray-400">
              Submit raw content for processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Content ID</label>
              <Input 
                placeholder="unique-content-id"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Raw Content (theboringdev format)</label>
              <Textarea 
                placeholder='[{"shipped_content": "# Your Article Title\\n\\nYour content...","image_seo_details": [{"url": "https://example.com/image.png","alt_text": "Image description","theme": "AI Development","style": "Minimalist","brand": "theboringdev"}],"seo_details_of_content": {"brief_id": "brief_example","keyword_id": "kw_example","trend_id": "trend_example","content_angle": "Example Angle","target_word_count": 2500,"status": "DRAFT"}}]'
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="min-h-[300px] bg-gray-900 border-gray-600 text-white font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-2">
                Expected format: Array with shipped_content (markdown), image_seo_details, and seo_details_of_content
              </p>
            </div>
            
            <Button 
              onClick={submitContent} 
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Submit Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Processing Pipeline */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Processing Pipeline
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time status of content processing stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProcessing.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No content currently processing
                </div>
              ) : (
                activeProcessing.map((item) => (
                  <div key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="font-medium text-white">{item.content_id}</h3>
                         <p className="text-sm text-gray-400">
                           Started {new Date(item.processing_start).toLocaleTimeString()}
                         </p>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge className={getStatusColor(item.status)}>
                           {item.status}
                         </Badge>
                         {item.status === 'classified' && (
                           <button
                             onClick={() => triggerDesignProcessing(item.content_id)}
                             className="inline-flex items-center px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                           >
                             <Play className="h-3 w-3 mr-1" />
                             Design
                           </button>
                         )}
                         {item.status === 'design_approved' && (
                           <button
                             onClick={() => triggerAssetProcessing(item.content_id)}
                             className="inline-flex items-center px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
                           >
                             <Play className="h-3 w-3 mr-1" />
                             Assets
                           </button>
                         )}
                       </div>
                     </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {PROCESSING_STAGES.map((stage, index) => {
                        const status = getStageStatus(item.content_id, stage.key);
                        const Icon = stage.icon;
                        
                        return (
                          <div key={stage.key} className="text-center">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2 ${
                              status === 'completed' 
                                ? 'bg-green-600 border-green-500' 
                                : status === 'processing'
                                ? 'bg-blue-600 border-blue-500 animate-pulse'
                                : status === 'failed'
                                ? 'bg-red-600 border-red-500'
                                : 'bg-gray-600 border-gray-500'
                            }`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs text-gray-400">{stage.label}</div>
                            {index < PROCESSING_STAGES.length - 1 && (
                              <div className="h-px bg-gray-600 mt-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Classification & Error Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Category Classification</CardTitle>
            <CardDescription className="text-gray-400">
              Content distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CONTENT_CATEGORIES.map((category) => {
                const count = metrics?.category_breakdown?.[category] || 0;
                const percentage = metrics?.total_processed 
                  ? Math.round((count / metrics.total_processed) * 100) 
                  : 0;
                
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{count}</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Error Tracking
            </CardTitle>
            <CardDescription className="text-gray-400">
              System health and error monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Classification Errors</span>
                <Badge variant="outline" className="text-red-400 border-red-700">
                  {metrics?.error_breakdown?.classification || 0}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Generation Errors</span>
                <Badge variant="outline" className="text-yellow-400 border-yellow-700">
                  {metrics?.error_breakdown?.generation || 0}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Quality Check Errors</span>
                <Badge variant="outline" className="text-orange-400 border-orange-700">
                  {metrics?.error_breakdown?.quality_check || 0}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Deployment Errors</span>
                <Badge variant="outline" className="text-red-400 border-red-700">
                  {metrics?.error_breakdown?.deployment || 0}
                </Badge>
              </div>
              
              <Separator className="bg-gray-600" />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retry Failed
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Pause className="w-4 h-4 mr-1" />
                  Emergency Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}