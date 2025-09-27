# Supabase Local Development Setup

This project uses Supabase as the backend-as-a-service platform for managing your content intelligence system.

## 🚀 Quick Start

1. **Install Docker Desktop** (if not already installed):
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure Docker is running

2. **Run the development helper**:
   ```powershell
   .\dev-scripts.ps1
   ```
   
3. **Choose option 11** for quick setup, then **option 1** to start Supabase

## 📊 Database Schema Overview

Your content intelligence system includes these main tables:

### Core Tables
- **`trend_master`** - AI trending topics collection
- **`keyword_intelligence`** - SEO keyword research and opportunities  
- **`competitor_intelligence`** - Competitive analysis data
- **`content_briefs`** - AI-optimized content creation briefs
- **`performance_tracking`** - Content performance analytics

### Key Views
- **`batch_content_selection`** - Automatically selects top 17 content pieces for daily processing
- **`dev_status_dashboard`** - Quick development status overview

## 🔧 Development Workflow

### Daily Development
1. Start Supabase: `supabase start`
2. Access Studio: http://localhost:54323
3. View your data and run queries
4. Generate types: `supabase gen types typescript --local > types/supabase.ts`

### Database Operations
```sql
-- View current batch selection
SELECT * FROM batch_content_selection;

-- Check system status
SELECT * FROM dev_status_dashboard;

-- View recent trends
SELECT trend_topic, final_trend_score, discovery_date 
FROM trend_master 
ORDER BY discovery_date DESC 
LIMIT 10;
```

### Working with Edge Functions

Your project has several Edge Functions configured:
- `ai-intelligence-processor`
- `mcp-converter` 
- `zuhu-*` functions (asset-manager, content-classifier, etc.)
- `quality-fortress`
- `autonomous-publishing-engine`
- `github-publisher`

To work with functions:
```bash
# Serve functions locally
supabase functions serve

# Deploy a function
supabase functions deploy function-name
```

## 🔑 Connection Information

When Supabase is running locally:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Supabase Studio** | http://localhost:54323 | - |
| **API** | http://127.0.0.1:54321 | Use anon/service_role keys from status |
| **Database** | postgresql://postgres:postgres@127.0.0.1:54322/postgres | postgres/postgres |
| **Email Testing** | http://localhost:54324 | - |

## 📝 Available Scripts

The `dev-scripts.ps1` provides these options:

1. **🐳 Start Supabase** - Starts all local services
2. **🛑 Stop Supabase** - Stops all services  
3. **🔄 Reset Database** - Fresh start with migrations + seed data
4. **📊 Show Status** - Connection info and service status
5. **🎯 Generate Types** - Create TypeScript definitions
6. **🔍 Test Connection** - Verify database connectivity
7. **📈 Dev Dashboard** - View project files and structure
8. **🌱 Seed Database** - Load sample development data
9. **🔧 VS Code Setup** - Configure workspace settings
10. **📝 View Migrations** - List all database migrations
11. **⚡ Quick Setup** - One-click development environment setup

## 🗄️ Sample Data

The seed file includes:
- 3 sample trends (AI agents, no-code tools, content generation)
- 4 related keywords with SEO metrics
- 3 content briefs ready for processing
- Sample competitor analysis data
- Development user account (dev@example.com / testpassword123)

## 🔍 Debugging Tips

### Common Issues

**Docker not found:**
- Install Docker Desktop and ensure it's running
- Add Docker to your system PATH

**Port conflicts:**
- Check if ports 54321-54325 are available
- Modify `supabase/config.toml` if needed

**Migration errors:**
- Run `supabase db reset` to apply all migrations fresh
- Check migration files for syntax errors

### Useful Commands

```bash
# View detailed status
supabase status -o json

# Check logs
supabase logs

# Reset with no backup (clean slate)
supabase stop --no-backup
supabase start

# Generate fresh migration
supabase db diff -f new_migration_name

# Test specific function
supabase functions serve --env-file .env.local
```

## 🎯 Content Intelligence Workflow

Your system is designed for:

1. **Trend Discovery** - Collect trending AI/development topics
2. **Keyword Research** - Analyze SEO opportunities  
3. **Content Briefing** - Generate AI-optimized content briefs
4. **Batch Processing** - Select top 17 pieces daily for processing
5. **Performance Tracking** - Monitor content success metrics

The `batch_content_selection` view automatically prioritizes content based on:
- Content urgency score (40% weight)
- SEO opportunity score (25% weight) 
- Traffic potential (20% weight)
- Trend strength (15% weight)

## 🚀 Next Steps

1. Start Supabase locally
2. Explore the data in Studio
3. Generate TypeScript types for your frontend
4. Connect your application using the provided connection details
5. Build your content intelligence workflows!

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)