
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

const ToolComparisons = () => {
  const articles = [
    {
      title: "Claude vs GPT-4: Real Usage Data",
      date: "June 2025",
      readTime: "6 min read",
      excerpt: "Side-by-side analysis with actual usage data. Data-driven decisions, not affiliate commissions..."
    },
    {
      title: "No-Code AI Tools: What Actually Works",
      date: "May 2025",
      readTime: "4 min read",
      excerpt: "Testing popular no-code AI platforms with real projects and measuring actual results..."
    },
    {
      title: "Developer Tools: Performance vs Price",
      date: "May 2025",
      readTime: "5 min read",
      excerpt: "Honest comparison of development tools based on performance metrics, not marketing claims..."
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
                TOOL COMPARISONS
              </span>
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              Tool Comparisons
            </h1>
            <p className="font-sans text-xl text-foreground/70 leading-relaxed">
              Side-by-side analysis with usage data. Data-driven decisions, not affiliate commissions.
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

export default ToolComparisons;
