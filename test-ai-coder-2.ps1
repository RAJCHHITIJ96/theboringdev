# Test script for AI Coder 2.0
Write-Host "🚀 Testing AI Coder 2.0..." -ForegroundColor Green

$testPayload = @{
    "category" = "ai-automation"
    "shipped_content" = @"
# Simple Test Article

This is a simple test to validate AI Coder 2.0 functionality.

## Key Features

- **Gemini 2.5 Pro Integration**: Bulletproof component generation
- **Error-Free JSX**: Zero compilation errors guaranteed
- **Enterprise Reliability**: Built for millions of users

## Testing Process

1. Input validation and sanitization
2. Gemini API integration
3. JSX structure validation
4. Component generation success

This should generate a perfect React component.
"@
    "assets_manager_details" = @{
        "images" = @()
        "tables" = @()
        "charts" = @()
        "code_snippets" = @()
        "videos" = @()
    }
    "seo_details" = @{
        "html_head_section" = @{
            "meta_tags" = @{
                "title" = "Simple Test Article - AI Coder 2.0"
                "description" = "Testing the new Gemini 2.5 Pro powered AI Coder 2.0 system"
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-coder-2" `
                                  -Method POST `
                                  -ContentType "application/json" `
                                  -Body $testPayload

    Write-Host "✅ AI Coder 2.0 Test: SUCCESS" -ForegroundColor Green
    Write-Host "Generated component: $($response.metadata.component_name)" -ForegroundColor Cyan
    
    # Save response for inspection
    $response | ConvertTo-Json -Depth 10 | Out-File "ai-coder-2-response.json"
    Write-Host "Response saved to ai-coder-2-response.json" -ForegroundColor Yellow

} catch {
    Write-Host "💥 AI Coder 2.0 Test: EXCEPTION" -ForegroundColor Red
    Write-Host "   Exception: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error Response: $errorBody" -ForegroundColor Yellow
    }
}