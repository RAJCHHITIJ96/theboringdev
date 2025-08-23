import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MCPConverter = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConvert = async () => {
    if (!inputJson.trim()) {
      toast.error('Please provide input JSON data');
      return;
    }

    setIsConverting(true);
    setConversionStatus('idle');
    setOutputJson('');

    try {
      // Parse input to validate JSON
      const parsedInput = JSON.parse(inputJson);
      
      const { data, error } = await supabase.functions.invoke('mcp-converter', {
        body: { inputData: parsedInput }
      });

      if (error) {
        throw new Error(error.message || 'Conversion failed');
      }

      setOutputJson(JSON.stringify(data.convertedData, null, 2));
      setConversionStatus('success');
      toast.success('JSON successfully converted to database-compliant format!');
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

  const loadExample = () => {
    const exampleData = [
      {
        "operation": "insert",
        "table": "TREND_MASTER",
        "data": {
          "trend_id": "trend_20250823_ai_example",
          "trend_topic": "AI Example Trend",
          "trend_description": "Example trend description for testing",
          "discovery_time_period": "day",
          "google_trends_score": "Breakout",
          "trend_category": "AI_INFRASTRUCTURE",
          "status": "ACTIVE"
        }
      }
    ];
    setInputJson(JSON.stringify(exampleData, null, 2));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MCP JSON Schema Converter</h1>
        <p className="text-muted-foreground">
          Intelligent JSON converter powered by Gemini 2.5 Flash that transforms raw data into database-compliant format
        </p>
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
              Paste your raw JSON data that needs to be converted for database insertion
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
            </CardTitle>
            <CardDescription>
              AI-converted JSON that matches your database schema requirements
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

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI-Powered Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Uses Gemini 2.5 Flash to intelligently understand and convert data formats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schema Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically validates against TREND_MASTER, KEYWORD_INTELLIGENCE, and other database schemas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Field Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Converts field values like "day" → "afternoon" and "Breakout" → integer values
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCPConverter;