import React, { useState, useEffect } from 'react';
import {
  Search, Youtube, FileText, MessageCircle, BookOpen, BarChart3, Download, User, Settings,
  Play, Clock, Target, TrendingUp, Zap, Brain, CheckCircle, Star, Plus, ChevronRight,
  Activity, Award, Calendar, Filter, Menu, X, Lightbulb, Rocket, GraduationCap,
  Eye, Heart, Share2, BookmarkPlus, Home, Sun, LogOut, Moon, Trophy, Timer,
  Flame, BookOpenCheck, PlayCircle, Users, PieChart, LineChart, ArrowUp, ArrowDown
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

  // Sample data with analytics
  const statsCards = [
    {
      title: "Study Streak",
      value: user?.streak || "7",
      change: "+3 days",
      changePercent: "+18%",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      icon: <Flame className="w-5 h-5 md:w-6 md:h-6" />,
      trend: "up"
    },
    {
      title: "Topics Studied",
      value: user?.totalTopics || "24",
      change: "+5 this week",
      changePercent: "+26%",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: <BookOpenCheck className="w-5 h-5 md:w-6 md:h-6" />,
      trend: "up"
    },
    {
      title: "Quizzes Completed",
      value: user?.completedQuizzes || "18",
      change: "+12%",
      changePercent: "+12%",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      icon: <Trophy className="w-5 h-5 md:w-6 md:h-6" />,
      trend: "up"
    },
    {
      title: "Study Hours",
      value: `${user?.studyHours || "45.5"}h`,
      change: "+8.2h",
      changePercent: "+22%",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      icon: <Timer className="w-5 h-5 md:w-6 md:h-6" />,
      trend: "up"
    }
  ];

  const analyticsData = {
    weeklyStudyHours: [
      { day: 'Mon', hours: 2.5, completed: 3 },
      { day: 'Tue', hours: 4.2, completed: 5 },
      { day: 'Wed', hours: 3.8, completed: 4 },
      { day: 'Thu', hours: 5.1, completed: 6 },
      { day: 'Fri', hours: 3.3, completed: 4 },
      { day: 'Sat', hours: 6.5, completed: 8 },
      { day: 'Sun', hours: 4.7, completed: 5 }
    ],
    subjectProgress: [
      { subject: 'React', progress: 85, color: 'from-blue-500 to-purple-500' },
      { subject: 'JavaScript', progress: 92, color: 'from-yellow-500 to-orange-500' },
      { subject: 'Python', progress: 68, color: 'from-green-500 to-teal-500' },
      { subject: 'CSS', progress: 75, color: 'from-pink-500 to-red-500' },
      { subject: 'Node.js', progress: 58, color: 'from-emerald-500 to-cyan-500' }
    ],
    monthlyGoals: {
      current: 78,
      target: 100,
      streak: 7,
      bestStreak: 12
    }
  };

  const quickActions = [
    {
      title: "Start New Topic",
      description: "Begin learning something new",
      color: "from-emerald-500 to-teal-500",
      icon: <Plus className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('search'),
      stats: "24 available"
    },
    {
      title: "Enrolled Courses",
      description: "View your enrolled courses",
      color: "from-blue-500 to-purple-500",
      icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => window.location.href = '/enrolled-courses',
      stats: "5 active"
    },
    {
      title: "Watch Videos",
      description: "Visual learning content",
      color: "from-red-500 to-pink-500",
      icon: <Youtube className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('videos'),
      stats: "12 new videos"
    },
    {
      title: "My Notes",
      description: "Review your notes",
      color: "from-orange-500 to-yellow-500",
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
      action: () => setActiveTab('notes'),
      stats: "18 notes"
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

  // Dummy data for different tabs
  const searchTopics = [
    { id: 1, title: "React Hooks Deep Dive", category: "Frontend", difficulty: "Intermediate", duration: "3h 45m", students: "2.4k", rating: 4.8, thumbnail: "⚛️" },
    { id: 2, title: "Node.js Backend Development", category: "Backend", difficulty: "Advanced", duration: "5h 20m", students: "1.8k", rating: 4.9, thumbnail: "🟢" },
    { id: 3, title: "Python Machine Learning", category: "AI/ML", difficulty: "Beginner", duration: "4h 15m", students: "3.2k", rating: 4.7, thumbnail: "🐍" },
    { id: 4, title: "TypeScript Fundamentals", category: "Programming", difficulty: "Intermediate", duration: "2h 30m", students: "1.5k", rating: 4.6, thumbnail: "📘" },
  ];

  const enrolledCourses = [
    { id: 1, title: "Complete React Course", progress: 75, instructor: "John Doe", duration: "12h", nextLesson: "React Context API", thumbnail: "⚛️", enrolledDate: "2 weeks ago" },
    { id: 2, title: "JavaScript ES6 Masterclass", progress: 45, instructor: "Jane Smith", duration: "8h", nextLesson: "Arrow Functions", thumbnail: "🟨", enrolledDate: "1 month ago" },
    { id: 3, title: "CSS Grid & Flexbox", progress: 90, instructor: "Mike Johnson", duration: "6h", nextLesson: "Grid Areas", thumbnail: "🎨", enrolledDate: "3 weeks ago" },
  ];

  const videoLibrary = [
    { id: 1, title: "React Hooks Tutorial", views: "45k", duration: "25:30", category: "React", thumbnail: "⚛️", uploadDate: "2 days ago" },
    { id: 2, title: "CSS Animation Basics", views: "32k", duration: "18:45", category: "CSS", thumbnail: "🎨", uploadDate: "1 week ago" },
    { id: 3, title: "JavaScript Promises", views: "28k", duration: "22:15", category: "JavaScript", thumbnail: "🟨", uploadDate: "3 days ago" },
    { id: 4, title: "Node.js Express Setup", views: "19k", duration: "35:20", category: "Backend", thumbnail: "🟢", uploadDate: "5 days ago" },
  ];

  const userNotes = [
    { id: 1, title: "React State Management", content: "useState hook is used for managing state in functional components...", date: "2 days ago", tags: ["React", "Hooks"] },
    { id: 2, title: "JavaScript Closures", content: "A closure is a function that has access to variables in its outer scope...", date: "1 week ago", tags: ["JavaScript", "Concepts"] },
    { id: 3, title: "CSS Grid Layout", content: "Grid container and grid items are the fundamental concepts...", date: "3 days ago", tags: ["CSS", "Layout"] },
  ];

  // Analytics Chart Components - Professional Charts
  const StudyHoursChart = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 md:p-6 h-full`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 space-y-2 sm:space-y-0">
          <div>
            <h3 className={`text-base md:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Daily Study Hours
            </h3>
            <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Last 7 days performance
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs md:text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Study Hours</span>
            </div>
          </div>
        </div>
        
        {/* Chart Area - Responsive */}
        <div className="relative h-48 md:h-64 lg:h-72 mb-4 overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2 z-10">
            <span>8h</span>
            <span>6h</span>
            <span>4h</span>
            <span>2h</span>
            <span>0h</span>
          </div>
          
          {/* Chart container - Fixed overflow */}
          <div className="ml-6 md:ml-8 mr-2 md:mr-4 h-full flex items-end justify-between px-1 md:px-2">
            {analyticsData.weeklyStudyHours.map((day, index) => (
              <div key={day.day} className="flex flex-col items-center flex-1 max-w-[calc(100%/7)] group">
                {/* Tooltip - More responsive */}
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 md:mb-2 px-1 md:px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'} whitespace-nowrap z-20 relative`}>
                  {day.hours}h studied
                </div>
                
                {/* Bar - Responsive width with proper constraints */}
                <div className="relative w-full flex justify-center items-end">
                  <div 
                    className="bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-1000 hover:scale-110 cursor-pointer shadow-lg animate-grow-up"
                    style={{ 
                      width: 'min(32px, calc(100% - 4px))',
                      maxWidth: '32px',
                      height: `${Math.max((day.hours / 8) * (isMobile ? 160 : 200), 8)}px`,
                      animationDelay: `${index * 0.15}s`
                    }}
                  />
                </div>
                
                {/* Day label - Responsive text */}
                <span className={`text-xs md:text-sm mt-1 md:mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate w-full text-center`}>
                  {isMobile ? day.day.slice(0, 3) : day.day}
                </span>
              </div>
            ))}
          </div>
          
          {/* Grid lines - Adjusted for proper spacing */}
          <div className="absolute inset-0 ml-6 md:ml-8 mr-2 md:mr-4 pointer-events-none">
            {[0, 1, 2, 3, 4].map((line) => (
              <div 
                key={line}
                className={`absolute w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                style={{ top: `${line * 25}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Chart Summary - Responsive grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className={`text-base md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {analyticsData.weeklyStudyHours.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Week
            </div>
          </div>
          <div className="text-center">
            <div className={`text-base md:text-xl font-bold text-emerald-500`}>
              {(analyticsData.weeklyStudyHours.reduce((acc, day) => acc + day.hours, 0) / 7).toFixed(1)}h
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Daily Avg
            </div>
          </div>
          <div className="text-center">
            <div className={`text-base md:text-xl font-bold text-blue-500`}>
              +15%
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              vs Last Week
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProgressChart = () => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 h-full`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Subject Progress
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Current learning progress
          </p>
        </div>
        <button className={`text-sm px-3 py-1 rounded-lg transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
          View Details
        </button>
      </div>
      
      <div className="space-y-5">
        {analyticsData.subjectProgress.map((subject, index) => (
          <div key={subject.subject} className="group" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${subject.color} shadow-lg`} />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {subject.subject}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {subject.progress}%
                </span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subject.progress >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  subject.progress >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {subject.progress >= 80 ? 'Excellent' : subject.progress >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
            </div>
            
            <div className={`relative h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'} shadow-inner`}>
              <div 
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-1000 ease-out shadow-sm animate-progress-fill group-hover:shadow-lg`}
                style={{ 
                  width: `${subject.progress}%`,
                  animationDelay: `${index * 0.2}s`
                }}
              />
              {/* Progress shine effect */}
              <div 
                className="absolute top-0 h-full w-4 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine"
                style={{ 
                  left: `${Math.max(subject.progress - 10, 0)}%`,
                  animationDelay: `${index * 0.3 + 1}s`
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
            <div className={`text-lg font-bold text-emerald-600 dark:text-emerald-400`}>
              {(analyticsData.subjectProgress.reduce((acc, subj) => acc + subj.progress, 0) / analyticsData.subjectProgress.length).toFixed(1)}%
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Average Progress
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className={`text-lg font-bold text-blue-600 dark:text-blue-400`}>
              {analyticsData.subjectProgress.filter(s => s.progress >= 80).length}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Subjects Mastered
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceChart = () => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 md:p-6 h-full`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 space-y-2 sm:space-y-0">
        <div>
          <h3 className={`text-base md:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Weekly Performance Trends
          </h3>
          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Topics completed and learning velocity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completed Topics</span>
        </div>
      </div>
      
      {/* Line Chart Area - Responsive height */}
      <div className="relative h-64 md:h-80 lg:h-96 mb-4 md:mb-6">
        <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <line 
              key={line}
              x1="50" 
              y1={50 + (line * 40)} 
              x2="450" 
              y2={50 + (line * 40)}
              stroke={isDark ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          ))}
          
          {/* Vertical grid lines */}
          {analyticsData.weeklyStudyHours.map((_, index) => (
            <line 
              key={index}
              x1={80 + (index * 55)} 
              y1="50" 
              x2={80 + (index * 55)} 
              y2="250"
              stroke={isDark ? '#374151' : '#f3f4f6'}
              strokeWidth="0.5"
            />
          ))}
          
          {/* Chart line */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </linearGradient>
            
            {/* Glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Area under curve */}
          <path
            d={`M 50,${230 - (analyticsData.weeklyStudyHours[0].completed * 20)} 
               ${analyticsData.weeklyStudyHours.map((day, index) => 
                 `L ${80 + (index * 55)},${230 - (day.completed * 20)}`
               ).join(' ')} 
               L 410,230 L 50,230 Z`}
            fill="url(#areaGradient)"
            className="animate-draw-area"
          />
          
          {/* Main line */}
          <path
            d={`M 50,${230 - (analyticsData.weeklyStudyHours[0].completed * 20)} 
               ${analyticsData.weeklyStudyHours.map((day, index) => 
                 `L ${80 + (index * 55)},${230 - (day.completed * 20)}`
               ).join(' ')}`}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="animate-draw-line"
          />
          
          {/* Data points */}
          {analyticsData.weeklyStudyHours.map((day, index) => (
            <g key={index}>
              <circle
                cx={80 + (index * 55)}
                cy={230 - (day.completed * 20)}
                r="6"
                fill="#8b5cf6"
                className="animate-scale-in cursor-pointer hover:r-8 transition-all"
                style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              />
              <circle
                cx={80 + (index * 55)}
                cy={230 - (day.completed * 20)}
                r="3"
                fill="white"
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
              />
              
              {/* Hover tooltip */}
              <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <rect
                  x={80 + (index * 55) - 20}
                  y={230 - (day.completed * 20) - 35}
                  width="40"
                  height="25"
                  rx="4"
                  fill={isDark ? '#1f2937' : '#ffffff'}
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  strokeWidth="1"
                />
                <text
                  x={80 + (index * 55)}
                  y={230 - (day.completed * 20) - 18}
                  fontSize="12"
                  fill={isDark ? '#ffffff' : '#1f2937'}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {day.completed}
                </text>
              </g>
            </g>
          ))}
          
          {/* Y-axis labels */}
          {[0, 2, 4, 6, 8, 10].map((value, index) => (
            <text 
              key={value}
              x="40" 
              y={235 - (index * 40)} 
              fontSize="12" 
              fill={isDark ? '#9ca3af' : '#6b7280'}
              textAnchor="end"
            >
              {value}
            </text>
          ))}
          
          {/* X-axis labels */}
          {analyticsData.weeklyStudyHours.map((day, index) => (
            <text 
              key={index}
              x={80 + (index * 55)} 
              y="270" 
              fontSize="12" 
              fill={isDark ? '#9ca3af' : '#6b7280'}
              textAnchor="middle"
              fontWeight="500"
            >
              {day.day}
            </text>
          ))}
          
          {/* Chart title on SVG */}
          <text 
            x="250" 
            y="25" 
            fontSize="14" 
            fill={isDark ? '#d1d5db' : '#374151'}
            textAnchor="middle"
            fontWeight="600"
          >
            Daily Learning Progress
          </text>
        </svg>
      </div>
      
      {/* Performance Stats - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className={`text-lg md:text-xl font-bold text-purple-500`}>
            {analyticsData.weeklyStudyHours.reduce((acc, day) => acc + day.completed, 0)}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Completed
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
          <div className={`text-lg md:text-xl font-bold text-pink-500`}>
            {Math.max(...analyticsData.weeklyStudyHours.map(d => d.completed))}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Best Day
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <div className={`text-lg md:text-xl font-bold text-indigo-500`}>
            {(analyticsData.weeklyStudyHours.reduce((acc, day) => acc + day.completed, 0) / 7).toFixed(1)}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Daily Avg
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
          <div className={`text-lg md:text-xl font-bold text-emerald-500`}>
            +23%
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Improvement
          </div>
        </div>
      </div>
    </div>
  );
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📊 Learning Analytics
                </h2>
                <div className="flex items-center space-x-3">
                  <select className={`px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </select>
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all">
                    Export Report
                  </button>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">127h</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Hours</div>
                </div>
              </div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <StudyHoursChart />
              <ProgressChart />
            </div>
            
            <div className="mb-6">
              <PerformanceChart />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <GoalsWidget />
              
              {/* Learning Patterns */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Learning Patterns
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Best Time</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>2-4 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Avg Session</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>45 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Most Active Day</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Thursday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Focus Score</span>
                    <span className={`text-sm font-medium text-green-500`}>8.5/10</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '🏆', title: 'Week Warrior', desc: '7-day streak' },
                    { icon: '🎯', title: 'Quiz Master', desc: '100% accuracy' },
                    { icon: '⚡', title: 'Speed Learner', desc: 'Completed in 30min' },
                    { icon: '🌟', title: 'First Course', desc: 'React Basics done' }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {achievement.title}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {achievement.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🔍 Search Topics
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search for topics..."
                    className={`pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchTopics.map((topic, index) => (
                <div key={topic.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer animate-fade-in ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-white'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{topic.thumbnail}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{topic.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{topic.category}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>⏱️ {topic.duration}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>👥 {topic.students}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>⭐ {topic.rating}</span>
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105">
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'videos':
        return (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📹 Video Library
              </h2>
              <div className="flex items-center space-x-4">
                <select className={`px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}>
                  <option>All Categories</option>
                  <option>React</option>
                  <option>JavaScript</option>
                  <option>CSS</option>
                  <option>Backend</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoLibrary.map((video, index) => (
                <div key={video.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer animate-fade-in ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-white'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{video.thumbnail}</div>
                    <span className="text-red-500 text-sm font-medium">● LIVE</span>
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{video.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{video.category}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>👁️ {video.views}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>⏱️ {video.duration}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{video.uploadDate}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Watch Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📝 My Notes
              </h2>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNotes.map((note, index) => (
                <div key={note.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer animate-fade-in ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-white'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
                    <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {note.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{note.date}</span>
                    <div className="flex space-x-2">
                      <button className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                  { id: 'all-courses', label: 'All Courses', icon: <BookOpen className="w-5 h-5" />, emoji: '📚', href: '/courses' },
                  { id: 'enrolled-courses', label: 'Enrolled Courses', icon: <Youtube className="w-5 h-5" />, emoji: '📹', href: '/enrolled-courses' },
                  { id: 'pdf-learning', label: 'PDF Learning', icon: <FileText className="w-5 h-5" />, emoji: '📄', isLink: true, href: '/pdf-learning' },
                  { id: 'video-learning', label: 'Video Learning', icon: <Youtube className="w-5 h-5" />, emoji: '🎥', isLink: true, href: '/video-learning' },
                  { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
                ].map((item, index) => (
                  item.isLink || item.href ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in ${
                        isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
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
              { id: 'all-courses', label: 'All Courses', icon: <BookOpen className="w-5 h-5" />, emoji: '📚', href: '/courses' },
              { id: 'enrolled-courses', label: 'Enrolled Courses', icon: <Youtube className="w-5 h-5" />, emoji: '📹', href: '/enrolled-courses' },
              { id: 'pdf-learning', label: 'PDF Learning', icon: <FileText className="w-5 h-5" />, emoji: '📄', isLink: true, href: '/pdf-learning' },
              { id: 'video-learning', label: 'Video Learning', icon: <Youtube className="w-5 h-5" />, emoji: '🎥', isLink: true, href: '/video-learning' },
              { id: 'notes', label: 'My Notes', icon: <FileText className="w-5 h-5" />, emoji: '📝' },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, emoji: '📊' },
              { id: 'help', label: 'Help & Support', icon: <MessageCircle className="w-5 h-5" />, emoji: '❓' },
            ].map((item, index) => (
              item.isLink || item.href ? (
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

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div
                key={stat.title}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                  border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer animate-bounce-in relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-6 -translate-y-6`}></div>
                
                <div className={`${stat.bgColor} w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-3 transform hover:rotate-12 transition-transform relative z-10`}>
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-500 font-medium animate-pulse">
                    {stat.change}
                  </p>
                  <div className="flex items-center space-x-1">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.changePercent}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg lg:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} animate-fade-in`}>
                Quick Actions
              </h2>
              <button className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                Customize
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} 
                    border rounded-xl p-4 lg:p-6 text-left transition-all duration-300 hover:shadow-lg transform hover:scale-105 group animate-fade-in relative overflow-hidden`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {/* Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`bg-gradient-to-r ${action.color} w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <h3 className={`font-semibold text-sm lg:text-base transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`text-xs lg:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {action.description}
                  </p>
                  <div className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {action.stats}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Professional Analytics Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg lg:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} animate-fade-in`}>
                📊 Learning Analytics
              </h2>
              <div className="flex items-center space-x-3">
                <select className={`px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 text-sm"
                >
                  Full Report
                </button>
              </div>
            </div>
            
            {/* Main Charts Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {/* Study Hours Chart */}
              <div className="lg:col-span-1 xl:col-span-2">
                <StudyHoursChart />
              </div>
              
              {/* Progress Chart */}
              <div className="lg:col-span-1 xl:col-span-1">
                <ProgressChart />
              </div>
            </div>
            
            {/* Performance Chart - Full Width */}
            <div className="mb-6">
              <PerformanceChart />
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

          {/* Dynamic Content Based on Active Tab */}
          {activeTab !== 'overview' && (
            <div className="mt-8 animate-fade-in">
              {renderActiveTabContent()}
            </div>
          )}
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

        /* Chart Animations */
        @keyframes grow-up {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes progress-fill {
          from {
            width: 0;
            opacity: 0.7;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw-line {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-area {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shine {
          0% {
            opacity: 0;
            transform: translateX(-100%) skewX(-12deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-grow-up {
          animation: grow-up 1s ease-out forwards;
        }

        .animate-progress-fill {
          animation: progress-fill 1.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }

        .animate-draw-line {
          animation: draw-line 2s ease-in-out forwards;
        }

        .animate-draw-area {
          animation: draw-area 1.5s ease-in-out 0.5s forwards;
          opacity: 0;
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
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