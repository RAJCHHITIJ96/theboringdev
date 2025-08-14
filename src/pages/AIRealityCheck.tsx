
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AIRealityCheck = () => {
  const articles = [
    {
      title: "AI Hype vs Reality: A Brutally Honest Assessment",
      date: "June 2025",
      readTime: "8 min read",
      description: "Separating genuine breakthroughs from marketing campaigns. Truth over trending topics.",
      category: "REALITY CHECK"
    },
    {
      title: "The AI Bubble: What's Real and What's Not",
      date: "May 2025", 
      readTime: "6 min read",
      description: "Honest analysis of where AI actually delivers value. Market realities beyond the VC narratives.",
      category: "REALITY CHECK"
    },
    {
      title: "Why 90% of AI Startups Will Fail (Data Analysis)",
      date: "May 2025",
      readTime: "7 min read",
      description: "Hard truths about the AI market that nobody wants to discuss. Failure patterns and opportunities.",
      category: "REALITY CHECK"
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
              REALITY CHECK
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-6 tracking-tight leading-tight">
              AI Reality Check
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

export default AIRealityCheck;
