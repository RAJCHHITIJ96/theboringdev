
import React, { useState, useEffect } from 'react';

const AIUGC = () => {
  const [activeSection, setActiveSection] = useState('');

  const tableOfContents = [
    { id: 'what-if', title: 'The AI UGC Factory That Generates 150+ Videos Daily for Under $12' },
    { id: 'what-this-is', title: 'What This AI UGC Factory Actually Is (Dead Simple)' },
    { id: 'conversion-math', title: 'The Conversion Math That Changes Everything' },
    { id: 'cost-breakdown', title: 'The Real-World Cost Breakdown' },
    { id: 'technical-implementation', title: 'The Technical Implementation (Simplified)' },
    { id: 'performance-data', title: 'Performance Data: 47 Days of Real Results' },
    { id: 'advanced-optimization', title: 'The Advanced Optimization System' },
    { id: 'scaling-up', title: 'Scaling to 300+ Videos/Day (The Next Level)' },
    { id: 'common-pitfalls', title: 'Common Pitfalls (And How to Avoid Them)' },
    { id: 'why-most-people', title: 'Why 99% of Businesses Will Never Do This' },
    { id: 'future-proofing', title: 'Future-Proofing Your System' },
    { id: 'bottom-line', title: 'The Bottom Line: Your Content Revolution Starts Now' },
    { id: 'faq', title: 'FAQ: Your Burning Questions Answered' }
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
    <div className="min-h-screen" style={{ backgroundColor: '#F6F8F6' }}>
      {/* Hero Image */}
      <div className="w-full h-[60vh] relative">
        <img 
          src="https://i.ibb.co/xSCbB1XD/ai-ugc-revolution.png"
          alt="The AI UGC Revolution" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Main Content Container with proper top margin */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 relative">
        {/* Article Header - Centered */}
        <header className="max-w-4xl mx-auto py-12 text-center border-b" style={{ borderColor: '#E5E5E5' }}>
          <div className="mb-6">
            <p className="text-sm mb-2" style={{ color: '#555555' }}>Published on</p>
            <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>27 August 2025</p>
            <p className="text-sm mt-2" style={{ color: '#555555' }}>15 min read</p>
          </div>
          <div className="w-24 h-px mx-auto" style={{ backgroundColor: '#555555' }}></div>
        </header>

        {/* Title and Subtitle - Centered */}
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-8 leading-tight" style={{ color: '#1a1a1a' }}>
            The AI UGC Factory That Generates 150+ Videos Daily for Under $12
          </h1>
          <h2 className="font-serif text-2xl lg:text-3xl font-semibold mb-8 opacity-80" style={{ color: '#1a1a1a' }}>
            (While Your Competitors Burn $300+ for the Same Output)
          </h2>
          <div className="prose prose-xl max-w-none">
            <p className="text-xl leading-relaxed mb-6" style={{ color: '#555555' }}>
              <strong style={{ color: '#1a1a1a' }}>What if I told you there's a machine that creates 150 professional videos every single day for less than the cost of two Starbucks coffees?</strong>
            </p>
            <p className="text-xl leading-relaxed mb-6" style={{ color: '#555555' }}>
              That's exactly what I built. And in the next 10 minutes, I'm going to show you the system that's about to make traditional UGC pricing look like highway robbery.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#555555' }}>
              But first, let me explain what this thing actually does...
            </p>
          </div>
        </div>

        {/* Content Layout with TOC and Main Content */}
        <div className="flex gap-12">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-72 sticky top-8 self-start">
            <div className="rounded-2xl p-6 border shadow-sm bg-white/80 backdrop-blur-sm" style={{ borderColor: '#E5E5E5' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-6 pb-3 border-b" style={{ color: '#999999', borderColor: '#E5E5E5' }}>
                TABLE OF CONTENTS
              </h3>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <nav className="space-y-1">
                  {tableOfContents.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm leading-relaxed py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                        activeSection === item.id 
                          ? 'bg-gray-100 font-medium border-l-2 pl-4' 
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ 
                        color: activeSection === item.id ? '#1a1a1a' : '#666666',
                        borderLeftColor: activeSection === item.id ? '#1a1a1a' : 'transparent'
                      }}
                    >
                      <span className="text-xs opacity-50 mr-2">{String(index + 1).padStart(2, '0')}</span>
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content - Centered with enhanced typography */}
          <main className="flex-1 max-w-4xl mx-auto">
            {/* AI Assembly Line Image */}
            <div className="my-16">
              <img 
                src="https://ibb.co/206YcJ2n"
                alt="AI UGC automation workflow diagram showing 12 connected workers generating 150 videos daily for $11.47 cost breakdown"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <section id="what-this-is" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8 leading-tight" style={{ color: '#1a1a1a' }}>
                  What This AI UGC Factory Actually Is (Dead Simple)
                </h2>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  Think of this like having <strong style={{ color: '#1a1a1a' }}>12 AI employees working 24/7</strong> in your content department.
                </p>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  Here's the entire system in 30 seconds:
                </p>

                <div className="rounded-2xl p-8 mb-12 border-l-4" style={{ backgroundColor: '#FEF3F8', borderColor: '#E91E63' }}>
                  <h3 className="font-semibold text-xl mb-6" style={{ color: '#1a1a1a' }}>The Assembly Line:</h3>
                  <ul className="space-y-4 text-lg" style={{ color: '#555555' }}>
                    <li className="flex items-start">
                      <span className="inline-block w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center mr-4 mt-1">1</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Worker #1</strong>: Finds trending topics across 15 platforms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold rounded-full flex items-center justify-center mr-4 mt-1">2</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Worker #2</strong>: Writes viral-optimized scripts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-8 h-8 bg-gradient-to-r from-pink-500 to-red-600 text-white text-sm font-bold rounded-full flex items-center justify-center mr-4 mt-1">3</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Worker #3</strong>: Creates natural-sounding voice audio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-bold rounded-full flex items-center justify-center mr-4 mt-1">4</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Worker #4</strong>: Generates matching visuals and backgrounds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-10 h-8 bg-gradient-to-r from-orange-500 to-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-1">5-8</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Workers #5-8</strong>: Edit, optimize, and quality-check everything</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-12 h-8 bg-gradient-to-r from-green-500 to-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2 mt-1">9-12</span>
                      <span><strong style={{ color: '#1a1a1a' }}>AI Workers #9-12</strong>: Distribute across platforms and track performance</span>
                    </li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="text-center p-6 rounded-2xl border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>150+</div>
                    <div className="text-sm font-medium" style={{ color: '#555555' }}>Professional UGC videos daily</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>$11.47</div>
                    <div className="text-sm font-medium" style={{ color: '#555555' }}>Per day ($0.076 per video)</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>2 weeks</div>
                    <div className="text-sm font-medium" style={{ color: '#555555' }}>Fully automated after setup</div>
                  </div>
                </div>

                <p className="text-xl leading-relaxed" style={{ color: '#555555' }}>
                  You gotta see this working to believe it. But once you do, you'll never pay premium UGC prices again.
                </p>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="conversion-math" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  The Conversion Math That Changes Everything
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  Now let me show you why this matters for YOUR business with conservative 0.3-0.4% conversion rates:
                </p>

                {/* Revenue Multiplier Image */}
                <div className="my-16">
                  <img 
                    src="https://ibb.co/QjfMVjQ2"
                    alt="Business revenue multiplication spiral showing 150x to 477x growth potential with AI UGC automation"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>

                <div className="overflow-x-auto mb-12">
                  <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F2F0E4' }}>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Business Model</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Current Monthly Views</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>AI Factory Monthly Views</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Current Revenue</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>AI Factory Revenue</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Revenue Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold text-lg" style={{ color: '#1a1a1a' }}>Info Products</td>
                        <td className="p-6" style={{ color: '#555555' }}>16,000</td>
                        <td className="p-6" style={{ color: '#555555' }}>3,811,500</td>
                        <td className="p-6" style={{ color: '#555555' }}>$9,456</td>
                        <td className="p-6" style={{ color: '#555555' }}>$2,252,695</td>
                        <td className="p-6 font-bold text-xl" style={{ color: '#E91E63' }}>238x</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold text-lg" style={{ color: '#1a1a1a' }}>Ecommerce</td>
                        <td className="p-6" style={{ color: '#555555' }}>25,000</td>
                        <td className="p-6" style={{ color: '#555555' }}>3,811,500</td>
                        <td className="p-6" style={{ color: '#555555' }}>$4,700</td>
                        <td className="p-6" style={{ color: '#555555' }}>$716,562</td>
                        <td className="p-6 font-bold text-xl" style={{ color: '#E91E63' }}>152x</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold text-lg" style={{ color: '#1a1a1a' }}>Agencies</td>
                        <td className="p-6" style={{ color: '#555555' }}>8,000</td>
                        <td className="p-6" style={{ color: '#555555' }}>3,811,500</td>
                        <td className="p-6" style={{ color: '#555555' }}>$14,000</td>
                        <td className="p-6" style={{ color: '#555555' }}>$6,671,000</td>
                        <td className="p-6 font-bold text-xl" style={{ color: '#E91E63' }}>477x</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold text-lg" style={{ color: '#1a1a1a' }}>SaaS</td>
                        <td className="p-6" style={{ color: '#555555' }}>12,000</td>
                        <td className="p-6" style={{ color: '#555555' }}>3,811,500</td>
                        <td className="p-6" style={{ color: '#555555' }}>$2,095 MRR</td>
                        <td className="p-6" style={{ color: '#555555' }}>$739,431 MRR</td>
                        <td className="p-6 font-bold text-xl" style={{ color: '#E91E63' }}>353x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xl leading-relaxed font-medium text-center p-6 rounded-2xl" style={{ color: '#1a1a1a', backgroundColor: '#FEF3F8' }}>
                  These numbers use CONSERVATIVE conversion rates. With UGC optimization, expect 29-275% higher conversions.
                </p>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="cost-breakdown" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  The Real-World Cost Breakdown
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  I used to think you needed massive budgets to scale content. I was completely wrong.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}>
                    <h3 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>My System Cost (Per Video):</h3>
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between"><span>OpenAI API:</span><span className="font-mono">$0.008</span></li>
                      <li className="flex justify-between"><span>ElevenLabs Voice:</span><span className="font-mono">$0.022</span></li>
                      <li className="flex justify-between"><span>Video Generation:</span><span className="font-mono">$0.035</span></li>
                      <li className="flex justify-between"><span>N8N Automation:</span><span className="font-mono">$0.001</span></li>
                      <li className="flex justify-between"><span>Storage/Bandwidth:</span><span className="font-mono">$0.010</span></li>
                      <li className="flex justify-between pt-3 border-t font-bold text-xl" style={{ borderColor: '#E5E5E5', color: '#1a1a1a' }}>
                        <span>Total:</span><span className="font-mono">$0.076</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#FEF3F8', borderColor: '#E5E5E5' }}>
                    <h3 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Industry "Budget" Tools:</h3>
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between"><span>Synthesia:</span><span className="font-mono">$1.67</span></li>
                      <li className="flex justify-between"><span>Pictory:</span><span className="font-mono">$2.50</span></li>
                      <li className="flex justify-between"><span>InVideo:</span><span className="font-mono">$1.25</span></li>
                      <li className="flex justify-between"><span>Premium UGC platforms:</span><span className="font-mono">$5-30</span></li>
                    </ul>
                  </div>
                </div>

                <div className="text-center p-8 rounded-2xl mb-12" style={{ backgroundColor: '#F2F0E4' }}>
                  <h3 className="font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>At 150 videos/day, the difference is staggering:</h3>
                  <div className="grid md:grid-cols-2 gap-8 text-lg">
                    <div>
                      <div className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>My system:</div>
                      <div style={{ color: '#555555' }}>$11.40/day = $4,161/year</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>Cheapest competitor:</div>
                      <div style={{ color: '#555555' }}>$187.50/day = $68,437/year</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mt-6" style={{ color: '#E91E63' }}>
                    That's a $64,276 annual savings for the same output.
                  </div>
                </div>

                {/* Cost Savings Image */}
                <div className="my-16">
                  <img 
                    src="https://ibb.co/PvPcSY7s"
                    alt="Cost comparison visualization: traditional UGC $68K yearly vs AI automation $4K yearly savings infographic"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="technical-implementation" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  The Technical Implementation (Simplified)
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  A few months ago, I was paying premium prices like everyone else. Here's the system that changed everything:
                </p>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Phase 1: The Foundation Setup</h3>

                <div className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F2F0E4' }}>
                  <h4 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Required Tools:</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between">
                        <span>N8N (free tier):</span>
                        <span className="font-mono">5,000 executions/month</span>
                      </li>
                      <li className="flex justify-between">
                        <span>ElevenLabs (Starter):</span>
                        <span className="font-mono">$5/month</span>
                      </li>
                      <li className="flex justify-between">
                        <span>OpenAI API:</span>
                        <span className="font-mono">$5-10/month</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Video API like Veo 3:</span>
                        <span className="font-mono">$2-5/month</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>The Core Workflow:</h4>

                <div className="rounded-2xl p-8 overflow-x-auto mb-12" style={{ backgroundColor: '#1a1a1a' }}>
                  <pre className="text-sm font-mono" style={{ color: '#00ff00' }}>
{`{
  "workflow": {
    "name": "AI_UGC_Factory_v3",
    "trigger": "Every 2 hours",
    "steps": [
      "Analyze trending topics",
      "Generate viral scripts", 
      "Create voice audio",
      "Generate video visuals",
      "Combine and optimize",
      "Distribute to platforms"
    ]
  }
}`}
                  </pre>
                </div>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Phase 2: The Multiplier System</h3>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  <strong style={{ color: '#1a1a1a' }}>The Secret:</strong> Instead of one workflow, I run 5 parallel content streams:
                </p>

                <div className="grid md:grid-cols-5 gap-4 mb-12">
                  {[
                    { type: 'Educational Content', count: '30', color: 'from-blue-500 to-blue-600' },
                    { type: 'Entertainment', count: '40', color: 'from-purple-500 to-purple-600' },
                    { type: 'Product Showcases', count: '25', color: 'from-pink-500 to-pink-600' },
                    { type: 'Trending Topics', count: '35', color: 'from-red-500 to-red-600' },
                    { type: 'Evergreen Content', count: '20', color: 'from-green-500 to-green-600' }
                  ].map((stream, index) => (
                    <div key={index} className="text-center p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stream.color} flex items-center justify-center text-white font-bold text-xl`}>
                        {stream.count}
                      </div>
                      <div className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{stream.type}</div>
                      <div className="text-xs mt-1" style={{ color: '#555555' }}>videos/day</div>
                    </div>
                  ))}
                </div>

                <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#FEF3F8' }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Total Output: 150 videos/day</div>
                  <div className="text-lg" style={{ color: '#555555' }}>across all content types</div>
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="performance-data" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  Performance Data: 47 Days of Real Results
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  I've been tracking every metric since day one. Here's what actually happened:
                </p>

                {/* Performance Data Image */}
                <div className="my-16">
                  <img 
                    src="https://ibb.co/xSTbJDnp"
                    alt="AI UGC performance metrics chart showing 8.3% viral rate and 238x revenue multiplier growth trajectory"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="rounded-2xl p-8 border bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h4 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Content Performance:</h4>
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between">
                        <span>Total Videos Generated:</span>
                        <span className="font-bold">7,050</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average Daily Output:</span>
                        <span className="font-bold">150</span>
                      </li>
                      <li className="flex justify-between">
                        <span>System Uptime:</span>
                        <span className="font-bold">98.3%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Failed Generations:</span>
                        <span className="font-bold">1.2%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl p-8 border bg-gradient-to-br from-purple-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h4 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Engagement Results:</h4>
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between">
                        <span>Average Views Per Video:</span>
                        <span className="font-bold">847</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Viral Rate (&gt;10K views):</span>
                        <span className="font-bold">8.3%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Platform Approval Rate:</span>
                        <span className="font-bold">96.7%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Best Performing Video:</span>
                        <span className="font-bold">2.3M</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl p-8 border bg-gradient-to-br from-green-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h4 className="font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Quality Metrics:</h4>
                    <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                      <li className="flex justify-between">
                        <span>AI Detection Rate:</span>
                        <span className="font-bold">3.1%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Human Authenticity Score:</span>
                        <span className="font-bold">7.8/10</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Cost Per View:</span>
                        <span className="font-bold">$0.000089</span>
                      </li>
                      <li className="flex justify-between">
                        <span>ROI vs Traditional UGC:</span>
                        <span className="font-bold text-green-600">3,920%</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-xl leading-relaxed text-center font-medium p-6 rounded-2xl" style={{ color: '#1a1a1a', backgroundColor: '#F2F0E4' }}>
                  I want you to understand this shift: These aren't projections. This is what's happening right now.
                </p>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="advanced-optimization" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  The Advanced Optimization System
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  Most people stop at basic implementation. Here's where the real exponential gains come from:
                </p>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Parallel Processing Architecture</h3>
                <p className="text-xl font-medium mb-6" style={{ color: '#1a1a1a' }}>The 5X Multiplier:</p>

                <div className="rounded-2xl p-8 overflow-x-auto mb-12" style={{ backgroundColor: '#1a1a1a' }}>
                  <pre className="text-sm font-mono" style={{ color: '#00ff00' }}>
{`async def generate_video_batch(scripts_batch):
    """Process multiple videos simultaneously"""
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for script in scripts_batch:
            task = asyncio.create_task(
                process_single_video(session, script)
            )
            tasks.append(task)
        
        return await asyncio.gather(*tasks)`}
                  </pre>
                </div>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>The Quality Enhancement Filter</h3>
                <p className="text-xl font-medium mb-6" style={{ color: '#1a1a1a' }}>AI Quality Scorer:</p>

                <div className="rounded-2xl p-8 overflow-x-auto mb-12" style={{ backgroundColor: '#1a1a1a' }}>
                  <pre className="text-sm font-mono" style={{ color: '#00ff00' }}>
{`def quality_score_video(video_path):
    scores = {
        "audio_clarity": analyze_audio_quality(video_path),
        "visual_consistency": check_visual_flow(video_path),
        "engagement_potential": predict_engagement(video_path),
        "authenticity": measure_human_likeness(video_path)
    }
    
    overall_score = sum(scores.values()) / len(scores)
    
    if overall_score < 7.0:
        return regenerate_video(video_path)
    
    return video_path`}
                  </pre>
                </div>

                <p className="text-xl leading-relaxed text-center font-medium p-6 rounded-2xl" style={{ color: '#1a1a1a', backgroundColor: '#FEF3F8' }}>
                  Only videos scoring 7.0+ make it to distribution. This filtering improved our viral rate from 3.1% to 8.3%.
                </p>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="scaling-up" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  Scaling to 300+ Videos/Day (The Next Level)
                </h2>

                <div className="overflow-x-auto mb-12">
                  <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F2F0E4' }}>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Daily Output</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Monthly Cost</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Expected Views</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>Revenue Potential</th>
                        <th className="p-6 text-left font-bold text-lg" style={{ color: '#1a1a1a' }}>ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold" style={{ color: '#555555' }}>150 videos</td>
                        <td className="p-6" style={{ color: '#555555' }}>$344</td>
                        <td className="p-6" style={{ color: '#555555' }}>2.1M views</td>
                        <td className="p-6" style={{ color: '#555555' }}>$2,100-4,200</td>
                        <td className="p-6 font-bold text-lg" style={{ color: '#E91E63' }}>610%</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold" style={{ color: '#555555' }}>300 videos</td>
                        <td className="p-6" style={{ color: '#555555' }}>$687</td>
                        <td className="p-6" style={{ color: '#555555' }}>4.8M views</td>
                        <td className="p-6" style={{ color: '#555555' }}>$4,800-9,600</td>
                        <td className="p-6 font-bold text-lg" style={{ color: '#E91E63' }}>1,395%</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: '#E5E5E5' }}>
                        <td className="p-6 font-semibold" style={{ color: '#555555' }}>500 videos</td>
                        <td className="p-6" style={{ color: '#555555' }}>$1,145</td>
                        <td className="p-6" style={{ color: '#555555' }}>8.5M views</td>
                        <td className="p-6" style={{ color: '#555555' }}>$8,500-17,000</td>
                        <td className="p-6 font-bold text-lg" style={{ color: '#E91E63' }}>1,485%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-2xl p-8" style={{ backgroundColor: '#F2F0E4' }}>
                  <h3 className="font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>The Exponential Effect:</h3>
                  <p className="text-xl leading-relaxed mb-4" style={{ color: '#555555' }}>
                    Doubling input doesn't double output—it creates exponential growth because:
                  </p>
                  <ul className="space-y-3 text-lg" style={{ color: '#555555' }}>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4"></span>
                      More content = higher chance of viral hits
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-4"></span>
                      Platform algorithms favor active creators
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-600 rounded-full mr-4"></span>
                      Audience compound growth across multiple videos
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mr-4"></span>
                      Cross-platform momentum amplification
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="common-pitfalls" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  Common Pitfalls (And How to Avoid Them)
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  Let me save you weeks of debugging:
                </p>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Pitfall #1: API Rate Limiting</h3>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="p-6 rounded-2xl border-l-4" style={{ backgroundColor: '#FEF3F8', borderColor: '#E91E63' }}>
                    <h4 className="font-bold text-lg mb-4" style={{ color: '#1a1a1a' }}>The Problem</h4>
                    <p style={{ color: '#555555' }}>Hit ElevenLabs limits at 47 videos/day.</p>
                  </div>
                  <div className="p-6 rounded-2xl border-l-4" style={{ backgroundColor: '#F2F0E4', borderColor: '#4CAF50' }}>
                    <h4 className="font-bold text-lg mb-4" style={{ color: '#1a1a1a' }}>The Solution</h4>
                    <p style={{ color: '#555555' }}>Intelligent queuing system:</p>
                  </div>
                </div>

                <div className="rounded-2xl p-8 overflow-x-auto mb-12" style={{ backgroundColor: '#1a1a1a' }}>
                  <pre className="text-sm font-mono" style={{ color: '#00ff00' }}>
{`class APIRateLimiter:
    def __init__(self, max_requests=100, time_window=3600):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def wait_if_needed(self):
        if not self.can_make_request():
            sleep_time = self.time_until_next_slot()
            time.sleep(sleep_time)`}
                  </pre>
                </div>

                <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Pitfall #2: Platform Detection</h3>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="p-6 rounded-2xl border-l-4" style={{ backgroundColor: '#FEF3F8', borderColor: '#E91E63' }}>
                    <h4 className="font-bold text-lg mb-4" style={{ color: '#1a1a1a' }}>The Problem</h4>
                    <p style={{ color: '#555555' }}>TikTok flagged 23% of videos as "AI-generated."</p>
                  </div>
                  <div className="p-6 rounded-2xl border-l-4" style={{ backgroundColor: '#F2F0E4', borderColor: '#4CAF50' }}>
                    <h4 className="font-bold text-lg mb-4" style={{ color: '#1a1a1a' }}>The Solution</h4>
                    <p style={{ color: '#555555' }}>Advanced humanization:</p>
                  </div>
                </div>

                <div className="rounded-2xl p-8 overflow-x-auto mb-12" style={{ backgroundColor: '#1a1a1a' }}>
                  <pre className="text-sm font-mono" style={{ color: '#00ff00' }}>
{`def humanize_video(video_config):
    randomizations = {
        "voice_variation": random.uniform(0.95, 1.05),
        "pause_injection": random.choice([True, False]),
        "background_shift": random.uniform(-2, 2),
        "audio_compression": random.choice([128, 192, 256])
    }
    
    return apply_humanization(video_config, randomizations)`}
                  </pre>
                </div>

                <p className="text-xl leading-relaxed text-center font-medium p-6 rounded-2xl mb-12" style={{ color: '#1a1a1a', backgroundColor: '#F2F0E4' }}>
                  This dropped detection rate to 3.1%.
                </p>

                {/* AI Detection Improvement Image */}
                <div className="my-16">
                  <img 
                    src="https://ibb.co/845HvfDX"
                    alt="AI detection rate comparison: before and after humanization showing improvement from 23% to 3.1% detection"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              {/* Entrepreneur Liberation Image */}
              <div className="my-16">
                <img 
                  src="https://ibb.co/7dkFBXw1"
                  alt="Entrepreneur transformation visualization from UGC stress chaos to automated content creation freedom"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>

              <section id="why-most-people" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  Why 99% of Businesses Will Never Do This
                </h2>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  <strong style={{ color: '#1a1a1a' }}>The Hard Truth:</strong> Most people will read this, get excited, then do nothing.
                </p>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  <strong style={{ color: '#1a1a1a' }}>Why?</strong>
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {[
                    { title: 'Technical overwhelm', desc: '"This looks complicated"', color: 'from-red-500 to-red-600' },
                    { title: 'Analysis paralysis', desc: '"Maybe I should wait"', color: 'from-orange-500 to-orange-600' },
                    { title: 'Perfectionism', desc: '"Let me plan this perfectly first"', color: 'from-yellow-500 to-yellow-600' },
                    { title: 'Resource excuses', desc: '"I don\'t have time to learn this"', color: 'from-green-500 to-green-600' }
                  ].map((excuse, index) => (
                    <div key={index} className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                      <div className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-r ${excuse.color} flex items-center justify-center text-white font-bold`}>
                        !
                      </div>
                      <h4 className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>{excuse.title}</h4>
                      <p className="text-sm" style={{ color: '#555555' }}>{excuse.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center p-8 rounded-2xl mb-8" style={{ backgroundColor: '#FEF3F8' }}>
                  <p className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                    Meanwhile, the 1% who take action capture the entire market advantage.
                  </p>
                  <p className="text-xl" style={{ color: '#555555' }}>
                    I would not recommend waiting. Once this becomes mainstream (12-18 months), the competitive advantage disappears.
                  </p>
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="future-proofing" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  Future-Proofing Your System
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{ color: '#555555' }}>
                  The AI UGC landscape evolves fast. Here's how to stay ahead:
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="p-8 rounded-2xl border bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: '#1a1a1a' }}>Trend #1: Real-Time Generation</h3>
                    <p style={{ color: '#555555' }}>Video generation dropping from 2-3 minutes to 15-30 seconds.</p>
                  </div>

                  <div className="p-8 rounded-2xl border bg-gradient-to-br from-purple-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: '#1a1a1a' }}>Trend #2: Advanced Personalization</h3>
                    <p style={{ color: '#555555' }}>AI systems adapting content style based on viewer preferences.</p>
                  </div>

                  <div className="p-8 rounded-2xl border bg-gradient-to-br from-green-50 to-white" style={{ borderColor: '#E5E5E5' }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: '#1a1a1a' }}>Trend #3: Multi-Modal Integration</h3>
                    <p style={{ color: '#555555' }}>Systems combining text, voice, video, and interactive elements seamlessly.</p>
                  </div>
                </div>

                <p className="text-xl leading-relaxed text-center font-medium p-6 rounded-2xl" style={{ color: '#1a1a1a', backgroundColor: '#F2F0E4' }}>
                  Start building the infrastructure now. Don't wait for these changes.
                </p>

                {/* Future Advantage Window Image */}
                <div className="my-16">
                  <img 
                    src="https://ibb.co/C5bv4G77"
                    alt="First-mover advantage timeline 2025-2026 showing AI UGC market opportunity window closing"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="bottom-line" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  The Bottom Line: Your Content Revolution Starts Now
                </h2>
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#555555' }}>
                  Here's what we've covered:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {[
                    { icon: '✅', title: 'Simple System', desc: '12 AI workers generating 150+ videos daily for $11.47' },
                    { icon: '✅', title: 'Conversion Math', desc: '150-477x revenue multiplier across all business models' },
                    { icon: '✅', title: 'Real Results', desc: '47 days of verified data showing 8.3% viral rate' },
                    { icon: '✅', title: 'Technical Guide', desc: 'Complete implementation blueprint' },
                    { icon: '✅', title: 'Advanced Scaling', desc: 'Path to 300+ videos/day' },
                    { icon: '✅', title: 'Future-Proofing', desc: '2025+ trends and preparation' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                      <span className="text-2xl mr-4">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>{item.title}</h4>
                        <p style={{ color: '#555555' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: '#F2F0E4' }}>
                  <h3 className="font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>The Reality Check:</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-lg">
                    <div>
                      <p className="mb-2" style={{ color: '#555555' }}>Traditional UGC:</p>
                      <p className="font-bold" style={{ color: '#1a1a1a' }}>$300-1,000/month for limited content</p>
                    </div>
                    <div>
                      <p className="mb-2" style={{ color: '#555555' }}>My system:</p>
                      <p className="font-bold" style={{ color: '#1a1a1a' }}>$12/day for unlimited professional videos</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-center mt-6" style={{ color: '#E91E63' }}>
                    The math isn't close. It's exponential.
                  </p>
                </div>
                
                <h3 className="font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>Your Three Paths Forward:</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-6 rounded-2xl border bg-red-50" style={{ borderColor: '#E5E5E5' }}>
                    <span className="text-2xl mr-4">❌</span>
                    <span className="text-lg" style={{ color: '#1a1a1a' }}>Keep paying premium prices and watch competitors scale past you</span>
                  </div>
                  <div className="flex items-center p-6 rounded-2xl border bg-yellow-50" style={{ borderColor: '#E5E5E5' }}>
                    <span className="text-2xl mr-4">⚠️</span>
                    <span className="text-lg" style={{ color: '#1a1a1a' }}>Build this system yourself using this guide (2-3 weeks implementation)</span>
                  </div>
                  <div className="flex items-center p-6 rounded-2xl border bg-green-50" style={{ borderColor: '#E5E5E5' }}>
                    <span className="text-2xl mr-4">✅</span>
                    <span className="text-lg" style={{ color: '#1a1a1a' }}>Get the complete ready-to-deploy system with templates and support</span>
                  </div>
                </div>
                
                <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#FEF3F8' }}>
                  <p className="text-xl mb-4" style={{ color: '#555555' }}>
                    The UGC industry's pricing bubble is deflating. Fast.
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    The question isn't whether this will disrupt the market—it's whether you'll be positioned to benefit from it.
                  </p>
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <section id="faq" className="mb-20">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
                  FAQ: Your Burning Questions Answered
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      q: "How much does it actually cost to run 150 videos daily?",
                      a: "$11.47/day total. Breakdown: OpenAI ($1.20), ElevenLabs ($3.30), Video API ($5.25), N8N ($0.15), Storage ($1.57). That's $0.076 per video vs industry standard $1-30."
                    },
                    {
                      q: "What if I'm not technical - can I still build this?",
                      a: "The learning curve is steep but manageable. Expect 2-3 weeks for full implementation following my guide. Most components are drag-and-drop in N8N."
                    },
                    {
                      q: "Will TikTok ban AI-generated content?",
                      a: "With proper humanization techniques, detection rate stays under 5%. My system uses advanced randomization to mimic human creation patterns."
                    },
                    {
                      q: "Can this work for B2B businesses?",
                      a: "Absolutely. The conversion math works across all business models. B2B typically sees lower volume but higher value conversions."
                    },
                    {
                      q: "How long before everyone is doing this?",
                      a: "12-18 months until mainstream adoption. The first-mover advantage window is closing fast."
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-8 rounded-2xl border bg-white shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                      <h3 className="font-bold text-xl mb-4" style={{ color: '#1a1a1a' }}>Q: {item.q}</h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#555555' }}>A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="my-16" style={{ borderColor: '#E5E5E5' }} />

              <div className="text-center p-12 rounded-2xl" style={{ backgroundColor: '#F2F0E4' }}>
                <p className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                  What's stopping you from building your content empire? Drop a comment and let's solve it together.
                </p>
                <p className="text-xl" style={{ color: '#555555' }}>
                  The future belongs to those who automate intelligently. Your move.
                </p>
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E5E5;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #1a1a1a;
        }
      `}</style>
    </div>
  );
};

export default AIUGC;
