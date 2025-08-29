# ZUHU Publishing System - API Documentation

## ZUHU AI Intelligence System

ZUHU is a comprehensive AI-powered content intelligence and processing system that transforms raw content through multiple AI agents working in an orchestrated unified pipeline.

### System Architecture

The ZUHU system operates as a **unified pipeline** with a single entry point that orchestrates multiple AI agents:

#### Unified Pipeline Entry Point
**Endpoint:** `/functions/v1/zuhu-unified-processor`
- **Purpose:** Single entry point for complete ZUHU pipeline execution
- **Architecture:** Master orchestrator that calls individual AI agents sequentially
- **Flow:** Input → Content Classification → Design Direction → Asset Management → Page Composition → SEO Synthesis → Output

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

##### Phase 4: Dynamic Page Composition **[NEW]**
**Agent:** `zuhu-page-composer`
- **Purpose:** AI-powered dynamic page building with design tokens
- **AI Model:** Claude (Anthropic)
- **Function:** Constructs pixel-perfect pages using design directives and validated assets

##### Phase 5: SEO & Design Synthesis **[NEW]**
**Agent:** `zuhu-seo-synthesizer`
- **Purpose:** AI-powered SEO optimization and structured data generation
- **AI Model:** Claude (Anthropic)
- **Function:** Applies final SEO optimizations, meta tags, and performance enhancements

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

**Response:** Complete pipeline results including all five phases

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

##### 4. Page Composition API **[NEW]**
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-page-composer \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "unique_content_identifier"
  }'
```

##### 5. SEO Synthesis API **[NEW]**
```bash
curl -X POST https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/zuhu-seo-synthesizer \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "unique_content_identifier"
  }'
```

## ZUHU Unified Pipeline Response Format

### Complete Pipeline Response
```json
{
  "success": true,
  "content_id": "zuhu_1234567890_abc123def",
  "pipeline_results": {
    "content_classification": {
      "category": "AI_TUTORIAL",
      "confidence_score": 0.95,
      "keywords": ["machine learning", "neural networks"],
      "processing_time": "2.3s"
    },
    "design_direction": {
      "template_id": "modern_tech_v2",
      "design_tokens": {...},
      "processing_time": "1.8s"
    },
    "asset_management": {
      "validated_assets": [...],
      "alt_text_improvements": {...},
      "processing_time": "3.1s"
    },
    "page_composition": {
      "page_id": "uuid",
      "components_used": ["hero", "code", "faq"],
      "page_size": 45632,
      "processing_time": "4.2s"
    },
    "seo_synthesis": {
      "seo_score": 95,
      "structured_data_count": 3,
      "performance_score": 88,
      "meta_tags_count": 12,
      "processing_time": "2.1s"
    }
  },
  "processing_time": "13.5s",
  "message": "ZUHU pipeline completed successfully"
}
```

### Pipeline Status Flow
```
received → processing → content_classified → design_directed → 
assets_validated → page_created → seo_optimized → completed
```

## Database Schema Updates

### New Tables Added

#### generated_pages **[NEW]**
- **Purpose:** Stores final composed pages with SEO optimizations
- **Key Fields:**
  - `id` - Unique page identifier
  - `content_id` - Links to content processing pipeline
  - `page_content` - Final MDX/HTML content
  - `page_metadata` - SEO meta tags, schema, performance metrics
  - `status` - Page status (draft, page_created, seo_optimized)
  - `version` - Page version for updates

### Enhanced Processing Tables

#### zuhu_content_processing
- **Enhanced Status Flow:** Now supports 5-stage pipeline
- **New Status Values:** `page_created`, `seo_optimized`

#### zuhu_processing_stages
- **New Stages:** `page_composition`, `seo_synthesis`
- **Enhanced Logging:** More detailed stage-specific metrics

## Performance Benchmarks

### Processing Times (Typical)
- **Content Classification:** 2-5 seconds
- **Design Direction:** 1-3 seconds  
- **Asset Management:** 3-8 seconds (depends on asset count)
- **Page Composition:** 4-7 seconds **[NEW]**
- **SEO Synthesis:** 2-4 seconds **[NEW]**
- **Total Pipeline:** 12-27 seconds **[UPDATED]**

### Quality Metrics

#### Page Composition Metrics
- **Component Integration Score:** Dynamic component assembly quality
- **Design Token Application:** Consistency with design system
- **Responsive Design Score:** Mobile and desktop optimization
- **Asset Integration Quality:** Image and media placement accuracy

#### SEO Synthesis Metrics  
- **SEO Score:** Overall search optimization rating (0-100)
- **Meta Tag Completeness:** Title, description, Open Graph coverage
- **Structured Data Quality:** JSON-LD schema accuracy and completeness
- **Performance Optimization:** Lazy loading, critical CSS, image optimization
- **Heading Structure Validation:** H1-H6 hierarchy compliance

## Error Handling

### New Error Scenarios

#### Page Composition Failures
- **Design Token Application Error:** Invalid or missing design tokens
- **Component Rendering Error:** Template or component mapping issues
- **Asset Integration Error:** Failed asset placement or optimization
- **Responsive Layout Error:** Mobile/desktop rendering problems

#### SEO Synthesis Failures
- **Meta Tag Generation Error:** Invalid title or description length
- **Structured Data Error:** JSON-LD schema validation failure
- **Performance Optimization Error:** Image or CSS optimization failure
- **Heading Validation Error:** Invalid H1-H6 structure

### Recovery Strategies
- Individual stage retry capability
- Fallback to previous pipeline stage
- Manual intervention points for quality assurance
- Detailed error logging with actionable recommendations

## Integration Examples

### Complete Pipeline Integration
```javascript
const response = await fetch('/zuhu-unified-processor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    raw_content: {
      shipped_content: "# Advanced React Patterns\n\nThis tutorial covers...",
      image_seo_details: [
        {
          url: "https://example.com/react-diagram.png",
          alt_text: "React component lifecycle diagram",
          theme: "React Development",
          style: "Technical Diagram",
          brand: "theboringdev"
        }
      ],
      seo_details_of_content: {
        brief_id: "brief_react_patterns_2024",
        keyword_id: "kw_react_patterns",
        trend_id: "trend_2024_react_architecture",
        content_angle: "Advanced React Patterns: Production-Ready Techniques",
        target_word_count: 3200,
        status: "DRAFT"
      }
    }
  })
});

const result = await response.json();

if (result.success) {
  console.log('Pipeline completed successfully!');
  console.log('Content ID:', result.content_id);
  console.log('SEO Score:', result.pipeline_results.seo_synthesis.seo_score);
  console.log('Page Components:', result.pipeline_results.page_composition.components_used);
  console.log('Total Processing Time:', result.processing_time);
} else {
  console.error('Pipeline failed at stage:', result.failed_stage);
  console.error('Error:', result.error);
}
```

### Stage-by-Stage Processing
```javascript
// Sequential processing for advanced control
const stages = [
  'zuhu-content-classifier',
  'zuhu-design-director', 
  'zuhu-asset-manager',
  'zuhu-page-composer',
  'zuhu-seo-synthesizer'
];

let contentId = null;

for (const stage of stages) {
  const payload = stage === 'zuhu-content-classifier' 
    ? { raw_content: contentData }
    : { content_id: contentId };
    
  const response = await fetch(`/${stage}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  
  if (result.success) {
    contentId = result.content_id;
    console.log(`${stage} completed:`, result);
  } else {
    console.error(`${stage} failed:`, result.error);
    break;
  }
}
```

### Monitoring and Analytics
```javascript
// Real-time pipeline monitoring
const monitorPipeline = async (contentId) => {
  const interval = setInterval(async () => {
    // Check processing stages
    const stages = await fetch(`/api/processing-stages/${contentId}`);
    const stagesData = await stages.json();
    
    console.log('Current stage:', stagesData.currentStage);
    console.log('Progress:', stagesData.completedStages, '/', stagesData.totalStages);
    
    // Check if completed
    if (stagesData.status === 'completed') {
      clearInterval(interval);
      
      // Fetch final results
      const finalResults = await fetch(`/api/generated-pages/${contentId}`);
      const pageData = await finalResults.json();
      
      console.log('Pipeline completed!');
      console.log('Final SEO score:', pageData.seoScore);
      console.log('Page performance:', pageData.performanceScore);
    }
  }, 2000);
};
```

## Rate Limits & Quotas
- **Unified Pipeline:** 10 requests/minute per IP
- **Individual Agents:** 20 requests/minute per IP  
- **Content Size Limit:** 100KB raw content
- **Asset Count Limit:** 20 images per content piece
- **Processing Timeout:** 5 minutes per pipeline
- **Page Size Limit:** 500KB final composed page
- **SEO Elements Limit:** 50 meta tags, 10 JSON-LD schemas

## Authentication
All endpoints are currently public (verify_jwt = false) for development. Production deployment should implement proper authentication and rate limiting.

---

## Legacy APIs (Maintained for Backward Compatibility)

### AI Intelligence Processor API
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/ai-intelligence-processor`

### MCP Converter API  
**POST** `https://ivxfajtibkqytrvvvirb.supabase.co/functions/v1/mcp-converter`

*Note: These legacy endpoints remain functional but new integrations should use the ZUHU Unified Pipeline for optimal performance and features.*

---

## Support & Monitoring
- **Real-time Pipeline Monitoring:** ZuhuDashboard with 5-stage visualization
- **Detailed Logs:** Available in Supabase Edge Function logs for each agent
- **Performance Metrics:** Tracked in `zuhu_system_metrics` table with enhanced analytics
- **Quality Assurance:** Built-in validation and scoring for each pipeline stage
- **Error Recovery:** Comprehensive error handling with actionable remediation steps