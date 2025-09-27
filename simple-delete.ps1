# Delete corrupted files from GitHub
Write-Host "Deleting corrupted files..."

$deletePayload = @{
    "files_to_delete" = @(
        "src/pages/TestArticle.tsx",
        "src/pages/SampleContentForTesting.tsx"
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-file-cleanup" -Method POST -ContentType "application/json" -Body $deletePayload
    
    if ($response.success) {
        Write-Host "SUCCESS: Files deleted!" -ForegroundColor Green
        Write-Host "Deleted count: $($response.deleted_files.Count)" -ForegroundColor Cyan
        $response.deleted_files | ForEach-Object { Write-Host "  Deleted: $_" -ForegroundColor Green }
    } else {
        Write-Host "FAILED: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}