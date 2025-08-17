# AI Intelligence Processor API Documentation

## Endpoint
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor`

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