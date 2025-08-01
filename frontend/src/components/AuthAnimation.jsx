import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  Sparkles,
  Lightbulb,
  Star,
  Rocket,
  GraduationCap,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js';

const AuthAnimation = ({ title, subtitle }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);

  const theme = useThemeStore((state) => CryptoJs.AES.decrypt(state.mode, import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJs.enc.Utf8));

  // Animation cycle for left side
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    
    // Generate floating elements for animation
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: [<Lightbulb key={i} />, <Star key={i} />, <Rocket key={i} />, <GraduationCap key={i} />, <Sparkles key={i} />, <Brain key={i} />, <Target key={i} />, <Zap key={i} />][i],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3000,
      duration: 3000 + Math.random() * 2000,
    }));
    setFloatingElements(elements);
    
    return () => clearInterval(interval);
  }, []);

  const learningSteps = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Discover Content",
      description: "Find YouTube videos and study materials",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Processing",
      description: "Get AI-powered summaries and insights",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Learning",
      description: "Practice with personalized quizzes",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your learning journey",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const isDark = theme === 'dark';

  return (
    <div className="relative order-2 lg:order-1">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-32 right-10 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse delay-700"></div>
        
        {/* Floating Icons */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-emerald-500/30 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}ms`,
              animationDuration: `${element.duration}ms`,
            }}
          >
            <div className="w-6 h-6">{element.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse">
              AI Learning
            </span>{' '}
            Journey
          </h1>
          <p className={`text-xl lg:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            {subtitle}
          </p>
        </div>

        {/* Enhanced Learning Steps - Removed scale animation */}
        <div className="space-y-6">
          {learningSteps.map((step, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl transition-all duration-700 ${
                animationStep === index 
                  ? 'translate-x-4 opacity-100 shadow-2xl' 
                  : 'translate-x-0 opacity-80 hover:opacity-100'
              } ${
                isDark 
                  ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600' 
                  : 'bg-gradient-to-r from-white/90 to-gray-50/90 border border-gray-200'
              } backdrop-blur-lg cursor-pointer`}
            >
              {/* Step Number */}
              <div className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {index + 1}
              </div>
              
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${step.color} text-white shadow-xl transform transition-all duration-300 ${
                  animationStep === index ? 'animate-pulse' : ''
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                {animationStep === index && (
                  <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
                )}
              </div>
              
              {/* Animated Border */}
              {animationStep === index && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Student Success Animation */}
        <div className="mt-12 flex items-center justify-center lg:justify-start space-x-4">
          <div className={`relative group cursor-pointer ${
            animationStep % 2 === 0 ? 'animate-bounce' : ''
          }`}>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-1 shadow-2xl">
              <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                👨‍🎓
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-lg font-semibold">12,000+ Students</p>
            <p className="text-sm">Learning Smarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthAnimation;
