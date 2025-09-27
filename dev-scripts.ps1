# Supabase Development Helper Scripts
# Run these commands to manage your local development environment

# Colors for output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red
$Cyan = [System.ConsoleColor]::Cyan

function Write-ColorOutput($ForegroundColor) {
    process { Write-Host $_ -ForegroundColor $ForegroundColor }
}

function Show-DevMenu {
    Write-Host "🚀 Supabase Development Menu" | Write-ColorOutput $Cyan
    Write-Host "=============================" | Write-ColorOutput $Cyan
    Write-Host ""
    Write-Host "1. 🐳 Start Supabase (requires Docker)" | Write-ColorOutput $Green
    Write-Host "2. 🛑 Stop Supabase" | Write-ColorOutput $Yellow
    Write-Host "3. 🔄 Reset Database (fresh start)" | Write-ColorOutput $Yellow
    Write-Host "4. 📊 Show Status & Connection Info" | Write-ColorOutput $Cyan
    Write-Host "5. 🎯 Generate TypeScript Types" | Write-ColorOutput $Green
    Write-Host "6. 🔍 Test Database Connection" | Write-ColorOutput $Cyan
    Write-Host "7. 📈 View Development Dashboard" | Write-ColorOutput $Green
    Write-Host "8. 🌱 Seed Database with Sample Data" | Write-ColorOutput $Green
    Write-Host "9. 🔧 Setup VS Code Settings" | Write-ColorOutput $Yellow
    Write-Host "10. 📝 View Latest Migrations" | Write-ColorOutput $Cyan
    Write-Host "11. ⚡ Quick Development Setup" | Write-ColorOutput $Green
    Write-Host "12. ❌ Exit" | Write-ColorOutput $Red
    Write-Host ""
}

function Start-Supabase {
    Write-Host "Starting Supabase local development stack..." | Write-ColorOutput $Green
    
    # Check if Docker is available
    try {
        docker --version | Out-Null
        Write-Host "✅ Docker found" | Write-ColorOutput $Green
        
        # Start Supabase
        supabase start
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Supabase started successfully!" | Write-ColorOutput $Green
            Show-ConnectionInfo
        } else {
            Write-Host "❌ Failed to start Supabase. Check Docker Desktop is running." | Write-ColorOutput $Red
        }
    } catch {
        Write-Host "❌ Docker not found. Please install Docker Desktop:" | Write-ColorOutput $Red
        Write-Host "https://www.docker.com/products/docker-desktop/" | Write-ColorOutput $Yellow
    }
}

function Stop-Supabase {
    Write-Host "Stopping Supabase..." | Write-ColorOutput $Yellow
    supabase stop
    Write-Host "✅ Supabase stopped" | Write-ColorOutput $Green
}

function Reset-Database {
    Write-Host "Resetting database to fresh state..." | Write-ColorOutput $Yellow
    supabase db reset
    Write-Host "✅ Database reset complete" | Write-ColorOutput $Green
}

function Show-ConnectionInfo {
    Write-Host "📊 Supabase Connection Information" | Write-ColorOutput $Cyan
    Write-Host "===================================" | Write-ColorOutput $Cyan
    supabase status
    Write-Host ""
    Write-Host "💡 Quick Access URLs:" | Write-ColorOutput $Yellow
    Write-Host "   📊 Supabase Studio: http://localhost:54323" | Write-ColorOutput $Green
    Write-Host "   📧 Email Testing: http://localhost:54324" | Write-ColorOutput $Green
    Write-Host "   🔗 API URL: http://127.0.0.1:54321" | Write-ColorOutput $Green
    Write-Host "   🗄️  Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres" | Write-ColorOutput $Green
}

function Generate-Types {
    Write-Host "Generating TypeScript types..." | Write-ColorOutput $Green
    supabase gen types typescript --local > types/supabase.ts
    Write-Host "✅ TypeScript types generated in types/supabase.ts" | Write-ColorOutput $Green
}

function Test-DatabaseConnection {
    Write-Host "Testing database connection..." | Write-ColorOutput $Cyan
    
    # Try to connect and run a simple query
    $result = supabase db reset --dry-run
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful" | Write-ColorOutput $Green
    } else {
        Write-Host "❌ Database connection failed" | Write-ColorOutput $Red
    }
}

function Show-DevDashboard {
    Write-Host "📈 Development Dashboard" | Write-ColorOutput $Cyan
    Write-Host "========================" | Write-ColorOutput $Cyan
    
    # This would ideally query the database, but for now show file info
    Write-Host "📁 Project Structure:" | Write-ColorOutput $Green
    Get-ChildItem -Path "supabase" -Recurse | Where-Object { $_.Extension -in ".sql", ".toml" } | Format-Table Name, Length, LastWriteTime
}

