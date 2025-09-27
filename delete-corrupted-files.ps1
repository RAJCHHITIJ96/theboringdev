# DELETE CORRUPTED FILES FROM GITHUB
Write-Host "DELETING CORRUPTED FILES FROM GITHUB REPOSITORY..." -ForegroundColor Red

$corruptedFiles = @(
    "src/pages/TestArticle.tsx",
    "src/pages/SampleContentForTesting.tsx"
)

# Create a Supabase function call to delete files
$deletePayload = @{
    "action" = "delete_files"
    "files_to_delete" = $corruptedFiles
    "commit_message" = "Clean up corrupted Unicode files"
} | ConvertTo-Json -Depth 10

Write-Host "`nFiles to delete:" -ForegroundColor Yellow
$corruptedFiles | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor Red
}

Write-Host "`nDeleting via GitHub API..." -ForegroundColor Cyan
try {
    # We'll use the GitHub Publisher to delete files
    $deleteResponse = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-file-cleanup" `
                                       -Method POST `
                                       -ContentType "application/json" `
                                       -Body $deletePayload
    
    if ($deleteResponse.success) {
        Write-Host "SUCCESS: Corrupted files deleted!" -ForegroundColor Green
        Write-Host "Deleted files: $($deleteResponse.deleted_files -join ', ')" -ForegroundColor Cyan
    } else {
        Write-Host "DELETION FAILED: $($deleteResponse.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "EXCEPTION during deletion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "We'll need to delete manually through GitHub web interface" -ForegroundColor Yellow
}

Write-Host "`nMANUAL CLEANUP INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "If automated deletion failed, please:" -ForegroundColor White
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Navigate to src/pages/" -ForegroundColor White
Write-Host "3. Delete these files manually:" -ForegroundColor White
$corruptedFiles | ForEach-Object {
    Write-Host "   - $_" -ForegroundColor Red
}
Write-Host "4. Commit the deletions with message: 'Clean up corrupted files'" -ForegroundColor White
Write-Host "5. Check Netlify build after deletion" -ForegroundColor White

Write-Host "`nNEW CLEAN FILE CREATED:" -ForegroundColor Green
Write-Host "✓ src/pages/CleanTestArticle2024.tsx (with proper encoding)" -ForegroundColor Cyan