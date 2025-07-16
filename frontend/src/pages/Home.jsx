import React, { useState, useEffect } from 'react';
import { Search, Play, BookOpen, Brain, FileText, TrendingUp, Moon, Sun, Menu, X, ArrowRight, Check, Zap, Sparkles, Target } from 'lucide-react';

const Home = () => {
  // In your actual project, replace this with localStorage
  const [theme, setTheme] = useState(localStorage.getItem('mode') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState(false);

  // In your actual project, use this instead:
  // const [theme, setTheme] = useState(() => localStorage.getItem('mode') || 'light');
  
  useEffect(() => {
    setTheme(localStorage.getItem('mode') || 'light');
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            if (entry.target.id === 'stats-section') {
              setAnimatedStats(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    const mode = localStorage.getItem('mode') === 'dark' ? 'light' : 'dark';
    setTheme(mode);
    localStorage.setItem('mode', mode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Topic Search",
      description: "Search manually or ask AI to fetch resources intelligently"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "YouTube Transcript Fetcher",
      description: "Extract full transcripts from any YouTube video instantly"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI-Powered Summarizer",
      description: "Get bullet-point summaries powered by Gemini AI"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Chatbot Doubt Solver",
      description: "Ask concept doubts and get real-time AI responses"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Note-Taking",
      description: "Save personal notes organized by topics"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracker",
      description: "Visual overview of your learning completion"
    }
  ];

  const stats = [
    { 
      number: "10K+", 
      label: "Videos Processed", 
      icon: <Play className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      number: "5K+", 
      label: "Active Users", 
      icon: <Target className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      number: "50K+", 
      label: "Quizzes Generated", 
      icon: <Brain className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10"
    },
    { 
      number: "95%", 
      label: "Success Rate", 
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                <Zap className="w-6 h-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StudySync AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => smoothScrollTo('features')}
                className={`hover:text-blue-500 transition-all duration-300 transform hover:scale-105 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Features
              </button>
              <button 
                onClick={() => smoothScrollTo('about')}
                className={`hover:text-blue-500 transition-all duration-300 transform hover:scale-105 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                About
              </button>
              <button 
                onClick={() => smoothScrollTo('contact')}
                className={`hover:text-blue-500 transition-all duration-300 transform hover:scale-105 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-3">
                <button className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Sign In
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Get Started
                </button>
              </div>

              <button
                onClick={toggleMenu}
                className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className={`mt-4 p-4 rounded-lg border transform transition-all duration-300 ease-out ${
              isMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-2 scale-95'
            } ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <nav className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    smoothScrollTo('features');
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 text-left hover:text-blue-500 transition-all duration-300 transform hover:translate-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    smoothScrollTo('about');
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 text-left hover:text-blue-500 transition-all duration-300 transform hover:translate-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  About
                </button>
                <button 
                  onClick={() => {
                    smoothScrollTo('contact');
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 text-left hover:text-blue-500 transition-all duration-300 transform hover:translate-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  Contact
                </button>
                <hr className={`${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                <button className={`py-2 text-left transition-all duration-300 transform hover:translate-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Sign In
                </button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
          isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} id="hero">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Learning with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
              AI-Powered
            </span>{' '}
            Study Tools
          </h1>
          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            StudySync AI turns YouTube videos and study content into personalized learning experiences. 
            Get summaries, quizzes, and track your progress with the power of Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className={`px-8 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} id="stats-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`relative group transform transition-all duration-700 delay-${index * 100} ${
                  animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className={`relative overflow-hidden rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600' 
                    : 'bg-white/50 border-gray-200/50 hover:border-gray-300'
                }`}>
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bgColor} backdrop-blur-sm`}>
                    <div className={`bg-gradient-to-r ${stat.color} text-white rounded-lg p-2`}>
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className={`text-sm md:text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {stat.label}
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Everything you need to transform your study sessions into efficient, AI-powered learning experiences.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border transition-all duration-500 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 delay-${index * 100} ${
                isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-50'}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-16 md:py-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How StudySync AI Works
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload or Search</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Paste a YouTube link or search for topics using our AI-powered search
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our Gemini AI extracts transcripts, creates summaries, and generates quizzes
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Track</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Study with notes, take quizzes, and track your progress over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className={`max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of students who are already learning smarter with StudySync AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Start Free Trial
            </button>
            <button className={`px-8 py-3 rounded-lg border transition-colors ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-white'}`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudySync AI</span>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Transforming education with AI-powered learning tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Twitter
                </a>
                <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  LinkedIn
                </a>
                <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Features
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Pricing
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  API
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Documentation
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Help Center
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  About
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Blog
                </a>
                <a href="#" className={`block ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Careers
                </a>
              </div>
            </div>
          </div>

          <div className={`mt-8 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 StudySync AI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Privacy Policy
                </a>
                <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;