import React, { useState, useEffect } from 'react';

const AboutUsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const Particle = ({ delay, size, x, y }) => (
    <div
      className="absolute rounded-full bg-orange-500 opacity-20"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        div {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );

  const FloatingIcon = ({ icon, delay, x, y }) => (
    <div
      className="absolute text-4xl text-orange-500 opacity-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        div {
          animation: iconFloat 10s ease-in-out infinite;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
      {icon}
    </div>
  );

  const teamMembers = [
    {
        name: "Leela Akshith",
        position: "CEO & Founder",
        image: "/assets/akash.jpeg",
        description: "25+ years in construction management, leading projects worth over $500M."
    },
    {
      name: "Sarah Chen",
      position: "Chief Architect",
      image: "/api/placeholder/300/300",
      description: "Award-winning architect specializing in sustainable commercial designs."
    },
    {
      name: "David Thompson",
      position: "Project Manager",
      image: "/api/placeholder/300/300",
      description: "Expert in large-scale residential and infrastructure projects."
    },
    {
      name: "Elena Martinez",
      position: "Safety Director",
      image: "/api/placeholder/300/300",
      description: "Ensuring the highest safety standards across all construction sites."
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Precision",
      description: "Every detail matters. We ensure accuracy in every aspect of construction."
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through transparency and reliability."
    },
    {
      icon: "🔄",
      title: "Innovation",
      description: "Embracing new technologies and sustainable building practices."
    },
    {
      icon: "⚡",
      title: "Excellence",
      description: "Committed to delivering superior quality in every project."
    }
  ];

  return (
    <div className="w-screen min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Dynamic background with mouse follow effect */}
      <div 
        className="fixed inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.1), transparent 40%)`,
        }}
      />

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.5}
            size={Math.random() * 20 + 10}
            x={Math.random() * 100}
            y={Math.random() * 100}
          />
        ))}
      </div>

      {/* Floating construction icons */}
      <div className="fixed inset-0 overflow-hidden">
        <FloatingIcon icon="🏗️" delay={0} x={10} y={20} />
        <FloatingIcon icon="🏢" delay={2} x={85} y={15} />
        <FloatingIcon icon="⚒️" delay={4} x={15} y={70} />
        <FloatingIcon icon="🏭" delay={6} x={80} y={75} />
        <FloatingIcon icon="🔧" delay={1} x={50} y={10} />
        <FloatingIcon icon="⛑️" delay={3} x={90} y={50} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black bg-opacity-90 backdrop-blur-lg' : 'bg-transparent'
      }`}>
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-3xl font-bold tracking-wider">
              <span className="text-white">FEET</span>
              <span className="text-orange-500">INFRA PROJECTS</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Projects', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`relative group transition-colors duration-300 font-medium ${
                    item === 'About' ? 'text-orange-500' : 'text-white hover:text-orange-500'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                    item === 'About' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Geometric background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(30deg, #ff6b35 12%, transparent 12.5%, transparent 87%, #ff6b35 87.5%, #ff6b35),
                linear-gradient(150deg, #ff6b35 12%, transparent 12.5%, transparent 87%, #ff6b35 87.5%, #ff6b35),
                linear-gradient(30deg, #ff6b35 12%, transparent 12.5%, transparent 87%, #ff6b35 87.5%, #ff6b35),
                linear-gradient(150deg, #ff6b35 12%, transparent 12.5%, transparent 87%, #ff6b35 87.5%, #ff6b35)
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center w-full px-6">
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Animated title */}
            <div className="overflow-hidden">
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-tight">
                <span className="inline-block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <span className="text-white">ABOUT</span>
                </span>
                <br />
                <span className="inline-block animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <span className="text-orange-500">FEET INFRA PROJECTS</span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light tracking-wide max-w-4xl mx-auto">
                Established in 2010, we've been 
                <span className="text-orange-500 font-medium"> transforming visions into reality </span>
                with unwavering commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="relative w-full py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-white">Our</span>
                <span className="text-orange-500"> Story</span>
              </h2>
              <div className="space-y-6 text-gray-300 text-base lg:text-lg leading-relaxed">
                <p>
                  What started as a small family business in 1998 has grown into one of the region's 
                  most trusted construction companies. Founded by Michael Rodriguez with just a 
                  pickup truck and a dream, BuildCraft has built over 500 projects.
                </p>
                <p>
                  Our journey began with residential renovations and has evolved to include 
                  commercial complexes, industrial facilities, and landmark architectural projects. 
                  Through every project, we've maintained our core values of quality, integrity, and innovation.
                </p>
                <p>
                  Today, with a team of over 150 skilled professionals, we continue to push 
                  boundaries in construction technology while never forgetting the personal 
                  touch that built our reputation.
                </p>
              </div>
            </div>
            <div className="relative">
                <img 
                    src="/assets/feetinfra.jpg" 
                    alt="Company building"
                    className="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-lg" />
                </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Our</span>
              <span className="text-orange-500"> Values</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision we make and every structure we build.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative p-6 lg:p-8 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="text-5xl lg:text-6xl mb-4 lg:mb-6 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4 group-hover:text-orange-500 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative w-full py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Meet Our</span>
              <span className="text-orange-500"> Team</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              The experienced professionals behind every successful project.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
  <div 
    key={index}
    className="group relative bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden"
  >
    <div className="relative overflow-hidden rounded-t-xl">
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-48 lg:h-64 object-cover transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
    <div className="p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
        {member.name}
      </h3>
      <p className="text-orange-500 text-sm font-semibold mb-3">
        {member.position}
      </p>
      <p className="text-gray-300 text-sm leading-relaxed">
        {member.description}
      </p>
    </div>
  </div>
))}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-white">Ready to Build</span>
            <span className="text-orange-500"> Together?</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let's transform your vision into reality. Contact us today to discuss your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-8 py-4 bg-orange-500 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/25">
              <span className="relative z-10">Get In Touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>
            
            <button className="group relative px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:bg-white hover:text-black">
              <span className="relative z-10 flex items-center gap-2 justify-center">
                View Projects
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #000;
        }

        ::-webkit-scrollbar-thumb {
          background: #ff6b35;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #ff8c42;
        }

        /* Ensure full width */
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;