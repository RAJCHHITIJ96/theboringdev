
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AINews = () => {
  const articles = [
    {
      title: "OpenAI's Latest Update: What It Actually Means",
      date: "June 2025",
      readTime: "4 min read",
      description: "Beyond the headlines - practical implications for developers and businesses. What changed, what didn't, and what you should do about it.",
      category: "AI NEWS"
    },
    {
      title: "Google's AI Strategy Shift: The Real Story",
      date: "May 2025", 
      readTime: "6 min read",
      description: "Context that leads to action, not breathless hype cycles. Analysis of market moves and their impact on the competitive landscape.",
      category: "AI NEWS"
    },
    {
      title: "The AI Regulation Update That Actually Matters",
      date: "May 2025",
      readTime: "5 min read",
      description: "Cutting through policy jargon to understand real-world impacts. How new regulations will affect AI development and deployment.",
      category: "AI NEWS"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-40">
        <div className="container mx-auto max-w-4xl px-6">
          {/* Clean Header Section */}
          <div className="mb-20 fade-in-up">
            <div className="text-sm font-mono text-foreground/60 mb-6 tracking-wider uppercase">
              AI NEWS
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 tracking-tight leading-tight">
              AI News
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl leading-relaxed">
              What happened, what it means, what you should do. Context that leads to action.
            </p>
            <div className="w-full h-px bg-border-gray"></div>
          </div>

          {/* Articles Grid */}
          <div className="space-y-16 fade-in-up">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group cursor-pointer border-b border-border-gray/30 pb-16 last:border-b-0 hover:border-border-gray/60 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground/50 tracking-wider uppercase">
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-3 text-sm text-foreground/60">
                      <span className="font-mono">{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="font-serif font-semibold text-2xl md:text-3xl text-foreground group-hover:text-foreground/80 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  
                  <p className="font-sans text-foreground/70 leading-relaxed text-lg max-w-3xl">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                    <span>Read Article</span>
                    <span className="ml-2 transition-transform group-hover:translate-x-1 duration-200">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};

export default AINews;
