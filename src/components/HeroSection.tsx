
const HeroSection = () => {
  return (
    <section className="py-32 md:py-40 lg:py-48 theme-transition">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="bg-[#F6F5EF] dark:bg-background rounded-[10px] p-16 md:p-24 lg:p-32">
          <div className="text-center fade-in-up">
            {/* LARGE Elements - Primary Focus (40% visual weight) */}
            <h1 className="mb-16 font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-foreground">
              The AI Revolution Has A Problem
            </h1>
            
            {/* MEDIUM Elements - Secondary Support (35% visual weight) */}
            <div className="space-y-12 mb-20">
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight font-serif text-foreground">
                <strong>Everyone's talking about AI changing everything.</strong>
              </p>
              
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight font-serif text-foreground">
                <strong>Nobody's showing you what's actually real.</strong>
              </p>
            </div>

            {/* Primary CTA - LARGE element for conversion */}
            <div className="mb-12">
              <button className="btn-primary interactive-element focusable text-xl px-12 py-6">
                <strong>Start Reading →</strong>
              </button>
            </div>

            {/* SMALL Elements - Supporting Details (25% visual weight) */}
            <div className="text-base opacity-70">
              <p className="font-serif">Real intelligence about AI intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
