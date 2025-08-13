
const HeroSection = () => {
  return (
    <section className="section-spacing-large theme-transition">
      <div className="container-reading">
        <div className="text-center fade-in-up">
          {/* LARGE Elements - Primary Focus (40% visual weight) */}
          <h1 className="mb-large font-serif-display">
            The AI Revolution Has A Problem
          </h1>
          
          {/* MEDIUM Elements - Secondary Support (35% visual weight) */}
          <div className="space-y-large mb-xl">
            <p className="text-xl md:text-2xl font-semibold leading-tight font-serif-body">
              <strong>Everyone's talking about AI changing everything.</strong>
            </p>
            
            <p className="text-xl md:text-2xl font-semibold leading-tight font-serif-body">
              <strong>Nobody's showing you what's actually real.</strong>
            </p>
          </div>

          {/* Primary CTA - LARGE element for conversion */}
          <div className="mt-xl">
            <button className="btn-primary interactive-element focusable">
              <strong>Explore AI Intelligence →</strong>
            </button>
          </div>

          {/* SMALL Elements - Supporting Details (25% visual weight) */}
          <div className="mt-large text-sm opacity-70">
            <p className="font-serif-body">Real intelligence about AI intelligence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
