import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

const ConstructionHomepage = () => {
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

  // Component for animated background particles
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
      {/* Inline style for particle float animation */}
      <style jsx>{`
        div {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );

  // Component for floating construction-themed icons
  const FloatingIcon = ({ icon, delay, x, y }) => (
    <div
      className="absolute text-4xl text-orange-500 opacity-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Inline style for icon float animation - removed scale effect */}
      <style jsx>{`
        div {
          animation: iconFloat 100s ease-in-out infinite;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); } /* Removed scale(1) */
          50% { transform: translateY(-50px); } /* Removed scale(1.2) */
        }
      `}</style>
      {icon}
    </div>
  );

  return (
    <>
      {/* Global styles to reset default browser margins/padding and ensure full page height */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden; /* Prevent horizontal scrolling */
        }
        
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }
      `}</style>

      {/* Main container for the homepage, covering the full viewport */}
      <div className="w-full h-screen bg-black text-white overflow-hidden relative">
        {/* Dynamic background with mouse follow effect */}
        {/* This div is fixed and covers the entire screen, appearing behind other content */}
        <div 
          className="fixed inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.1), transparent 40%)`,
          }}
        />

        {/* Animated particles layer, fixed and behind main content */}
        <div className="fixed inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <Particle
              key={i}
              delay={i * 0.5}
              size={Math.random() * 20 + 10}
              x={Math.random() * 100}
              y={Math.random() * 100}
            />
          ))}
        </div>

        {/* Floating construction icons layer, fixed and behind main content */}
        <div className="fixed inset-0 overflow-hidden">
          <FloatingIcon icon="🏗️" delay={0} x={10} y={20} />
          <FloatingIcon icon="🏢" delay={2} x={85} y={15} />
          <FloatingIcon icon="⚒️" delay={4} x={15} y={70} />
          <FloatingIcon icon="🏭" delay={6} x={80} y={75} />
          <FloatingIcon icon="🔧" delay={1} x={50} y={10} />
          <FloatingIcon icon="⛑️" delay={3} x={90} y={50} />
        </div>

        {/* Navigation Bar */}
        {/* This nav element is fixed at the top, spans full width, and has a high z-index */}
        <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-95 backdrop-blur-lg border-b border-gray-800/50">
          <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              {/* Logo/Brand Name */}
              <div className="text-3xl font-bold tracking-wider cursor-pointer">
                <span className="text-white">FEET INFRA</span>
                <span className="text-orange-500">Project</span>
              </div>
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-8">
                {['Home', 'About', 'Projects', 'Contact'].map((item, index) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className={`relative group transition-colors duration-300 font-medium cursor-pointer ${
                      item === 'Home' ? 'text-white-500' : 'text-white hover:text-orange-500'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item}
                    {/* Underline effect on hover */}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                      item === 'Home' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </a>
                ))}
              </div>
              
              {/* Mobile menu button (hamburger icon) */}
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

        {/* Hero Section - Full screen content */}
        <section className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Geometric pattern background for the hero section */}
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

          {/* Main content of the hero section */}
          <div className="relative z-10 text-center w-full px-6">
            <div className="space-y-8">
              {/* Animated title */}
              <div className="overflow-hidden">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="inline-block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <span className="text-white">BUILDING</span>
                  </span>
                  <br />
                  <span className="inline-block animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <span className="text-orange-500">TOMORROW</span>
                  </span>
                </h1>
              </div>

              {/* Subtitle with fade-in effect */}
              <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-3xl mx-auto">
                  Crafting extraordinary structures with precision, passion, and innovation. 
                  <span className="text-orange-500 font-medium"> Where vision meets reality.</span>
                </p>
              </div>

              {/* Stats counter section - removed group-hover:scale-110 */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '1.2s' }}>
                {[
                  { number: '20+', label: 'Projects Completed' },
                  { number: '5+', label: 'Years Experience' },
                  { number: '100%', label: 'Client Satisfaction' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Call-to-action (CTA) Buttons - removed hover:scale-105 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1.6s' }}>
                <a
                href='/contact'
                className="group relative px-6 py-3 bg-orange-500 text-white rounded-full font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/25">
                  <span className="relative z-10">Get Free Quote</span>
                  {/* Hover effect for button */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </a>
                
                <a 
                  href="/projects" 
                  className="group relative px-6 py-3 border-2 border-white text-white rounded-full font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:bg-white hover:text-black flex items-center gap-2 justify-center"
                >
                  <span className="relative z-10">
                    View Projects
                  </span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator animation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Custom CSS animations and scrollbar styling */}
        <style jsx>{`
          /* Keyframe animation for sliding up elements */
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

          /* Keyframe animation for fading in elements */
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

          /* Apply slide-up animation */
          .animate-slide-up {
            animation: slide-up 1s cubic-bezier(0.4, 0, 0.2, 1) both;
          }

          /* Apply fade-in animation */
          .animate-fade-in {
            animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) both;
          }

          /* Custom scrollbar styling for a consistent look */
          ::-webkit-scrollbar {
            width: 8px; /* Width of the scrollbar */
          }

          ::-webkit-scrollbar-track {
            background: #000; /* Background of the scrollbar track */
          }

          ::-webkit-scrollbar-thumb {
            background: #ff6b35; /* Color of the scrollbar thumb */
            border-radius: 4px; /* Rounded corners for the thumb */
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #ff8c42; /* Color of the scrollbar thumb on hover */
          }
        `}</style>
      </div>
    </>
  );
};

export default ConstructionHomepage;
