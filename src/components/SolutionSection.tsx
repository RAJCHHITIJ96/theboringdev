
const SolutionSection = () => {
  return (
    <section className="section-spacing-large theme-transition">
      <div className="container-reading">
        <div className="fade-in-up">
          {/* LARGE Element - Section Headline */}
          <h2 className="text-center mb-xl font-serif-display">
            What if you had a system that actually worked?
          </h2>
          
          {/* MEDIUM Elements - Value Proposition */}
          <div className="max-w-prose mx-auto space-y-large text-center">
            <p className="text-xl leading-relaxed mb-large font-serif-body">
              Meet <strong className="font-serif-display">theboringdev</strong> — where one person with obsessive attention to detail built something the entire AI industry needs:
            </p>
            
            {/* LARGE Element - Core Promise */}
            <div className="hero-card">
              <p className="text-2xl md:text-3xl font-bold font-serif-display leading-tight">
                Real intelligence about AI intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
