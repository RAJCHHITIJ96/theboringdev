Write-Host "🤖 Testing Shaper AI Integration..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Check if we have a real AI Coder 2 response or use mock
$responseFile = "ai-coder-2-response-test.json"
$mockFile = "mock-ai-coder-2-response.json"

$inputFile = $null
if (Test-Path $responseFile) {
    $inputFile = $responseFile
    Write-Host "📁 Using real AI Coder 2 response: $responseFile" -ForegroundColor Cyan
} elseif (Test-Path $mockFile) {
    $inputFile = $mockFile
    Write-Host "📁 Using mock AI Coder 2 response: $mockFile" -ForegroundColor Yellow
} else {
    Write-Host "❌ No AI Coder 2 response found!" -ForegroundColor Red
    Write-Host "Expected files: $responseFile or $mockFile" -ForegroundColor Red
    exit 1
}

# Read the AI Coder 2 response
Write-Host "📖 Reading AI Coder 2 output..." -ForegroundColor Cyan
$aiCoderResponse = Get-Content $inputFile -Raw

# Validate the response structure
try {
    $response = $aiCoderResponse | ConvertFrom-Json
    
    Write-Host "✅ Response validation successful!" -ForegroundColor Green
    Write-Host "   • Success: $($response.success)" -ForegroundColor Cyan
    Write-Host "   • Component Name: $($response.metadata.component_name)" -ForegroundColor Cyan
    Write-Host "   • Route Slug: $($response.metadata.route_slug)" -ForegroundColor Cyan
    Write-Host "   • Category: $($response.metadata.category)" -ForegroundColor Cyan
    Write-Host "   • Component Size: $([math]::Round($response.component.Length / 1024, 2)) KB" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Invalid AI Coder 2 response format!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Shaper AI configuration
$supabaseUrl = "https://ivxfajtibkqytrvvvirb.supabase.co"
$shaperUrl = "$supabaseUrl/functions/v1/shaper-ai"

Write-Host ""
Write-Host "🎯 Target: $shaperUrl" -ForegroundColor Magenta
Write-Host "🔥 Sending to Shaper AI (this may take 15-30 seconds)..." -ForegroundColor Yellow
Write-Host ""

$startTime = Get-Date

try {
    # Send to Shaper AI without authorization header (configured for development)
    $shaperResponse = Invoke-RestMethod -Uri $shaperUrl -Method POST -Body $aiCoderResponse -ContentType "application/json" -TimeoutSec 60
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "🎉 Shaper AI Response received in $([math]::Round($duration, 2)) seconds!" -ForegroundColor Green
    Write-Host ""
    
    if ($shaperResponse.success) {
        Write-Host "✅ SUCCESS - Files Created and Deployed!" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Green
        
        # Display files created
        Write-Host "📁 Files Created:" -ForegroundColor Yellow
        foreach ($file in $shaperResponse.files_created) {
            Write-Host "   • $($file.path) ($($file.size_kb) KB) - $($file.status)" -ForegroundColor Cyan
        }
        
        # Display routes updated
        Write-Host "🔗 Routes Updated:" -ForegroundColor Yellow
        foreach ($route in $shaperResponse.routes_updated) {
            Write-Host "   • $($route.route) -> $($route.component) in $($route.file)" -ForegroundColor Cyan
        }
        
        # Display registry update
        Write-Host "📊 Registry Updated:" -ForegroundColor Yellow
        Write-Host "   • Category: $($shaperResponse.registry_updated.category)" -ForegroundColor Cyan
        Write-Host "   • Total Articles: $($shaperResponse.registry_updated.total_articles)" -ForegroundColor Cyan
        Write-Host "   • New Entry: $($shaperResponse.registry_updated.new_entry.title)" -ForegroundColor Cyan
        
        # Display validation results
        Write-Host "🔍 Validation Results:" -ForegroundColor Yellow
        $validation = $shaperResponse.validation
        Write-Host "   • Naming Conflicts: $(if ($validation.naming_conflicts) { '❌ Found' } else { '✅ None' })" -ForegroundColor $(if ($validation.naming_conflicts) { 'Red' } else { 'Green' })
        Write-Host "   • Route Conflicts: $(if ($validation.route_conflicts) { '❌ Found' } else { '✅ None' })" -ForegroundColor $(if ($validation.route_conflicts) { 'Red' } else { 'Green' })
        Write-Host "   • TypeScript Valid: $(if ($validation.typescript_valid) { '✅ Yes' } else { '❌ No' })" -ForegroundColor $(if ($validation.typescript_valid) { 'Green' } else { 'Red' })
        Write-Host "   • Imports Valid: $(if ($validation.component_imports_valid) { '✅ Yes' } else { '❌ No' })" -ForegroundColor $(if ($validation.component_imports_valid) { 'Green' } else { 'Red' })
        
        Write-Host "🚀 Deployment Ready: $(if ($shaperResponse.deployment_ready) { '✅ YES' } else { '❌ NO' })" -ForegroundColor $(if ($shaperResponse.deployment_ready) { 'Green' } else { 'Red' })
        
        # Save Shaper AI response
        $outputFile = "shaper-ai-response.json"
        $shaperResponse | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
        
        Write-Host ""
        Write-Host "💾 Response saved to: $outputFile" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎯 NEXT STEPS:" -ForegroundColor Magenta
        Write-Host "1. Check GitHub repository for committed files" -ForegroundColor White
        Write-Host "2. Verify Netlify deployment triggered automatically" -ForegroundColor White
        Write-Host "3. Test the live URL once deployed" -ForegroundColor White
        Write-Host "4. Confirm article registry was updated correctly" -ForegroundColor White
        
        # Display expected live URL
        $expectedUrl = "https://theboringdev.netlify.app/$($response.metadata.category.ToLower().Replace(' ', '-'))/$($response.metadata.route_slug)"
        Write-Host ""
        Write-Host "🌐 Expected Live URL: $expectedUrl" -ForegroundColor Cyan
        
    } else {
        Write-Host "❌ FAILURE - Shaper AI Error" -ForegroundColor Red
        Write-Host "=============================" -ForegroundColor Red
        Write-Host "Error: $($shaperResponse.error)" -ForegroundColor Red
        if ($shaperResponse.details) {
            Write-Host "Details: $($shaperResponse.details)" -ForegroundColor Yellow
        }
        if ($shaperResponse.validation) {
            Write-Host "Validation Issues:" -ForegroundColor Yellow
            $shaperResponse.validation | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Yellow
        }
    }
    
} catch {
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "💥 ERROR after $([math]::Round($duration, 2)) seconds" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "1. Check GitHub API token configuration in Supabase" -ForegroundColor White
    Write-Host "2. Verify GitHub repository settings" -ForegroundColor White
    Write-Host "3. Check function logs in Supabase dashboard" -ForegroundColor White
    Write-Host "4. Ensure network connectivity" -ForegroundColor White
}

Write-Host ""
Write-Host "🏁 Shaper AI test completed at: $(Get-Date)" -ForegroundColor Gray
Write-Host "===============================================" -ForegroundColor Gray