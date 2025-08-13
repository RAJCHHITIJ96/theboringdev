
import { CheckCircle, BarChart3, Search, Zap } from 'lucide-react';

const DifferentiationSection = () => {
  const features = [
    {
      title: "We validate everything",
      description: "Every trend. Every tool. Every \"breakthrough\" announcement.",
      emphasis: "Before we tell you about it.",
      icon: CheckCircle,
    },
    {
      title: "We show you the data", 
      description: "Traffic stats, keyword research, competitive analysis.",
      emphasis: "The numbers behind the hype.",
      icon: BarChart3,
    },
    {
      title: "We find what others miss",
      description: "Content gaps, SEO opportunities, market positioning.", 
      emphasis: "Intelligence that gives you an edge.",
      icon: Search,
    },
    {
      title: "We deliver it systematically",
      description: "50-60 pieces of validated AI intelligence daily.",
      emphasis: "While maintaining quality that rivals The New York Times.",
      icon: Zap,
    }
  ];

  return (
    <section className="section-spacing-large bg-accent-subtle theme-transition">
      <div className="container-main">
        <div className="container-reading mb-xl">
          <h2 className="text-center font-serif-display">
            Here's what makes us different:
          </h2>
        </div>
        
        <div className="grid gap-large md:grid-cols-2 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="content-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center mb-medium">
                  <IconComponent className="w-8 h-8 mr-medium text-foreground" />
                  <h3 className="font-sans-interface">
                    {feature.title}
                  </h3>
                </div>
                <p className="mb-small text-lg leading-relaxed font-serif-body">
                  {feature.description}
                </p>
                <p className="text-foreground/70 font-serif-body">
                  <em>{feature.emphasis}</em>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
