
interface CategoryProps {
  title: string;
  description: string;
  disclaimer: string;
  featured?: boolean;
}

const ExploreCard = ({ title, description, disclaimer, featured = false }: CategoryProps) => (
  <div className={`
    group relative overflow-hidden rounded-2xl border border-border-gray bg-background 
    hover:shadow-xl hover:border-foreground/20 transition-all duration-500 hover:-translate-y-2
    ${featured ? 'md:col-span-2 md:row-span-1 p-8' : 'p-6'}
  `}>
    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <h3 className={`font-serif font-bold text-foreground group-hover:text-foreground transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
          {title}
        </h3>
        <p className={`font-sans text-foreground/80 leading-relaxed ${featured ? 'text-lg' : 'text-base'}`}>
          {description}
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border-gray/50">
        <p className="font-sans text-sm text-foreground/60 italic">
          {disclaimer}
        </p>
      </div>
    </div>
    
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent-subtle/20 to-warm-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Corner accent */}
    <div className="absolute -top-8 -right-8 w-16 h-16 bg-accent-subtle rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
  </div>
);

const ExploreSection = () => {
  const categories = [
    {
      title: "AI Intelligence",
      description: "Real trends backed by traffic data and market analysis",
      disclaimer: "Not recycled LinkedIn posts",
      featured: true
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
    <section className="py-24 bg-accent-subtle/30 theme-transition">
      <div className="container-main max-w-7xl">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-foreground mb-8 tracking-tight">
            Ready to dive into real 
            <span className="block text-foreground/70">AI intelligence?</span>
          </h2>
          
          <p className="font-sans text-xl md:text-2xl font-medium text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-8">
            Start exploring what interests you most
          </p>
        </div>
        
        {/* Masonry-style bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr fade-in-up">
          {categories.map((category, index) => (
            <ExploreCard 
              key={index}
              title={category.title}
              description={category.description}
              disclaimer={category.disclaimer}
              featured={category.featured}
            />
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16 fade-in-up">
          <button className="inline-flex items-center px-8 py-4 bg-foreground text-background font-sans font-semibold text-lg rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Start Exploring →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
