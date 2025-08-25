
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
      
      {/* Hero Section - Perplexity Style */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-5 gap-8 min-h-[70vh] items-center">
            {/* Large Hero Image */}
            <div className="lg:col-span-3 fade-in-up">
              <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
                <img 
                  src={trendingHero} 
                  alt="Trending AI Opportunities" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Content Side */}
            <div className="lg:col-span-2 fade-in-up lg:pl-8">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Introducing Trending AI Opportunities
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Spot opportunities before they become crowded markets. Early movers make the most money.
              </p>
              <button className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors font-medium">
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section - Minimal */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="space-y-8">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group cursor-pointer border-b border-border/30 pb-8 last:border-b-0 hover:border-border/60 transition-all duration-200"
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground group-hover:text-muted-foreground/80 transition-colors mb-3 leading-tight">
                  {article.title}
                </h2>
                
                <div className="flex items-center space-x-3 text-sm text-muted-foreground/60 mb-4">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {article.description}
                </p>
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
