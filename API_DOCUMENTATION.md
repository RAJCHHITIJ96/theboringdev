# ZUHU Publishing System API Documentation

## Overview
The ZUHU Publishing System is an intelligent, unified content automation pipeline that processes content through multiple AI agents autonomously. Submit content once and watch it flow through the entire pipeline automatically.

## System Architecture

### Unified Pipeline Flow
**Input** → **Content Intelligence Engine** → **Design Director AI** → **Media Intelligence & Validation Engine** → **[Future Phases]**

All processing happens automatically through a single entry point.

## The Unified API Endpoint

### ZUHU Unified Processor
**Endpoint**: `POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-unified-processor`

**Purpose**: Process content through the entire ZUHU pipeline automatically

**Headers**:
```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
apikey: YOUR_SUPABASE_ANON_KEY
```

**Request Body**:
```json
{
  "content_id": "unique-content-identifier",
  "raw_content": [
    {
      "shipped_content": "# Your Article Title\n\nYour content in markdown format...",
      "image_seo_details": [
        {
          "url": "https://example.com/image.png",
          "alt_text": "Image description",
          "theme": "AI Development",
          "style": "Minimalist",
          "brand": "theboringdev"
        }
      ],
      "seo_details_of_content": {
        "brief_id": "brief_example",
        "keyword_id": "kw_example", 
        "trend_id": "trend_example",
        "content_angle": "Example Angle",
        "target_word_count": 2500,
        "status": "DRAFT"
      }
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "contentId": "unique-content-identifier",
  "processingTime": 15420,
  "classification": {
    "classification": {
      "primaryCategory": "AI Reality Check",
      "confidenceScore": 0.98,
      "categoryScores": {
        "trending": 0.45,
        "automation": 0.82,
        "comparisons": 0.35,
        "news": 0.20,
        "realityCheck": 0.98,
        "builderStories": 0.75
      },
      "reasoning": "Strong focus on cutting through AI hype...",
      "alternativeCategory": "AI Automation"
    },
    "seoElements": {
      "titleTag": "The Unsexy Guide to AI Coding: Ship 3x Faster Without the Hype",
      "metaDescription": "Learn the BORINGDEV Method for AI-assisted coding...",
      "primaryKeywords": ["ai coding guide", "github copilot workflow"],
      "semanticKeywords": ["ai pair programming", "code generation tools"],
      "internalLinks": [
        {
          "anchor": "shipping real-world projects",
          "target": "/systems/side-project-to-saas/",
          "relevance": "practical implementation"
        }
      ],
      "externalLinks": [
        {
          "anchor": "GitHub Copilot",
          "url": "https://copilot.github.com",
          "authority": "high",
          "relevance": "primary tool reference"
        }
      ]
    },
    "contentIntelligence": {
      "brandVoiceAlignment": 0.96,
      "valueDensityScore": 0.94,
      "engagementPotential": 0.92,
      "monetizationReadiness": 0.95,
      "uniqueAngles": ["BORINGDEV 4-Step Framework", "Anti-hype positioning"],
      "competitorAdvantage": "Practical framework focus vs theoretical possibilities"
    },
    "qualityMetrics": {
      "contentCompleteness": 0.97,
      "technicalAccuracy": 0.96,
      "brandCompliance": 0.98,
      "processingComplexity": "high",
      "recommendedNextStep": "proceed_to_design"
    }
  },
  "design": {
    "id": "uuid",
    "content_id": "unique-content-identifier", 
    "template_id": "template_ai_ugc_v1",
    "design_token_set": {
      "colorScheme": "minimal_black_white",
      "typography": "clean_sans_serif",
      "spacing": "generous_whitespace",
      "layout": "article_focused"
    },
    "component_map": {
      "hero": "minimal_hero",
      "content": "article_body",
      "cta": "subtle_inline_cta",
      "navigation": "clean_breadcrumb"
    },
    "category": "AI Reality Check",
    "design_philosophy": "Cut through AI hype with clean, minimal design that prioritizes readability and trust.",
    "created_at": "2025-08-29T17:30:00Z",
    "updated_at": "2025-08-29T17:30:00Z"
  },
  "assets": {
    "id": "uuid",
    "content_id": "unique-content-identifier",
    "asset_urls": [
      "https://example.com/image1.png",
      "https://example.com/image2.png"
    ],
    "validated_assets": [
      {
        "url": "https://example.com/image1.png",
        "healthStatus": "healthy",
        "statusCode": 200,
        "altTextScore": 85,
        "needsImprovement": false
      }
    ],
    "asset_health_check": {
      "totalAssets": 2,
      "healthyAssets": 2,
      "brokenAssets": 0,
      "brokenUrls": []
    },
    "alt_text_improvements": [],
    "validation_errors": [],
    "created_at": "2025-08-29T17:35:00Z",
    "updated_at": "2025-08-29T17:35:00Z"
  },
  "finalStatus": "completed"
}
```

