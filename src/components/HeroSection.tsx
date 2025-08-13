
const HeroSection = () => {
  return (
    <section className="section-spacing-large theme-transition">
      <div className="container-reading">
        {/* LARGE Elements - Primary Focus (40% visual weight) */}
        <div className="text-center fade-in-up">
          <h1 className="mb-8">
            The AI Revolution Has A Problem
          </h1>
          
          {/* MEDIUM Elements - Secondary Support (35% visual weight) */}
          <div className="space-y-8 mb-12">
            <p className="text-xl md:text-2xl font-semibold leading-tight">
              <strong>Everyone's talking about AI changing everything.</strong>
            </p>
            
            <p className="text-xl md:text-2xl font-semibold leading-tight">
              <strong>Nobody's showing you what's actually real.</strong>
            </p>
          </div>

          {/* Primary CTA - LARGE element for conversion */}
          <div className="mt-12">
            <button className="btn-primary interactive-hover focusable">
              <strong>Explore AI Intelligence →</strong>
            </button>
          </div>

          {/* SMALL Elements - Supporting Details (25% visual weight) */}
          <div className="mt-8 text-sm opacity-70">
            <p>Real intelligence about AI intelligence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
