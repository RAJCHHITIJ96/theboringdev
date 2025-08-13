
const ProblemSection = () => {
  return (
    <section className="section-spacing-large bg-error-subtle theme-transition">
      <div className="container-reading">
        <div className="animate-fade-in-up">
          {/* LARGE Element - Section Headline */}
          <h2 className="section-headline mb-xl text-center">
            The brutal truth about AI content today:
          </h2>
          
          {/* MEDIUM Elements - Key Statistics */}
          <div className="mb-xl">
            <p className="text-xl md:text-2xl leading-tight mb-large text-center">
              <span className="stat-highlight text-3xl md:text-4xl font-mono-data font-semibold mr-small">73%</span>
              of what you read about "breakthrough AI tools" is content marketing disguised as journalism.
            </p>
          </div>

          {/* SMALL Elements - Supporting Details */}
          <div className="prose-content space-y-medium">
            <p className="text-lg leading-relaxed">
              The same recycled ChatGPT tutorials. The same "revolutionary" announcements. The same influencers promoting tools they've never actually used.
            </p>
            
            <p className="text-xl font-semibold text-center py-large">
              <strong>While you're drowning in AI noise, the real opportunities are slipping away.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
