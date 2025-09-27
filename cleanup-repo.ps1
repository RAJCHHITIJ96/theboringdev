# REPOSITORY CLEANUP - Remove corrupted files
Write-Host "CLEANING UP CORRUPTED FILES FROM REPOSITORY..." -ForegroundColor Red

$corruptedFiles = @(
    "src/pages/TestArticle.tsx",
    "src/pages/SampleContentForTesting.tsx"
)

Write-Host "`nStep 1: Testing with completely NEW filename..." -ForegroundColor Yellow

# Create test payload with UNIQUE filename
$testPayload = @{
    "shipped_content" = "# Clean Test Article 2024`n`nThis is a completely new test with clean encoding."
    "image_seo_details" = @()
    "seo_details_of_content" = @{
        "status" = "ACTIVE"
        "brief_id" = "clean_test_001" 
        "trend_id" = "clean_trend_001"
        "keyword_id" = "clean_keyword_001"
        "content_angle" = "Clean Encoding Test"
        "primary_keyword" = "clean test"
        "target_word_count" = 800
    }
} | ConvertTo-Json -Depth 10

Write-Host "Running CLEAN workflow test..." -ForegroundColor Cyan
try {
    # Step 1: AI Coder 2
    $aiCoderResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-coder-2" `
                                        -Method POST `
                                        -ContentType "application/json" `
                                        -Body $testPayload

    if ($aiCoderResponse.success) {
        Write-Host "AI Coder 2: SUCCESS - Generated: $($aiCoderResponse.metadata.component_name)" -ForegroundColor Green
        
        # Step 2: Shaper AI 
        $shaperInput = $aiCoderResponse | ConvertTo-Json -Depth 10
        $shaperResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/shaper-ai" `
                                          -Method POST `
                                          -ContentType "application/json" `
                                          -Body $shaperInput

        if ($shaperResponse.success) {
            Write-Host "Shaper AI: SUCCESS - Files: $($shaperResponse.files_created.Count)" -ForegroundColor Green
            
            # Step 3: GitHub Publisher
            $githubInput = $shaperResponse | ConvertTo-Json -Depth 10
            $githubResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-publisher" `
                                               -Method POST `
                                               -ContentType "application/json" `
                                               -Body $githubInput

            if ($githubResponse.success) {
                Write-Host "GitHub Publisher: SUCCESS" -ForegroundColor Green
                Write-Host "NEW FILES COMMITTED TO REPOSITORY:" -ForegroundColor Yellow
                $githubResponse.git_operations.files_added | ForEach-Object {
                    Write-Host "  + $_" -ForegroundColor Cyan
                }
                
                Write-Host "`nURL: $($githubResponse.deployment.url)" -ForegroundColor Green
                
                # Save clean response
                $githubResponse | ConvertTo-Json -Depth 10 | Out-File "clean-workflow-response.json"
                Write-Host "Clean response saved to clean-workflow-response.json" -ForegroundColor Yellow
                
            } else {
                Write-Host "GitHub Publisher FAILED: $($githubResponse.error)" -ForegroundColor Red
            }
        } else {
            Write-Host "Shaper AI FAILED: $($shaperResponse.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "AI Coder 2 FAILED: $($aiCoderResponse.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "WORKFLOW EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host "`nNEXT STEPS:" -ForegroundColor Green
Write-Host "1. Check your GitHub repository for the new clean files" -ForegroundColor White
Write-Host "2. Monitor Netlify for build success with clean encoding" -ForegroundColor White
Write-Host "3. If still failing, we need to manually clean the corrupted files" -ForegroundColor White