# DELETE CORRUPTED FILES VIA GITHUB API
Write-Host "DELETING CORRUPTED FILES FROM YOUR GITHUB REPOSITORY..." -ForegroundColor Red

$corruptedFiles = @(
    "src/pages/TestArticle.tsx",
    "src/pages/SampleContentForTesting.tsx"
)

$deletePayload = @{
    "files_to_delete" = $corruptedFiles
    "commit_message" = "Clean up corrupted Unicode files"
} | ConvertTo-Json -Depth 10

Write-Host "`nFiles to delete from GitHub:" -ForegroundColor Yellow
$corruptedFiles | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor Red
}

Write-Host "`nConnecting to your GitHub via Supabase..." -ForegroundColor Cyan
try {
    $deleteResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-file-cleanup" `
                                       -Method POST `
                                       -ContentType "application/json" `
                                       -Body $deletePayload
    
    if ($deleteResponse.success) {
        Write-Host "`nSUCCESS! CORRUPTED FILES DELETED!" -ForegroundColor Green
        Write-Host "Total processed: $($deleteResponse.total_processed)" -ForegroundColor Cyan
        Write-Host "Successfully deleted: $($deleteResponse.deleted_files.Count)" -ForegroundColor Green
        
        Write-Host "`nDeleted files:" -ForegroundColor Yellow
        $deleteResponse.deleted_files | ForEach-Object {
            Write-Host "  ✓ $_" -ForegroundColor Green
        }
        
        if ($deleteResponse.failed_files.Count -gt 0) {
            Write-Host "`nFailed to delete:" -ForegroundColor Red
            $deleteResponse.failed_files | ForEach-Object {
                Write-Host "  ✗ $_" -ForegroundColor Red
            }
        }
        
        Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
        Write-Host "1. Check Netlify for automatic rebuild" -ForegroundColor White
        Write-Host "2. The build should now succeed without Unicode errors" -ForegroundColor White
        Write-Host "3. Your clean file should be live: https://theboringdev.com/General/clean-test-article-2024" -ForegroundColor White
        
    } else {
        Write-Host "DELETION FAILED: $($deleteResponse.error)" -ForegroundColor Red
        Write-Host "You may need to delete these files manually from GitHub" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "EXCEPTION during deletion: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody" -ForegroundColor Yellow
    }
    
    Write-Host "`nMANUAL DELETION REQUIRED:" -ForegroundColor Yellow
    Write-Host "Please manually delete these files from your GitHub repository:" -ForegroundColor White
    $corruptedFiles | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
}