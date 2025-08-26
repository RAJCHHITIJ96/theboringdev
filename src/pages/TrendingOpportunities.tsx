
import React from 'react';

const TrendingOpportunities = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The AI UGC Factory That Generates 150+ Videos Daily for Under $12",
      thumbnail: "https://i.ibb.co/xSCbB1XD/ai-ugc-revolution.png",
      link: "/ai-ugc"
    },
    {
      id: 2,
      title: "10 AI Tools That Will Transform Your Business in 2024",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      id: 3,
      title: "How to Build AI-Powered Customer Support That Actually Works",
      thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F8F6' }}>
      {/* Hero Section */}
      <section className="h-[45vh] max-h-[500px] min-h-[400px] flex items-center px-12 py-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight" style={{ color: '#1a1a1a' }}>
                Trending AI Opportunities
              </h1>
              <p className="text-base leading-relaxed max-w-lg" style={{ color: '#555555' }}>
                Discover the latest AI innovations and opportunities that are transforming businesses worldwide. Stay ahead of the curve with insights into emerging technologies and strategic implementations.
              </p>
            </div>
            
            {/* Hero Image */}
            <div className="h-full">
              <img 
                src="/src/assets/trending-hero.png" 
                alt="Trending AI Opportunities Hero"
                className="w-full h-full object-cover rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="h-[45vh] max-h-[500px] min-h-[400px] px-12 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {blogPosts.map((post) => (
              <article 
                key={post.id}
                className="group cursor-pointer h-full max-h-[320px] transition-all duration-200 hover:-translate-y-1"
              >
                <a 
                  href={post.link}
                  className="block h-full rounded-xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}
                >
                  <div className="h-[180px] overflow-hidden">
                    <img 
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 h-[calc(100%-180px)] flex items-center">
                    <h3 className="text-base font-medium leading-tight line-clamp-3" style={{ color: '#1a1a1a' }}>
                      {post.title}
                    </h3>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendingOpportunities;
