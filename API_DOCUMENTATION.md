# ZUHU Publishing System - API Documentation

## ZUHU AI Intelligence System

ZUHU is a comprehensive AI-powered content intelligence and processing system that transforms raw content through multiple AI agents working in an orchestrated unified pipeline.

### System Architecture

The ZUHU system operates as a **unified pipeline** with a single entry point that orchestrates multiple AI agents:

#### Unified Pipeline Entry Point
**Endpoint:** `/functions/v1/zuhu-unified-processor`
- **Purpose:** Single entry point for complete ZUHU pipeline execution
- **Architecture:** Master orchestrator that calls individual AI agents sequentially
- **Flow:** Input → Content Classification → Design Direction → Asset Management → Output

#### Individual AI Agents (Called by Unified Processor)

##### Phase 1: Content Classification & Intelligence
**Agent:** `zuhu-content-classifier`
- **Purpose:** AI-powered content analysis and classification
- **AI Model:** Claude (Anthropic)
- **Function:** Analyzes raw content and classifies it into strategic categories

##### Phase 2: Design Direction & Template Assignment  
**Agent:** `zuhu-design-director`
- **Purpose:** AI-powered design template selection and directive creation
- **AI Model:** Claude (Anthropic) 
- **Function:** Assigns appropriate design templates based on content classification

##### Phase 3: Asset Management & Media Intelligence
**Agent:** `zuhu-asset-manager`
- **Purpose:** AI-powered asset validation and media optimization
- **AI Model:** Claude (Anthropic)
- **Function:** Validates image URLs and enhances alt-text for SEO optimization

### API Usage

#### Unified Pipeline API (Recommended)

The unified processor is the **single entry point** for the complete ZUHU pipeline:

```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-unified-processor \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_content": {
      "shipped_content": "Your markdown content here...",
      "image_seo_details": [...],
      "seo_details_of_content": {...}
    }
  }'
```

**Optional Parameters:**
- `content_id`: If not provided, a unique ID will be generated automatically

**Response:** Complete pipeline results including all three phases

#### Individual Agent APIs (Advanced Usage)

For advanced users who need to call specific agents individually:

##### 1. Content Classification API
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-content-classifier \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "unique_content_identifier",
    "raw_content": {
      "shipped_content": "Your markdown content here...",
      "image_seo_details": [...],
      "seo_details_of_content": {...}
    }
  }'
```

##### 2. Design Direction API
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-design-director \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "unique_content_identifier"
  }'
```

##### 3. Asset Management API
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-asset-manager \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "unique_content_identifier"
  }'
```

## ZUHU Content Intelligence Engine API

### Overview
The ZUHU Content Intelligence Engine analyzes and classifies content for theboringdev platform using Claude AI for intelligent categorization and SEO optimization.

### Endpoint
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-content-classifier`

### Content Structure Support
The API is designed to handle theboringdev's specific content structure:
- **shipped_content**: Full markdown content with images, tables, charts
- **image_seo_details**: Array of image metadata with URLs, alt text, themes
- **seo_details_of_content**: Comprehensive SEO and content metadata

### Request Format
```json
{
  "content_id": "unique-content-identifier",
  "raw_content": [
    {
      "shipped_content": "Full markdown content...",
      "image_seo_details": [
        {
          "url": "https://example.com/image.png",
          "alt_text": "SEO-optimized alt text",
          "theme": "Content theme",
          "style": "Visual style",
          "brand": "theboringdev"
        }
      ],
      "seo_details_of_content": {
        "brief_id": "content_brief_id",
        "keyword_id": "primary_keyword_id",
        "trend_id": "associated_trend_id",
        "content_angle": "Content positioning",
        "target_word_count": 2500,
        "status": "DRAFT"
      }
    }
  ]
}
```

### Response Format
```json
{
  "success": true,
  "content_id": "unique-content-identifier",
  "classification": {
    "primaryCategory": "automation",
    "confidenceScore": 0.92,
    "categoryScores": {
      "trending": 0.85,
      "automation": 0.92,
      "comparisons": 0.30,
      "news": 0.15,
      "realityCheck": 0.40,
      "builderStories": 0.25
    },
    "reasoning": "Detailed analysis explanation",
    "alternativeCategory": "trending"
  },
  "seo_elements": {
    "titleTag": "Optimized title under 60 chars",
    "metaDescription": "Compelling description under 160 chars",
    "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
    "semanticKeywords": ["related1", "related2", "related3"],
    "internalLinks": [
      {
        "anchor": "anchor text",
        "target": "/internal-url/",
        "relevance": "why relevant"
      }
    ],
    "externalLinks": [
      {
        "anchor": "link text", 
        "url": "https://authority-source.com",
        "authority": "high",
        "relevance": "why included"
      }
    ]
  },
  "processing_time": 2847
}
```

