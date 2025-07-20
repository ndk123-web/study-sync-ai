import React, { useState, useEffect } from 'react';
import {
  Search,
  Youtube,
  FileText,
  MessageCircle,
  BookOpen,
  BarChart3,
  Download,
  User,
  Settings,
  Bell,
  Play,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Brain,
  CheckCircle,
  Star,
  Plus,
  ChevronRight,
  Activity,
  Award,
  Calendar,
  Filter,
  Menu,
  X,
  Sparkles,
  Lightbulb,
  Rocket,
  GraduationCap,
  Eye,
  Heart,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const theme = useThemeStore((state) => CryptoJs.AES.decrypt(state.mode, import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJs.enc.Utf8));
  const isDark = theme === 'dark';
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [welcomeAnimation, setWelcomeAnimation] = useState(true);

  // Sample user data
  const user = {
    name: "Alex Johnson",
    email: "alex@studysync.ai",
    avatar: "👨‍🎓",
    streak: 7,
    totalTopics: 24,
    completedQuizzes: 18,
    studyHours: 45.5
  };

  // Sample recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'video',
      title: 'Machine Learning Basics',
      action: 'Watched video',
      time: '2 hours ago',
      progress: 100,
      icon: <Youtube className="w-5 h-5" />
    },
    {
      id: 2,
      type: 'quiz',
      title: 'React Fundamentals',
      action: 'Completed quiz',
      time: '4 hours ago',
      progress: 85,
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 3,
      type: 'notes',
      title: 'JavaScript ES6 Features',
      action: 'Added notes',
      time: '1 day ago',
      progress: 70,
      icon: <BookOpen className="w-5 h-5" />
    }
  ];

  // Sample trending topics
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

  // Notification component
  const NotificationCard = ({ notification, onClose }) => (
    <div 
      className={`notification-card transform transition-all duration-500 ease-out animate-slide-in
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        border rounded-2xl p-4 shadow-lg mb-3 hover:shadow-xl`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 
            notification.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
           notification.type === 'info' ? <Bell className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {notification.message}
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {notification.time}
          </p>
        </div>
        <button 
          onClick={onClose}
          className={`text-gray-400 hover:text-gray-600 transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Floating animation card component (only fade-in, no continuous animation)
  const AnimatedCard = ({ children, className = "", delay = 0 }) => (
    <div 
      className={`animated-card transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl ${className}`}
      style={{ 
        animation: `fadeInUp 0.8s ease-out ${delay}s both`
      }}
    >
      {children}
    </div>
  );

  // Animation and effects
  useEffect(() => {
    // Welcome animation timeout
    const welcomeTimeout = setTimeout(() => {
      setWelcomeAnimation(false);
    }, 2000);

    // Sample notifications (only once)
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

    return () => {
      clearTimeout(welcomeTimeout);
    };
  }, []);

  const statsCards = [
    {
      title: "Topics Studied",
      value: user.totalTopics,
      change: "+3 this week",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: isDark ? "bg-blue-500/10" : "bg-blue-50"
    },
    {
      title: "Quiz Score",
      value: "85%",
      change: "+12% improvement",
      icon: <Target className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: isDark ? "bg-emerald-500/10" : "bg-emerald-50"
    },
    {
      title: "Study Hours",
      value: user.studyHours,
      change: "+8h this week",
      icon: <Clock className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: isDark ? "bg-purple-500/10" : "bg-purple-50"
    },
    {
      title: "Learning Streak",
      value: `${user.streak} days`,
      change: "Keep it up! 🔥",
      icon: <Award className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: isDark ? "bg-amber-500/10" : "bg-amber-50"
    }
  ];

  const quickActions = [
    {
      title: "Search Topics",
      description: "Find videos and resources",
      icon: <Search className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      action: () => setActiveTab('search')
    },
    {
      title: "Take Quiz",
      description: "Test your knowledge",
      icon: <Brain className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      action: () => setActiveTab('quiz')
    },
    {
      title: "My Notes",
      description: "Review your notes",
      icon: <FileText className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      action: () => setActiveTab('notes')
    },
    {
      title: "Ask Doubts",
      description: "Get AI help",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "from-amber-500 to-orange-500",
      action: () => setActiveTab('chatbot')
    }
  ];

  // Notification Toast Component
  const NotificationToast = ({ notification, onClose }) => (
    <div
      className={`fixed top-20 right-4 z-50 max-w-sm p-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } animate-slide-in-right`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
        }`}>
          {notification.type === 'success' ? 
            <CheckCircle className="w-5 h-5 text-white" /> : 
            <Bell className="w-5 h-5 text-white" />
          }
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {notification.message}
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {notification.time}
          </p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Notifications */}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        />
      ))}

      {/* Welcome Animation Overlay */}
      {welcomeAnimation && (
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/90 to-teal-500/90 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <Sparkles className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">Welcome Back!</h1>
            <p className="text-xl animate-fade-in-delay">Ready to continue your learning journey?</p>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 ${
          isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        }`}>
          <div className="p-6">
            {/* User Stats */}
            <div className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome back!
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.streak} day streak 🔥
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: 'overview', icon: <BarChart3 className="w-5 h-5" />, label: 'Overview' },
                { id: 'search', icon: <Search className="w-5 h-5" />, label: 'Search Topics' },
                { id: 'youtube', icon: <Youtube className="w-5 h-5" />, label: 'YouTube Videos' },
                { id: 'notes', icon: <FileText className="w-5 h-5" />, label: 'My Notes' },
                { id: 'chatbot', icon: <MessageCircle className="w-5 h-5" />, label: 'Ask Doubts' },
                { id: 'quiz', icon: <Brain className="w-5 h-5" />, label: 'Quizzes' },
                { id: 'progress', icon: <TrendingUp className="w-5 h-5" />, label: 'Progress' },
                { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                    activeTab === item.id
                      ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105`
                      : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:transform hover:scale-105`
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <AnimatedCard 
                key={index}
                delay={index * 0.1}
                className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } ${stat.bgColor} group relative overflow-hidden`}
              >
                <div className="absolute inset-0 gradient-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} group-hover:scale-110 transition-transform duration-300`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.title}
                  </h3>
                  <p className="text-sm text-emerald-500 font-medium">
                    {stat.change}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} animate-fade-in-up`}>
              ⚡ Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <AnimatedCard
                  key={index}
                  delay={index * 0.15}
                  className={`p-6 rounded-2xl border text-left transition-all duration-500 group relative overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={action.action}
                    className="w-full text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                      </div>
                      <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-emerald-500 transition-colors duration-300`}>
                        {action.title}
                      </h3>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:text-gray-500 transition-colors duration-300`}>
                        {action.description}
                      </p>
                      <ChevronRight className={`w-5 h-5 mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:text-emerald-500 group-hover:translate-x-2 transition-all duration-300`} />
                    </div>
                  </button>
                </AnimatedCard>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activities
                </h3>
                <button className="text-emerald-500 hover:text-emerald-600 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.type === 'video' ? 'bg-red-500' :
                      activity.type === 'quiz' ? 'bg-emerald-500' : 'bg-blue-500'
                    } text-white`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {activity.action} • {activity.time}
                      </p>
                      <div className={`w-full mt-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${activity.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                      {activity.progress}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Trending Topics
              </h3>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isDark ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl">
                        {topic.thumbnail}
                      </div>
                      {topic.isNew && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {topic.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-3 h-3" />
                        <span>{topic.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{topic.rating}</span>
                      </div>
                    </div>
                    <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {topic.duration} • {topic.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;