# Create netlify.toml file to fix branch configuration
Write-Host "Creating netlify.toml configuration file..."

$netlifyConfig = @"
# Netlify Configuration
[build]
  base = "/"
  command = "bun run build"
  publish = "dist/"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
"@

# Create the config file
$netlifyConfig | Out-File -FilePath "netlify.toml" -Encoding UTF8

Write-Host "netlify.toml created successfully!" -ForegroundColor Green
Write-Host "This file will force Netlify to use correct build settings" -ForegroundColor Cyan

# Now commit this file via our GitHub Publisher
$configPayload = @{
    "files_to_commit" = @(
        @{
            "path" = "netlify.toml"
            "content" = $netlifyConfig
        }
    )
    "commit_message" = "Add Netlify configuration to fix branch deployment"
} | ConvertTo-Json -Depth 10

Write-Host "`nCommitting netlify.toml to GitHub..." -ForegroundColor Yellow

try {
    # We'll create a simple commit via a manual method since we don't have a generic commit function
    Write-Host "netlify.toml file created locally" -ForegroundColor Green
    Write-Host "You can manually commit this file to GitHub" -ForegroundColor Yellow
    
    Write-Host "`nFile contents:" -ForegroundColor Cyan
    Get-Content netlify.toml | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    
} catch {
    Write-Host "Could not auto-commit, but file created locally" -ForegroundColor Yellow
}