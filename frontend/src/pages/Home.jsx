import React, { useState, useEffect } from 'react';
import { Search, Play, BookOpen, Brain, FileText, TrendingUp, Moon, Sun, Menu, X, ArrowRight, Check, Zap, Sparkles, Target, Users, Award, Globe } from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js'

const Home = () => {
  // const [theme, setMode] = useState(() => {
  //   if (typeof window !== 'undefined') {
  //     return localStorage.getItem('mode') || 'light';
  //   }
  //   return 'light';
  // });

  // Zustand Config
  const theme = useThemeStore( (state) => CryptoJs.AES.decrypt(state.mode,import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJs.enc.Utf8) ) 
  const setMode = useThemeStore( (state) => state.setMode)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState(false);

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

  // This setMode is function is from zustand  
  const toggleTheme = () => {
    setMode();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Topic Search",
      description: "Search manually or ask AI to fetch resources intelligently with advanced algorithms"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "YouTube Transcript Fetcher",
      description: "Extract full transcripts from any YouTube video instantly with perfect accuracy"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI-Powered Summarizer",
      description: "Get comprehensive bullet-point summaries powered by advanced Gemini AI technology"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Chatbot Doubt Solver",
      description: "Ask concept doubts and get real-time AI responses with detailed explanations"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Note-Taking",
      description: "Save personal notes organized by topics with intelligent categorization"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracker",
      description: "Visual overview of your learning completion with detailed analytics"
    }
  ];

  const stats = [
    { 
      number: "25K+", 
      label: "Videos Processed", 
      icon: <Play className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      shadowColor: "shadow-emerald-500/20"
    },
    { 
      number: "12K+", 
      label: "Active Learners", 
      icon: <Users className="w-6 h-6" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/10",
      shadowColor: "shadow-violet-500/20"
    },
    { 
      number: "80K+", 
      label: "AI Summaries", 
      icon: <Brain className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      shadowColor: "shadow-amber-500/20"
    },
    { 
      number: "98%", 
      label: "Success Rate", 
      icon: <Award className="w-6 h-6" />,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500/10",
      shadowColor: "shadow-rose-500/20"
    }
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'} shadow-lg`}>
                <Zap className="w-7 h-7 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  StudySync AI
                </span>
                <div className="text-xs text-gray-500">Learn Smarter</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => smoothScrollTo('features')}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Features
              </button>
              <button 
                onClick={() => smoothScrollTo('stats-section')}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                About
              </button>
              <button 
                onClick={() => smoothScrollTo('cta-section')}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${isDark ? 'hover:bg-gray-800 bg-gray-800/50' : 'hover:bg-gray-100 bg-gray-100/50'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-3">
                <button className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Sign In
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
                  Get Started
                </button>
              </div>

              <button
                onClick={toggleMenu}
                className={`md:hidden p-3 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] transform transition-all duration-500 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDark ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  StudySync AI
                </span>
              </div>
              <button onClick={toggleMenu} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => {
                  smoothScrollTo('features');
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Features
              </button>
              <button 
                onClick={() => {
                  smoothScrollTo('stats-section');
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                About
              </button>
              <button 
                onClick={() => {
                  smoothScrollTo('cta-section');
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Contact
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Sign In
              </button>
              <button className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
          isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} id="hero">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Learning with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse">
              AI-Powered
            </span>{' '}
            Study Tools
          </h1>
          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            StudySync AI turns YouTube videos and study content into personalized learning experiences. 
            Get summaries, quizzes, and track your progress with the power of Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 font-medium">
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-medium ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-white hover:shadow-lg'}`}>
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`} id="stats-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Join thousands of learners who are already transforming their education with our AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`group transform transition-all duration-700 delay-${index * 150} ${
                  animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${stat.shadowColor} ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-gray-600' 
                    : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 hover:border-gray-300'
                }`}>
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-20 transition-all duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${stat.bgColor} backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}>
                    <div className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-3 shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className={`text-base md:text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {stat.label}
                  </div>
                  
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-all duration-500 -z-10`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`container mx-auto px-4 py-16 md:py-24 ${isDark ? '' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
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
              className={`group p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 delay-${index * 100} ${
                isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${isDark ? 'bg-gray-800 border-gray-700 hover:border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-emerald-100'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${isDark ? 'bg-emerald-900 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className={`container mx-auto px-4 py-16 md:py-24 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl ${isDark ? 'bg-gradient-to-r from-emerald-900 to-teal-900' : 'bg-gradient-to-r from-emerald-50 to-teal-50'} border-2 ${isDark ? 'border-emerald-800' : 'border-emerald-200'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of students who are already learning smarter with StudySync AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-medium">
              Start Free Trial
            </button>
            <button className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 font-medium ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-white hover:shadow-lg'}`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t-2 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-600' : 'bg-emerald-500'}`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">StudySync AI</span>
                  <div className="text-xs text-gray-500">Learn Smarter</div>
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Transforming education with AI-powered learning tools for the modern student.
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