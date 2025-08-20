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
// Recharts for professional charts (aliased to avoid icon name collisions)
import * as Recharts from 'recharts';

const Dashboard = () => {
  // Zustand store hooks
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode = useThemeStore((state) => state.setMode);

  // App stores
  const { isAuth, removeAuth } = useIsAuth();
  const { username, email, photoURL, isPremium, logoutUser } = useUserStore();

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
      } else {
        message = `Welcome, ${username}! 🎉`;
      }
      setWelcomeMessage(message);
      setSignInNotification(true);
      localStorage.removeItem('welcomeUser');
    }
  }, []);
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

  // Removed older analyticsData; not needed after simplifying charts

  const quickActions = [
    {
      title: "📚 Browse Courses",
      description: "Explore available courses",
      color: "from-blue-500 to-indigo-600",
      action: () => (window.location.href = '/courses'),
      stats: "50+ available",
    },
    {
      title: "🎯 My Courses",
      description: "Continue learning",
      color: "from-emerald-500 to-teal-600",
      action: () => (window.location.href = '/enrolled-courses'),
      stats: "3 in progress",
    },
    {
      title: "📄 PDF Learning",
      description: "Study with documents",
      color: "from-purple-500 to-pink-600",
      action: () => (window.location.href = '/pdf-learning'),
      stats: "Upload & learn",
    },
    {
      title: "📝 My Notes",
      description: "Access saved notes",
      color: "from-orange-500 to-red-600",
      action: () => setActiveTab('notes'),
      stats: "12 notes saved",
    },
  ];

  // Shared Recharts tooltip
  const ReTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className={`px-3 py-2 rounded-lg border shadow ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`}>
        {label && <div className="text-xs font-semibold mb-1">{label}</div>}
        {payload.map((item, idx) => (
          <div key={idx} className="text-xs flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}: </span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Reusable responsive chart container using CSS clamp for height
  const ResponsiveChartBox = ({ children, min = 220, vh = 35, max = 420 }) => (
    <div style={{ width: '100%', height: `clamp(${min}px, ${vh}vh, ${max}px)` }}>
      <Recharts.ResponsiveContainer width="100%" height="100%">
        {children}
      </Recharts.ResponsiveContainer>
    </div>
  );

  // Chart data
  const learningTrendData = [
    { month: 'Jan', courses: 2, videos: 8, pdfs: 3, quizzes: 0 },
    { month: 'Feb', courses: 1, videos: 10, pdfs: 4, quizzes: 0 },
    { month: 'Mar', courses: 2, videos: 12, pdfs: 5, quizzes: 0 },
    { month: 'Apr', courses: 3, videos: 9, pdfs: 4, quizzes: 0 },
    { month: 'May', courses: 1, videos: 11, pdfs: 6, quizzes: 0 },
    { month: 'Jun', courses: 2, videos: 13, pdfs: 5, quizzes: 0 },
    { month: 'Jul', courses: 3, videos: 14, pdfs: 6, quizzes: 0 },
    { month: 'Aug', courses: 2, videos: 12, pdfs: 5, quizzes: 0 },
  ];

  const categoryDistribution = [
    { name: 'Frontend', value: 32, color: '#10B981' },
    { name: 'Backend', value: 24, color: '#3B82F6' },
    { name: 'DSA', value: 18, color: '#8B5CF6' },
    { name: 'DevOps', value: 14, color: '#F59E0B' },
    { name: 'AI/ML', value: 12, color: '#EF4444' },
  ];

  const quizScoresByCourse = [
    { course: 'React', avgScore: 82, attempts: 3 },
    { course: 'Node', avgScore: 74, attempts: 2 },
    { course: 'DSA', avgScore: 68, attempts: 4 },
    { course: 'DevOps', avgScore: 71, attempts: 1 },
    { course: 'ML', avgScore: 77, attempts: 2 },
  ];

  // Datasets for tab content and side sections
  const searchTopics = [
    { id: 1, thumbnail: '⚛️', difficulty: 'Beginner', title: 'React Basics', category: 'Frontend', duration: '2h 10m', students: 1200, rating: 4.7 },
    { id: 2, thumbnail: '🟨', difficulty: 'Intermediate', title: 'JavaScript ES2023', category: 'Frontend', duration: '3h 05m', students: 980, rating: 4.6 },
    { id: 3, thumbnail: '🧩', difficulty: 'Advanced', title: 'Data Structures', category: 'CS', duration: '4h 30m', students: 620, rating: 4.8 },
  ];

  const videoLibrary = [
    { id: 1, thumbnail: '🎬', title: 'Async JS Patterns', category: 'JavaScript', views: '12.4k', duration: '18:45', uploadDate: '2d ago' },
    { id: 2, thumbnail: '💅', title: 'Tailwind CSS v4', category: 'CSS', views: '8.1k', duration: '22:13', uploadDate: '5d ago' },
    { id: 3, thumbnail: '🗄️', title: 'Building REST APIs', category: 'Backend', views: '5.7k', duration: '16:02', uploadDate: '1w ago' },
  ];

  const userNotes = [
    { id: 1, title: 'React Hooks', content: 'useState, useEffect, and custom hooks overview...', tags: ['react', 'hooks'], date: 'Aug 10, 2025' },
    { id: 2, title: 'SQL Joins', content: 'INNER, LEFT, RIGHT joins explained with examples...', tags: ['sql', 'db'], date: 'Aug 9, 2025' },
    { id: 3, title: 'Big-O Basics', content: 'Time vs space complexity quick reference...', tags: ['dsa'], date: 'Aug 8, 2025' },
  ];

  const recentActivities = [
    { id: 1, icon: <PlayCircle className="w-5 h-5 text-emerald-500" />, title: 'Watched React State Patterns', action: 'Video', time: '2h ago', progress: 60 },
    { id: 2, icon: <BookOpen className="w-5 h-5 text-indigo-500" />, title: 'Read DSA Notes - Trees', action: 'PDF', time: '5h ago', progress: 100 },
    { id: 3, icon: <Trophy className="w-5 h-5 text-yellow-500" />, title: 'Quiz: Sorting Algorithms', action: 'Quiz', time: '1d ago', progress: 85 },
  ];

  const trendingTopics = [
    { id: 1, thumbnail: '🧠', title: 'Neural Networks from Scratch', views: '21k', duration: '35m', rating: 4.9, isNew: true },
    { id: 2, thumbnail: '⚙️', title: 'CI/CD with GitHub Actions', views: '15k', duration: '28m', rating: 4.7, isNew: false },
    { id: 3, thumbnail: '🚀', title: 'Next.js 15 Server Actions', views: '18k', duration: '32m', rating: 4.8, isNew: true },
  ];

  // 1) Learning Trend Analysis
  const TrendAnalysisCard = () => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Learning Trend Analysis</span>
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive view of your learning journey
          </p>
        </div>
      </div>
      <ResponsiveChartBox min={240} vh={38} max={420}>
        <Recharts.LineChart data={learningTrendData} margin={{ top: 5, right: 24, left: 12, bottom: 5 }}>
          <Recharts.CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
          <Recharts.XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }} />
          <Recharts.YAxis tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }} />
          <Recharts.Tooltip content={<ReTooltip />} />
          <Recharts.Legend />
          <Recharts.Line type="monotone" dataKey="courses" stroke="#10B981" strokeWidth={3} dot={{ r: 3, fill: '#10B981' }} activeDot={{ r: 6 }} name="Courses" />
          <Recharts.Line type="monotone" dataKey="videos" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3, fill: '#3B82F6' }} activeDot={{ r: 6 }} name="Videos" />
          <Recharts.Line type="monotone" dataKey="pdfs" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 3, fill: '#8B5CF6' }} activeDot={{ r: 6 }} name="PDFs" />
          <Recharts.Line type="monotone" dataKey="quizzes" stroke="#F59E0B" strokeWidth={3} dot={{ r: 3, fill: '#F59E0B' }} activeDot={{ r: 6 }} name="Quizzes" />
        </Recharts.LineChart>
      </ResponsiveChartBox>
    </div>
  );

  // 2) Learning Categories pie chart
  const LearningCategoriesCard = () => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Learning Categories</span>
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Time distribution across topics
          </p>
        </div>
      </div>
      <ResponsiveChartBox min={210} vh={32} max={320}>
        <Recharts.PieChart>
          <Recharts.Pie
            data={categoryDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            dataKey="value"
          >
            {categoryDistribution.map((entry, index) => (
              <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Recharts.Pie>
          <Recharts.Tooltip content={<ReTooltip />} />
        </Recharts.PieChart>
      </ResponsiveChartBox>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {categoryDistribution.map((cat) => (
          <div key={cat.name} className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // 3) Quiz Performance (per course)
  const QuizPerformanceChart = () => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
            <Target className="w-5 h-5 text-purple-500" />
            <span>Quiz Performance (per course)</span>
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Average quiz scores with attempts
          </p>
        </div>
      </div>
      <ResponsiveChartBox min={210} vh={32} max={320}>
        <Recharts.BarChart data={quizScoresByCourse} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
          <Recharts.CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
          <Recharts.XAxis dataKey="course" tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} />
          <Recharts.YAxis tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} domain={[0, 100]} />
          <Recharts.Tooltip content={<ReTooltip />} />
          <Recharts.Legend />
          <Recharts.ReferenceLine y={70} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Target 70%', position: 'insideTopRight', fill: isDark ? '#FBBF24' : '#92400E', fontSize: 10 }} />
          <Recharts.Bar dataKey="avgScore" name="Avg Score" fill="#3B82F6" radius={[8,8,0,0]} barSize={32}>
            <Recharts.LabelList dataKey="avgScore" position="top" formatter={(v) => `${v}%`} style={{ fill: isDark ? '#E5E7EB' : '#374151', fontSize: 12 }} />
          </Recharts.Bar>
        </Recharts.BarChart>
      </ResponsiveChartBox>
      {/* Attempts badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {quizScoresByCourse.map((c) => (
          <span key={c.course} className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {c.course}: {c.attempts} attempts
          </span>
        ))}
      </div>
    </div>
  );

  // Removed assessment trend and course mastery for simplified 3-chart layout

  // Removed StreakChart and GoalsWidget components

  // Render content for non-overview tabs
  const renderActiveTabContent = () => {
    switch (activeTab) {
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
                    border rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl transform hover:scale-105 group relative overflow-hidden`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {/* Background Gradient Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg bg-gradient-to-r text-white text-2xl`}>
                      {action.title.split(' ')[0]} {/* Extract emoji */}
                    </div>
                    <h3 className={`font-bold text-base transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {action.title.substring(2)} {/* Remove emoji from title */}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                      {action.description}
                    </p>
                    <div className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {action.stats}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Charts (Only 3 charts) */}
          <div className="mb-8 space-y-6">
            <TrendAnalysisCard />
            <div className="grid lg:grid-cols-2 gap-6">
              <LearningCategoriesCard />
              <QuizPerformanceChart />
            </div>
          </div>

          {/* End charts */}

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