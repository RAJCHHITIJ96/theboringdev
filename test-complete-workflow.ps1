# COMPLETE WORKFLOW TEST - AI Coder 2 → Shaper AI → GitHub Publisher
Write-Host "COMPLETE WORKFLOW TEST - Debugging Real Issues" -ForegroundColor Red

$testPayload = @{
    "shipped_content" = "## Sample Content for Testing`n`nThis is a sample content block to test the AI CODER 2 function..."
    "image_seo_details" = @(
        @{
            "image_name" = "hero image"
            "image_url" = "https://example.com/image.png"
            "alt_text" = "Sample alt text for testing"
            "placement" = "After the introduction paragraph"
        }
    )
    "seo_details_of_content" = @{
        "status" = "ACTIVE"
        "brief_id" = "test_brief_001"
        "trend_id" = "test_trend_001"
        "keyword_id" = "test_keyword_001"
        "content_angle" = "Sample Content Testing"
        "primary_keyword" = "ai testing"
        "target_word_count" = 1500
    }
} | ConvertTo-Json -Depth 10

Write-Host "`nSTEP 1: Testing AI Coder 2..." -ForegroundColor Yellow
try {
    $aiCoderResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-coder-2" `
                                        -Method POST `
                                        -ContentType "application/json" `
                                        -Body $testPayload

    if ($aiCoderResponse.success) {
        Write-Host "AI Coder 2: SUCCESS" -ForegroundColor Green
        Write-Host "   Generated: $($aiCoderResponse.metadata.component_name)" -ForegroundColor Cyan
        
        # Save AI Coder output for Shaper AI
        $shaperInput = $aiCoderResponse | ConvertTo-Json -Depth 10
        
        Write-Host "`nSTEP 2: Testing Shaper AI..." -ForegroundColor Yellow
        try {
            $shaperResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/shaper-ai" `
                                              -Method POST `
                                              -ContentType "application/json" `
                                              -Body $shaperInput

            if ($shaperResponse.success) {
                Write-Host "Shaper AI: SUCCESS" -ForegroundColor Green
                Write-Host "   Files Created: $($shaperResponse.files_created.Count)" -ForegroundColor Cyan
                Write-Host "   Deployment Ready: $($shaperResponse.deployment_ready)" -ForegroundColor Cyan
                
                # Save Shaper output for GitHub Publisher
                $githubInput = $shaperResponse | ConvertTo-Json -Depth 10
                
                Write-Host "`nSTEP 3: Testing GitHub Publisher..." -ForegroundColor Yellow
                try {
                    $githubResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-publisher" `
                                                       -Method POST `
                                                       -ContentType "application/json" `
                                                       -Body $githubInput

                    if ($githubResponse.success) {
                        Write-Host "GitHub Publisher: SUCCESS" -ForegroundColor Green
                        Write-Host "   Quality Tests: $($githubResponse.quality_tests.overall_status)" -ForegroundColor Cyan
                        Write-Host "   Git Operations: $($githubResponse.git_operations.push_successful)" -ForegroundColor Cyan
                        Write-Host "   Deployment: $($githubResponse.deployment.status)" -ForegroundColor Cyan
                        Write-Host "   URL: $($githubResponse.deployment.url)" -ForegroundColor Cyan
                        
                        # Save all outputs for analysis
                        $githubResponse | ConvertTo-Json -Depth 10 | Out-File "github-publisher-response.json"
                        Write-Host "📄 GitHub Publisher response saved to github-publisher-response.json" -ForegroundColor Yellow
                        
                        Write-Host "`nCOMPLETE WORKFLOW: SUCCESS!" -ForegroundColor Green
                        
                    } else {
                        Write-Host "GitHub Publisher: FAILED" -ForegroundColor Red
                        Write-Host "   Error: $($githubResponse.error)" -ForegroundColor Red
                        $githubResponse | ConvertTo-Json -Depth 10 | Out-File "github-publisher-error.json"
                    }
                    
                } catch {
                    Write-Host "GitHub Publisher: EXCEPTION" -ForegroundColor Red
                    Write-Host "   Exception: $($_.Exception.Message)" -ForegroundColor Red
                    
                    if ($_.Exception.Response) {
                        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                        $errorBody = $reader.ReadToEnd()
                        Write-Host "   Error Response: $errorBody" -ForegroundColor Yellow
                        $errorBody | Out-File "github-publisher-exception.json"
                    }
                }
                
            } else {
                Write-Host "Shaper AI: FAILED" -ForegroundColor Red
                Write-Host "   Error: $($shaperResponse.error)" -ForegroundColor Red
                $shaperResponse | ConvertTo-Json -Depth 10 | Out-File "shaper-ai-error.json"
            }
            
        } catch {
            Write-Host "Shaper AI: EXCEPTION" -ForegroundColor Red
            Write-Host "   Exception: $($_.Exception.Message)" -ForegroundColor Red
            
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd()
                Write-Host "   Error Response: $errorBody" -ForegroundColor Yellow
                $errorBody | Out-File "shaper-ai-exception.json"
            }
        }
        
    } else {
        Write-Host "AI Coder 2: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($aiCoderResponse.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "AI Coder 2: EXCEPTION" -ForegroundColor Red
    Write-Host "   Exception: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error Response: $errorBody" -ForegroundColor Yellow
        $errorBody | Out-File "ai-coder-2-exception.json"
    }
}

Write-Host "`nTest completed. Check generated files for detailed analysis." -ForegroundColor Cyan
