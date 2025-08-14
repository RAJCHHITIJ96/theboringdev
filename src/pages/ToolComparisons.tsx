
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ToolComparisons = () => {
  const articles = [
    {
      title: "ChatGPT vs Claude vs Gemini: Real Usage Data",
      date: "June 2025",
      readTime: "7 min read",
      description: "Side-by-side analysis with actual usage statistics from 1000+ users, not affiliate marketing.",
      category: "COMPARISONS"
    },
    {
      title: "AI Writing Tools: What Actually Works in 2025",
      date: "May 2025", 
      readTime: "5 min read",
      description: "Data-driven decisions based on real performance metrics across 50+ tools.",
      category: "COMPARISONS"
    },
    {
      title: "Code Generation Tools: Comprehensive Analysis",
      date: "May 2025",
      readTime: "9 min read",
      description: "GitHub Copilot vs Cursor vs Claude vs ChatGPT for developers. Real coding benchmarks.",
      category: "COMPARISONS"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto max-w-2xl px-6">
          {/* Header Section */}
          <div className="mb-16 fade-in-up">
            <div className="text-sm font-mono text-foreground/50 mb-4 tracking-wider uppercase">
              COMPARISONS
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight leading-tight">
              Tool Comparisons
            </h1>
            <div className="w-full h-px bg-foreground/10 mb-8"></div>
          </div>

          {/* Articles List */}
          <div className="space-y-12 fade-in-up">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="group cursor-pointer border-b border-foreground/10 pb-12 last:border-b-0 hover:border-foreground/20 transition-all duration-200"
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
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default ToolComparisons;
