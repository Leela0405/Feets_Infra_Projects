import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Animated from './components/AnimatedParticles'
import Floating from './components/FloatIcon';
import Footer from './components/footer';
import NavigationAuto from './components/Nav';
import Mouse from './components/Mouse';

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

  return (
    <>
      {/* Main container for the homepage, covering the full viewport */}
      <div className="w-full h-screen bg-black text-white overflow-hidden relative">
        {/* Dynamic background with mouse follow effect */}
        {/* This div is fixed and covers the entire screen, appearing behind other content */}
       <Mouse/>

       
          <Animated/>

         <Floating/>

        <NavigationAuto/>

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

     
        <Footer/>
       
      </div>
    </>
  );
};

export default ConstructionHomepage;
