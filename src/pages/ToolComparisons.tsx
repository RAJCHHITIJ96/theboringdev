
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ToolComparisons = () => {
  const articles = [
    {
      title: "ChatGPT vs Claude vs Gemini: Real Usage Data",
      date: "June 2025",
      readTime: "5 min read",
      description: "Side-by-side analysis with actual usage statistics, not affiliate marketing disguised as reviews...",
      category: "COMPARISONS"
    },
    {
      title: "AI Writing Tools: What Actually Works",
      date: "May 2025", 
      readTime: "4 min read",
      description: "Data-driven decisions based on real performance metrics across 50+ tools...",
      category: "COMPARISONS"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-32">
        <div className="container-reading">
          <div className="mb-16 fade-in-up">
            <div className="text-sm font-mono text-foreground/60 mb-4 tracking-wider uppercase">
              COMPARISONS
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight">
              Tool Comparisons
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

export default ToolComparisons;
