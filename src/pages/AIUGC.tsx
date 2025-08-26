import React, { useState, useEffect } from 'react';

const AIUGC = () => {
  const [activeSection, setActiveSection] = useState('');

  const tableOfContents = [
    { id: 'what-if', title: 'What If I Told You There\'s a "Boring" Way to Generate 100K+ Visitors Every Month—And It Compounds?' },
    { id: 'simple-idea', title: 'The Simple Idea Everyone\'s Missing (But Nobody Wants to Talk About)' },
    { id: 'conservative-math', title: 'The Conservative Math That Changes Everything' },
    { id: 'boring-method', title: 'The Boring Method Architecture (How It Actually Works)' },
    { id: 'done-for-you-1', title: 'The Boring Method Done-For-You System' },
    { id: 'architecture', title: 'The Make.com + Claude Architecture That Powers Everything' },
    { id: 'why-most-people', title: 'Why Most People Will Never Build This' },
    { id: 'done-for-you-2', title: 'Your Traffic Empire, Built For You' },
    { id: 'next-move', title: 'Your Next Move: From Understanding to Implementation' },
    { id: 'whats-your-move', title: 'What\'s Your Move?' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="w-full h-[60vh] relative">
        <img 
          src="https://i.ibb.co/xSCbB1XD/ai-ugc-revolution.png"
          alt="The AI UGC Revolution" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="flex gap-12">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-80 sticky top-8 self-start">
            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
                TABLE OF CONTENTS
              </h3>
              <nav className="space-y-3">
                {tableOfContents.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left text-sm leading-relaxed transition-all duration-200 hover:text-foreground ${
                      activeSection === item.id 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Article Header */}
            <header className="py-12 text-center border-b border-border/30">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Published on</p>
                <p className="text-sm font-medium">27 August 2025</p>
                <p className="text-sm text-muted-foreground mt-2">15 min read</p>
              </div>
              <div className="w-24 h-px bg-foreground/20 mx-auto"></div>
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none py-16">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
                The Boring Method of Generating 100K+ Visitors That Compounds Every Month (All With AI Systems)
              </h1>

              <section id="what-if" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  What If I Told You There's a "Boring" Way to Generate 100K+ Visitors Every Month—And It Compounds?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Everyone's doing AI content wrong. They're thinking in single posts. I'm thinking in traffic ecosystems that multiply themselves. While others celebrate their first viral post, I built a system that generates 100K visitors in month 2, 200K in month 3, and keeps compounding from there. Not through luck. Not through viral content. Through systematic AI-powered compound growth.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Here's the thing most people don't understand: AI content isn't about replacing human creativity—it's about amplifying human strategy at exponential scale. You gotta see this working to believe it. But once you do, you'll never go back to the old way of building traffic.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This is what I call <strong className="text-foreground">The Boring Method</strong>. Not because it's boring—because it works so consistently, it becomes "boringly" predictable.
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="simple-idea" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  The Simple Idea Everyone's Missing (But Nobody Wants to Talk About)
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Let me break this down in the simplest terms possible: Most people think: <em>"AI can write blog posts now, cool!"</em> I thought: <em>"What if AI could build entire content empires that self-multiply?"</em> The difference? Scale thinking vs. single-post thinking.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Traditional Content Strategy:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Write 1 great post per week</li>
                      <li>• Hope it performs well</li>
                      <li>• Pray for consistent traffic</li>
                      <li>• Scale linearly (maybe)</li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">The Boring Method:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Generate 17 optimized posts daily</li>
                      <li>• Each post targets different keyword clusters</li>
                      <li>• 510+ posts create domain authority compound effect</li>
                      <li>• Traffic scales geometrically, not linearly</li>
                    </ul>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  I used to think quality meant writing one perfect post per week. Then I realized: Why not both quality <strong className="text-foreground">AND</strong> quantity at massive scale?
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="conservative-math" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  The Conservative Math That Changes Everything
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Here's where it gets interesting. Let me show you the actual numbers—not the hopeful projections, but the conservative reality of compound traffic growth.
                </p>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full border-collapse bg-background rounded-xl border border-border/30">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="border border-border/30 p-4 text-left font-semibold">Month</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Content Pieces</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Monthly Visitors</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Domain Authority</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Compound Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border/30 p-4">Month 1</td><td className="border border-border/30 p-4">510</td><td className="border border-border/30 p-4">45,000</td><td className="border border-border/30 p-4">Building</td><td className="border border-border/30 p-4">1x</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 2</td><td className="border border-border/30 p-4">1,020</td><td className="border border-border/30 p-4">100,000</td><td className="border border-border/30 p-4">Moderate</td><td className="border border-border/30 p-4">2.2x</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 3</td><td className="border border-border/30 p-4">1,530</td><td className="border border-border/30 p-4">200,000</td><td className="border border-border/30 p-4">Strong</td><td className="border border-border/30 p-4">4.4x</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 4</td><td className="border border-border/30 p-4">2,040</td><td className="border border-border/30 p-4">350,000</td><td className="border border-border/30 p-4">High</td><td className="border border-border/30 p-4">7.8x</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 6</td><td className="border border-border/30 p-4">3,060</td><td className="border border-border/30 p-4">600,000</td><td className="border border-border/30 p-4">Authority</td><td className="border border-border/30 p-4">13.3x</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Now here's the business impact. No matter what you sell—info products, e-commerce, agency services, SaaS—the conversion math is universal.
                </p>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full border-collapse bg-background rounded-xl border border-border/30">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="border border-border/30 p-4 text-left font-semibold">Month</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Visitors</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Info Products ($200 AOV)</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">E-commerce ($75 AOV)</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">Agency (10% to leads)</th>
                        <th className="border border-border/30 p-4 text-left font-semibold">SaaS ($49 MRR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border/30 p-4">Month 2</td><td className="border border-border/30 p-4">100,000</td><td className="border border-border/30 p-4">$60,000</td><td className="border border-border/30 p-4">$22,500</td><td className="border border-border/30 p-4">10,000 leads</td><td className="border border-border/30 p-4">$14,700 MRR</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 3</td><td className="border border-border/30 p-4">200,000</td><td className="border border-border/30 p-4">$120,000</td><td className="border border-border/30 p-4">$45,000</td><td className="border border-border/30 p-4">20,000 leads</td><td className="border border-border/30 p-4">$29,400 MRR</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 4</td><td className="border border-border/30 p-4">350,000</td><td className="border border-border/30 p-4">$210,000</td><td className="border border-border/30 p-4">$78,750</td><td className="border border-border/30 p-4">35,000 leads</td><td className="border border-border/30 p-4">$51,450 MRR</td></tr>
                      <tr><td className="border border-border/30 p-4">Month 6</td><td className="border border-border/30 p-4">600,000</td><td className="border border-border/30 p-4">$360,000</td><td className="border border-border/30 p-4">$135,000</td><td className="border border-border/30 p-4">60,000 leads</td><td className="border border-border/30 p-4">$88,200 MRR</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  I want you to understand something: These aren't best-case scenarios. This is conservative math based on actual implementation data.
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="boring-method" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  The Boring Method Architecture (How It Actually Works)
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  This isn't your typical "AI writes blog posts" setup. Most AI content systems optimize for volume. I optimized for compound domain authority that creates exponential traffic multiplication.
                </p>

                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">The Three-Layer System:</h3>

                <div className="space-y-8">
                  <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
                    <h4 className="font-semibold text-lg text-foreground mb-4">Layer 1: Content Intelligence Engine</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Claude AI with custom prompt engineering</li>
                      <li>• 17 unique, high-quality posts daily</li>
                      <li>• Each targeting specific keyword clusters</li>
                      <li>• Quality scoring algorithm ensures 85+ rating before publication</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
                    <h4 className="font-semibold text-lg text-foreground mb-4">Layer 2: Compound Authority Builder</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Content pieces interlink strategically</li>
                      <li>• Creates topical authority clusters</li>
                      <li>• Builds domain-wide SEO momentum</li>
                      <li>• Each new post strengthens the entire ecosystem</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
                    <h4 className="font-semibold text-lg text-foreground mb-4">Layer 3: Traffic Multiplication Framework</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Search rankings compound across all content</li>
                      <li>• Social sharing amplifies through content clusters</li>
                      <li>• Email list growth accelerates with more entry points</li>
                      <li>• Authority-driven traffic becomes increasingly organic</li>
                    </ul>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mt-8">
                  A few months ago, I was thinking about individual post performance. Now I think about traffic ecosystem performance. The magic happens when you stop optimizing for single posts and start optimizing for compound domain authority.
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="done-for-you-1" className="mb-16">
                <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                    👉 The Boring Method Done-For-You System
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    You've just seen the architecture, the math, and why this compounds. But here's the truth: building this yourself would take months of painful trial and error. That's exactly why I created the <strong className="text-foreground">Done-For-You Boring Method System</strong>. My team and I set up the <strong className="text-foreground">entire ecosystem</strong> for you:
                  </p>
                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Keyword intelligence pipelines</li>
                    <li>• Claude AI content generation (with quality scoring built in)</li>
                    <li>• Next.js publishing architecture</li>
                    <li>• Automated interlinking & authority building</li>
                    <li>• Traffic + revenue attribution</li>
                  </ul>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    You get a <strong className="text-foreground">ready-to-run compound traffic engine</strong> without wasting months figuring it out alone.
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    ⚡ Only a limited number of implementation slots open monthly. If you want us to build this for you, <a href="#" className="text-primary underline hover:no-underline">click here now and secure your spot</a>.
                  </p>
                </div>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="architecture" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  The Make.com + Claude Architecture That Powers Everything
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Want to see exactly how this works under the hood? I would not recommend trying to build this with basic tools. The compound effect requires enterprise-level automation that most people don't even know exists.
                </p>

                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">The Technical Stack:</h3>

                <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto mb-8">
                  <pre className="text-sm text-green-400 font-mono">
{`{
  "content_engine": {
    "trigger": "Daily 6AM keyword research scan",
    "generation": "Claude with custom theboring prompts", 
    "quality_check": "Automated scoring algorithm",
    "publishing": "Next.js dynamic deployment",
    "optimization": "Real-time SEO metadata generation"
  },
  "compound_multiplier": {
    "interlinking": "Automated cluster connections",
    "authority_building": "Strategic pillar content",
    "social_amplification": "Multi-platform distribution",
    "email_integration": "Automated list building"
  }
}`}
                  </pre>
                </div>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="why-most-people" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Why Most People Will Never Build This
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Here's the uncomfortable truth: The Boring Method requires thinking in systems, not posts. Most content creators are still thinking like bloggers, not like traffic engineers.
                </p>

                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">Common Mistakes I See:</h3>

                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h4 className="font-semibold text-lg text-red-900 mb-2">Single-Post Optimization Obsession</h4>
                    <p className="text-red-800">Spending weeks perfecting one post instead of building systematic content generation</p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h4 className="font-semibold text-lg text-red-900 mb-2">Quality Perfectionism</h4>
                    <p className="text-red-800">Waiting for "perfect" content instead of shipping "excellent" content at scale</p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h4 className="font-semibold text-lg text-red-900 mb-2">Manual Process Addiction</h4>
                    <p className="text-red-800">Trying to hand-craft everything instead of engineering automated excellence</p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h4 className="font-semibold text-lg text-red-900 mb-2">Short-Term Thinking</h4>
                    <p className="text-red-800">Measuring success in days/weeks instead of compound monthly growth</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mt-8">
                  I want you to think differently. This isn't about creating content—it's about engineering traffic empires.
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="done-for-you-2" className="mb-16">
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl p-8 border border-primary/20">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                    👉 Your Traffic Empire, Built For You
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Right now, you've seen the <strong className="text-foreground">entire blueprint</strong>—the architecture, the math, the implementation reality. And if you're feeling both excited <strong className="text-foreground">and</strong> overwhelmed… that's exactly where most people realize they can't do this alone.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    That's why I created the <strong className="text-foreground">Done-For-You Boring Method Implementation</strong>. We don't just give you the plan—we build the entire system:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>17+ posts/day pipeline fully automated</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Authority-building interlinking strategy</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Next.js publishing & optimization stack</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Revenue attribution wired in from day one</span>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Instead of trying (and failing) to duct-tape tools together, you'll wake up to a system already working and compounding.
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    Spots are extremely limited (because we run the builds in-house). If you're serious about scaling traffic predictably, <a href="#" className="text-primary underline hover:no-underline">click here now to apply</a>.
                  </p>
                </div>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="next-move" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Your Next Move: From Understanding to Implementation
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  The compound traffic revolution is happening with or without you. I've given you the complete blueprint. The architecture, the math, the real-world implementation data—everything you need to understand why The Boring Method generates 100K+ visitors that compound monthly. But understanding and implementing are two different games.
                </p>

                <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Here's what separates successful implementations from abandoned projects:
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <div>
                      <strong className="text-foreground">Systems Thinking:</strong> <span className="text-muted-foreground">Optimizing for compound growth, not individual posts</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <div>
                      <strong className="text-foreground">Technical Excellence:</strong> <span className="text-muted-foreground">Enterprise-level automation that actually works at scale</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <div>
                      <strong className="text-foreground">Quality at Speed:</strong> <span className="text-muted-foreground">85+ content quality scores at 17 posts daily</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <div>
                      <strong className="text-foreground">Authority Building:</strong> <span className="text-muted-foreground">Strategic content clusters that multiply domain authority</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <div>
                      <strong className="text-foreground">Patience for Compound Growth:</strong> <span className="text-muted-foreground">Waiting for the exponential curve to kick in</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  You gotta see this working to believe it. But once you experience compound traffic growth, you'll never go back to linear content strategies.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  The choice is simple: Keep creating content the old way and hope for viral hits, or start engineering traffic systems that compound predictably. The traffic empire belongs to those who understand that consistency at scale beats perfection at small scale every single time.
                </p>
              </section>

              <hr className="border-border/30 my-12" />

              <section id="whats-your-move" className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  What's Your Move?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have you tried building automated content systems before? What's been your biggest challenge with scaling content creation? Drop a comment below—I read every response and often share additional insights personally.
                </p>
              </section>
            </article>

            {/* Trending Opportunities Card */}
            <div className="mt-16 pt-16 border-t border-border/30">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
                Trending AI Opportunities
              </h2>
              <div className="max-w-md mx-auto">
                <div className="bg-background rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
                  <div className="w-full h-48">
                    <img 
                      src="https://i.ibb.co/xSCbB1XD/ai-ugc-revolution.png"
                      alt="The AI UGC Factory"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
                      The AI UGC Factory That Generates 150+ Videos Daily for Under $12
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AIUGC;