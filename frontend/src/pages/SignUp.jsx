import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Github, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  Play, 
  TrendingUp,
  Sparkles,
  Lightbulb,
  Star,
  Rocket,
  GraduationCap
} from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js';
import Header from '../components/Header';

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);

  const theme = useThemeStore( (state) => CryptoJs.AES.decrypt(state.mode,import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJs.enc.Utf8) )
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});

  // Animation cycle for left side
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    
    // Generate floating elements for animation
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: [<Lightbulb />, <Star />, <Rocket />, <GraduationCap />, <Sparkles />, <Brain />, <Target />, <Zap />][i],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3000,
      duration: 3000 + Math.random() * 2000,
    }));
    setFloatingElements(elements);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully!');
    }, 2000);
  };

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
    <>
      <Header />
      <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Side - Enhanced Animation */}
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
                    Start Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse">
                      AI Learning
                    </span>{' '}
                    Journey
                  </h1>
                  <p className={`text-xl lg:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    Join thousands of students transforming their education with StudySync AI's powerful learning tools.
                  </p>
                </div>

                {/* Enhanced Learning Steps */}
                <div className="space-y-6">
                  {learningSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`group relative p-6 rounded-2xl transition-all duration-700 transform hover:scale-105 ${
                        animationStep === index 
                          ? 'scale-105 translate-x-4 opacity-100 shadow-2xl' 
                          : 'scale-100 translate-x-0 opacity-80 hover:opacity-100'
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
                          animationStep === index ? 'animate-pulse scale-110' : 'group-hover:scale-110'
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

            {/* Right Side - Modern Form */}
            <div className="order-1 lg:order-2">
              <div className={`max-w-lg mx-auto p-8 lg:p-12 rounded-3xl shadow-2xl backdrop-blur-lg border ${
                isDark 
                  ? 'bg-gray-800/90 border-gray-700 shadow-black/50' 
                  : 'bg-white/95 border-gray-200 shadow-gray-500/20'
              }`}>
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Create Account
                  </h2>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Start your AI-powered learning journey today
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4 mb-8">
                  <button className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 font-medium ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                  } hover:shadow-xl`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  
                  <button className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 font-medium ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                  } hover:shadow-xl`}>
                    <Github className="w-6 h-6" />
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`px-6 py-2 rounded-full text-sm font-medium ${
                      isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                    }`}>
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-4 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete='new-name'
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.name 
                            ? 'border-red-500 focus:border-red-500' 
                            : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-emerald-500' 
                            : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500'
                        } text-lg`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-4 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete='new-email'
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-emerald-500' 
                            : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500'
                        } text-lg`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-4 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete='new-password'
                        className={`w-full pl-12 pr-14 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-500' 
                            : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-emerald-500' 
                            : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500'
                        } text-lg`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-4 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-4 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete='new-confirm-password'
                        className={`w-full pl-12 pr-14 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.confirmPassword 
                            ? 'border-red-500 focus:border-red-500' 
                            : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-emerald-500' 
                            : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500'
                        } text-lg`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-4 top-4 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 font-medium">{errors.confirmPassword}</p>}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-emerald-500 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2"
                    />
                    <label htmlFor="acceptTerms" className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      I agree to the{' '}
                      <a href="#" className="text-emerald-500 hover:text-emerald-600 underline font-medium">
                        Terms of Service
                      </a>
                      {' '}and{' '}
                      <a href="#" className="text-emerald-500 hover:text-emerald-600 underline font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-red-500 text-sm font-medium">{errors.acceptTerms}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <p className={`text-center mt-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <a href="#" className="text-emerald-500 hover:text-emerald-600 font-semibold underline">
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;