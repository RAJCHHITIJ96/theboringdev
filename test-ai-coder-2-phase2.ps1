# ============================================
# AI CODER 2 - Phase 2 Comprehensive Test Script
# Testing the autonomous AI publishing system with rich content
# ============================================

Write-Host "🚀 Starting AI CODER 2 Phase 2 Comprehensive Test..." -ForegroundColor Green
Write-Host "Testing with rich content including assets, SEO, and technical details" -ForegroundColor Yellow
Write-Host ""

# Read the structured test content
$testContentPath = "phase2-test-content.json"
if (-not (Test-Path $testContentPath)) {
    Write-Host "❌ Error: phase2-test-content.json not found!" -ForegroundColor Red
    Write-Host "Please ensure the test content file exists in the current directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "📖 Reading test content from: $testContentPath" -ForegroundColor Cyan
$testContent = Get-Content $testContentPath -Raw

# Validate JSON structure
try {
    $jsonTest = $testContent | ConvertFrom-Json
    Write-Host "✅ JSON structure validated successfully" -ForegroundColor Green
    Write-Host "   - Category: $($jsonTest.category)" -ForegroundColor Cyan
    Write-Host "   - Content length: $($jsonTest.shipped_content.Length) characters" -ForegroundColor Cyan
    Write-Host "   - Images: $($jsonTest.assets_manager_details.images.Count)" -ForegroundColor Cyan
    Write-Host "   - Code snippets: $($jsonTest.assets_manager_details.code_snippets.Count)" -ForegroundColor Cyan
    Write-Host "   - SEO title: $($jsonTest.seo_details.html_head_section.meta_tags.title)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: Invalid JSON structure in test content!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Supabase configuration
$supabaseUrl = "https://ivxfajtibkqytrvvvirb.supabase.co"
$functionName = "ai-coder-2"
$functionUrl = "$supabaseUrl/functions/v1/$functionName"

Write-Host ""
Write-Host "🎯 Target Function: $functionUrl" -ForegroundColor Magenta

# Set up headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGZhanRpYmtxeXRydnZ2aXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTA5MzgsImV4cCI6MjA3MDY4NjkzOH0.I87jM-QRNDJcjxMrVhA8l44RG3fhPmJ7nsn9UaNe8-4"
}

Write-Host ""
Write-Host "🔥 Sending AI CODER 2 Request..." -ForegroundColor Yellow
Write-Host "⏱️  This may take 30-60 seconds for Gemini 2.5 Pro to generate the component..." -ForegroundColor Gray

$startTime = Get-Date

try {
    # Make the request with longer timeout for AI processing
    $response = Invoke-RestMethod -Uri $functionUrl -Method POST -Body $testContent -Headers $headers -TimeoutSec 120
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    Write-Host "🎉 AI CODER 2 Response Received!" -ForegroundColor Green
    Write-Host "⏱️  Processing time: $([math]::Round($duration, 2)) seconds" -ForegroundColor Cyan
    
    # Analyze the response
    if ($response.success) {
        Write-Host ""
        Write-Host "✅ SUCCESS - Component Generated!" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        
        # Display metadata
        Write-Host "📋 Component Metadata:" -ForegroundColor Yellow
        Write-Host "   • Component Name: $($response.metadata.component_name)" -ForegroundColor Cyan
        Write-Host "   • Route Slug: $($response.metadata.route_slug)" -ForegroundColor Cyan
        Write-Host "   • Category: $($response.metadata.category)" -ForegroundColor Cyan
        Write-Host "   • Title: $($response.metadata.title)" -ForegroundColor Cyan
        Write-Host "   • Read Time: $($response.metadata.read_time)" -ForegroundColor Cyan
        Write-Host "   • Publish Date: $($response.metadata.publish_date)" -ForegroundColor Cyan
        
        # Display asset counts
        if ($response.metadata.assets_count) {
            Write-Host "   • Assets Count:" -ForegroundColor Cyan
            $response.metadata.assets_count.PSObject.Properties | ForEach-Object {
                Write-Host "     - $($_.Name): $($_.Value)" -ForegroundColor Gray
            }
        }
        
        # Component analysis
        $componentLength = $response.component.Length
        Write-Host ""
        Write-Host "🔧 Component Analysis:" -ForegroundColor Yellow
        Write-Host "   • Component size: $([math]::Round($componentLength / 1024, 2)) KB" -ForegroundColor Cyan
        $hasReact = if ($response.component -like "*import React*") { '✅' } else { '❌' }
        $hasHeader = if ($response.component -like "*NewHeader*") { '✅' } else { '❌' }
        $hasFooter = if ($response.component -like "*Footer*") { '✅' } else { '❌' }
        $hasHelmet = if ($response.component -like "*Helmet*") { '✅' } else { '❌' }
        
        Write-Host "   • Contains React import: $hasReact" -ForegroundColor Cyan
        Write-Host "   • Contains NewHeader: $hasHeader" -ForegroundColor Cyan
        Write-Host "   • Contains Footer: $hasFooter" -ForegroundColor Cyan
        Write-Host "   • Contains Helmet SEO: $hasHelmet" -ForegroundColor Cyan
        
        # Save the response for Shaper AI testing
        $outputFile = "ai-coder-2-phase2-response.json"
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
        Write-Host ""
        Write-Host "💾 Response saved to: $outputFile" -ForegroundColor Green
        Write-Host "🔗 Ready for Shaper AI integration testing!" -ForegroundColor Yellow
        
        # Save just the component code for inspection
        $componentFile = "generated-component.tsx"
        $response.component | Out-File -FilePath $componentFile -Encoding UTF8
        Write-Host "📝 Generated component saved to: $componentFile" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎯 NEXT STEPS:" -ForegroundColor Magenta
        Write-Host "1. Review the generated component in $componentFile" -ForegroundColor White
        Write-Host "2. Test Shaper AI with the response in $outputFile" -ForegroundColor White
        Write-Host "3. Verify end-to-end pipeline integration" -ForegroundColor White
        
    } else {
        Write-Host ""
        Write-Host "❌ FAILURE - AI CODER 2 Error" -ForegroundColor Red
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
        Write-Host "Error: $($response.error)" -ForegroundColor Red
        if ($response.details) {
            Write-Host "Details: $($response.details)" -ForegroundColor Yellow
        }
    }
    
} catch {
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    Write-Host "💥 CRITICAL ERROR - Request Failed" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "⏱️  Failed after: $([math]::Round($duration, 2)) seconds" -ForegroundColor Cyan
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "1. Check if Supabase functions are running" -ForegroundColor White
    Write-Host "2. Verify GEMINI_API_KEY is configured in Supabase" -ForegroundColor White
    Write-Host "3. Check function logs in Supabase dashboard" -ForegroundColor White
    Write-Host "4. Ensure network connectivity to Supabase" -ForegroundColor White
}

Write-Host ""
Write-Host "🏁 Test completed at: $(Get-Date)" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray