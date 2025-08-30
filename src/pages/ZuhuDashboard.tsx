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
  TrendingUp,
  Shield,
  ExternalLink,
  GitCommit,
  Globe
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

interface QualityAudit {
  id: string;
  content_id: string;
  quality_score: number;
  audit_results: any;
  issues_found: any[];
  recommendations: any[];
  status: string;
  created_at: string;
}

interface DeploymentBatch {
  id: string;
  batch_id: string;
  content_ids: string[];
  batch_status: string;
  github_commit_sha?: string;
  published_urls: string[];
  created_at: string;
  deployment_completed_at?: string;
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
  const [qualityAudits, setQualityAudits] = useState<QualityAudit[]>([]);
  const [deploymentBatches, setDeploymentBatches] = useState<DeploymentBatch[]>([]);
  
  // New agent tracking states
  const [agentActivities, setAgentActivities] = useState<any[]>([]);
  const [pipelineMonitoring, setPipelineMonitoring] = useState<any[]>([]);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // FREE TIER: Polling-based updates instead of real-time subscriptions
  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 10 seconds for near real-time feel (FREE TIER OPTIMIZED)
    let intervalId: NodeJS.Timeout;
    
    if (isAutoRefreshEnabled) {
      intervalId = setInterval(() => {
        fetchDashboardData();
        setLastRefresh(new Date());
      }, 10000); // 10-second polling for free tier
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoRefreshEnabled]);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchActiveProcessing(),
      fetchRecentStages(),
      fetchMetrics(),
      fetchDesignDirectives(),
      fetchAssetData(),
      fetchQualityAudits(),
      fetchDeploymentBatches(),
      // New agent tracking data
      fetchAgentActivities(),
      fetchPipelineMonitoring()
    ]);
  };

  // NEW: Fetch agent activities for real-time tracking
  const fetchAgentActivities = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('zuhu-agent-tracker', {
        body: {
          action: 'get_agent_activities',
          data: { limit: 100 }
        }
      });

      if (!error && data?.success) {
        setAgentActivities(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching agent activities:', error);
    }
  };

  // NEW: Fetch pipeline monitoring for pipeline visualization
  const fetchPipelineMonitoring = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('zuhu-agent-tracker', {
        body: {
          action: 'get_pipeline_status',
          data: {}
        }
      });

      if (!error && data?.success) {
        setPipelineMonitoring(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pipeline monitoring:', error);
    }
  };

  // NEW: Manual refresh button
  const handleManualRefresh = async () => {
    await fetchDashboardData();
    setLastRefresh(new Date());
    toast.success('Dashboard refreshed!');
  };

  const fetchActiveProcessing = async () => {
    const { data, error } = await supabase
      .from('zuhu_content_processing')
      .select('*')
      .in('status', ['received', 'processing', 'classified', 'design_approved', 'assets_processed', 'assets_validated', 'page_created', 'seo_optimized', 'quality_approved', 'requires_manual_review', 'approved_for_publishing'])
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

  const fetchQualityAudits = async () => {
    const { data, error } = await supabase
      .from('quality_audits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setQualityAudits(data.map(audit => ({
        ...audit,
        issues_found: Array.isArray(audit.issues_found) ? audit.issues_found : [],
        recommendations: Array.isArray(audit.recommendations) ? audit.recommendations : []
      })));
    }
  };

  const fetchDeploymentBatches = async () => {
    const { data, error } = await supabase
      .from('deployment_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setDeploymentBatches(data.map(batch => ({
        ...batch,
        content_ids: (Array.isArray(batch.content_ids) ? batch.content_ids : []) as string[],
        published_urls: (Array.isArray(batch.published_urls) ? batch.published_urls : []) as string[]
      })));
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

      // Call the unified ZUHU processor
      const { data, error } = await supabase.functions.invoke('zuhu-unified-processor', {
        body: {
          content_id: contentId,
          raw_content: parsedContent
        }
      });

      if (error) throw error;

      toast.success('Content submitted to unified pipeline successfully!');
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

  // Trigger quality audit for content
  const triggerQualityAudit = async (contentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('quality-fortress', {
        body: { content_id: contentId }
      });

      if (error) throw error;

      toast.success('Quality audit triggered!');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(`Failed to trigger quality audit: ${error.message}`);
    }
  };

  // Trigger autonomous publishing
  const triggerAutonomousPublishing = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('autonomous-publishing-engine', {
        body: {}
      });

      if (error) throw error;

      toast.success('Autonomous publishing triggered!');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(`Failed to trigger publishing: ${error.message}`);
    }
  };

  const getStageStatus = (contentId: string, stageName: string) => {
    const stage = recentStages.find(s => s.content_id === contentId && s.stage === stageName);
    return stage?.status || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'live': return 'text-green-600 bg-green-50 border-green-200';
      case 'approved_for_publishing': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'quality_approved': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'requires_manual_review': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
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
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity className="w-4 h-4" />
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button 
              onClick={handleManualRefresh}
              variant="outline" 
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
              variant="outline" 
              size="sm"
              className={isAutoRefreshEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isAutoRefreshEnabled ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              Auto-refresh {isAutoRefreshEnabled ? 'ON' : 'OFF'}
            </Button>
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

      {/* Quality Audits & Deployment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Quality Fortress
              </div>
              <Button 
                onClick={() => fetchQualityAudits()}
                variant="outline" 
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest quality audit results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityAudits.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No quality audits found
                </div>
              ) : (
                qualityAudits.slice(0, 5).map((audit) => (
                  <div key={audit.id} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white text-sm">{audit.content_id}</h4>
                        <p className="text-xs text-gray-400">
                          {new Date(audit.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-lg font-bold ${getQualityScoreColor(audit.quality_score)}`}>
                          {audit.quality_score}
                        </div>
                        <Badge className={getStatusColor(audit.status)} variant="outline">
                          {audit.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {audit.issues_found?.length || 0} issues • {audit.recommendations?.length || 0} recommendations
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <GitCommit className="w-5 h-5 mr-2" />
                Autonomous Publishing
              </div>
              <Button 
                onClick={triggerAutonomousPublishing}
                variant="outline" 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                <Play className="w-4 h-4 mr-1" />
                Publish Now
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Deployment batch status & live URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deploymentBatches.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No deployment batches found
                </div>
              ) : (
                deploymentBatches.slice(0, 3).map((batch) => (
                  <div key={batch.id} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white text-sm">{batch.batch_id}</h4>
                        <p className="text-xs text-gray-400">
                          {batch.content_ids.length} articles • {new Date(batch.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(batch.batch_status)} variant="outline">
                        {batch.batch_status}
                      </Badge>
                    </div>
                    {batch.published_urls.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {batch.published_urls.slice(0, 2).map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            Live
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ))}
                        {batch.published_urls.length > 2 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{batch.published_urls.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Agent Activity Feed & Pipeline Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Real-Time Agent Activity Feed */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Agent Activity Feed
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-700">
                {agentActivities.length} Activities
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time agent I/O tracking • Free tier polling (10s updates)
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {agentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No agent activities yet
                </div>
              ) : (
                agentActivities.slice(0, 20).map((activity) => (
                  <div 
                    key={activity.id} 
                    className="bg-gray-900 rounded-lg p-3 border border-gray-600 hover:bg-gray-850 cursor-pointer"
                    onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={
                              activity.interaction_type === 'input' ? 'text-blue-400 border-blue-700' :
                              activity.interaction_type === 'output' ? 'text-green-400 border-green-700' :
                              activity.interaction_type === 'error' ? 'text-red-400 border-red-700' :
                              'text-yellow-400 border-yellow-700'
                            }
                          >
                            {activity.interaction_type}
                          </Badge>
                          <span className="font-medium text-white text-sm">{activity.agent_name}</span>
                          {activity.processing_time_ms && (
                            <span className="text-xs text-gray-400">
                              {activity.processing_time_ms}ms
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {activity.content_id} • {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {activity.status && (
                          <Badge className={getStatusColor(activity.status)} variant="outline">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {expandedActivity === activity.id && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <h4 className="text-sm font-medium text-white mb-2">
                          {activity.interaction_type === 'input' ? 'Input Data:' : 
                           activity.interaction_type === 'output' ? 'Output Data:' : 
                           'Error Data:'}
                        </h4>
                        <pre className="text-xs bg-gray-800 p-2 rounded border border-gray-600 overflow-x-auto">
                          {JSON.stringify(activity.interaction_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Monitoring with Current States */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Pipeline Monitoring
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-700">
                {pipelineMonitoring.filter(p => p.stage_status === 'active').length} Active
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current agent processing states and pipeline flow
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {pipelineMonitoring.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active pipeline processes
                </div>
              ) : (
                pipelineMonitoring.slice(0, 10).map((pipeline) => (
                  <div key={pipeline.id} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white text-sm">{pipeline.content_id}</h4>
                        <p className="text-xs text-gray-400">
                          Stage: {pipeline.pipeline_stage} • Agent: {pipeline.current_agent || 'None'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            pipeline.stage_status === 'active' ? 'text-green-400 bg-green-900 border-green-700' :
                            pipeline.stage_status === 'completed' ? 'text-blue-400 bg-blue-900 border-blue-700' :
                            pipeline.stage_status === 'error' ? 'text-red-400 bg-red-900 border-red-700' :
                            'text-gray-400 bg-gray-900 border-gray-700'
                          }
                          variant="outline"
                        >
                          {pipeline.stage_status}
                        </Badge>
                      </div>
                    </div>
                    
                    {pipeline.processing_started_at && (
                      <div className="text-xs text-gray-500">
                        Started: {new Date(pipeline.processing_started_at).toLocaleTimeString()} • 
                        Last activity: {new Date(pipeline.last_activity).toLocaleTimeString()}
                      </div>
                    )}
                    
                    {pipeline.error_data && (
                      <div className="mt-2 p-2 bg-red-900 border border-red-700 rounded">
                        <p className="text-xs text-red-200">
                          Error: {JSON.stringify(pipeline.error_data).substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Input */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              ZUHU Unified Pipeline
            </CardTitle>
            <CardDescription className="text-gray-400">
              Submit raw content to the complete ZUHU processing pipeline
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
                One endpoint processes all three AI agents: Content Classification → Design Direction → Asset Validation
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
                  Submit to Unified Pipeline
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
                          {item.status === 'seo_optimized' && (
                            <button
                              onClick={() => triggerQualityAudit(item.content_id)}
                              className="inline-flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Quality
                            </button>
                          )}
                          {item.status === 'approved_for_publishing' && (
                            <Badge className="bg-emerald-600 text-white">
                              Ready for Publishing
                            </Badge>
                          )}
                          {item.status === 'requires_manual_review' && (
                            <Badge className="bg-orange-600 text-white">
                              Needs Review
                            </Badge>
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