
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AINews = () => {
  const articles = [
    {
      title: "What OpenAI's Latest Update Actually Means",
      date: "June 2025",
      readTime: "3 min read",
      description: "Context that leads to action, not breathless hype cycles about the latest AI announcements...",
      category: "NEWS"
    },
    {
      title: "Google's AI Strategy: Beyond the Headlines",
      date: "May 2025", 
      readTime: "4 min read",
      description: "What happened, what it means, and what you should do about Google's recent AI moves...",
      category: "NEWS"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-32">
        <div className="container-reading">
          <div className="mb-16 fade-in-up">
            <div className="text-sm font-mono text-foreground/60 mb-4 tracking-wider uppercase">
              NEWS
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              AI News
            </h1>
            <div className="w-full h-px bg-border-gray mb-8"></div>
          </div>

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

export default AINews;
