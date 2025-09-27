# CHECK GITHUB REPOSITORY STATUS
Write-Host "CHECKING GITHUB REPOSITORY STATUS..." -ForegroundColor Yellow

# Get GitHub Token from Supabase secrets
Write-Host "`nStep 1: Getting GitHub configuration..." -ForegroundColor Cyan
try {
    $secretsOutput = npx supabase secrets list --format=json | ConvertFrom-Json
    
    # Note: We can't read the actual values, but we can see the secrets exist
    Write-Host "GitHub secrets configured:" -ForegroundColor Green
    $secretsOutput | Where-Object { $_.name -like "*GITHUB*" -or $_.name -like "*NETLIFY*" } | ForEach-Object {
        Write-Host "  ✓ $($_.name)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Could not check secrets: $($_.Exception.Message)" -ForegroundColor Red
}

# Check recent commits to the repository (if we can access it)
Write-Host "`nStep 2: Checking for recent commits..." -ForegroundColor Cyan
Write-Host "Since we can't access the actual token values, please manually check:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Check if there are recent commits with 'SampleContentForTesting' files" -ForegroundColor White
Write-Host "3. Check if the branch structure matches what Netlify is watching" -ForegroundColor White

Write-Host "`nStep 3: Expected files that should be in GitHub:" -ForegroundColor Cyan
Write-Host "  📁 src/pages/SampleContentForTesting.tsx" -ForegroundColor White
Write-Host "  📁 src/data/articles.ts" -ForegroundColor White

Write-Host "`nStep 4: Netlify Configuration Check:" -ForegroundColor Cyan
Write-Host "Netlify should be configured to:" -ForegroundColor Yellow
Write-Host "  • Watch your GitHub repository" -ForegroundColor White
Write-Host "  • Build from 'main' or 'master' branch" -ForegroundColor White
Write-Host "  • Use build command: npm run build or similar" -ForegroundColor White
Write-Host "  • Publish directory: dist/ or build/" -ForegroundColor White

Write-Host "`nStep 5: Common Issues:" -ForegroundColor Cyan
Write-Host "❌ Wrong repository connected to Netlify" -ForegroundColor Red
Write-Host "❌ Wrong branch being watched by Netlify" -ForegroundColor Red
Write-Host "❌ Files being committed to feature branches instead of main" -ForegroundColor Red
Write-Host "❌ Build configuration mismatch" -ForegroundColor Red
Write-Host "❌ Missing package.json or build scripts" -ForegroundColor Red

Write-Host "`nNext Steps:" -ForegroundColor Green
Write-Host "1. Check your GitHub repository for the committed files" -ForegroundColor White
Write-Host "2. Verify Netlify is watching the correct repository and branch" -ForegroundColor White
Write-Host "3. Check Netlify build logs for errors" -ForegroundColor White
Write-Host "4. Verify your repository has proper build configuration" -ForegroundColor White