
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AIRealityCheck = () => {
  const articles = [
    {
      title: "AI Hype vs Reality: A Honest Assessment",
      date: "June 2025",
      readTime: "6 min read",
      description: "Separating genuine breakthroughs from marketing campaigns, truth over trending topics...",
      category: "REALITY CHECK"
    },
    {
      title: "The AI Bubble: What's Real and What's Not",
      date: "May 2025", 
      readTime: "5 min read",
      description: "Not echo chamber amplification, but honest analysis of where AI actually delivers value...",
      category: "REALITY CHECK"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-32">
        <div className="container-reading">
          <div className="mb-16 fade-in-up">
            <div className="text-sm font-mono text-foreground/60 mb-4 tracking-wider uppercase">
              REALITY CHECK
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              AI Reality Check
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

export default AIRealityCheck;
