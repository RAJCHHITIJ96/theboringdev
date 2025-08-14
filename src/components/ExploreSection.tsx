
interface CategoryProps {
  title: string;
  description: string;
  disclaimer: string;
  ctaText: string;
  ctaLink: string;
}

const CategoryCard = ({ title, description, disclaimer, ctaText, ctaLink }: CategoryProps) => (
  <div className="group relative bg-background border border-border-gray rounded-xl p-6 hover:shadow-lg hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1">
    <div className="space-y-4">
      <h3 className="font-serif font-semibold text-lg leading-tight text-foreground group-hover:text-foreground transition-colors">
        {title}
      </h3>
      <p className="font-sans text-foreground/80 leading-relaxed">
        {description}
      </p>
      <p className="font-sans text-sm text-foreground/60 italic">
        {disclaimer}
      </p>
      
      {/* CTA Button */}
      <div className="pt-2">
        <a 
          href={ctaLink}
          className="inline-flex items-center text-sm font-medium text-foreground hover:text-foreground/80 transition-colors group-hover:translate-x-1 duration-200"
        >
          {ctaText}
          <span className="ml-1 transition-transform group-hover:translate-x-1 duration-200">→</span>
        </a>
      </div>
    </div>
    
    {/* Subtle accent indicator */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-accent-subtle rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

const ExploreSection = () => {
  const categories = [
    {
      title: "Trending AI Opportunities",
      description: "Spot opportunities before they become crowded markets. Early movers make the most money",
      disclaimer: "Not recycled LinkedIn posts",
      ctaText: "Find Your Edge",
      ctaLink: "/trending-opportunities"
    },
    {
      title: "AI Automation",
      description: "Systems that actually work in real businesses. Real implementations with measurable ROI", 
      disclaimer: "Not theoretical frameworks",
      ctaText: "See What Works",
      ctaLink: "/ai-automation"
    },
    {
      title: "Tool Comparisons",
      description: "Side-by-side analysis with usage data. Data-driven decisions, not affiliate commissions",
      disclaimer: "Not marketing disguised as reviews",
      ctaText: "Compare Smart",
      ctaLink: "/tool-comparisons"
    },
    {
      title: "AI News", 
      description: "What happened, what it means, what you should do. Context that leads to action",
      disclaimer: "Not breathless hype cycles",
      ctaText: "Get Context",
      ctaLink: "/ai-news"
    },
    {
      title: "AI Reality Check",
      description: "Separating genuine breakthroughs from marketing campaigns. Truth over trending topics",
      disclaimer: "Not echo chamber amplification",
      ctaText: "Cut the Hype",
      ctaLink: "/ai-reality-check"
    },
    {
      title: "Builder Stories",
      description: "What's actually working for developers vs. what gurus claim works. Real wins from real builders",
      disclaimer: "Not theoretical case studies",
      ctaText: "Learn from Builders",
      ctaLink: "/builder-stories"
    }
  ];

  return (
    <section className="py-24 theme-transition">
      <div className="container-main max-w-6xl">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
            Intelligence Categories
          </h2>
          <p className="font-sans text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Curated insights across six core areas of AI development
          </p>
        </div>
        
        {/* Grid layout matching the original Intelligence Categories design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-up">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              title={category.title}
              description={category.description}
              disclaimer={category.disclaimer}
              ctaText={category.ctaText}
              ctaLink={category.ctaLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
