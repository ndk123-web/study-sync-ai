import React, { useState, useEffect } from "react";
import {
  Search,
  Play,
  BookOpen,
  Brain,
  FileText,
  TrendingUp,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Users,
  Award,
  Globe,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Infinity,
  Quote,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  // Zustand Config
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState(false);
  const [currentTyping, setCurrentTyping] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [particles, setParticles] = useState([]);

  const typingTexts = [
    "AI-Powered Study Tools",
    "Smart Learning Platform", 
    "Intelligent Study Assistant"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            if (entry.target.id === "stats-section") {
              setAnimatedStats(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Enhanced typing animation effect with deletion
  useEffect(() => {
    let timer;
    
    const currentText = typingTexts[currentTyping];
    
    if (!isDeleting && displayedText.length < currentText.length) {
      // Typing phase
      setIsTyping(true);
      timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, 150); // Slower typing speed
    } else if (!isDeleting && displayedText.length === currentText.length) {
      // Pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
        setIsTyping(false);
      }, 2000); // Wait 2 seconds
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting phase
      timer = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, 100); // Faster deletion
    } else if (isDeleting && displayedText.length === 0) {
      // Switch to next text
      setIsDeleting(false);
      setCurrentTyping((prev) => (prev + 1) % typingTexts.length);
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, currentTyping, isDeleting]);

  // Particle system
  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
    });

    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, createParticle);
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 15000);
    return () => clearInterval(interval);
  }, []);

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Topic Search",
      description:
        "Advanced AI algorithms intelligently fetch and curate the most relevant educational resources for any topic you're studying",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "YouTube Transcript Fetcher",
      description:
        "Extract complete transcripts from YouTube videos with 99.9% accuracy, making content searchable and accessible",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Summarizer",
      description:
        "Transform hours of content into comprehensive bullet-point summaries using cutting-edge Gemini AI technology",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-500/10 to-indigo-500/10",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Intelligent Chatbot",
      description:
        "Get instant answers to complex questions with context-aware AI that understands your learning materials",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Note-Taking",
      description:
        "Organize your thoughts with AI-enhanced note-taking that automatically categorizes and links related concepts",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Analytics",
      description:
        "Detailed insights into your learning journey with personalized recommendations and performance tracking",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Videos Processed",
      icon: <Play className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      shadowColor: "shadow-emerald-500/20",
      description: "Hours of educational content analyzed",
    },
    {
      number: "25K+",
      label: "Active Learners",
      icon: <Users className="w-6 h-6" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/10",
      shadowColor: "shadow-violet-500/20",
      description: "Students improving their grades",
    },
    {
      number: "150K+",
      label: "AI Summaries",
      icon: <Brain className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      shadowColor: "shadow-amber-500/20",
      description: "Intelligent summaries generated",
    },
    {
      number: "99.8%",
      label: "Success Rate",
      icon: <Award className="w-6 h-6" />,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500/10",
      shadowColor: "shadow-rose-500/20",
      description: "Student satisfaction score",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "StudySync AI has revolutionized how I study. The AI summaries save me hours, and the progress tracking keeps me motivated!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&eyes=happy&mouth=smile",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Medical Student",
      content: "The chatbot feature is incredible. It's like having a personal tutor available 24/7 to answer my questions.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede&eyes=default&mouth=smile",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Engineering Student",
      content: "I've improved my GPA by 0.8 points since using StudySync AI. The personalized study plans are game-changing!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffd93d&eyes=happy&mouth=smile",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload or Search Content",
      description: "Add YouTube videos, PDFs, or search for topics using our AI-powered search engine",
      icon: <Search className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02", 
      title: "AI Analysis",
      description: "Our advanced AI processes your content, extracting key insights and creating comprehensive summaries",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      step: "03",
      title: "Interactive Learning",
      description: "Chat with AI, take notes, track progress, and receive personalized recommendations for optimal learning",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900"
      }`}
    >
      <Header />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Blobs */}
        <div className={`absolute top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-8 animate-blob-morph ${isDark ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-emerald-300 to-teal-300'}`}></div>
        <div className={`absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl opacity-6 animate-blob-morph animation-delay-2000 ${isDark ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-300 to-pink-300'}`}></div>
        <div className={`absolute -bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-5 animate-blob-morph animation-delay-4000 ${isDark ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-blue-300 to-cyan-300'}`}></div>
        
        {/* Floating Particles */}
        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-32 left-12 w-8 h-8 border-2 border-emerald-500/30 rotate-45 animate-floating-shapes"></div>
        <div className="absolute top-64 right-24 w-6 h-6 bg-purple-500/20 rounded-full animate-floating-shapes animation-delay-1000"></div>
        <div className="absolute bottom-48 left-1/4 w-10 h-10 border-2 border-teal-500/30 rotate-12 animate-floating-shapes animation-delay-2000"></div>
        <div className="absolute top-48 right-1/3 w-4 h-4 bg-pink-500/30 rotate-45 animate-floating-shapes animation-delay-3000"></div>
        <div className="absolute top-20 right-12 w-5 h-5 border border-cyan-500/25 rounded-full animate-floating-shapes animation-delay-1500"></div>
        <div className="absolute bottom-32 left-16 w-7 h-7 bg-emerald-500/15 rotate-12 animate-floating-shapes animation-delay-2500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div
          className={`max-w-5xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          id="hero"
        >
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 text-emerald-300' 
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700'
          } backdrop-blur-sm`}>
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI Technology</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Transform Your Learning with{" "}
            <div className="relative inline-block typewriter-container">
              <span className="professional-gradient typewriter-effect">
                {displayedText}
                <span className="typewriter-cursor"></span>
              </span>
            </div>
          </h1>
          
          <div className="professional-highlight mb-12">
            <p
              className={`text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              StudySync AI revolutionizes education by transforming YouTube videos and study materials into 
              <span className="font-semibold text-emerald-500"> personalized learning experiences</span>. 
              Get AI-powered summaries, interactive quizzes, and track your progress with cutting-edge technology.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to={"/dashboard"}>
              <button className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 font-semibold text-lg magnetic-button">
                <span>Start Learning Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button
              className={`group px-10 py-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 font-semibold text-lg hover-lift ${
                isDark
                  ? "border-gray-600 hover:bg-gray-800 hover:border-emerald-500"
                  : "border-gray-300 hover:bg-white hover:shadow-xl hover:border-emerald-300"
              }`}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Infinity className="w-4 h-4 text-emerald-500" />
              <span>Unlimited Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`relative py-24 ${isDark ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur-sm`}
        id="stats-section"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-purple-300' 
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700'
            } backdrop-blur-sm`}>
              <TrendingUp className="w-4 h-4" />
              <span>Trusted Worldwide</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Empowering Students Globally
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of learners who are already transforming their education with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-700 delay-${
                  index * 150
                } ${
                  animatedStats
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 clean-card minimal-shadow`}
                >
                  {/* Animated gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-20 transition-all duration-500`}
                  ></div>

                  {/* Floating icon background */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <div className={`text-6xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Icon container */}
                  <div
                    className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${stat.bgColor} backdrop-blur-sm group-hover:scale-110 transition-all duration-300 z-10`}
                  >
                    <div
                      className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      {stat.icon}
                    </div>
                  </div>

                  {/* Number with counter animation */}
                  <div
                    className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent animate-number-count`}
                  >
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-lg md:text-xl font-semibold mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.description}
                  </div>

                  {/* Hover effect border */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-30 transition-all duration-500 -z-10 blur`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional metrics */}
          <div className="mt-16 text-center">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">15+</div>
                <div className="text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">500+</div>
                <div className="text-sm">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">4.9★</div>
                <div className="text-sm">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`relative container mx-auto px-4 py-24 ${
          isDark ? "" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
        }`}
      >
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible.features
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 text-blue-300' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700'
          } backdrop-blur-sm`}>
            <Sparkles className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Smarter Learning
            </span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Our comprehensive suite of AI-powered tools transforms your study sessions into 
            efficient, personalized learning experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl border transition-all duration-700 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-3 delay-${
                index * 100
              } ${
                isVisible.features
                  ? "translate-y-0 opacity-100 animate-card-entrance"
                  : "translate-y-10 opacity-0"
              } ${
                isDark
                  ? "bg-gray-800/80 border-gray-700/50 hover:border-gray-600"
                  : "bg-white/80 border-gray-200/50 hover:border-gray-300"
              } backdrop-blur-sm hover-lift`}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}
              ></div>

              {/* Floating decoration */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} blur-xl`}></div>
              </div>

              <div className="relative z-10">
                {/* Icon container with enhanced design */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br ${feature.gradient} shadow-lg`}
                >
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-4 group-hover:text-emerald-500 transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={`leading-relaxed mb-6 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className={`flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Animated border effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 transition-all duration-500 -z-10 blur`}
              ></div>
            </div>
          ))}
        </div>

        {/* Feature showcase grid */}
        <div className="mt-20">
          <div className={`text-center mb-12`}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              See It In Action
            </h3>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Real examples of how StudySync AI transforms your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before/After showcase */}
            <div className={`relative p-8 rounded-3xl border ${
              isDark
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/50 border-gray-200/50"
            } backdrop-blur-sm`}>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-red-600">Before StudySync AI</h4>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Hours spent manually taking notes, struggling to understand complex topics, 
                  and difficulty tracking learning progress
                </p>
              </div>
            </div>
            
            <div className={`relative p-8 rounded-3xl border ${
              isDark
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/50 border-gray-200/50"
            } backdrop-blur-sm`}>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-emerald-600">With StudySync AI</h4>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Instant AI summaries, interactive learning, personalized progress tracking, 
                  and 5x faster comprehension
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`relative py-24 ${isDark ? "bg-gray-800/30" : "bg-gray-50/50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 text-green-300' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700'
            } backdrop-blur-sm`}>
              <Target className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How StudySync AI{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Get started in minutes and transform your learning experience with three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className={`relative group text-center transform transition-all duration-700 delay-${index * 200} ${
                  isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                {/* Step connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 z-0"></div>
                )}
                
                <div className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isDark
                    ? "bg-gray-800/80 border-gray-700/50 hover:border-emerald-500/50"
                    : "bg-white/80 border-gray-200/50 hover:border-emerald-300/50"
                } hover-lift`}>
                  {/* Step number */}
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {step.title}
                  </h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`relative py-24 ${isDark ? "" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 text-yellow-300' 
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-700'
            } backdrop-blur-sm`}>
              <Star className="w-4 h-4" />
              <span>Student Success</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Students{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Real stories from students who transformed their learning with StudySync AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:shadow-xl delay-${index * 150} ${
                  isDark
                    ? "bg-gray-800/80 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                } hover-lift`}
              >
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="w-8 h-8 text-emerald-500" />
                </div>

                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className={`text-lg leading-relaxed mb-6 italic ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-20 transition-all duration-500 -z-10 blur"></div>
              </div>
            ))}
          </div>

          {/* Additional testimonial stats */}
          <div className="mt-16 text-center">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-2">4.9/5</div>
                <div>Average Rating</div>
                <div className="text-sm opacity-70">From 10,000+ reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-2">95%</div>
                <div>Recommend to Friends</div>
                <div className="text-sm opacity-70">Student satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-2">3.2x</div>
                <div>Faster Learning</div>
                <div className="text-sm opacity-70">Compared to traditional methods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-section"
        className={`relative py-24 ${
          isDark ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 to-blue-50"
        }`}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl opacity-12 ${isDark ? 'bg-emerald-600' : 'bg-emerald-400'}`}></div>
          <div className={`absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${isDark ? 'bg-teal-600' : 'bg-teal-400'}`}></div>
          <div className={`absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-2xl opacity-8 ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'}`}></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div
            className={`max-w-5xl mx-auto text-center p-12 md:p-20 rounded-4xl backdrop-blur-lg border ${
              isDark
                ? "glass-card-dark border-gray-700/50"
                : "glass-card border-gray-200/50"
            } hover:scale-[1.02] transition-all duration-500`}
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 text-emerald-300' 
                : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700'
            } backdrop-blur-sm`}>
              <Sparkles className="w-4 h-4" />
              <span>Start Your Journey Today</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Learning?
            </h2>
            
            <p
              className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of students who are already learning smarter, faster, and more efficiently with StudySync AI's revolutionary platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/dashboard">
                <button className="group px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-semibold text-lg magnetic-button flex items-center justify-center space-x-3">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                className={`group px-12 py-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 font-semibold text-lg hover-lift flex items-center justify-center space-x-3 ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-800 hover:border-emerald-500 text-gray-300"
                    : "border-gray-300 hover:bg-white hover:shadow-xl hover:border-emerald-300 text-gray-700"
                }`}
              >
                <span>Schedule Demo</span>
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>100% Secure</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bank-level encryption</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>24/7 Support</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Always here to help</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Instant Setup</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ready in 2 minutes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Infinity className="w-5 h-5 text-emerald-500" />
                  <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No Limits</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Unlimited usage</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-emerald-500/30 rounded-full animate-sparkle"></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-teal-500/30 rounded-full animate-sparkle animation-delay-1000"></div>
            <div className="absolute top-1/2 left-8 w-2 h-2 bg-purple-500/30 rounded-full animate-sparkle animation-delay-2000"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
