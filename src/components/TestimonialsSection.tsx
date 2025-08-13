
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Finally, someone who actually validates what they write about AI. The competitive analysis alone is worth the read.",
      author: "Sarah M., AI Product Manager"
    },
    {
      quote: "I was drowning in AI content. This is the only source I trust for real market intelligence.",
      author: "David K., Startup Founder"
    },
    {
      quote: "The trend analysis here is better than what most consulting firms charge thousands for.",
      author: "Maya P., Investment Analyst"
    }
  ];

  return (
    <section className="section-spacing-large bg-success-subtle theme-transition">
      <div className="container-reading">
        <div className="fade-in-up">
          <h2 className="text-center mb-xl font-serif-display">
            What people are saying:
          </h2>
          
          <div className="space-y-large">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="content-card">
                <p className="text-lg mb-medium font-serif-body italic">
                  "{testimonial.quote}"
                </p>
                <p className="text-foreground/70 font-sans-interface">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
