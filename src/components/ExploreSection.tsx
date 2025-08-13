
interface CategoryProps {
  title: string;
  description: string;
  disclaimer: string;
}

const ExploreCard = ({ title, description, disclaimer }: CategoryProps) => (
  <div className="content-card hover:bg-warm-accent transition-colors duration-200 cursor-pointer group">
    <h3 className="font-sans-interface mb-small group-hover:text-foreground transition-colors">
      <strong>{title}</strong>
    </h3>
    <p className="mb-small font-serif-body">
      {description}
    </p>
    <p className="text-sm text-foreground/70 font-serif-body">
      <em>{disclaimer}</em>
    </p>
  </div>
);

const ExploreSection = () => {
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
    <section className="section-spacing-large bg-warm-accent theme-transition">
      <div className="container-reading">
        <div className="fade-in-up">
          <h2 className="text-center mb-large font-serif-display">
            Ready to dive into real AI intelligence?
          </h2>
          
          <p className="text-xl mb-xl text-center font-serif-body">
            <strong>Start exploring what interests you most:</strong>
          </p>
          
          <div className="grid gap-large md:grid-cols-2">
            {categories.map((category, index) => (
              <ExploreCard 
                key={index}
                title={category.title}
                description={category.description}
                disclaimer={category.disclaimer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
