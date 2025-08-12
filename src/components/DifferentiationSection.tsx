
import { Clock, DollarSign, MessageCircle, Globe, User, Settings } from 'lucide-react';

const DifferentiationSection = () => {
  const features = [
    {
      title: "We validate everything",
      description: "Every trend. Every tool. Every \"breakthrough\" announcement.",
      emphasis: "Before we tell you about it.",
      icon: Clock,
      gridClass: "bento-card"
    },
    {
      title: "We show you the data", 
      description: "Traffic stats, keyword research, competitive analysis.",
      emphasis: "The numbers behind the hype.",
      icon: DollarSign,
      gridClass: "bento-card"
    },
    {
      title: "We find what others miss",
      description: "Content gaps, SEO opportunities, market positioning.", 
      emphasis: "Intelligence that gives you an edge.",
      icon: MessageCircle,
      gridClass: "bento-card bento-card-large"
    },
    {
      title: "Multiple Language Support",
      description: "Serve customers in their preferred language. Break communication barriers and expand your business reach across different markets.",
      emphasis: "Global accessibility made simple.",
      icon: Globe,
      gridClass: "bento-card"
    },
    {
      title: "Personalized Customer Experience",
      description: "Create unique interactions for every customer. AI agents remember preferences and provide tailored recommendations that feel personal.",
      emphasis: "Individual attention at scale.",
      icon: User,
      gridClass: "bento-card"
    },
    {
      title: "We deliver it systematically",
      description: "50-60 pieces of validated AI intelligence daily.",
      emphasis: "While maintaining quality that rivals The New York Times.",
      icon: Settings,
      gridClass: "bento-card"
    }
  ];

  return (
    <section className="section-spacing bg-accent-green theme-transition">
      <div className="content-container">
        <div className="content-narrow mb-12">
          <h2 className="section-headline text-center">
            Here's what makes us different:
          </h2>
        </div>
        
        <div className="bento-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className={feature.gridClass} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center mb-4">
                  <IconComponent className="w-8 h-8 mr-3 text-foreground" />
                  <h3 className="subsection-headline mb-0">
                    {feature.title}
                  </h3>
                </div>
                <p className="mb-3 text-lg leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-muted-foreground">
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