function Seed-Database {
    Write-Host "Seeding database with sample data..." | Write-ColorOutput $Green
    # The seed.sql file will be automatically run when db reset is called
    supabase db reset
    Write-Host "✅ Database seeded with development data" | Write-ColorOutput $Green
}

function Setup-VSCode {
    Write-Host "Setting up VS Code workspace..." | Write-ColorOutput $Yellow
    
    $vscodeDir = ".vscode"
    if (!(Test-Path $vscodeDir)) {
        New-Item -ItemType Directory -Path $vscodeDir
        Write-Host "✅ Created .vscode directory" | Write-ColorOutput $Green
    }
    
    # Create VS Code settings
    $settings = @{
        "typescript.suggest.autoImports" = $true
        "typescript.updateImportsOnFileMove.enabled" = "always"
        "editor.formatOnSave" = $true
        "editor.codeActionsOnSave" = @{
            "source.organizeImports" = $true
        }
        "files.associations" = @{
            "*.sql" = "sql"
            "*.toml" = "toml"
        }
        "sqltools.connections" = @(
            @{
                "name" = "Supabase Local"
                "driver" = "PostgreSQL"
                "server" = "127.0.0.1"
                "port" = 54322
                "database" = "postgres"
                "username" = "postgres"
                "password" = "postgres"
            }
        )
    }
    
    $settings | ConvertTo-Json -Depth 10 | Out-File -FilePath "$vscodeDir/settings.json" -Encoding UTF8
    Write-Host "✅ VS Code settings configured" | Write-ColorOutput $Green
    
    # Create recommended extensions
    $extensions = @{
        "recommendations" = @(
            "ms-vscode.vscode-typescript-next",
            "bradlc.vscode-tailwindcss", 
            "ms-vscode.vscode-json",
            "mtxr.sqltools",
            "mtxr.sqltools-driver-pg",
            "supabase.supabase"
        )
    }
    
    $extensions | ConvertTo-Json -Depth 5 | Out-File -FilePath "$vscodeDir/extensions.json" -Encoding UTF8
    Write-Host "✅ VS Code extensions recommended" | Write-ColorOutput $Green
}

function Show-Migrations {
    Write-Host "📝 Database Migrations" | Write-ColorOutput $Cyan
    Write-Host "======================" | Write-ColorOutput $Cyan
    
    Get-ChildItem -Path "supabase/migrations" -Filter "*.sql" | ForEach-Object {
        Write-Host "📄 $($_.Name) ($(Get-Date $_.LastWriteTime -Format 'yyyy-MM-dd HH:mm'))" | Write-ColorOutput $Green
    }
}

function Quick-Setup {
    Write-Host "🚀 Running Quick Development Setup..." | Write-ColorOutput $Cyan
    Write-Host "=====================================" | Write-ColorOutput $Cyan
    
    # Create types directory
    if (!(Test-Path "types")) {
        New-Item -ItemType Directory -Path "types"
        Write-Host "✅ Created types directory" | Write-ColorOutput $Green
    }
    
    # Setup VS Code
    Setup-VSCode
    
    # Try to start Supabase
    Write-Host ""
    Write-Host "Next steps:" | Write-ColorOutput $Yellow
    Write-Host "1. Install Docker Desktop if not already installed" | Write-ColorOutput $Yellow
    Write-Host "2. Run option 1 to start Supabase" | Write-ColorOutput $Yellow
    Write-Host "3. Run option 8 to seed with sample data" | Write-ColorOutput $Yellow
    Write-Host "4. Run option 5 to generate TypeScript types" | Write-ColorOutput $Yellow
}

# Main menu loop
do {
    Show-DevMenu
    $choice = Read-Host "Select an option (1-12)"
    
    switch ($choice) {
        "1" { Start-Supabase }
        "2" { Stop-Supabase }
        "3" { Reset-Database }
        "4" { Show-ConnectionInfo }
        "5" { Generate-Types }
        "6" { Test-DatabaseConnection }
        "7" { Show-DevDashboard }
        "8" { Seed-Database }
        "9" { Setup-VSCode }
        "10" { Show-Migrations }
        "11" { Quick-Setup }
        "12" { 
            Write-Host "👋 Happy coding!" | Write-ColorOutput $Green
            exit 
        }
        default { 
            Write-Host "❌ Invalid option. Please select 1-12." | Write-ColorOutput $Red
        }
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue..."
    Clear-Host
} while ($true)