
const TrendingOpportunities = () => {
  const blogPosts = [
    {
      title: "Building Automated Workflows That Actually Work",
      date: "Aug 26, 2025",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop"
    },
    {
      title: "The Future of AI in Content Creation", 
      date: "Aug 25, 2025",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop"
    },
    {
      title: "Why Most AI Tools Fail in Production",
      date: "Aug 24, 2025", 
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop"
    },
    {
      title: "Scaling AI Applications: Lessons Learned",
      date: "Aug 23, 2025",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop"
    },
    {
      title: "The Hidden Costs of AI Implementation", 
      date: "Aug 22, 2025",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop"
    },
    {
      title: "AI Ethics: Beyond the Hype",
      date: "Aug 21, 2025",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="font-semibold text-xl text-gray-900">
              theboringdev
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Intelligence</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Validation</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Trends</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Analysis</a>
            </nav>
            
            {/* CTA Button */}
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Start Reading
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-12 py-20">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            {/* Left Side - Image (60% width) */}
            <div className="lg:col-span-3">
              <div className="relative w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
                <img 
                  src="https://i.ibb.co/jvgYFjjv/20250826-0127-Serene-Minimalist-Landscape-simple-compose-01k3hcx55rfxg8wnnpa6qraftv.png"
                  alt="Trending AI Opportunities" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Right Side - Content (40% width) */}
            <div className="lg:col-span-2">
              <h1 className="font-serif text-4xl lg:text-[42px] font-bold text-[#2d3748] mb-6 leading-[1.2]">
                Introducing Trending AI Opportunities
              </h1>
              <p className="text-[#718096] text-lg leading-[1.6] mb-8">
                Spot opportunities before they become crowded markets. Early movers make the most money.
              </p>
              <button className="border border-[#e2e8f0] text-[#4a5568] px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-12 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article 
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video w-full">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#2d3748] text-lg mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-[#718096] text-sm">
                    {post.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-12 py-12">
          <div className="text-center text-[#718096]">
            <p>© 2025 theboringdev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrendingOpportunities;
