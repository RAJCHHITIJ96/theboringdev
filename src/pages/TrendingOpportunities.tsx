
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";
import trendingHero from "@/assets/trending-hero.png";

const TrendingOpportunities = () => {
  const articles = [
    {
      title: "Building Automated Workflows That Actually Work",
      date: "June 2025",
      readTime: "4 min read",
      description: "Real automation systems with measurable ROI from actual businesses, not theoretical frameworks.",
      category: "TRENDING"
    },
    {
      title: "The Hidden AI Opportunities Everyone's Missing",
      date: "May 2025", 
      readTime: "3 min read",
      description: "Market gaps that early movers are exploiting right now. Data-driven analysis of emerging niches.",
      category: "TRENDING"
    },
    {
      title: "Why Most AI Startups Fail (And How to Avoid It)",
      date: "May 2025",
      readTime: "5 min read",
      description: "Common pitfalls that kill AI ventures before they scale. Learn from 100+ failed startups.",
      category: "TRENDING"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <NewHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="fade-in-up">
              <div className="text-sm font-mono text-muted-foreground/70 mb-6 tracking-wider uppercase">
                TRENDING OPPORTUNITIES
              </div>
              <h1 className="font-serif font-bold text-5xl md:text-6xl xl:text-7xl text-foreground mb-8 tracking-tight leading-[0.9]">
                Trending AI
                <br />
                <span className="text-muted-foreground/60">Opportunities</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Spot opportunities before they become crowded markets. Early movers make the most money.
              </p>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
            
            {/* Hero Image */}
            <div className="relative fade-in-up lg:justify-self-end">
              <div className="relative w-full max-w-lg mx-auto">
                <img 
                  src={trendingHero} 
                  alt="Trending AI Opportunities visualization" 
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-16 text-center fade-in-up">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
              Latest Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated insights on emerging AI opportunities and market trends
            </p>
          </div>

          <div className="grid gap-8 fade-in-up">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-border transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-6 right-6">
                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider uppercase">
                    {article.category}
                  </span>
                </div>
                
                <h3 className="font-serif font-semibold text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-4 leading-tight pr-20">
                  {article.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                  <span className="font-mono">{article.date}</span>
                  <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
                  <span>{article.readTime}</span>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {article.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary group-hover:text-primary/80 transition-colors">
                  <span className="text-sm font-medium">Read more</span>
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrendingOpportunities;
