
interface CategoryProps {
  title: string;
  description: string;
  disclaimer: string;
  index: number;
}

const CategoryCard = ({ title, description, disclaimer, index }: CategoryProps) => (
  <div 
    className="group relative bg-background border border-border-gray rounded-xl p-6 hover:shadow-lg hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="space-y-3">
      <h3 className="font-serif font-semibold text-lg leading-tight text-foreground group-hover:text-foreground transition-colors">
        {title}
      </h3>
      <p className="font-sans text-foreground/80 leading-relaxed">
        {description}
      </p>
      <p className="font-sans text-sm text-foreground/60 italic">
        {disclaimer}
      </p>
    </div>
    
    {/* Subtle accent indicator */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-accent-subtle rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

const ContentCategoriesSection = () => {
  const categories = [
    {
      title: "AI Intelligence",
      description: "Real trends backed by traffic data and market analysis",
      disclaimer: "Not recycled LinkedIn posts"
    },
    {
      title: "AI Automation",
      description: "Systems that actually work in real businesses", 
      disclaimer: "Not theoretical frameworks"
    },
    {
      title: "Tool Comparisons",
      description: "Side-by-side analysis with usage data",
      disclaimer: "Not affiliate marketing disguised as reviews"
    },
    {
      title: "AI News", 
      description: "What happened, what it means, what you should do",
      disclaimer: "Not breathless hype cycles"
    },
    {
      title: "AI Reality Check",
      description: "Separating genuine breakthroughs from marketing campaigns",
      disclaimer: "Not echo chamber amplification"
    },
    {
      title: "Trending Intelligence",
      description: "What's actually gaining traction vs. what's just loud",
      disclaimer: "Not social media noise"
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
        
        {/* Bento-style grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-up">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              title={category.title}
              description={category.description}
              disclaimer={category.disclaimer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentCategoriesSection;
