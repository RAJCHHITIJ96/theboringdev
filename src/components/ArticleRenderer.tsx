import React, { lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getArticleBySlug } from '@/data/articles';
import NewHeader from '@/components/NewHeader';
import Footer from '@/components/Footer';

interface ArticleRendererProps {
  category: string;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ category }) => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  // Get article metadata from registry
  const article = getArticleBySlug(category, slug);
  
  if (!article) {
    return <Navigate to="/404" replace />;
  }

  // Dynamically import the component
  const ArticleComponent = lazy(() => 
    import(`../pages/${article.component}.tsx`)
      .then(module => ({ default: module.default }))
      .catch(() => {
        console.error(`Failed to load component: ${article.component}`);
        return import('../pages/NotFound.tsx');
      })
  );

  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <main className="pt-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-lg text-muted-foreground">Loading article...</div>
          </div>
        }>
          <ArticleComponent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};