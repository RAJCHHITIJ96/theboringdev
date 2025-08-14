
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleCard = ({ title, date, readTime, excerpt }: {
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
}) => (
  <article className="group border-b border-border-gray py-8 first:pt-0 last:border-b-0 last:pb-0">
    <div className="space-y-3">
      <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-foreground/80 transition-colors cursor-pointer">
        {title}
      </h3>
      <div className="flex items-center space-x-4 text-sm text-foreground/50">
        <span className="font-mono">{date}</span>
        <span>•</span>
        <span>{readTime}</span>
      </div>
      <p className="font-sans text-foreground/70 leading-relaxed">
        {excerpt}
      </p>
    </div>
  </article>
);

const TrendingOpportunities = () => {
  const articles = [
    {
      title: "The Art of Minimal Design",
      date: "June 2025",
      readTime: "3 min read",
      excerpt: "Why less is more in today's cluttered digital landscape, and how to achieve clarity through restraint..."
    },
    {
      title: "The Future of Startups", 
      date: "May 2025",
      readTime: "2 min read",
      excerpt: "Why One Person Will Soon Build a Billion-Dollar Company..."
    },
    {
      title: "From Student to Entrepreneur",
      date: "May 2025", 
      readTime: "3 min read",
      excerpt: "Lessons learned building a company at 19, and why age is just a number when passion meets purpose..."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-24">
        <div className="container-reading">
          <div className="mb-16">
            <div className="mb-4">
              <span className="font-mono text-sm text-foreground/50 uppercase tracking-wider">
                TRENDING AI OPPORTUNITIES
              </span>
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              Trending AI Opportunities
            </h1>
            <p className="font-sans text-xl text-foreground/70 leading-relaxed">
              Spot opportunities before they become crowded markets. Early movers make the most money.
            </p>
          </div>
          
          <div className="space-y-0">
            {articles.map((article, index) => (
              <ArticleCard 
                key={index}
                title={article.title}
                date={article.date}
                readTime={article.readTime}
                excerpt={article.excerpt}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingOpportunities;
