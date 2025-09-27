# FINAL WORKFLOW TEST - Complete End-to-End Verification
Write-Host "FINAL COMPLETE WORKFLOW TEST - POST CLEANUP" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$finalTestPayload = @{
    "shipped_content" = "# Final Verification Test`n`nThis is the ultimate test of our autonomous publishing pipeline after cleaning up corrupted files."
    "image_seo_details" = @()
    "seo_details_of_content" = @{
        "status" = "ACTIVE"
        "brief_id" = "final_test_001"
        "trend_id" = "final_trend_001"
        "keyword_id" = "final_keyword_001"
        "content_angle" = "Final Pipeline Test"
        "primary_keyword" = "final test"
        "target_word_count" = 1000
    }
} | ConvertTo-Json -Depth 10

Write-Host "`nSTEP 1/3: Testing AI Coder 2.0..." -ForegroundColor Yellow
try {
    $aiCoderResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-coder-2" `
                                        -Method POST `
                                        -ContentType "application/json" `
                                        -Body $finalTestPayload

    if ($aiCoderResponse.success) {
        Write-Host "AI Coder 2.0: SUCCESS" -ForegroundColor Green
        Write-Host "  Generated Component: $($aiCoderResponse.metadata.component_name)" -ForegroundColor Cyan
        Write-Host "  Route Slug: $($aiCoderResponse.metadata.route_slug)" -ForegroundColor Cyan
        Write-Host "  Category: $($aiCoderResponse.metadata.category)" -ForegroundColor Cyan
        
        Write-Host "`nSTEP 2/3: Testing Shaper AI..." -ForegroundColor Yellow
        $shaperInput = $aiCoderResponse | ConvertTo-Json -Depth 10
        
        $shaperResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/shaper-ai" `
                                          -Method POST `
                                          -ContentType "application/json" `
                                          -Body $shaperInput

        if ($shaperResponse.success) {
            Write-Host "Shaper AI: SUCCESS" -ForegroundColor Green
            Write-Host "  Files Created: $($shaperResponse.files_created.Count)" -ForegroundColor Cyan
            Write-Host "  Deployment Ready: $($shaperResponse.deployment_ready)" -ForegroundColor Cyan
            
            Write-Host "  Files to be written:" -ForegroundColor Gray
            $shaperResponse.files_created | ForEach-Object {
                Write-Host "    - $($_.path) ($($_.size_kb) KB)" -ForegroundColor Gray
            }
            
            Write-Host "`nSTEP 3/3: Testing GitHub Publisher..." -ForegroundColor Yellow
            $githubInput = $shaperResponse | ConvertTo-Json -Depth 10
            
            $githubResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-publisher" `
                                               -Method POST `
                                               -ContentType "application/json" `
                                               -Body $githubInput

            if ($githubResponse.success) {
                Write-Host "GitHub Publisher: SUCCESS" -ForegroundColor Green
                Write-Host "`nQUALITY TESTS:" -ForegroundColor Yellow
                Write-Host "  TypeScript Check: $($githubResponse.quality_tests.typescript_check.passed)" -ForegroundColor Cyan
                Write-Host "  ESLint Check: $($githubResponse.quality_tests.eslint_check.passed)" -ForegroundColor Cyan
                Write-Host "  Build Test: $($githubResponse.quality_tests.build_test.passed)" -ForegroundColor Cyan
                Write-Host "  Import Validation: $($githubResponse.quality_tests.import_validation.passed)" -ForegroundColor Cyan
                Write-Host "  Component Test: $($githubResponse.quality_tests.component_test.passed)" -ForegroundColor Cyan
                Write-Host "  Overall Status: $($githubResponse.quality_tests.overall_status)" -ForegroundColor Green
                
                Write-Host "`nGIT OPERATIONS:" -ForegroundColor Yellow
                Write-Host "  Branch Created: $($githubResponse.git_operations.branch_created)" -ForegroundColor Cyan
                Write-Host "  Commit Created: $($githubResponse.git_operations.commit_created)" -ForegroundColor Cyan
                Write-Host "  Push Successful: $($githubResponse.git_operations.push_successful)" -ForegroundColor Cyan
                Write-Host "  Commit Hash: $($githubResponse.git_operations.commit_hash)" -ForegroundColor Cyan
                
                Write-Host "`nFILES COMMITTED TO GITHUB:" -ForegroundColor Yellow
                $githubResponse.git_operations.files_added | ForEach-Object {
                    Write-Host "  + $_" -ForegroundColor Green
                }
                
                Write-Host "`nDEPLOYMENT:" -ForegroundColor Yellow
                Write-Host "  Status: $($githubResponse.deployment.status)" -ForegroundColor Cyan
                Write-Host "  URL: $($githubResponse.deployment.url)" -ForegroundColor Green
                Write-Host "  Build Time: $($githubResponse.deployment.build_time)" -ForegroundColor Cyan
                
                Write-Host "`nVERIFICATION:" -ForegroundColor Yellow
                Write-Host "  URL Accessible: $($githubResponse.verification.url_accessible)" -ForegroundColor Cyan
                Write-Host "  Mobile Responsive: $($githubResponse.verification.mobile_responsive)" -ForegroundColor Cyan
                Write-Host "  SEO Tags Present: $($githubResponse.verification.seo_tags_present)" -ForegroundColor Cyan
                
                # Save complete response
                $githubResponse | ConvertTo-Json -Depth 10 | Out-File "final-workflow-success.json"
                
                Write-Host "`n" -NoNewline
                Write-Host "COMPLETE WORKFLOW: " -ForegroundColor White -NoNewline
                Write-Host "SUCCESS!" -ForegroundColor Green
                Write-Host "=============================================" -ForegroundColor Green
                Write-Host "Your autonomous publishing pipeline is FULLY OPERATIONAL!" -ForegroundColor Green
                Write-Host "New article should be live at: $($githubResponse.deployment.url)" -ForegroundColor Cyan
                Write-Host "Response saved to: final-workflow-success.json" -ForegroundColor Gray
                
            } else {
                Write-Host "GitHub Publisher: FAILED" -ForegroundColor Red
                Write-Host "Error: $($githubResponse.error)" -ForegroundColor Red
            }
        } else {
            Write-Host "Shaper AI: FAILED" -ForegroundColor Red
            Write-Host "Error: $($shaperResponse.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "AI Coder 2.0: FAILED" -ForegroundColor Red
        Write-Host "Error: $($aiCoderResponse.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "WORKFLOW EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody" -ForegroundColor Yellow
    }
}