## Processing Pipeline Stages

The unified processor automatically moves content through these stages:

1. **received** - Content submitted to pipeline
2. **analyzing** - AI analyzing and classifying content
3. **classified** - Content classified with SEO elements extracted
4. **design_processing** - Template and design philosophy being assigned
5. **design_approved** - Design directive created and saved
6. **asset_processing** - Assets being validated and optimized
7. **assets_validated** - All assets checked and alt text improved
8. **completed** - Full pipeline processing finished

## Content Categories

The system automatically classifies content into these 6 categories:

1. **AI Reality Check** - Cutting through hype, practical perspectives
2. **AI Automation** - Process optimization, workflow automation  
3. **Tool Comparisons** - Feature comparisons, decision frameworks
4. **AI News** - Industry updates, breaking developments
5. **Builder Stories** - Success stories, case studies, journeys
6. **Trending Opportunities** - Emerging trends, market opportunities

## Key Features

### ✅ Unified Entry Point
- Single API call processes entire pipeline
- No manual triggers between stages
- Autonomous progression through all phases

### ✅ Real-time Tracking
- Monitor processing status via ZUHU Dashboard
- Detailed stage progression logs
- Processing time metrics

### ✅ Intelligent Processing
- AI-powered content classification (Claude 4 Sonnet)
- Automatic template selection based on category
- Asset validation with health checks
- SEO optimization throughout pipeline

### ✅ Error Handling
- Bulletproof JSON parsing from AI responses
- Comprehensive error logging
- Failed stage tracking and recovery

## Error Handling

All stages include comprehensive error handling:
- `200` - Success (full pipeline completed)
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error (stage failure with details)

Error responses include:
```json
{
  "error": "Processing pipeline failed",
  "details": "Specific error message from failed stage"
}
```

## Authentication

Requires Supabase authentication headers:
- `Authorization`: Bearer token with your Supabase anon key
- `apikey`: Your Supabase anon key

## Rate Limits

- Unified Processor: 5 requests/minute (due to multi-stage processing)

## Dashboard Monitoring

Monitor the entire pipeline at: `https://your-app-url.com/zuhu`

The dashboard provides:
- Real-time pipeline progression
- Stage-by-stage status tracking
- Processing time analytics
- Error logs and debugging
- System performance metrics

## Usage Example

```javascript
// Submit content and let ZUHU handle everything
const response = await fetch('https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-unified-processor', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-supabase-anon-key',
    'Content-Type': 'application/json',
    'apikey': 'your-supabase-anon-key'
  },
  body: JSON.stringify({
    content_id: 'my-article-123',
    raw_content: [/* your content data */]
  })
});

const result = await response.json();
// Result contains classification, design, and asset data
// Content is now ready for next phases!
```

## Migration from Old System

If you were using the separate endpoints:
- ❌ `/zuhu-content-classifier` → ✅ `/zuhu-unified-processor`
- ❌ `/zuhu-design-director` → ✅ Automatic (included)  
- ❌ `/zuhu-asset-manager` → ✅ Automatic (included)

## Support

For technical support, monitor system logs via the ZUHU dashboard or check the unified processor function logs.