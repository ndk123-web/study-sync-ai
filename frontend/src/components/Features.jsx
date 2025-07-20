import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js';
import { Zap, Brain, BookOpen, BarChart3, Target, Bolt, Globe, Star, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Features = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      emoji: "🤖",
      title: "AI-Powered Learning",
      description: "Advanced AI algorithms that adapt to your learning style and pace for maximum efficiency",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: BookOpen,
      emoji: "📚",
      title: "Smart Notes",
      description: "Automatically organize and categorize your study materials with intelligent tagging",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      emoji: "📊",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and performance insights",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      emoji: "🎯",
      title: "Personalized Quizzes",
      description: "Custom assessments based on your learning progress and knowledge gaps",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Bolt,
      emoji: "⚡",
      title: "Real-time Feedback",
      description: "Instant suggestions and improvements for better learning outcomes",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      emoji: "🌐",
      title: "Cross-Platform Sync",
      description: "Access your study materials anywhere, anytime, on any device seamlessly",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    { icon: Users, number: "50K+", label: "Active Learners" },
    { icon: BookOpen, number: "1M+", label: "Study Sessions" },
    { icon: Award, number: "95%", label: "Success Rate" },
    { icon: TrendingUp, number: "300%", label: "Faster Learning" }
  ];

  return (
    <>
      <Header />
      
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Hero Section */}
        <div className={`relative py-24 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'}`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className={`relative container mx-auto px-4 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-bounce">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Powerful Features
            </h1>
            <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Discover the revolutionary features that make StudySync AI your ultimate learning companion
            </p>
            
            {/* Stats Section */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:scale-105 transition-all duration-300 group`}>
                  <stat.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl md:text-3xl font-bold text-emerald-500 mb-1">{stat.number}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group p-8 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-100'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ 
                  transitionDelay: `${800 + index * 100}ms`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    {feature.emoji}
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 group-hover:text-emerald-500 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed group-hover:text-opacity-80 transition-all duration-300`}>
                  {feature.description}
                </p>
                
                <div className="mt-6 flex items-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Available Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Why Choose StudySync AI?
              </h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                Experience the future of learning with our cutting-edge technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} border ${isDark ? 'border-emerald-800' : 'border-emerald-200'} hover:scale-105 transition-all duration-300 group`}>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Intelligent Learning</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Our AI understands your unique learning patterns and adapts content accordingly
                </p>
              </div>

              <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-50 to-purple-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'} hover:scale-105 transition-all duration-300 group`}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Faster Progress</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Learn 3x faster with our optimized study methods and personalized approach
                </p>
              </div>

              <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-pink-900/30 to-rose-900/30' : 'bg-gradient-to-br from-pink-50 to-rose-50'} border ${isDark ? 'border-pink-800' : 'border-pink-200'} hover:scale-105 transition-all duration-300 group`}>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Proven Results</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join thousands of successful learners who achieved their goals with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Features;
