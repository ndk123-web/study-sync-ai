import React, { useState, useEffect } from 'react';
import {
  Search, Youtube, FileText, MessageCircle, BookOpen, BarChart3, Download, User, Settings,
  Bell, Play, Clock, Target, TrendingUp, Zap, Brain, CheckCircle, Star, Plus, ChevronRight,
  Activity, Award, Calendar, Filter, Menu, X, Sparkles, Lightbulb, Rocket, GraduationCap,
  Eye, Heart, Share2, BookmarkPlus, CheckCircle2, Home, LogOut, Moon, Sun, ChevronDown
} from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import { useIsAuth } from '../store/slices/useIsAuth';
import { useUserStore } from '../store/slices/useUserStore';
import CryptoJs from 'crypto-js';

const Dashboard = () => {
  // Zustand store hooks
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode  = useThemeStore((state) => state.setMode);
  const isAuth  = useIsAuth((state) => state.isAuth);
  const user = ''

  const isDark = theme === 'light'

  useEffect( () => {
    console.log("Theme: ",theme)
  } , [theme])

  // Component States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAuth) {
      window.location.href = '/signin';
    }
  }, [isAuth]);

  const handleLogout = () => {
    logout();
    removeAuth();
    setShowUserMenu(false);
    window.location.href = '/signin';
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

  // NotificationCard Component
  const NotificationCard = ({ notification, onClose }) => (
    <div className={`p-3 rounded-lg border mb-2 last:mb-0 transform transition-all duration-300 hover:scale-105 ${
      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-600' : 
            notification.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
             notification.type === 'info' ? <Bell className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {notification.message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  // Desktop Header Component
  const DesktopHeader = () => (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
    } backdrop-blur-md`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${
              isDark ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-emerald-500 to-teal-500"
            } shadow-lg transform hover:scale-105 transition-transform`}>
              <Zap className="w-7 h-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                StudySync AI
              </span>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Dashboard</div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search topics, videos, notes..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                onFocus={() => setActiveTab('search')}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } relative`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Desktop Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } rounded-xl shadow-xl border z-50 animate-slide-in`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No new notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {user?.name || 'User'}
                  </div>
                  <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {user?.isPremium ? "Premium" : "Free Plan"}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } rounded-xl shadow-xl border z-50 animate-slide-in`}>
                  <div className="p-4">
                    {/* User Info */}
                    <div className={`flex items-center space-x-3 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {user?.name || 'User'}
                        </div>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {user?.email || 'user@example.com'}
                        </div>
                        <div className="text-xs text-emerald-500 font-medium">
                          {user?.isPremium ? "Premium Member" : "Free Plan"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-3 space-y-1">
                      <button
                        onClick={() => {setActiveTab('settings'); setShowUserMenu(false);}}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setMode();
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Mobile Header Component
  const MobileHeader = () => (
    <header className={`sticky top-0 z-50 lg:hidden border-b transition-all duration-300 ${
      isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
    } backdrop-blur-md`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-emerald-500 to-teal-500"
            }`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'} hidden sm:block`}>
              StudySync AI
            </span>
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } relative`}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.name?.split(' ')[0] || 'User'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {user?.isPremium ? 'Premium' : 'Free'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

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
      } ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl overflow-y-auto`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-bounce-in">
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

          {/* Welcome Message - Mobile Only */}
          <div className={`p-4 rounded-xl mb-6 animate-fade-in glass-effect ${
            isDark ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
          }`} style={{ animationDelay: '0.1s' }}>
            <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
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
                  {user?.name || 'User'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email || 'user@example.com'}
                </p>
                <span className="text-xs text-emerald-500 font-medium">
                  {user?.isPremium ? "Premium Member" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2 mb-6 flex-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
              { id: 'search', label: 'Search Topics', icon: <Search className="w-5 h-5" />, emoji: '🔍' },
              { id: 'videos', label: 'Videos', icon: <Youtube className="w-5 h-5" />, emoji: '📹' },
              { id: 'quiz', label: 'Quizzes', icon: <Brain className="w-5 h-5" />, emoji: '🧠' },
              { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, emoji: '⚙️' },
            ].map((item, index) => (
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
            ))}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-2 animate-fade-in`} style={{ animationDelay: '0.8s' }}>
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
    </>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className={`hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-r transition-all duration-300`}>
      <div className="flex flex-col flex-1 pt-20 pb-4 overflow-y-auto">
        <div className="px-6 mb-8">
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
              { id: 'search', label: 'Search Topics', icon: <Search className="w-5 h-5" />, emoji: '🔍' },
              { id: 'videos', label: 'Videos', icon: <Youtube className="w-5 h-5" />, emoji: '📹' },
              { id: 'quiz', label: 'Quizzes', icon: <Brain className="w-5 h-5" />, emoji: '🧠' },
              { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
            ].map((item, index) => (
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
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );

  // Animation effects
  useEffect(() => {
    // Sample notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'success',
          title: 'Welcome to StudySync AI! 🎉',
          message: 'Your learning journey starts now!',
          time: 'just now'
        },
        {
          id: 2,
          type: 'info',
          title: 'New quiz available',
          message: 'Test your knowledge on React Hooks',
          time: '5 min ago'
        }
      ]);
    }, 1000);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Mobile Notifications Dropdown */}
      {showNotifications && (
        <div className={`fixed top-16 right-4 w-80 max-w-[90vw] lg:hidden ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl shadow-xl border z-50 animate-slide-in`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No new notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Section - Desktop Only */}
          <div className="hidden lg:block mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} animate-bounce-in`}>
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
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
                  <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
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
      `}</style>
    </div>
  );
};

export default Dashboard;