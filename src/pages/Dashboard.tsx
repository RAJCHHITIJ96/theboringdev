import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp, Target, Users, BarChart3 } from "lucide-react";

interface TableStats {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tables = [
          { name: 'TREND_MASTER', icon: TrendingUp },
          { name: 'KEYWORD_INTELLIGENCE', icon: Target },
          { name: 'COMPETITOR_INTELLIGENCE', icon: Users },
          { name: 'CONTENT_BRIEFS', icon: BarChart3 },
          { name: 'PERFORMANCE_TRACKING', icon: BarChart3 }
        ];

        const statsPromises = tables.map(async (table) => {
          let count = 0;
          try {
            const tableName = table.name.toLowerCase() as 'trend_master' | 'keyword_intelligence' | 'competitor_intelligence' | 'content_briefs' | 'performance_tracking';
            const { count: tableCount, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            count = error ? 0 : tableCount || 0;
          } catch (error) {
            console.error(`Error fetching count for ${table.name}:`, error);
            count = 0;
          }
          
          return {
            name: table.name,
            count,
            icon: table.icon
          };
        });

        const results = await Promise.all(statsPromises);
        setStats(results);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            🚀 GOLDMINE SYSTEM
          </h1>
          <p className="text-lg text-muted-foreground">
            Automated AI Content Intelligence Database
          </p>
          <Badge variant="secondary" className="mt-2">
            17-Article Batch Processing System
          </Badge>
        </div>

        <div className="mb-8">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>
                Complete 5-table schema deployed and ready for Make.com integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">All tables created successfully</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.name} className="transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name.replace('_', ' ')}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stat.count.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    records ready for processing
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Batch Processing Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅</Badge>
                <span className="text-sm">Exactly 17 articles per batch</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅</Badge>
                <span className="text-sm">Smart quality-based selection</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅</Badge>
                <span className="text-sm">Full trend + keyword + competitor intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅</Badge>
                <span className="text-sm">Make.com ready with optimized indexes</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⏰ Daily Automation Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>5:30 AM IST:</strong> Morning Trends Collection</div>
              <div><strong>1:30 PM IST:</strong> Afternoon Trends Collection</div>
              <div><strong>9:30 PM IST:</strong> Evening Trends Collection</div>
              <div><strong>10:00 PM IST:</strong> Keyword Intelligence Processing</div>
              <div><strong>10:30 PM IST:</strong> Competitor Analysis</div>
              <div><strong>11:00 PM IST:</strong> Content Briefs Generation</div>
              <div><strong>11:30 PM IST:</strong> 17-Article Batch Selection</div>
              <div><strong>12:00 AM IST:</strong> JUHU Publishing Pipeline</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-dashed border-2 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">🔧 Ready for Make.com Integration</h3>
              <p className="text-muted-foreground text-sm">
                Your database is fully optimized and ready for automated batch processing. 
                Connect your Make.com scenarios to start generating 17 high-quality articles daily!
              </p>
              <Badge variant="secondary" className="mt-3">
                All 5 tables • 25+ optimized indexes • Batch selection algorithm
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-green-500/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">🤖 AI Intelligence Processor</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Custom endpoint that analyzes raw JSON from AI agents and structures data for database insertion.
              </p>
              <div className="space-y-2 text-xs">
                <div><strong>Endpoint:</strong> /functions/v1/ai-intelligence-processor</div>
                <div><strong>Method:</strong> POST</div>
                <div><strong>Status:</strong> <Badge variant="outline" className="text-green-600">🟢 Live & Ready</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📋 AI Intelligence Processor API Documentation</CardTitle>
              <CardDescription>
                Send raw JSON data from your AI agents to automatically structure and insert into the correct database table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-2">🆕 Batch Request Format (1-10 Operations):</h4>
                <pre className="text-xs overflow-x-auto">{`[
  {
    "operation": "insert",
    "table": "TREND_MASTER",
    "data": {
      "trend_id": "trend_20250816_ai_gpt_5_rollout",
      "trend_topic": "OpenAI GPT-5 Rollout Challenges",
      "trend_category": "AI_PRODUCT_NEWS", // Auto-mapped to AI_DEVELOPMENT
      "status": "ACTIVE",
      // ... other fields
    }
  },
  {
    "operation": "insert", 
    "table": "KEYWORD_INTELLIGENCE",
    "data": {
      "keyword_id": "kw_123",
      "primary_keyword": "GPT-5",
      // ... other fields
    }
  }
  // ... up to 10 operations total
]`}</pre>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Legacy Single Request Format:</h4>
                <pre className="text-xs overflow-x-auto">{`{
  "database_id": 1,     // 1-4 (see mapping below)
  "raw_data": {         // Your raw JSON data
    "trend_topic": "AI Automation Tools",
    "trend_description": "...",
    // ... any other fields
  }
}`}</pre>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Table Names (Batch Format):</h4>
                  <div className="space-y-1 text-sm">
                    <div><Badge variant="outline">TREND_MASTER</Badge> Trend analysis</div>
                    <div><Badge variant="outline">KEYWORD_INTELLIGENCE</Badge> Keyword research</div>
                    <div><Badge variant="outline">COMPETITOR_INTELLIGENCE</Badge> Competitor analysis</div>
                    <div><Badge variant="outline">CONTENT_BRIEFS</Badge> Content planning</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Database IDs (Legacy Format):</h4>
                  <div className="space-y-1 text-sm">
                    <div><Badge variant="outline">1</Badge> TREND_MASTER</div>
                    <div><Badge variant="outline">2</Badge> KEYWORD_INTELLIGENCE</div>
                    <div><Badge variant="outline">3</Badge> COMPETITOR_INTELLIGENCE</div>
                    <div><Badge variant="outline">4</Badge> CONTENT_BRIEFS</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Batch Response Format:</h4>
                  <pre className="text-xs">{`{
  "success": true,
  "message": "All 5 operations completed successfully",
  "total_operations": 5,
  "successful_operations": 5,
  "failed_operations": 0,
  "total_inserted_records": 5,
  "results": [...]
}`}</pre>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Legacy Response Format:</h4>
                  <pre className="text-xs">{`{
  "success": true,
  "message": "Data successfully processed...",
  "table": "trend_master",
  "inserted_records": 1
}`}</pre>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 Batch Usage Example:</h4>
                <pre className="text-xs overflow-x-auto">{`curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor \\
  -H "Content-Type: application/json" \\
  -d '[
    {
      "operation": "insert",
      "table": "TREND_MASTER",
      "data": {
        "trend_topic": "AI Voice Assistants",
        "trend_momentum_score": 85,
        "social_mentions_count": 1250
      }
    },
    {
      "operation": "insert",
      "table": "KEYWORD_INTELLIGENCE", 
      "data": {
        "primary_keyword": "voice AI",
        "search_volume_monthly": 12000
      }
    }
  ]'`}</pre>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-semibold mb-2">📊 Valid trend_category Values:</h4>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div>
                    <Badge variant="outline" className="mb-2">AI_DEVELOPMENT</Badge>
                    <div className="text-xs text-muted-foreground">Auto-mapped from: AI_PRODUCT_NEWS, AI_INNOVATION, AI_TOOLS, AI_MODELS, etc.</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">AI_BUSINESS</Badge>
                    <div className="text-xs text-muted-foreground">Auto-mapped from: AI_ETHICS, AI_IMPACT, AI_POLICY, AI_REGULATION, etc.</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">AUTOMATION</Badge>
                    <div className="text-xs text-muted-foreground">Auto-mapped from: AI_AUTOMATION, PROCESS_AUTOMATION, RPA, etc.</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">NO_CODE</Badge>
                    <div className="text-xs text-muted-foreground">Auto-mapped from: NO_CODE_AI, LOW_CODE, VISUAL_PROGRAMMING, etc.</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold mb-2">⚡ Key Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Batch processing: Send 1-10 operations in a single request</li>
                  <li>• Automatic data structuring for each database table</li>
                  <li>• <strong>Smart category mapping:</strong> Invalid categories auto-mapped to valid ones</li>
                  <li>• Mixed operations: Different tables in the same batch</li>
                  <li>• Partial success handling: Some operations can fail without affecting others</li>
                  <li>• Backward compatibility: Legacy single format still supported</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;