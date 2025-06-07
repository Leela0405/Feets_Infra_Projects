import React, { useState, useEffect } from 'react';

const ContactPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.service) errors.service = 'Please select a service';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        message: '',
        timeline: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Particle = ({ delay, size, x, y }) => (
    <div
      className="absolute rounded-full bg-orange-500 opacity-20 pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
      }}
    />
  );

  const FloatingIcon = ({ icon, delay, x, y }) => (
    <div
      className="absolute text-3xl text-orange-500 opacity-10 pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {icon}
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-black text-white overflow-x-hidden">
      {/* Global Styles */}
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
          overflow-x: hidden;
        }
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `}</style>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Dynamic Mouse Following Background */}
      <div 
        className="fixed inset-0 opacity-20 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.15), transparent 50%)`,
        }}
      />

      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.5}
            size={Math.random() * 15 + 8}
            x={Math.random() * 100}
            y={Math.random() * 100}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon="📧" delay={0} x={5} y={110} />
        <FloatingIcon icon="📞" delay={2} x={85} y={110} />
        <FloatingIcon icon="🏢" delay={4} x={25} y={110} />
        <FloatingIcon icon="💼" delay={6} x={70} y={110} />
        <FloatingIcon icon="🏗️" delay={1} x={45} y={110} />
        <FloatingIcon icon="✉️" delay={3} x={60} y={110} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-3xl font-bold tracking-wider cursor-pointer">
              <span className="text-white">FEET</span>
              <span className="text-orange-500"> INFRA</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Projects', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`relative group transition-colors duration-300 font-medium ${
                    item === 'Contact' ? 'text-orange-500' : 'text-white hover:text-orange-500'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                    item === 'Contact' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              ))}
            </div>
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
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-white">GET IN</span>
              <br />
              <span className="text-orange-500">TOUCH</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Ready to start your next construction project? Let's discuss how we can bring your vision to life with precision and excellence.
            </p>
          </div>
        </div>

        {/* Contact Stats */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mt-16 animate-fadeInUp opacity-0" style={{ animationDelay: '0.6s' }}>
          <div className="text-center group">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-400">+91 98765 43210</p>
            <p className="text-gray-400">+91 87654 32109</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-400">info@feetinfra.com</p>
            <p className="text-gray-400">projects@feetinfra.com</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-400">123 Construction Ave</p>
            <p className="text-gray-400">Hyderabad, Telangana</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Form */}
            <div className="animate-slideInLeft opacity-0" style={{ animationDelay: '0.8s' }}>
              <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  <span className="text-white">Send Us A</span>
                  <span className="text-orange-500"> Message</span>
                </h2>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400 text-center animate-pulse-slow">
                    ✅ Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black bg-opacity-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300`}
                          placeholder="John Doe"
                        />
                        {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black bg-opacity-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300`}
                          placeholder="john@example.com"
                        />
                        {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black bg-opacity-50 border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300`}
                          placeholder="+91 98765 43210"
                        />
                        {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Service Needed *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black bg-opacity-50 border ${formErrors.service ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300`}
                        >
                          <option value="">Select a service</option>
                          <option value="residential">Residential Construction</option>
                          <option value="commercial">Commercial Construction</option>
                          <option value="industrial">Industrial Projects</option>
                          <option value="renovation">Renovation & Remodeling</option>
                          <option value="consultation">Project Consultation</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.service && <p className="text-red-400 text-sm mt-1">{formErrors.service}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Project Budget
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-10">Under ₹10 Lakhs</option>
                          <option value="10-50">₹10 - ₹50 Lakhs</option>
                          <option value="50-100">₹50 Lakhs - ₹1 Crore</option>
                          <option value="1-5">₹1 - ₹5 Crores</option>
                          <option value="above-5">Above ₹5 Crores</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Project Timeline
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300"
                      >
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate (Within 1 month)</option>
                        <option value="short">Short term (1-3 months)</option>
                        <option value="medium">Medium term (3-6 months)</option>
                        <option value="long">Long term (6+ months)</option>
                        <option value="planning">Still planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Project Details *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-4 py-3 bg-black bg-opacity-50 border ${formErrors.message ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-300 resize-none`}
                        placeholder="Tell us about your project requirements, location, specific needs, and any other details that would help us understand your project better..."
                      />
                      {formErrors.message && <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </div>
            </div>

            {/* Right Side - Additional Info */}
            <div className="animate-slideInRight opacity-0" style={{ animationDelay: '1s' }}>
              <div className="space-y-8">
                
                {/* Why Choose Us */}
                <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-6 text-orange-500">Why Choose FEET INFRA?</h3>
                  <div className="space-y-4">
                    {[
                      { icon: '🏗️', title: '15+ Years Experience', desc: 'Proven track record in construction excellence' },
                      { icon: '⭐', title: '200+ Projects Completed', desc: 'Residential, commercial, and industrial projects' },
                      { icon: '🔧', title: 'Expert Team', desc: 'Skilled architects, engineers, and craftsmen' },
                      { icon: '✅', title: '100% Quality Assurance', desc: 'Every project meets the highest standards' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 group hover:bg-gray-800 hover:bg-opacity-50 p-3 rounded-lg transition-all duration-300">
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-6 text-orange-500">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monday - Friday</span>
                      <span className="text-white font-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Saturday</span>
                      <span className="text-white font-semibold">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sunday</span>
                      <span className="text-red-400">Closed</span>
                    </div>
                    <div className="mt-4 p-3 bg-orange-500 bg-opacity-20 rounded-lg border border-orange-500 border-opacity-50">
                      <p className="text-sm text-orange-300">
                        🚨 Emergency services available 24/7 for ongoing projects
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Response */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Quick Response Guarantee</h3>
                  <p className="mb-4">We respond to all inquiries within 2 hours during business hours</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl">⚡</span>
                    <span className="font-bold text-xl">2 Hour Response</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-80 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4">
            <span className="text-white">FEET</span>
            <span className="text-orange-500"> INFRA</span>
          </div>
          <p className="text-gray-400 mb-6">Building tomorrow, today.</p>
          <div className="flex justify-center space-x-6 text-2xl">
            <span className="hover:text-orange-500 cursor-pointer transition-colors duration-300">📱</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors duration-300">📧</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors duration-300">🌐</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors duration-300">📍</span>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2024 FEET INFRA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;