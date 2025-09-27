# ULTIMATE SYSTEM TEST - AI Engineers Ready for Battle!
Write-Host "🔥 ULTIMATE AI AUTONOMOUS PUBLISHING SYSTEM TEST 🔥" -ForegroundColor Red
Write-Host "====================================================" -ForegroundColor Red
Write-Host "Testing: AI Coder → Shaper AI → GitHub Publisher → Netlify Deploy" -ForegroundColor Yellow

$ultimateTestPayload = @{
    "shipped_content" = "# Ultimate System Test`n`nThis is the final battle test of our autonomous publishing system. If this works, we celebrate with coffee! If not, we debug like legends!"
    "image_seo_details" = @()
    "seo_details_of_content" = @{
        "status" = "ACTIVE"
        "brief_id" = "ultimate_test_001"
        "trend_id" = "ultimate_trend_001"
        "keyword_id" = "ultimate_keyword_001"
        "content_angle" = "Ultimate System Test"
        "primary_keyword" = "ultimate test"
        "target_word_count" = 1200
    }
} | ConvertTo-Json -Depth 10

Write-Host "`n🤖 PHASE 1: Testing AI Coder 2.0..." -ForegroundColor Cyan
try {
    $aiCoderResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-coder-2" `
                                        -Method POST `
                                        -ContentType "application/json" `
                                        -Body $ultimateTestPayload

    if ($aiCoderResponse.success) {
        Write-Host "✅ AI Coder 2.0: PERFECT!" -ForegroundColor Green
        Write-Host "   Component: $($aiCoderResponse.metadata.component_name)" -ForegroundColor White
        Write-Host "   Route: $($aiCoderResponse.metadata.route_slug)" -ForegroundColor White
        
        Write-Host "`n🎨 PHASE 2: Testing Shaper AI..." -ForegroundColor Cyan
        $shaperInput = $aiCoderResponse | ConvertTo-Json -Depth 10
        
        $shaperResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/shaper-ai" `
                                          -Method POST `
                                          -ContentType "application/json" `
                                          -Body $shaperInput

        if ($shaperResponse.success) {
            Write-Host "✅ Shaper AI: PERFECT!" -ForegroundColor Green
            Write-Host "   Files Ready: $($shaperResponse.files_created.Count)" -ForegroundColor White
            Write-Host "   Deployment Ready: $($shaperResponse.deployment_ready)" -ForegroundColor White
            
            Write-Host "`n🚀 PHASE 3: Testing GitHub Publisher..." -ForegroundColor Cyan
            $githubInput = $shaperResponse | ConvertTo-Json -Depth 10
            
            $githubResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-publisher" `
                                               -Method POST `
                                               -ContentType "application/json" `
                                               -Body $githubInput

            if ($githubResponse.success) {
                Write-Host "✅ GitHub Publisher: PERFECT!" -ForegroundColor Green
                Write-Host "   Quality Tests: $($githubResponse.quality_tests.overall_status)" -ForegroundColor White
                Write-Host "   Git Push: $($githubResponse.git_operations.push_successful)" -ForegroundColor White
                Write-Host "   Commit: $($githubResponse.git_operations.commit_hash)" -ForegroundColor White
                
                # Save response for analysis
                $githubResponse | ConvertTo-Json -Depth 10 | Out-File "ultimate-test-response.json"
                
                Write-Host "`n🌐 PHASE 4: Checking Netlify Deploy..." -ForegroundColor Cyan
                Write-Host "Waiting for Netlify to detect GitHub changes..." -ForegroundColor Yellow
                
                # Wait for Netlify to detect changes
                Start-Sleep -Seconds 10
                
                Write-Host "`nChecking latest Netlify deploy..." -ForegroundColor Cyan
                
                # Check deploy status
                try {
                    $deployCheck = netlify deploy:list --json | ConvertFrom-Json
                    $latestDeploy = $deployCheck[0]
                    
                    Write-Host "Latest Deploy Status: $($latestDeploy.state)" -ForegroundColor Cyan
                    Write-Host "Deploy URL: $($latestDeploy.deploy_ssl_url)" -ForegroundColor Cyan
                    Write-Host "Created: $($latestDeploy.created_at)" -ForegroundColor Gray
                    
                    if ($latestDeploy.state -eq "ready") {
                        Write-Host "`n🎉 SUCCESS! NETLIFY DEPLOY SUCCESSFUL!" -ForegroundColor Green
                        Write-Host "☕ TIME FOR COFFEE! THE SYSTEM IS WORKING!" -ForegroundColor Green
                        Write-Host "Live URL: $($latestDeploy.deploy_ssl_url)" -ForegroundColor Cyan
                    } elseif ($latestDeploy.state -eq "building") {
                        Write-Host "`n⏳ NETLIFY IS BUILDING..." -ForegroundColor Yellow
                        Write-Host "Let's check the build logs..." -ForegroundColor Yellow
                    } else {
                        Write-Host "`n❌ NETLIFY DEPLOY FAILED!" -ForegroundColor Red
                        Write-Host "Time to debug like legends! Let's check the logs..." -ForegroundColor Red
                    }
                } catch {
                    Write-Host "Could not get deploy status via CLI, checking manually..." -ForegroundColor Yellow
                }
                
            } else {
                Write-Host "❌ GitHub Publisher FAILED!" -ForegroundColor Red
                Write-Host "Error: $($githubResponse.error)" -ForegroundColor Red
                return
            }
        } else {
            Write-Host "❌ Shaper AI FAILED!" -ForegroundColor Red  
            Write-Host "Error: $($shaperResponse.error)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "❌ AI Coder 2.0 FAILED!" -ForegroundColor Red
        Write-Host "Error: $($aiCoderResponse.error)" -ForegroundColor Red
        return
    }
    
} catch {
    Write-Host "💥 SYSTEM EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host "`n📋 SYSTEM TEST SUMMARY:" -ForegroundColor Yellow
Write-Host "- AI Coder 2.0: Check logs above" -ForegroundColor White
Write-Host "- Shaper AI: Check logs above" -ForegroundColor White  
Write-Host "- GitHub Publisher: Check logs above" -ForegroundColor White
Write-Host "- Netlify Deploy: Check status above" -ForegroundColor White

Write-Host "`n🔍 NEXT STEPS FOR DEBUGGING (if needed):" -ForegroundColor Yellow
Write-Host "1. Check ultimate-test-response.json for GitHub details" -ForegroundColor White
Write-Host "2. Run: netlify open to check Netlify dashboard" -ForegroundColor White
Write-Host "3. Run: netlify logs to see build logs" -ForegroundColor White
Write-Host "4. If failed, we analyze and fix like senior engineers!" -ForegroundColor White