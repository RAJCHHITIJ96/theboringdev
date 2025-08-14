
import NewHeader from "@/components/NewHeader";
import Footer from "@/components/Footer";

const AINews = () => {
  const articles = [
    {
      title: "OpenAI's Latest Release: What It Actually Means",
      date: "June 2025",
      readTime: "5 min read",
      description: "Context that leads to action, not breathless hype cycles about the latest AI announcements.",
      category: "NEWS"
    },
    {
      title: "The Real Impact of Google's AI Updates",
      date: "May 2025", 
      readTime: "4 min read",
      description: "What happened, what it means, what you should do. Analysis beyond the marketing headlines.",
      category: "NEWS"
    },
    {
      title: "AI Regulation Updates: Practical Implications",
      date: "May 2025",
      readTime: "6 min read",
      description: "How new AI regulations will actually affect your business operations and development plans.",
      category: "NEWS"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <NewHeader />
      <main className="pt-20">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          {/* Header Section */}
          <div className="mb-12 fade-in-up">
            <div className="text-sm font-mono text-foreground/50 mb-4 tracking-wider uppercase">
              NEWS
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight leading-tight">
              AI News
            </h1>
            <div className="w-full h-px bg-foreground/10 mb-8"></div>
          </div>

          {/* Articles List */}
          <div className="space-y-8 fade-in-up">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group cursor-pointer border-b border-foreground/10 pb-8 last:border-b-0 hover:border-foreground/20 transition-all duration-200"
              >
                <h2 className="font-serif font-semibold text-xl md:text-2xl text-foreground group-hover:text-foreground/80 transition-colors mb-3 leading-tight">
                  {article.title}
                </h2>
                
                <div className="flex items-center space-x-3 text-sm text-foreground/60 mb-3">
                  <span className="font-mono">{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <p className="text-foreground/70 leading-relaxed mb-4 max-w-xl">
                  {article.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AINews;
