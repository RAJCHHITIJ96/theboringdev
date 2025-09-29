// Auto-generated article registry
// This file is managed by Shaper AI - do not edit manually

export interface ArticleEntry {
  slug: string;
  component: string;
  title: string;
  publishDate: string;
  category: string;
  description: string;
  readTime: string;
  url: string;
  assetsCount: {
    images: number;
    videos: number;
    tables: number;
    charts: number;
    code_snippets: number;
  };
}

export const ARTICLE_REGISTRY: Record<string, ArticleEntry[]> = {
  "ai-automation": [
    {
      "slug": "ai-powered-email-automation-strategies",
      "component": "AiPoweredEmailAutomationStrategies",
      "title": "AI Email Automation Guide - Boost Conversions by 4x",
      "publishDate": "2025-04-20",
      "category": "ai-automation",
      "description": "Learn how to use AI to personalize and automate email marketing campaigns. Save time and increase conversions with real-world strategies.",
      "readTime": "8 min",
      "url": "/ai-automation/ai-powered-email-automation-strategies",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    },
    {
      "slug": "the-ai-powered-meeting-summaries-guide",
      "component": "TheAipoweredMeetingSummariesGuide",
      "title": "The AI Meeting Summaries Guide - Save 93% Time",
      "publishDate": "2025-03-01",
      "category": "ai-automation",
      "description": "Learn how AI meeting summaries save time, boost productivity, and ensure no detail is missed. Real case study with 1,400% ROI.",
      "readTime": "12 min",
      "url": "/ai-automation/the-ai-powered-meeting-summaries-guide",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    },
    {
      "slug": "ai-agent-security-the-nonsense-guide-to-prompt-injection-malicious-use",
      "component": "AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse",
      "title": "AI Agent Security: The No-nonsense Guide to Prompt Injection & Malicious Use",
      "publishDate": "2024-09-28",
      "category": "ai-automation",
      "description": "Comprehensive guide to securing AI agents from prompt injection attacks and malicious use cases",
      "readTime": "15 min",
      "url": "/ai-automation/ai-agent-security-the-nonsense-guide-to-prompt-injection-malicious-use",
      "assetsCount": {
        "images": 0,
        "code_blocks": 5,
        "tables": 2,
        "charts": 0,
        "videos": 0
      }
    },
    {
      "slug": "building-ai-workflows",
      "component": "BuildingAIWorkflows",
      "title": "Building AI Workflows",
      "publishDate": "2024-09-29",
      "category": "ai-automation",
      "description": "Learn to build efficient AI workflows for automation",
      "readTime": "10 min",
      "url": "/ai-automation/building-ai-workflows",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    }
  ],
  "ai-news": [],
  "tool-comparisons": [],
  "builder-stories": [],
  "ai-reality-check": [],
  "trending-opportunities": [],
  "General": [
    {
      "slug": "ultimate-system-test",
      "component": "UltimateSystemTest",
      "title": "Ultimate System Test",
      "publishDate": "2023-10-27",
      "category": "General",
      "description": "This is the final battle test of our autonomous publishing system. If this works, we celebrate with coffee! If not, we debug like legends!",
      "readTime": "1 min",
      "url": "/General/ultimate-system-test",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    },
    {
      "slug": "final-verification-test",
      "component": "FinalVerificationTest",
      "title": "Final Verification Test",
      "publishDate": "2024-09-29",
      "category": "General",
      "description": "Final verification of the autonomous publishing pipeline",
      "readTime": "1 min",
      "url": "/General/final-verification-test",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    },
    {
      "slug": "clean-test-article-2024",
      "component": "CleanTestArticle2024",
      "title": "Clean Test Article 2024",
      "publishDate": "2024-09-29",
      "category": "General",
      "description": "Testing the cleaned pipeline",
      "readTime": "1 min",
      "url": "/General/clean-test-article-2024",
      "assetsCount": {
        "images": 0,
        "code_blocks": 0,
        "tables": 0,
        "charts": 0,
        "videos": 0
      }
    }
  ]
};

export function getArticleBySlug(category: string, slug: string): ArticleEntry | undefined {
  return ARTICLE_REGISTRY[category]?.find(article => article.slug === slug);
}

export function getAllArticles(): ArticleEntry[] {
  return Object.values(ARTICLE_REGISTRY).flat();
}

export function getArticlesByCategory(category: string): ArticleEntry[] {
  return ARTICLE_REGISTRY[category] || [];
}

// Category mapping for navigation
export const CATEGORY_CONFIG = {
  'ai-automation': {
    name: 'AI Automation',
    description: 'Practical AI automation strategies and tools',
    path: '/ai-automation'
  },
  'ai-news': {
    name: 'AI News',
    description: 'Latest developments in artificial intelligence',
    path: '/ai-news'
  },
  'tool-comparisons': {
    name: 'Tool Comparisons',
    description: 'In-depth comparisons of AI tools and platforms',
    path: '/tool-comparisons'
  },
  'builder-stories': {
    name: 'Builder Stories',
    description: 'Stories from AI builders and entrepreneurs',
    path: '/builder-stories'
  },
  'ai-reality-check': {
    name: 'AI Reality Check',
    description: 'Critical analysis of AI trends and claims',
    path: '/ai-reality-check'
  },
  'trending-opportunities': {
    name: 'Trending Opportunities',
    description: 'Emerging opportunities in the AI space',
    path: '/trending-opportunities'
  }
} as const;
