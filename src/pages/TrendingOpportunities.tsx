
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TrendingOpportunities = () => {
  const articles = [
    {
      title: "The Art of Minimal Design",
      date: "June 2025",
      readTime: "3 min read",
      description: "Why less is more in today's cluttered digital landscape, and how to achieve clarity through restraint...",
      category: "TRENDING"
    },
    {
      title: "The Future of Startups",
      date: "May 2025", 
      readTime: "2 min read",
      description: "Why One Person Will Soon Build a Billion-Dollar Company...",
      category: "TRENDING"
    },
    {
      title: "From Student to Entrepreneur",
      date: "May 2025",
      readTime: "3 min read", 
      description: "Lessons learned building a company at 19, and why age is just a number when passion meets purpose...",
      category: "TRENDING"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-32">
        <div className="container-reading">
          {/* Page Header */}
          <div className="mb-16 fade-in-up">
            <div className="text-sm font-mono text-foreground/60 mb-4 tracking-wider uppercase">
              TRENDING
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              Trending AI Opportunities
            </h1>
            <div className="w-full h-px bg-border-gray mb-8"></div>
          </div>

          {/* Articles List */}
          <div className="space-y-12 fade-in-up">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group cursor-pointer"
              >
                <div className="space-y-3">
                  <h2 className="font-serif font-semibold text-2xl text-foreground group-hover:text-foreground/80 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-foreground/60">
                    <span className="font-mono">{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <p className="font-sans text-foreground/70 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <div className="w-full h-px bg-border-gray/50 mt-8"></div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingOpportunities;
