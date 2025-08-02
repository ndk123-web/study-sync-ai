import React, { useState, useEffect } from 'react';
import {
  Search, Youtube, FileText, MessageCircle, BookOpen, BarChart3, Download, User, Settings,
  Play, Clock, Target, TrendingUp, Zap, Brain, CheckCircle, Star, Plus, ChevronRight,
  Activity, Award, Calendar, Filter, Menu, X, Lightbulb, Rocket, GraduationCap,
  Eye, Heart, Share2, BookmarkPlus, Home, Sun, LogOut, Moon
} from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import { useIsAuth } from '../store/slices/useIsAuth';
import { useUserStore } from '../store/slices/useUserStore';
import Header from '../components/Header';
import CryptoJs from 'crypto-js';
import SuccessNotification from '../components/SuccessNotification';

const Dashboard = () => {
  // Zustand store hooks
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const [signInNotification, setSignInNotification] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Welcome notification functionality
  useEffect(() => {
    const welcomeData = localStorage.getItem('welcomeUser');
    if (welcomeData) {
      const { username, type } = JSON.parse(welcomeData);
      
      let message = '';
      if (type === 'signin') {
        message = `Welcome back, ${username}! 🎉`;
      } else if (type === 'signup') {
        message = `Welcome to StudySync AI, ${username}! 🎉✨`;
      }
      
      setWelcomeMessage(message);
      setSignInNotification(true);
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setSignInNotification(false);
      }, 2000);
      
      // Clean up localStorage
      localStorage.removeItem('welcomeUser');
    }
  }, []);

  const setMode  = useThemeStore((state) => state.setMode);
  const isAuth  = useIsAuth((state) => state.isAuth);
  const removeAuth = useIsAuth((state) => state.removeAuth);

  const username = useUserStore((state) => state.username);
  const email = useUserStore((state) => state.email);
  const photoURL = useUserStore((state) => state.photoURL);
  const isPremium = useUserStore((state) => state.isPremium);
  const logoutUser = useUserStore((state) => state.logoutUser);

  // Use the actual user data instead of empty string
  const user = {
    name: username,
    email: email,
    photoURL: photoURL,
    isPremium: isPremium,
    streak: "7",
    totalTopics: "24", 
    completedQuizzes: "18",
    studyHours: "45.5"
  }

  const isDark = theme === 'dark'

  // useEffect( () => {
  //   console.log("Theme: ",theme)
  // } , [theme])

  // Component States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Auth check
  useEffect(() => {
    if (!isAuth) {
      window.location.href = '/signin';
    }
  }, [isAuth]);

  // Expose toggle function globally for Header component
  useEffect(() => {
    window.dashboardSidebar = {
      toggle: () => setIsSidebarOpen(prev => !prev)
    };
    
    return () => {
      delete window.dashboardSidebar;
    };
  }, []);

  const handleLogout = () => {
    removeAuth();
    logoutUser();
    setIsSidebarOpen(false);
  };

  // Sample data
  const statsCards = [
    {
      title: "Study Streak",
      value: user?.streak || "7",
      change: "+3 days",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      title: "Topics Studied",
      value: user?.totalTopics || "24",
      change: "+5 this week",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      title: "Quizzes Completed",
      value: user?.completedQuizzes || "18",
      change: "+12%",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      icon: <Target className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      title: "Study Hours",
      value: `${user?.studyHours || "45.5"}h`,
      change: "+8.2h",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />
    }
  ];

  const quickActions = [
    {
      title: "Start New Topic",
      description: "Begin learning something new",
      color: "from-emerald-500 to-teal-500",
      icon: <Plus className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('search')
    },
    {
      title: "Take Quiz",
      description: "Test your knowledge",
      color: "from-blue-500 to-purple-500",
      icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('quiz')
    },
    {
      title: "Watch Videos",
      description: "Visual learning content",
      color: "from-red-500 to-pink-500",
      icon: <Youtube className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('videos')
    },
    {
      title: "My Notes",
      description: "Review your notes",
      color: "from-orange-500 to-yellow-500",
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('notes')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'video',
      title: 'Machine Learning Basics',
      action: 'Watched video',
      time: '2 hours ago',
      progress: 100,
      icon: <Youtube className="w-4 h-4 md:w-5 md:h-5" />
    },
    {
      id: 2,
      type: 'quiz',
      title: 'React Fundamentals',
      action: 'Completed quiz',
      time: '4 hours ago',
      progress: 85,
      icon: <Target className="w-4 h-4 md:w-5 md:h-5" />
    },
    {
      id: 3,
      type: 'notes',
      title: 'JavaScript ES6 Features',
      action: 'Added notes',
      time: '1 day ago',
      progress: 70,
      icon: <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
    }
  ];

  const trendingTopics = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      views: "2.3k",
      duration: "1h 24m",
      difficulty: "Beginner",
      thumbnail: "🤖",
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      views: "1.8k",
      duration: "2h 15m",
      difficulty: "Advanced",
      thumbnail: "⚛️",
      rating: 4.9,
      isNew: false
    },
    {
      id: 3,
      title: "Python Data Analysis",
      views: "3.1k",
      duration: "1h 45m",
      difficulty: "Intermediate",
      thumbnail: "🐍",
      rating: 4.7,
      isNew: true
    }
  ];

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-all duration-300 ease-in-out lg:hidden ${
        isSidebarOpen ? 'translate-x-0 animate-slide-in' : '-translate-x-full'
      } ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 animate-bounce-in">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-emerald-500 to-teal-500"
              } shadow-lg transform hover:scale-110 transition-transform`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  StudySync AI
                </span>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Dashboard</div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              {/* Welcome Message - Mobile Only */}
              <div className={`p-4 rounded-xl mb-6 animate-fade-in glass-effect ${
                isDark ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
              }`} style={{ animationDelay: '0.1s' }}>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {username || 'User'}! 👋
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ready to continue learning?
                </p>
              </div>

              {/* User Profile in Sidebar */}
              <div className={`p-4 rounded-xl mb-6 animate-fade-in ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center transform hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {username || 'User'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {email || 'user@example.com'}
                    </p>
                    <span className="text-xs text-emerald-500 font-medium">
                      {isPremium ? "Premium Member" : "Free Plan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2 mb-6">
                {[
                  { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
                  { id: 'search', label: 'Search Topics', icon: <Search className="w-5 h-5" />, emoji: '🔍' },
                  { id: 'videos', label: 'Videos', icon: <Youtube className="w-5 h-5" />, emoji: '📹' },
                  { id: 'pdf-learning', label: 'PDF Learning', icon: <FileText className="w-5 h-5" />, emoji: '📄', isLink: true, href: '/pdf-learning' },
                  { id: 'video-learning', label: 'Video Learning', icon: <Youtube className="w-5 h-5" />, emoji: '🎥', isLink: true, href: '/video-learning' },
                  { id: 'quiz', label: 'Quizzes', icon: <Brain className="w-5 h-5" />, emoji: '🧠' },
                  { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, emoji: '⚙️' },
                ].map((item, index) => (
                  item.isLink ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in ${
                        isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <span className="text-lg animate-bounce-in" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </a>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in ${
                        activeTab === item.id
                          ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                          : `${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                      }`}
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <span className="text-lg animate-bounce-in" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <ChevronRight className="w-4 h-4 ml-auto animate-slide-in-right" />
                      )}
                    </button>
                  )
                ))}
              </nav>
            </div>

            {/* Footer Section - Theme Toggle & Logout */}
            <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-2 animate-fade-in`} style={{ animationDelay: '0.8s' }}>
              <button
                onClick={() => {
                  setMode();
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <button
                onClick={() => {handleLogout(); setIsSidebarOpen(false);}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className={`hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:top-[73px] ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-r transition-all duration-300 custom-scrollbar`}>
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        <div className="px-6 flex-1">
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
              { id: 'search', label: 'Search Topics', icon: <Search className="w-5 h-5" />, emoji: '🔍' },
              { id: 'videos', label: 'Courses', icon: <Youtube className="w-5 h-5" />, emoji: '📹' },
              { id: 'pdf-learning', label: 'PDF Learning', icon: <FileText className="w-5 h-5" />, emoji: '📄', isLink: true, href: '/pdf-learning' },
              { id: 'video-learning', label: 'Video Learning', icon: <Youtube className="w-5 h-5" />, emoji: '🎥', isLink: true, href: '/video-learning' },
              { id: 'quiz', label: 'Quizzes', icon: <Brain className="w-5 h-5" />, emoji: '🧠' },
              { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, emoji: '⚙️' },
              { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, emoji: '👤' },
              { id: 'help', label: 'Help & Support', icon: <MessageCircle className="w-5 h-5" />, emoji: '❓' },
            ].map((item, index) => (
              item.isLink ? (
                <a
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeTab === item.id
                      ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                      : `${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              )
            ))}
          </nav>
        </div>

        {/* Bottom Section - User Info */}
        <div className={`px-6 mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt={username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {username || 'User'}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Use the existing Header component */}
      <Header />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Section - Desktop Only */}
          <div className="hidden lg:block mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} animate-bounce-in`}>
                  Welcome back, {username || 'User'}! 👋
                </h1>
                <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div
                key={stat.title}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                  border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer animate-bounce-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${stat.bgColor} w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-3 transform hover:rotate-12 transition-transform`}>
                  <div className={`bg-gradient-to-r ${stat.color} text-white p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className={`text-xs lg:text-sm font-medium transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.title}
                </h3>
                <p className={`text-lg lg:text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {stat.value}
                </p>
                <p className="text-xs text-green-500 font-medium animate-pulse">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className={`text-lg lg:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} mb-4 animate-fade-in`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} 
                    border rounded-xl p-4 lg:p-6 text-left transition-all duration-300 hover:shadow-lg transform hover:scale-105 group animate-fade-in`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className={`bg-gradient-to-r ${action.color} w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <h3 className={`font-semibold text-sm lg:text-base transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`text-xs lg:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities & Trending Topics */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Recent Activities */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 lg:p-6 transition-colors duration-300 animate-fade-in`} style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg lg:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activities
                </h2>
                <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} animate-pulse`} />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className={`flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 transform hover:scale-105 animate-slide-in-right`} style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center transform hover:rotate-12 transition-transform`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm lg:text-base font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                        {activity.title}
                      </p>
                      <p className={`text-xs lg:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.action} • {activity.time}
                      </p>
                    </div>
                    <div className={`text-xs lg:text-sm font-medium ${
                      activity.progress === 100 ? 'text-green-500' : 'text-blue-500'
                    } animate-pulse`}>
                      {activity.progress}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 lg:p-6 transition-colors duration-300 animate-fade-in`} style={{ animationDelay: '1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg lg:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Trending Topics
                </h2>
                <TrendingUp className={`w-5 h-5 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} animate-bounce`} />
              </div>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.id} className={`p-3 lg:p-4 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-105 animate-bounce-in ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`} style={{ animationDelay: `${1.1 + index * 0.1}s` }}>
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl lg:text-3xl transform hover:scale-125 transition-transform animate-bounce" style={{ animationDelay: `${1.2 + index * 0.1}s` }}>{topic.thumbnail}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className={`text-sm lg:text-base font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                            {topic.title}
                          </h3>
                          {topic.isNew && (
                            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            👁️ {topic.views}
                          </span>
                          <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ⏱️ {topic.duration}
                          </span>
                          <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ⭐ {topic.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#10b981' : '#059669'} ${isDark ? '#374151' : '#f3f4f6'};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#374151' : '#f3f4f6'};
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${isDark ? '#374151' : '#f3f4f6'};
        }
      `}</style>
      
      {/* Welcome Notification */}
      <SuccessNotification
        isVisible={signInNotification}
        onClose={() => setSignInNotification(false)}
        message={welcomeMessage}
        isDark={isDark}
      />
    </div>
  );
};

export default Dashboard;