
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AIAutomation = () => {
  const articles = [
    {
      title: "Building Automated Workflows That Actually Work",
      date: "June 2025",
      readTime: "4 min read",
      description: "Real automation systems with measurable ROI from actual businesses, not theoretical frameworks. Step-by-step implementation guides with real performance data.",
      category: "AUTOMATION"
    },
    {
      title: "ROI-Driven AI Implementation Strategy",
      date: "May 2025", 
      readTime: "6 min read",
      description: "How to implement AI systems that pay for themselves within 90 days. Case studies from businesses that achieved 300%+ ROI in their first quarter.",
      category: "AUTOMATION"
    },
    {
      title: "The Complete Guide to AI Process Automation",
      date: "May 2025",
      readTime: "8 min read",
      description: "From workflow analysis to deployment, everything you need to automate business processes with AI. Includes templates and checklists.",
      category: "AUTOMATION"
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
              AUTOMATION
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 tracking-tight leading-tight">
              AI Automation
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl leading-relaxed">
              Systems that actually work in real businesses. Real implementations with measurable ROI.
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

export default AIAutomation;
