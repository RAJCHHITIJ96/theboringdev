
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

const AINews = () => {
  const articles = [
    {
      title: "OpenAI's Latest Release: What It Actually Means",
      date: "June 2025",
      readTime: "4 min read",
      excerpt: "What happened, what it means, what you should do. Context that leads to action..."
    },
    {
      title: "The AI Funding Bubble: Reality Check",
      date: "May 2025",
      readTime: "3 min read",
      excerpt: "Behind the headlines: what the recent AI funding rounds really tell us about the market..."
    },
    {
      title: "Google's AI Strategy Shift",
      date: "May 2025",
      readTime: "5 min read",
      excerpt: "Analyzing Google's recent AI moves and what they mean for developers and businesses..."
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
                AI NEWS
              </span>
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              AI News
            </h1>
            <p className="font-sans text-xl text-foreground/70 leading-relaxed">
              What happened, what it means, what you should do. Context that leads to action.
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

export default AINews;
