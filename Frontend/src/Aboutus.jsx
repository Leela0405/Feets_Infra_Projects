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
      className="absolute rounded-full bg-orange-500 opacity-20 animate-pulse"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    />
  );

  const FloatingIcon = ({ icon, delay, x, y }) => (
    <div
      className="absolute text-4xl text-orange-500 opacity-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `iconFloat 8s ease-in-out infinite ${delay}s`,
      }}
    >
      {icon}
    </div>
  );

  const teamMembers = [
    {
      name: "Leela Akshith",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "25+ years in construction management, leading projects worth over $500M."
    },
    {
      name: "Sarah Chen",
      position: "Chief Architect",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Award-winning architect specializing in sustainable commercial designs."
    },
    {
      name: "David Thompson",
      position: "Project Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Expert in large-scale residential and infrastructure projects."
    },
    {
      name: "Elena Martinez",
      position: "Safety Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
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
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Dynamic background with mouse follow effect */}
      <div 
        className="fixed inset-0 opacity-30 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.1), transparent 40%)`,
        }}
      />

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.4}
            size={Math.random() * 25 + 8}
            x={Math.random() * 100}
            y={Math.random() * 100}
          />
        ))}
      </div>

      {/* Floating construction icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon="🏗️" delay={0} x={5} y={15} />
        <FloatingIcon icon="🏢" delay={2} x={90} y={10} />
        <FloatingIcon icon="⚒️" delay={4} x={10} y={80} />
        <FloatingIcon icon="🏭" delay={6} x={85} y={70} />
        <FloatingIcon icon="🔧" delay={1} x={45} y={5} />
        <FloatingIcon icon="⛑️" delay={3} x={95} y={45} />
        <FloatingIcon icon="🏠" delay={5} x={5} y={50} />
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a
             href='/home'
            >
            <div className="text-3xl font-bold tracking-wider cursor-pointer">
              <span className="text-white">FEET INFRA</span>
              <span className="text-orange-500">CRAFT</span>
            </div>
            </a>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Projects', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`relative group transition-colors duration-300 font-medium cursor-pointer ${
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
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white hover:text-orange-500 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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
                  <span className="text-orange-500">FEET INFRA</span>
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

            {/* Stats */}
            <div className="animate-scale-in flex justify-center space-x-8 md:space-x-12" style={{ animationDelay: '1.2s' }}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500">15+</div>
                <div className="text-sm md:text-base text-gray-400">Years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500">200+</div>
                <div className="text-sm md:text-base text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500">$500M+</div>
                <div className="text-sm md:text-base text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="relative w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-white">Our</span>
                <span className="text-orange-500"> Story</span>
              </h2>
              <div className="space-y-6 text-gray-300 text-base lg:text-lg leading-relaxed">
                <p>
                  What started as a small family business in 2010 has grown into one of the region's 
                  most trusted construction companies. Founded by Leela Akshith with just a 
                  pickup truck and a dream, Feet Infra has built over 200 projects.
                </p>
                <p>
                  Our journey began with residential renovations and has evolved to include 
                  commercial complexes, industrial facilities, and landmark architectural projects. 
                  Through every project, we've maintained our core values of quality, integrity, and innovation.
                </p>
                <p>
                  Today, with a team of over 50 skilled professionals, we continue to push 
                  boundaries in construction technology while never forgetting the personal 
                  touch that built our reputation.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop" 
                alt="Company building"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-2xl" />
              
              {/* Floating badge */}
              <div className="absolute -top-8 -right-8 bg-orange-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">2010</div>
                <div className="text-xs opacity-90">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Our</span>
              <span className="text-orange-500"> Values</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision we make and every structure we build.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gray-900/70 rounded-2xl backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Meet Our</span>
              <span className="text-orange-500"> Team</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              The experienced professionals behind every successful project.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group relative bg-gray-900/70 rounded-2xl backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden hover:scale-105 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 text-sm font-semibold mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-white">Ready to Build</span>
            <span className="text-orange-500"> Together?</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let's transform your vision into reality. Contact us today to discuss your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-8 py-4 bg-orange-500 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:bg-orange-600 hover:scale-105">
              <span className="relative z-10">Get In Touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            
            <button className="group relative px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:text-white hover:scale-105">
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold tracking-wider mb-4">
                <span className="text-white">FEET INFRA</span>
                <span className="text-orange-500">CRAFT</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Building exceptional structures with precision, innovation, and unwavering commitment to excellence since 2010.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                  <span className="text-white">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                  <span className="text-white">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                  <span className="text-white">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">Commercial Construction</li>
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">Residential Building</li>
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">Renovations</li>
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">Project Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Construction Ave</li>
                <li>Building City, BC 12345</li>
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">(555) 123-4567</li>
                <li className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">info@feetinfra.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Feet Infra Construction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;