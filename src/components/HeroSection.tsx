
const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 theme-transition">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-[#F6F5EF] dark:bg-background rounded-[10px] p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24">
          <div className="text-center fade-in-up">
            {/* LARGE Elements - Primary Focus (40% visual weight) */}
            <h1 className="mb-12 font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
              The AI Revolution Has A Problem
            </h1>
            
            {/* MEDIUM Elements - Secondary Support (35% visual weight) */}
            <div className="space-y-8 mb-16">
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight font-serif text-foreground">
                <strong>Everyone's talking about AI changing everything.</strong>
              </p>
              
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight font-serif text-foreground">
                <strong>Nobody's showing you what's actually real.</strong>
              </p>
            </div>

            {/* Primary CTA - LARGE element for conversion */}
            <div className="mb-8">
              <button className="btn-primary interactive-element focusable text-lg px-8 py-4">
                <strong>Start Reading →</strong>
              </button>
            </div>

            {/* SMALL Elements - Supporting Details (25% visual weight) */}
            <div className="text-sm opacity-70">
              <p className="font-serif">Real intelligence about AI intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
