
const ProblemSection = () => {
  return (
    <section className="section-spacing-large bg-error-subtle theme-transition">
      <div className="container-reading">
        <div className="fade-in-up">
          {/* LARGE Element - Section Headline */}
          <h2 className="text-center mb-xl font-serif-display">
            The brutal truth about AI content today:
          </h2>
          
          {/* MEDIUM Elements - Key Statistics */}
          <div className="mb-xl text-center">
            <p className="text-xl md:text-2xl leading-tight mb-large font-serif-body">
              <span className="stat-number text-3xl md:text-4xl font-mono-data font-semibold mr-small">73%</span>
              of what you read about "breakthrough AI tools" is content marketing disguised as journalism.
            </p>
          </div>

          {/* SMALL Elements - Supporting Details */}
          <div className="max-w-prose mx-auto space-y-medium">
            <p className="text-lg leading-relaxed font-serif-body">
              The same recycled ChatGPT tutorials. The same "revolutionary" announcements. The same influencers promoting tools they've never actually used.
            </p>
            
            <p className="text-xl font-semibold text-center py-large font-serif-body">
              <strong>While you're drowning in AI noise, the real opportunities are slipping away.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
