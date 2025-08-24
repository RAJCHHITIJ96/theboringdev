import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, ArrowRight, Zap, Brain, Target, BarChart3, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ConversionMode = 'strict' | 'smart' | 'batch';
type ConversionStatus = 'idle' | 'success' | 'error';

interface ConversionMetadata {
  conversionMethod: string;
  processingTimeMs: number;
  conversionMode: string;
  itemsProcessed: number;
  targetTables: string;
}

const MCPConverter = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>('idle');
  const [conversionMode, setConversionMode] = useState<ConversionMode>('smart');
  const [enableValidationReport, setEnableValidationReport] = useState(false);
  const [metadata, setMetadata] = useState<ConversionMetadata | null>(null);
  const [validationReport, setValidationReport] = useState<any>(null);

  const handleConvert = async () => {
    if (!inputJson.trim()) {
      toast.error('Please provide input JSON data');
      return;
    }

    setIsConverting(true);
    setConversionStatus('idle');
    setOutputJson('');
    setMetadata(null);
    setValidationReport(null);

    try {
      // Parse input to validate JSON
      const parsedInput = JSON.parse(inputJson);
      
      const { data, error } = await supabase.functions.invoke('mcp-converter', {
        body: { 
          inputData: parsedInput,
          conversionMode,
          enableValidationReport
        }
      });

      if (error) {
        throw new Error(error.message || 'Conversion failed');
      }

      // Handle new clean response format (data is now the array directly)
      setOutputJson(JSON.stringify(data, null, 2));
      setMetadata(null); // No metadata in clean format
      setValidationReport(null); // No validation report in clean format
      setConversionStatus('success');
      
      const itemCount = Array.isArray(data) ? data.length : 1;
      const successMsg = `✅ Successfully converted ${itemCount} item(s)`;
      toast.success(successMsg);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to convert JSON');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputJson);
    toast.success('Output copied to clipboard!');
  };

  const getModeIcon = (mode: ConversionMode) => {
    switch (mode) {
      case 'strict': return Target;
      case 'smart': return Brain;
      case 'batch': return BarChart3;
    }
  };

  const getModeColor = (mode: ConversionMode) => {
    switch (mode) {
      case 'strict': return 'text-orange-500';
      case 'smart': return 'text-blue-500';
      case 'batch': return 'text-green-500';
    }
  };

  const getModeDescription = (mode: ConversionMode) => {
    switch (mode) {
      case 'strict': return 'Minimal conversions, exact input preservation';
      case 'smart': return 'AI-powered with intelligent defaults and foreign key creation';
      case 'batch': return 'Optimized for bulk processing with dependency ordering';
    }
  };

  const loadExample = () => {
    const exampleData = [
      {
        "operation": "insert",
        "table": "TREND_MASTER",
        "data": {
          "trend_id": "trend_20250823_ai_example",
          "trend_topic": "AI Example Trend",
          "trend_description": "Example trend description for testing speed of light conversion",
          "discovery_time_period": "day",
          "google_trends_score": "Breakout",
          "trend_category": "AI_INFRASTRUCTURE",
          "status": "ACTIVE"
        }
      },
      {
        "operation": "insert", 
        "table": "KEYWORD_INTELLIGENCE",
        "data": {
          "keyword_id": "kw_ai_example",
          "trend_id": "trend_20250823_ai_example",
          "primary_keyword": "AI speed optimization",
          "search_volume_monthly": 5000,
          "keyword_difficulty": 65,
          "search_intent": "informational"
        }
      }
    ];
    setInputJson(JSON.stringify(exampleData, null, 2));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          MCP JSON Schema Converter
          <Badge variant="outline" className="ml-2">Speed of Light ⚡</Badge>
        </h1>
        <p className="text-muted-foreground mb-6">
          Intelligent JSON converter powered by Gemini 2.0 Flash with complete database schema support and smart conversion modes
        </p>

        {/* Conversion Mode Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Conversion Settings</CardTitle>
            <CardDescription>
              Configure how your data should be processed and converted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conversion-mode">Conversion Mode</Label>
                <Select value={conversionMode} onValueChange={(value: ConversionMode) => setConversionMode(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversion mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">Strict Mode</div>
                          <div className="text-xs text-muted-foreground">Minimal conversions, exact input preservation</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="smart">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">Smart Mode (Recommended)</div>
                          <div className="text-xs text-muted-foreground">AI-powered with intelligent defaults</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="batch">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">Batch Mode</div>
                          <div className="text-xs text-muted-foreground">Optimized for bulk processing</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="validation-report"
                  checked={enableValidationReport}
                  onCheckedChange={setEnableValidationReport}
                />
                <Label htmlFor="validation-report">Enable Validation Report</Label>
              </div>
            </div>

            {/* Current Mode Description */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(getModeIcon(conversionMode), { 
                  className: `h-4 w-4 ${getModeColor(conversionMode)}` 
                })}
                <span className="font-medium">Current Mode: {conversionMode.charAt(0).toUpperCase() + conversionMode.slice(1)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getModeDescription(conversionMode)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Raw JSON Input
              <Badge variant="outline">Source Data</Badge>
            </CardTitle>
            <CardDescription>
              Paste your raw JSON data for any supported table (TREND_MASTER, KEYWORD_INTELLIGENCE, COMPETITOR_INTELLIGENCE, CONTENT_BRIEFS, PERFORMANCE_TRACKING)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button onClick={loadExample} variant="outline" size="sm">
                Load Example
              </Button>
              <Button 
                onClick={() => setInputJson('')} 
                variant="ghost" 
                size="sm"
              >
                Clear
              </Button>
            </div>
            <Textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database-Compliant Output
              <Badge variant="outline">Converted Data</Badge>
              {conversionStatus === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {conversionStatus === 'error' && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              {metadata && (
                <Badge variant="secondary" className="ml-auto">
                  {metadata.processingTimeMs}ms
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-converted JSON with complete schema validation and foreign key intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={handleCopyOutput}
                variant="outline"
                size="sm"
                disabled={!outputJson}
              >
                Copy Output
              </Button>
              <Button 
                onClick={() => setOutputJson('')} 
                variant="ghost" 
                size="sm"
                disabled={!outputJson}
              >
                Clear
              </Button>
            </div>
            <Textarea
              value={outputJson}
              readOnly
              placeholder="Converted JSON will appear here..."
              className="min-h-[400px] font-mono text-sm bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleConvert}
          disabled={!inputJson.trim() || isConverting}
          size="lg"
          className="min-w-[200px]"
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              Convert JSON
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Metadata & Validation Report */}
      {(metadata || validationReport) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Conversion Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <Badge variant="outline" className="ml-2">{metadata.conversionMethod}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="ml-2 font-mono">{metadata.processingTimeMs}ms</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="ml-2 capitalize">{metadata.conversionMode}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-2">{metadata.itemsProcessed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {validationReport && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Tables Processed: <Badge variant="outline">{validationReport.tablesProcessed.length}</Badge></div>
                  <div className="text-xs text-muted-foreground">
                    {validationReport.tablesProcessed.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Enhanced Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI-Powered Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Uses Gemini 2.0 Flash with complete database schema knowledge and intelligent foreign key dependency creation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Complete Schema Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Full validation for all 5 database tables with smart field mappings, enum conversions, and constraint enforcement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Smart Field Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced conversions: "day" → "afternoon", "Breakout" → 100, string truncation, and JSON field handling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Performance Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Speed of light processing with parallel operations, caching, and real-time performance tracking
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCPConverter;