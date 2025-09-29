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
  "ai-automation": [],
  "ai-news": [],
  "tool-comparisons": [],
  "builder-stories": [],
  "ai-reality-check": [],
  "trending-opportunities": [],
  "General": [
    {
      "slug": "simple-test",
      "component": "SimpleTest",
      "title": "Simple Test - AI Coder 2",
      "publishDate": "2025-01-15",
      "category": "General",
      "description": "Basic test for the system",
      "readTime": "1 min",
      "url": "/General/simple-test",
      "assetsCount": {
        "images": 0,
        "tables": 0,
        "charts": 0,
        "code_snippets": 0,
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
