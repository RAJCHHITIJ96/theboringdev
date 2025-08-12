
interface CategoryProps {
  title: string;
  description: string;
  disclaimer: string;
}

const CategoryCard = ({ title, description, disclaimer }: CategoryProps) => (
  <div className="minimal-card hover:bg-accent-green transition-colors duration-200 cursor-pointer">
    <h3 className="subsection-headline mb-3">
      <strong>{title}</strong>
    </h3>
    <p className="mb-2">
      {description}
    </p>
    <p className="text-sm text-muted-foreground">
      <em>{disclaimer}</em>
    </p>
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
    <section className="section-spacing">
      <div className="content-container">
        <div className="content-narrow">
          <h2 className="section-headline mb-12">
            What you'll find here:
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category, index) => (
              <CategoryCard 
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

export default ContentCategoriesSection;