### Content Categories
1. **Trending AI Opportunities** - Emerging trends and market opportunities
2. **AI Automation** - Productivity and workflow optimization  
3. **Tool Comparisons** - Software and tool evaluations
4. **AI News** - Current events and developments
5. **AI Reality Check** - Myth-busting and practical perspectives
6. **Builder Stories** - Personal experiences and case studies

### Example cURL Request
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-content-classifier \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "content_ai_coding_guide_2025",
    "raw_content": [
      {
        "shipped_content": "# AI Coding: The Unsexy Guide...",
        "image_seo_details": [
          {
            "url": "https://i.ibb.co/example.png",
            "alt_text": "AI coding workflow diagram",
            "theme": "AI Development",
            "style": "Minimalist",
            "brand": "theboringdev"
          }
        ],
        "seo_details_of_content": {
          "brief_id": "brief_ai_coding_unsexy_guide_2025",
          "keyword_id": "kw_ai_coding_guide", 
          "trend_id": "trend_2025_developer_productivity",
          "content_angle": "AI Coding: The Unsexy Guide to Actually Shipping Faster",
          "target_word_count": 2800,
          "status": "DRAFT"
        }
      }
    ]
  }'
```

---

## AI Intelligence Processor API

### Endpoint
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor`

---

## MCP Converter API

### Overview
The MCP (Multi Content Processor) Converter intelligently converts raw data into structured database formats using AI-powered analysis. It supports plain text, JSON, and various data formats with automatic table detection.

### Endpoint
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/mcp-converter`

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"
}
```

### New Simplified Request Format
```json
{
  "data": "YOUR_RAW_DATA_OR_TEXT",
  "mode": "smart"
}
```

### Request Parameters
- **`data`** (required): Raw input data - can be plain text, JSON string, or structured object
- **`mode`** (optional): Conversion mode - `smart` (default), `strict`, or `batch`
- **`enableValidationReport`** (optional): Boolean to enable detailed validation report (default: true)

### Supported Input Formats

#### 1. Plain Text Input (NEW)
```json
{
  "data": "AI trends show Perplexity integration with Chrome is gaining traction. Search volume for 'perplexity ai chrome' shows breakout status with 95% momentum score.",
  "mode": "smart"
}
```

#### 2. Raw JSON String
```json
{
  "data": "[{\"operation\":\"insert\",\"table\":\"TREND_MASTER\",\"data\":{\"trend_id\":\"trend_123\",\"trend_topic\":\"AI Chrome Integration\"}}]",
  "mode": "smart"
}
```

#### 3. Structured Object/Array
```json
{
  "data": {
    "trend_topic": "AI-Powered Browser Extensions",
    "trend_description": "Growing interest in AI browser integrations",
    "google_trends_score": "breakout",
    "trend_sentiment": "positive"
  },
  "mode": "smart"
}
```

### Response Format
```json
{
  "success": true,
  "convertedData": [
    {
      "operation": "insert",
      "table": "TREND_MASTER", 
      "data": {
        "trend_id": "trend_20250124_ai_chrome",
        "trend_topic": "AI-Powered Browser Extensions",
        "trend_description": "Growing interest in AI browser integrations",
        "google_trends_score": 100,
        "trend_sentiment": "POSITIVE",
        "discovery_time_period": "afternoon",
        "status": "ACTIVE"
      }
    }
  ],
  "metadata": {
    "conversionMethod": "gemini",
    "processingTimeMs": 1847,
    "conversionMode": "smart",
    "itemsProcessed": 1,
    "autoDetectedTables": "Gemini AI auto-detection enabled"
  },
  "validationReport": {
    "inputItemCount": 1,
    "outputItemCount": 1,
    "tablesProcessed": ["TREND_MASTER"],
    "warnings": []
  }
}
```

### Conversion Modes

