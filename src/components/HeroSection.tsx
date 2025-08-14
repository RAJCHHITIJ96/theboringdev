
const HeroSection = () => {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-[#F6F5EF] dark:bg-background border-b border-foreground/5">
      {/* Remove all container/padding constraints */}
      <div className="relative h-full w-full flex flex-col items-center justify-center text-center">
        
        {/* Decorative Scribbles */}
        <svg className="absolute top-[20%] left-[10%] w-24 h-20 opacity-30" viewBox="0 0 100 80">
          <path d="M10,40 Q30,10 50,40 T90,40" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground/20"/>
        </svg>
        <svg className="absolute top-[30%] right-[15%] w-20 h-16 opacity-30" viewBox="0 0 80 60">
          <circle cx="40" cy="30" r="25" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground/20"/>
        </svg>
        <svg className="absolute bottom-[25%] left-[20%] w-16 h-12 opacity-30" viewBox="0 0 60 40">
          <path d="M5,20 L25,5 L45,25 L25,35 Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground/20"/>
        </svg>
        <svg className="absolute bottom-[20%] right-[10%] w-24 h-14 opacity-30" viewBox="0 0 90 50">
          <path d="M10,25 Q30,5 50,25 Q70,45 90,25" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground/20"/>
        </svg>

        {/* LARGE Elements - Primary Focus (40% visual weight) */}
        <div className="space-y-8 md:space-y-12 max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
            The AI Revolution Has A Problem
          </h1>

          {/* MEDIUM Elements - Secondary Support (35% visual weight) */}
          <div className="space-y-8 md:space-y-6">
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
    </section>
  );
};

export default HeroSection;
