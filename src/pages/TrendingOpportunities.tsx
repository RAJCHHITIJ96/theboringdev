
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
    <div className="h-screen bg-white overflow-hidden">

      {/* Hero Section */}
      <section className="bg-white h-[45vh] max-h-[500px] min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-12 py-10 h-full">
          <div className="grid lg:grid-cols-5 gap-12 items-center h-full">
            {/* Left Side - Image (60% width) */}
            <div className="lg:col-span-3 h-full">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="https://i.ibb.co/jvgYFjjv/20250826-0127-Serene-Minimalist-Landscape-simple-compose-01k3hcx55rfxg8wnnpa6qraftv.png"
                  alt="Trending AI Opportunities" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Right Side - Content (40% width) */}
            <div className="lg:col-span-2 flex flex-col justify-center h-full">
              <h1 className="font-serif text-3xl lg:text-[32px] font-bold text-[#2d3748] mb-4 leading-[1.2]">
                Introducing Trending AI Opportunities
              </h1>
              <p className="text-[#718096] text-base leading-[1.6] mb-6">
                Spot opportunities before they become crowded markets. Early movers make the most money.
              </p>
              <button className="border border-[#e2e8f0] text-[#4a5568] px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium w-fit">
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white h-[45vh] max-h-[500px] min-h-[400px] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-12 py-10 h-full">
          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {blogPosts.slice(0, 3).map((post, index) => (
              <article 
                key={index}
                className="bg-white rounded-xl border border-[#f0f0f0] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer h-full max-h-[320px]"
              >
                <div className="w-full h-[180px]">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 h-[calc(100%-180px)] flex flex-col justify-between">
                  <h3 className="text-[16px] font-semibold text-[#2d3748] mb-2 leading-[1.4] line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#718096] text-[14px] font-normal">
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
