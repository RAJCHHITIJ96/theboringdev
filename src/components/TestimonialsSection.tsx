
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
    <section className="section-spacing bg-accent-warm theme-transition">
      <div className="content-container">
        <div className="content-narrow">
          <h2 className="section-headline mb-12">
            What people are saying:
          </h2>
          
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="minimal-card">
                <p className="testimonial">
                  "{testimonial.quote}"
                </p>
                <p className="testimonial-author">
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
