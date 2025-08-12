
const DifferentiationSection = () => {
  const features = [
    {
      title: "We validate everything",
      description: "Every trend. Every tool. Every \"breakthrough\" announcement.",
      emphasis: "Before we tell you about it."
    },
    {
      title: "We show you the data", 
      description: "Traffic stats, keyword research, competitive analysis.",
      emphasis: "The numbers behind the hype."
    },
    {
      title: "We find what others miss",
      description: "Content gaps, SEO opportunities, market positioning.", 
      emphasis: "Intelligence that gives you an edge."
    },
    {
      title: "We deliver it systematically",
      description: "50-60 pieces of validated AI intelligence daily.",
      emphasis: "While maintaining quality that rivals The New York Times."
    }
  ];

  return (
    <section className="section-spacing bg-accent-green theme-transition">
      <div className="content-container">
        <div className="content-narrow">
          <h2 className="section-headline mb-12">
            Here's what makes us different:
          </h2>
          
          <div className="grid gap-8 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="subsection-headline mb-3">
                  {feature.title}
                </h3>
                <p className="mb-2 text-lg">
                  {feature.description}
                </p>
                <p className="text-muted-foreground">
                  <em>{feature.emphasis}</em>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