#### Smart Mode (Default - Recommended)
- **AI-powered analysis** with automatic table detection
- **Intelligent field mapping** and data conversion
- **Auto-generates missing dependencies** (e.g., creates TREND_MASTER if KEYWORD_INTELLIGENCE needs it)
- **Plain text processing** - analyzes content and extracts structured data
- **Contextual understanding** fills missing required fields

#### Strict Mode
- **Minimal conversion** with exact field matching only
- **No automatic dependencies** - fails if foreign keys missing
- **Faster processing** for well-structured data
- **No AI processing** - uses manual conversion logic only

#### Batch Mode  
- **Optimized for large datasets** with dependency resolution
- **Proper ordering** ensures TREND_MASTER → KEYWORD_INTELLIGENCE → etc.
- **Bulk processing** with intelligent defaults for missing data
- **Foreign key handling** creates missing references automatically

### Auto-Detection Intelligence

The MCP Converter now automatically detects target tables by analyzing:
- **Content keywords**: "trend", "keyword", "competitor", "content", "performance"
- **Data patterns**: Structure matching specific table schemas  
- **Relationships**: Foreign key dependencies and proper ordering
- **Context clues**: Semantic analysis of input content

### Supported Database Tables

1. **TREND_MASTER** - Primary trends data (no dependencies)
2. **KEYWORD_INTELLIGENCE** - Keyword research data (depends on TREND_MASTER)
3. **COMPETITOR_INTELLIGENCE** - Competitor analysis (depends on KEYWORD_INTELLIGENCE)  
4. **CONTENT_BRIEFS** - Content planning (depends on both TREND_MASTER & KEYWORD_INTELLIGENCE)
5. **PERFORMANCE_TRACKING** - Performance metrics (depends on KEYWORD_INTELLIGENCE)

### Example Usage

#### Simple Plain Text Conversion
```bash
curl -X POST \
  https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/mcp-converter \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -d '{"data":"YouTube AI age verification trending +250% with breakout status. High commercial intent for privacy-focused content.","mode":"smart"}'
```

#### Batch Processing
```bash
curl -X POST \
  https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/mcp-converter \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -d '{"data":[{"trend_topic":"Mobile AI","keywords":["pixel ai","edge ai"]},{"trend_topic":"Enterprise LLMs","keywords":["claude enterprise","gpt-5 rollout"]}],"mode":"batch"}'
```

### Error Handling

#### Invalid JSON Format
```json
{
  "success": false,
  "error": "Invalid JSON format in request body",
  "details": "Unexpected token...",
  "example": { "data": "your raw data here", "mode": "smart" }
}
```

#### Missing Data Field  
```json
{
  "success": false,
  "error": "Missing data field. Please provide data in \"data\" field.",
  "accepted_fields": ["data", "input_data", "inputData"]
}
```

### Key Improvements
- ✅ **Simplified API** - Just `data` and `mode` fields required
- ✅ **Plain text support** - No need to structure data manually  
- ✅ **Auto table detection** - AI determines target tables automatically
- ✅ **Robust parsing** - Multiple fallback strategies for different input formats
- ✅ **Enhanced error handling** - Clear error messages with examples
- ✅ **Gemini AI processing** - Advanced content analysis and field mapping

---

## Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"
}
```

## Batch Request Format

Send an array of operations to process multiple table insertions in a single request.

### Supported Tables:
1. **TREND_MASTER** (database_id: 1) - AI/Tech trends data
2. **KEYWORD_INTELLIGENCE** (database_id: 2) - SEO keyword analysis
3. **COMPETITOR_INTELLIGENCE** (database_id: 3) - Competitor analysis data
4. **CONTENT_BRIEFS** (database_id: 4) - Content creation briefs
5. **EXISTING_ARTICLES** (database_id: 5) - Article URL tracking

---

## Real Example Batch Requests

### Example 1: Complete Multi-Table Batch Request

```json
[
  {
    "operation": "insert",
    "table": "TREND_MASTER",
    "data": {
      "trend_id": "trend_2024_ai_agents",
      "trend_topic": "AI Autonomous Agents Revolution",
      "trend_description": "The emergence of AI agents that can perform complex tasks autonomously across multiple platforms and systems.",
      "trend_category": "AI_DEVELOPMENT",
      "status": "ACTIVE",
      "trend_momentum_score": 85,
      "trend_sustainability_score": 78,
      "final_trend_score": 92,
      "google_trends_score": 75,
      "social_mentions_count": 15420,
      "twitter_hashtag_volume": 8900,
      "reddit_engagement_score": 67,
      "trend_keywords": ["ai agents", "autonomous ai", "multi-agent systems", "ai automation"],
      "trend_hashtags": ["#AIAgents", "#AutonomousAI", "#MultiAgent", "#AIRevolution"],
      "trend_technologies": ["GPT-4", "AutoGPT", "LangChain", "CrewAI"],
      "trend_companies_mentioned": ["OpenAI", "Anthropic", "Microsoft", "Google"],
      "trend_influencers": ["@elonmusk", "@sama", "@karpathy", "@AndrewYNg"],
      "trend_source": "Twitter API Analysis",
      "discovery_date": "2024-01-15T10:30:00Z",
      "estimated_peak_date": "2024-03-15",
      "trend_peak_period": "Q1 2024",
      "trend_sentiment": "POSITIVE",
      "trend_audience": "Developers and AI Enthusiasts",
      "trend_context": "Growing interest in AI systems that can work independently",
      "trend_geographic_focus": ["United States", "Europe", "Asia-Pacific"],
      "trend_industry_tags": ["Technology", "Software Development", "AI/ML"],
      "trend_content_types": ["Technical Tutorials", "Use Cases", "Industry Analysis"],
      "trend_related_topics": ["Machine Learning", "Process Automation", "AI Ethics"],
      "news_articles_count": 245,
      "github_repo_count": 1250,
      "consistency_multiplier": 1.2,
      "daily_momentum_history": [
        {"date": "2024-01-10", "score": 45},
        {"date": "2024-01-11", "score": 52},
        {"date": "2024-01-12", "score": 67}
      ],
      "discovery_time_period": "January 2024"
    }
  },
  {
    "operation": "insert",
    "table": "KEYWORD_INTELLIGENCE",
    "data": {
      "keyword_id": "kw_ai_agents_tutorial",
      "trend_id": "trend_2024_ai_agents",
      "primary_keyword": "how to build AI agents",
      "search_volume_monthly": 12500,
      "keyword_difficulty": 45,
      "cpc_value": 3.25,
      "commercial_intent_score": 75,
      "search_intent": "INFORMATIONAL",
      "priority_level": "HIGH",
      "opportunity_score": 88,
      "search_volume_trend": "RISING",
      "content_creation_status": "QUEUED",
      "semantic_keywords": [
        "autonomous AI agents",
        "multi-agent framework",
        "AI agent development",
        "intelligent agents tutorial"
      ],
      "keyword_variations": [
        "build AI agents from scratch",
        "create autonomous AI agents",
        "AI agent development guide"
      ],
      "serp_features": ["Featured Snippets", "People Also Ask", "Videos"],
      "related_questions": [
        "What are AI agents?",
        "How do AI agents work?",
        "Best frameworks for AI agents?"
      ],
      "seasonal_pattern": {
        "peak_months": ["January", "September"],
        "low_months": ["July", "August"]
      },
      "ahrefs_data": {
        "difficulty": 42,
        "volume": 12000,
        "cpc": 3.20
      },
      "semrush_data": {
        "difficulty": 48,
        "volume": 13000,
        "cpc": 3.30
      },
      "ubersuggest_data": {
        "difficulty": 45,
        "volume": 12500,
        "cpc": 3.25
      }
    }
  },
  {
    "operation": "insert",
    "table": "COMPETITOR_INTELLIGENCE",
    "data": {
      "competitor_id": "comp_towardsdatascience",
      "keyword_id": "kw_ai_agents_tutorial", 
      "competitor_domain": "towardsdatascience.com",
      "page_url": "https://towardsdatascience.com/building-ai-agents-complete-guide-2024",
      "page_title": "Building AI Agents: A Complete Guide for 2024",
      "meta_description": "Learn how to build intelligent AI agents from scratch using modern frameworks like LangChain and AutoGPT. Step-by-step tutorial with code examples.",
      "competitor_rank": 1,
      "current_ranking_position": 3,
      "content_word_count": 2850,
      "content_structure": {
        "headings": ["Introduction", "What are AI Agents", "Building Your First Agent", "Advanced Techniques", "Conclusion"],
        "sections": 5,
        "code_blocks": 8
      },
      "internal_links_count": 12,
      "external_links_count": 8,
      "images_count": 6,
      "videos_count": 1,
      "code_snippets_count": 8,
      "cta_elements_count": 3,
      "page_load_speed": 2.1,
      "mobile_score": 89,
      "domain_authority": 82,
      "backlinks_count": 1520,
      "social_shares_total": 450,
      "estimated_monthly_traffic": 25000,
      "content_gaps_identified": [
        "Missing advanced deployment strategies",
        "No mention of cost optimization",
        "Lacks real-world use cases"
      ],
      "content_weaknesses": [
        "Code examples could be more detailed",
        "Missing troubleshooting section"
      ],
      "optimization_opportunities": [
        "Add more interactive examples",
        "Include video tutorials",
        "Better internal linking"
      ],
      "content_last_updated": "2024-01-10"
    }
  },
  {
    "operation": "insert", 
    "table": "CONTENT_BRIEFS",
    "data": {
      "brief_id": "brief_ai_agents_ultimate_guide",
      "keyword_id": "kw_ai_agents_tutorial",
      "trend_id": "trend_2024_ai_agents",
      "content_angle": "Complete beginner-to-advanced guide with hands-on projects",
      "target_word_count": 3500,
      "status": "DRAFT",
      "recommended_structure": {
        "sections": [
          "Introduction to AI Agents",
          "Core Components and Architecture", 
          "Setting Up Your Development Environment",
          "Building Your First AI Agent",
          "Advanced Agent Capabilities",
          "Real-World Use Cases and Projects",
          "Deployment and Scaling",
          "Best Practices and Common Pitfalls",
          "Future of AI Agents"
        ]
      },
      "must_include_topics": [
        "LangChain framework tutorial",
        "AutoGPT implementation",
        "Multi-agent communication",
        "Memory and state management",
        "Integration with external APIs"
      ],
      "semantic_keywords": [
        "autonomous agents development",
        "AI agent architecture",
        "multi-agent systems",
        "intelligent automation"
      ],
      "faq_questions": [
        {
          "question": "What programming languages are best for AI agents?",
          "focus": "Python, JavaScript recommendations"
        },
        {
          "question": "How much does it cost to run AI agents?",
          "focus": "API costs, infrastructure"
        },
        {
          "question": "Can AI agents work together?",
          "focus": "Multi-agent collaboration"
        }
      ],
      "code_examples_needed": [
        "Basic agent setup with LangChain",
        "Custom tool creation",
        "Agent memory implementation",
        "Multi-agent orchestration",
        "API integration examples"
      ],
      "video_requirements": {
        "main_video": "15-minute overview of building AI agents",
        "supplementary": ["Code walkthrough", "Live demo"]
      },
      "image_requirements": [
        "AI agent architecture diagram",
        "Workflow visualization", 
        "Code screenshots",
        "Results demonstration"
      ],
      "internal_linking_strategy": {
        "target_pages": [
          "/ai-tools-comparison",
          "/machine-learning-basics",
          "/python-for-ai"
        ],
        "anchor_texts": ["AI development tools", "ML fundamentals", "Python programming"]
      },
      "external_linking_targets": [
        {
          "domain": "langchain.readthedocs.io",
          "purpose": "Official documentation"
        },
        {
          "domain": "github.com/Significant-Gravitas/Auto-GPT",
          "purpose": "AutoGPT repository"
        }
      ],
      "competitor_gaps_to_exploit": [
        "More detailed cost analysis",
        "Better deployment guidance",
        "Industry-specific use cases"
      ],
      "gumroad_placement_strategy": {
        "product": "AI Agent Starter Kit",
        "placement": "After section 4",
        "context": "Advanced templates and tools"
      },
      "scheduled_publish_date": "2024-02-15T09:00:00Z",
      "estimated_time_to_rank_weeks": 6,
      "content_urgency_score": 85,
      "expected_traffic_estimate": 5000,
      "expected_revenue_estimate": 1200,
      "juhu_processing_notes": "Focus on practical implementation over theory",
      "claude_prompt_optimized": "Write a comprehensive guide for building AI agents that balances technical depth with accessibility for intermediate developers"
    }
  },
  {
    "operation": "insert",
    "table": "EXISTING_ARTICLES", 
    "data": [
      {
        "url": "https://example.com/ai-agents-guide-2024",
        "title": "The Complete Guide to AI Agents in 2024",
        "last_crawled": "2024-01-15T14:30:00Z"
      },
      {
        "url": "https://techblog.com/autonomous-ai-systems", 
        "title": "Building Autonomous AI Systems: A Developer's Perspective",
        "last_crawled": "2024-01-15T14:35:00Z"
      }
    ]
  }
]
```

### Example 2: Single Table Insertions

#### TREND_MASTER Only
```json
[
  {
    "operation": "insert",
    "table": "TREND_MASTER", 
    "data": {
      "trend_id": "trend_nocode_ai_2024",
      "trend_topic": "No-Code AI Platform Explosion",
      "trend_description": "The rapid growth of no-code platforms enabling non-technical users to build AI applications",
      "trend_category": "NO_CODE",
      "trend_momentum_score": 92,
      "social_mentions_count": 8500,
      "twitter_hashtag_volume": 4200,
      "trend_keywords": ["no-code AI", "visual AI builder", "drag-drop AI"],
      "trend_technologies": ["Bubble", "Zapier", "Microsoft Power Platform"],
      "discovery_date": "2024-01-10T08:00:00Z"
    }
  }
]
```

#### KEYWORD_INTELLIGENCE Only
```json
[
  {
    "operation": "insert",
    "table": "KEYWORD_INTELLIGENCE",
    "data": {
      "keyword_id": "kw_nocode_ai_tools",
      "trend_id": "trend_nocode_ai_2024", 
      "primary_keyword": "best no-code AI tools",
      "search_volume_monthly": 8900,
      "keyword_difficulty": 38,
      "cpc_value": 4.75,
      "commercial_intent_score": 88,
      "search_intent": "COMMERCIAL",
      "priority_level": "HIGH",
      "opportunity_score": 91
    }
  }
]
```

#### EXISTING_ARTICLES Only  
```json
[
  {
    "operation": "insert",
    "table": "EXISTING_ARTICLES",
    "data": {
      "url": "https://aibusiness.com/automation-trends-2024",
      "title": "Top AI Automation Trends Reshaping Business in 2024",
      "last_crawled": "2024-01-15T16:20:00Z"
    }
  }
]
```

---

## Legacy Single Request Format (Still Supported)

For backward compatibility, you can still use the original format:

```json
{
  "database_id": 1,
  "raw_data": {
    "trend_topic": "AI Code Generation Tools",
    "trend_category": "AI_DEVELOPMENT",
    "trend_momentum_score": 78
  }
}
```

**Database ID Mapping:**
- 1 = TREND_MASTER
- 2 = KEYWORD_INTELLIGENCE  
- 3 = COMPETITOR_INTELLIGENCE
- 4 = CONTENT_BRIEFS
- 5 = EXISTING_ARTICLES

---

## Response Format

### Successful Batch Response
```json
{
  "success": true,
  "message": "All 5 operations completed successfully",
  "total_operations": 5,
  "successful_operations": 5, 
  "failed_operations": 0,
  "total_inserted_records": 7,
  "results": [
    {
      "operation_index": 0,
      "table": "trend_master",
      "success": true,
      "inserted_records": 1
    }
    // ... more results
  ]
}
```

### Partial Success Response (HTTP 207)
```json
{
  "success": false,
  "message": "Batch processed with 3/5 successful operations", 
  "total_operations": 5,
  "successful_operations": 3,
  "failed_operations": 2,
  "total_inserted_records": 4,
  "results": [
    {
      "operation_index": 0,
      "table": "trend_master", 
      "success": true,
      "inserted_records": 1
    },
    {
      "operation_index": 1,
      "success": false,
      "error": "Missing required field: trend_topic"
    }
    // ... more results
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid table name. Use: TREND_MASTER, KEYWORD_INTELLIGENCE, COMPETITOR_INTELLIGENCE, CONTENT_BRIEFS, or EXISTING_ARTICLES"
}
```

---

## Important Notes

1. **Batch Size Limit**: 1-10 operations per request
2. **Required Fields**: Each operation must have `operation`, `table`, and `data`
3. **Only INSERT Operations**: Currently only "insert" operations are supported
4. **Category Validation**: TREND_MASTER categories are automatically validated and mapped
5. **URL Conflicts**: EXISTING_ARTICLES uses upsert to handle duplicate URLs
6. **Flexible Data Mapping**: The API accepts multiple field name variations for compatibility

---

## Testing the API

Use tools like Postman, curl, or your preferred HTTP client:

```bash
curl -X POST \
  https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -d '[{"operation":"insert","table":"EXISTING_ARTICLES","data":{"url":"https://test.com","title":"Test Article"}}]'
```