Write-Host "🚀 Starting AI CODER 2 Phase 2 Test..." -ForegroundColor Green
Write-Host ""

# Read test content
$testContentPath = "phase2-test-content.json"
if (-not (Test-Path $testContentPath)) {
    Write-Host "❌ Error: phase2-test-content.json not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📖 Reading test content..." -ForegroundColor Cyan
$testContent = Get-Content $testContentPath -Raw

# Validate JSON
try {
    $jsonTest = $testContent | ConvertFrom-Json
    Write-Host "✅ JSON validated - Category: $($jsonTest.category)" -ForegroundColor Green
} catch {
    Write-Host "❌ Invalid JSON: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Supabase config
$supabaseUrl = "https://ivxfajtibkqytrvvvirb.supabase.co"
$functionUrl = "$supabaseUrl/functions/v1/ai-coder-2"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGZhanRpYmtxeXRydnZ2aXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTA5MzgsImV4cCI6MjA3MDY4NjkzOH0.I87jM-QRNDJcjxMrVhA8l44RG3fhPmJ7nsn9UaNe8-4"
}

Write-Host "🎯 Target: $functionUrl" -ForegroundColor Magenta
Write-Host "🔥 Sending request (may take 30-60 seconds)..." -ForegroundColor Yellow
Write-Host ""

$startTime = Get-Date

try {
    $response = Invoke-RestMethod -Uri $functionUrl -Method POST -Body $testContent -Headers $headers -TimeoutSec 120
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "🎉 Response received in $([math]::Round($duration, 2)) seconds!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.success) {
        Write-Host "✅ SUCCESS - Component Generated!" -ForegroundColor Green
        Write-Host "=================================" -ForegroundColor Green
        
        Write-Host "📋 Metadata:" -ForegroundColor Yellow
        Write-Host "  • Name: $($response.metadata.component_name)" -ForegroundColor Cyan
        Write-Host "  • Slug: $($response.metadata.route_slug)" -ForegroundColor Cyan
        Write-Host "  • Category: $($response.metadata.category)" -ForegroundColor Cyan
        Write-Host "  • Title: $($response.metadata.title)" -ForegroundColor Cyan
        
        # Save response
        $outputFile = "ai-coder-2-phase2-response.json"
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
        
        Write-Host ""
        Write-Host "💾 Response saved to: $outputFile" -ForegroundColor Green
        Write-Host "🔗 Ready for Shaper AI testing!" -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ FAILURE: $($response.error)" -ForegroundColor Red
        if ($response.details) {
            Write-Host "Details: $($response.details)" -ForegroundColor Yellow
        }
    }
    
} catch {
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "💥 ERROR after $([math]::Round($duration, 2)) seconds" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🏁 Test completed at: $(Get-Date)" -ForegroundColor Gray