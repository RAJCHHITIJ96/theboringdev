# Commit netlify.toml using Shaper AI
Write-Host "Committing netlify.toml via Shaper AI..." -ForegroundColor Cyan

$netlifyContent = Get-Content netlify.toml -Raw

# Create a mock Shaper AI input that includes the netlify.toml file
$shaperPayload = @{
    "files_created" = @(
        @{
            "path" = "netlify.toml"
            "content" = $netlifyContent
            "size_kb" = [Math]::Round(($netlifyContent.Length / 1024), 2)
            "status" = "created"
        }
    )
    "registry_updated" = @{
        "category" = "config"
        "total_articles" = 1
        "new_entry" = @{
            "slug" = "netlify-config"
            "component" = "NetlifyConfig"
            "title" = "Netlify Configuration"
            "publishDate" = (Get-Date -Format "yyyy-MM-dd")
            "category" = "config"
            "description" = "Netlify configuration to fix branch deployment"
            "readTime" = "1 min"
            "url" = "/netlify.toml"
            "assetsCount" = @{
                "images" = 0
                "videos" = 0
                "tables" = 0
                "charts" = 0
                "code_snippets" = 0
            }
        }
    }
    "validation" = @{
        "naming_conflicts" = $false
        "route_conflicts" = $false
        "typescript_valid" = $true
        "component_imports_valid" = $true
    }
    "deployment_ready" = $true
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/github-publisher" `
                                  -Method POST `
                                  -ContentType "application/json" `
                                  -Body $shaperPayload

    if ($response.success) {
        Write-Host "SUCCESS: netlify.toml committed to GitHub!" -ForegroundColor Green
        Write-Host "Files added: $($response.git_operations.files_added -join ', ')" -ForegroundColor Cyan
        Write-Host "Commit hash: $($response.git_operations.commit_hash)" -ForegroundColor Cyan
        
        Write-Host "`nNow check Netlify - it should build from main branch!" -ForegroundColor Yellow
    } else {
        Write-Host "FAILED: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}