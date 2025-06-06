import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Calendar, Award, Code, Database, Server, Monitor, Star, Trophy, Users, Heart, Zap, Target, Rocket, ChevronRight } from 'lucide-react';

const InteractiveResume = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [skillsAnimation, setSkillsAnimation] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [matrixRain, setMatrixRain] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const canvasRef = useRef(null);

  const titles = [
    "Full-Stack Developer",
    "Problem Solver", 
    "Competitive Programmer",
    "System Designer",
    "Algorithm Enthusiast"
  ];

  // Initialize particles and matrix rain
  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${Math.random() * 60 + 250}, 70%, 60%)`
    }));
    setParticles(initialParticles);

    const matrixChars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -50,
      speed: Math.random() * 3 + 1,
      char: String.fromCharCode(0x30A0 + Math.random() * 96),
      opacity: Math.random() * 0.8 + 0.2
    }));
    setMatrixRain(matrixChars);

    setSkillsAnimation(true);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    let currentChar = 0;
    const typeInterval = setInterval(() => {
      if (currentChar <= currentTitle.length) {
        setTypingText(currentTitle.slice(0, currentChar));
        currentChar++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentTitleIndex]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Matrix rain animation
  useEffect(() => {
    const animateMatrix = () => {
      setMatrixRain(prev => prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        y: drop.y > window.innerHeight ? -50 : drop.y,
        char: Math.random() > 0.98 ? String.fromCharCode(0x30A0 + Math.random() * 96) : drop.char
      })));
    };

    const interval = setInterval(animateMatrix, 100);
    return () => clearInterval(interval);
  }, []);

  // Fireworks effect
  const triggerFireworks = () => {
    setClickCount(prev => prev + 1);
    if (clickCount > 0 && clickCount % 5 === 0) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);
    }
  };

  const projects = [
    {
      id: 1,
      title: "Online Code Editor",
      tech: ["Node.js", "Express.js", "PostgreSQL", "React.js"],
      date: "January 2025",
      highlights: [
        "20+ cleanly separated modules",
        "PostgreSQL integration for multiple files", 
        "Dashboard for 100s of code snippets",
        "100% RESTful API compliance"
      ],
      color: "from-blue-500 to-purple-600",
      icon: Code,
      stats: { users: "1K+", files: "5K+", uptime: "99.9%" }
    },
    {
      id: 2,
      title: "Task-Master",
      tech: ["Node.js", "Express.js", "PostgreSQL", "EJS"],
      date: "December 2024", 
      highlights: [
        "100+ concurrent users support",
        "bcrypt security (10 rounds)",
        "40% faster data retrieval", 
        "95% security improvement"
      ],
      color: "from-green-500 to-teal-600",
      icon: Target,
      stats: { users: "500+", tasks: "10K+", efficiency: "95%" }
    },
    {
      id: 3,
      title: "Redis Clone",
      tech: ["C++", "Sockets", "TCP", "Multithreading"],
      date: "May 2025",
      highlights: [
        "In-memory key-value store",
        "O(1) time complexity",
        "Custom binary protocol",
        "Object-oriented design"
      ],
      color: "from-red-500 to-pink-600", 
      icon: Rocket,
      stats: { ops: "1M+/s", latency: "<1ms", memory: "10GB" }
    }
  ];

  const skills = {
    "Languages": { skills: ["C++", "JavaScript", "C", "SQL", "Python"], levels: [95, 90, 85, 88, 80] },
    "Frontend": { skills: ["HTML", "CSS", "React.js", "Tailwind", "Bootstrap"], levels: [98, 95, 92, 90, 85] },
    "Backend": { skills: ["Node.js", "Express.js", "Socket.io"], levels: [90, 88, 85] },
    "Databases": { skills: ["PostgreSQL", "MySQL", "MongoDB"], levels: [85, 80, 78] },
    "Tools": { skills: ["VS Code", "Git", "Docker", "UNIX", "LINUX"], levels: [95, 90, 75, 85, 80] }
  };

  const achievements = [
    { icon: Trophy, text: "Top 1% in JEE Mains 2022", color: "text-yellow-500", count: "1%" },
    { icon: Award, text: "Top 3.5% in JEE Advanced 2022", color: "text-blue-500", count: "3.5%" },
    { icon: Star, text: "Gold medals in National Olympiads", color: "text-purple-500", count: "5+" },
    { icon: Code, text: "700+ LeetCode problems solved", color: "text-green-500", count: "700+" },
    { icon: Trophy, text: "Walmart SparkPlug Finalist", color: "text-orange-500", count: "Top 50" },
    { icon: Award, text: "3rd place GeekHaven Hackathon", color: "text-red-500", count: "3rd" }
  ];

  const navigation = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Monitor },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Dynamic Background with Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translate(${(mousePosition.x - window.innerWidth/2) * 0.01}px, ${(mousePosition.y - window.innerHeight/2) * 0.01}px)`
            }}
          />
        ))}
        
        {/* Matrix Rain Effect */}
        {matrixRain.map(drop => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm pointer-events-none"
            style={{
              left: drop.x,
              top: drop.y,
              opacity: drop.opacity,
              transform: `translateY(${drop.y}px)`
            }}
          >
            {drop.char}
          </div>
        ))}

        {/* Fireworks Effect */}
        {showFireworks && (
          <div className="fixed inset-0 pointer-events-none">
            {Array.from({length: 10}).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: Math.random() * window.innerWidth,
                  top: Math.random() * window.innerHeight,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cursor Follower */}
      <div 
        className="fixed w-6 h-6 bg-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transition: 'all 0.1s ease-out'
        }}
      />

      <div class="relative z-10 w-screen h-flexible">
        {/* Interactive Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            {/* Animated Avatar */}
            <div 
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-12"
              onClick={triggerFireworks}
            >
              A
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 hover:from-pink-400 hover:to-yellow-400 transition-all duration-500 cursor-default">
              Anirudh Temmanaboyina
            </h1>
            
            {/* Typewriter Effect */}
            <div className="text-xl md:text-2xl text-gray-300 mb-6 h-8">
              <span className="border-r-2 border-purple-400 animate-pulse">
                {typingText}
              </span>
            </div>
            
            {/* Interactive Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-300">
              {[
                { icon: Mail, text: "ani.temmanaboyina@gmail.com", href: "mailto:ani.temmanaboyina@gmail.com" },
                { icon: Phone, text: "9652939453", href: "tel:9652939453" },
                { icon: Linkedin, text: "LinkedIn", href: "#" },
                { icon: Github, text: "GitHub", href: "#" }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a 
                    key={index}
                    href={contact.href} 
                    className="flex items-center gap-2 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Icon size={20} className="animate-bounce" style={{animationDelay: `${index * 200}ms`}} />
                    <span className="hidden sm:inline">{contact.text}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Interactive Navigation */}
          <nav className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-2 flex flex-wrap gap-2 border border-white/20">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      triggerFireworks();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 transform hover:scale-105 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/20 hover:shadow-lg'
                    }`}
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <Icon size={18} className={activeSection === item.id ? 'animate-spin' : 'hover:animate-pulse'} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </header>

        {/* Main Content with Enhanced Interactivity */}
        <main className="container mx-auto ">
          {/* Projects Section with Advanced Interactions */}
          {activeSection === 'projects' && (
            <div className="animate-fadeIn">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Interactive Projects
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => {
                    const Icon = project.icon;
                    return (
                      <div
                        key={project.id}
                        className={`relative group cursor-pointer transform transition-all duration-700 hover:scale-105 ${
                          hoveredProject === project.id ? 'z-20 scale-110' : ''
                        }`}
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                        onClick={() => triggerFireworks()}
                        style={{animationDelay: `${index * 200}ms`}}
                      >
                        {/* Floating Card Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 rounded-2xl blur-xl transition-all duration-500 ${
                          hoveredProject === project.id ? 'scale-110 opacity-40' : 'scale-100'
                        }`}></div>
                        
                        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 overflow-hidden">
                          {/* Animated Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 transform scale-0 group-hover:scale-100 transition-transform duration-700"></div>
                          </div>
                          
                          <div className="relative z-10">
                            {/* Project Header with Icon */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Icon className="w-8 h-8 text-purple-400 group-hover:animate-spin" />
                                <h3 className="text-xl font-bold text-purple-300 group-hover:text-white transition-colors">
                                  {project.title}
                                </h3>
                              </div>
                              <span className="text-sm text-gray-400 group-hover:text-gray-200">{project.date}</span>
                            </div>
                            
                            {/* Animated Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              {Object.entries(project.stats).map(([key, value], statIndex) => (
                                <div key={key} className="text-center p-2 bg-white/10 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{transitionDelay: `${statIndex * 100}ms`}}>
                                  <div className="text-lg font-bold text-green-400">{value}</div>
                                  <div className="text-xs text-gray-400 capitalize">{key}</div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech.map((tech, techIndex) => (
                                <span 
                                  key={tech} 
                                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30 hover:bg-purple-500/40 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                                  style={{animationDelay: `${techIndex * 50}ms`}}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            {/* Project Highlights */}
                            <ul className="space-y-2">
                              {project.highlights.map((highlight, hlIndex) => (
                                <li 
                                  key={hlIndex} 
                                  className="text-gray-300 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500"
                                  style={{transitionDelay: `${hlIndex * 100 + 200}ms`}}
                                >
                                  <ChevronRight size={16} className="text-purple-400 group-hover:animate-pulse" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Skills Section */}
          {activeSection === 'skills' && (
            <div className="animate-fadeIn">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Technical Arsenal
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(skills).map(([category, data], categoryIndex) => (
                    <div key={category} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-500 group">
                      <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-3 group-hover:text-white transition-colors">
                        {category === 'Languages' && <Code size={24} className="group-hover:animate-bounce" />}
                        {category === 'Frontend' && <Monitor size={24} className="group-hover:animate-bounce" />}
                        {category === 'Backend' && <Server size={24} className="group-hover:animate-bounce" />}
                        {category === 'Databases' && <Database size={24} className="group-hover:animate-bounce" />}
                        {category === 'Tools' && <Zap size={24} className="group-hover:animate-bounce" />}
                        {category}
                      </h3>
                      <div className="space-y-4">
                        {data.skills.map((skill, index) => (
                          <div key={skill} className="relative group/skill">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-300 group-hover/skill:text-white transition-colors cursor-pointer">
                                {skill}
                              </span>
                              <span className="text-purple-400 font-bold opacity-0 group-hover/skill:opacity-100 transition-opacity">
                                {data.levels[index]}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden relative cursor-pointer group-hover/skill:h-4 transition-all duration-300">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{
                                  width: skillsAnimation ? `${data.levels[index]}%` : '0%',
                                  transitionDelay: `${categoryIndex * 200 + index * 100}ms`
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Achievements Section */}
          {activeSection === 'achievements' && (
            <div className="animate-fadeIn">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Hall of Fame
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={index} 
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-500 cursor-pointer group relative overflow-hidden"
                        onClick={triggerFireworks}
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <Icon className={`w-8 h-8 ${achievement.color} group-hover:animate-bounce`} />
                            <span className="text-2xl font-bold text-yellow-400 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                              {achievement.count}
                            </span>
                          </div>
                          <p className="text-gray-300 group-hover:text-white transition-colors">{achievement.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Other sections with basic structure for About and Education */}
          {activeSection === 'about' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                About Me
              </h2>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500">
                <p className="text-lg leading-relaxed text-gray-300 mb-6">
                  I'm a passionate full-stack developer and competitive programmer currently pursuing my Bachelor's in Technology at IIIT Allahabad. 
                  With a strong foundation in algorithms and system design, I love building scalable applications and solving complex problems.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Education Journey
              </h2>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-500">
                  <h3 className="text-2xl font-bold text-purple-300 mb-2">Indian Institute of Information Technology, Allahabad</h3>
                  <p className="text-lg text-gray-300 mb-2">Bachelor of Technology</p>
                  <p className="text-green-400 font-semibold">CGPA: 8.07</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InteractiveResume;