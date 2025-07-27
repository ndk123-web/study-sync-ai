import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  FileText,
  BookOpen,
  Clock,
  Users,
  Star,
  RotateCcw,
  Bookmark,
  Settings,
  Mic,
  Send,
  Download,
  Share2,
  Heart,
  ThumbsUp,
  MoreVertical,
  Zap,
  TrendingUp,
  Award,
  Target,
  Brain,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Header from "./Header";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";

const CoursesInterface = () => {
  // Get theme from store
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("chat");
  const [videoSize, setVideoSize] = useState(65); // Percentage of container width
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("45:30");
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // YouTube specific states
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const [isYouTubeReady, setIsYouTubeReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Sample course data with YouTube integration
  const currentCourse = {
    title: "Advanced React Development",
    instructor: "Sarah Johnson",
    currentLesson: "React Hooks Deep Dive",
    lessonNumber: 8,
    totalLessons: 24,
    duration: "45:30",
    progress: 65,
    difficulty: "Intermediate",
    rating: 4.9,
    students: "15.2k",
    category: "Web Development",
    youtubeVideoId: "HnXPKtro4SM", // Extract video ID from YouTube URL
    description:
      "Master advanced React concepts including custom hooks, performance optimization, and state management patterns.",
  };

  // Enhanced chat messages with AI responses
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message:
        "Welcome! I'm your AI study assistant. I can help explain concepts, answer questions, and provide additional resources about React Hooks. What would you like to know?",
      timestamp: new Date(),
      avatar: "🤖",
    },
    {
      id: 2,
      type: "user",
      message: "Can you explain what useEffect does in simple terms?",
      timestamp: new Date(Date.now() - 300000),
      avatar: "👤",
    },
    {
      id: 3,
      type: "ai",
      message:
        "Great question! useEffect is like setting up 'watchers' in your component. It runs code when specific things change (like state or props) or when the component first appears. Think of it as telling React: 'Hey, when X happens, do Y.' It's perfect for API calls, subscriptions, or cleanup tasks!",
      timestamp: new Date(Date.now() - 240000),
      avatar: "🤖",
    },
  ]);

  const recommendations = [
    {
      id: 1,
      title: "React Performance Optimization",
      instructor: "Prof. Mike Chen",
      duration: "3h 45m",
      rating: 4.8,
      students: "12.5k",
      level: "Advanced",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
      progress: 0,
      price: "Free",
      isNew: true,
    },
    {
      id: 2,
      title: "Node.js Backend Fundamentals",
      instructor: "Lisa Wang",
      duration: "4h 20m",
      rating: 4.9,
      students: "8.2k",
      level: "Intermediate",
      category: "Backend",
      image:
        "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=300&h=200&fit=crop",
      progress: 35,
      price: "$49",
      isPopular: true,
    },
    {
      id: 3,
      title: "JavaScript ES6+ Features",
      instructor: "Dr. Robert Kim",
      duration: "2h 30m",
      rating: 4.7,
      students: "15.3k",
      level: "Beginner",
      category: "Programming",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      progress: 100,
      price: "$29",
      isCompleted: true,
    },
    {
      id: 4,
      title: "Full Stack Development",
      instructor: "Prof. Elena Rodriguez",
      duration: "12h 45m",
      rating: 4.6,
      students: "6.7k",
      level: "Advanced",
      category: "Full Stack",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      progress: 15,
      price: "$99",
      isTrending: true,
    },
  ];

  // Lesson transcript data
  const transcript = [
    {
      time: "00:30",
      text: "Welcome to our comprehensive guide on React Hooks. Today we'll explore the useEffect hook in detail.",
    },
    {
      time: "01:15",
      text: "The useEffect hook is one of the most powerful tools in React. It allows us to perform side effects in functional components.",
    },
    {
      time: "02:45",
      text: "Let's start with a simple example. Here's how you would make an API call when a component mounts.",
    },
    {
      time: "04:20",
      text: "Notice how we pass an empty dependency array as the second argument. This ensures the effect only runs once.",
    },
    {
      time: "06:10",
      text: "Now, let's look at how to handle cleanup with useEffect. This is crucial for preventing memory leaks.",
    },
  ];

  // Learning stats
  const learningStats = {
    totalWatchTime: "127h 45m",
    coursesCompleted: 12,
    currentStreak: 15,
    skillPoints: 2847,
    certificates: 8,
    rank: "Advanced Learner",
  };

  // YouTube Helper Functions - SIMPLIFIED
  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  // Simple YouTube embed - no complex API needed!
  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;
  };

  // Simple event handlers - no complex YouTube API
  const togglePlay = () => {
    // User will use YouTube's built-in controls
    console.log("Use YouTube's built-in play/pause button");
  };

  const toggleMute = () => {
    console.log("Use YouTube's built-in mute button");
  };

  const handleVolumeChange = (e) => {
    console.log("Use YouTube's built-in volume control");
  };

  const toggleFullscreen = () => {
    console.log("Use YouTube's built-in fullscreen button");
  };

  const handleSpeedChange = (speed) => {
    console.log("Use YouTube's built-in speed control");
  };

  const handleProgressClick = (e) => {
    console.log("Use YouTube's built-in progress bar");
  };

  const skipTime = (seconds) => {
    console.log("Use YouTube's built-in skip controls");
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: "user",
        message: chatMessage,
        timestamp: new Date(),
        avatar: "👤",
      };

      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          type: "ai",
          message:
            "That's an excellent question! Let me help you understand that concept better. Based on the current video content, here's what you need to know...",
          timestamp: new Date(),
          avatar: "🤖",
        };
        setChatMessages((prev) => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Function to change YouTube video
  const changeYouTubeVideo = (videoId) => {
    console.log("Video changed to:", videoId);
    // Simple iframe src change
  };

  // No complex useEffects needed - just simple iframe embed!

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Include Header Component */}
      <Header />

      {/* Animated Course Progress Bar */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b px-6 py-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5">
                  <div
                    className={`w-full h-full rounded-2xl ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } flex items-center justify-center`}
                  >
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-xl">{currentCourse.title}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    by {currentCourse.instructor}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">
                      {currentCourse.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{currentCourse.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Lesson {currentCourse.lessonNumber} of{" "}
                  {currentCourse.totalLessons}
                </span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${currentCourse.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-emerald-500">
                  {currentCourse.progress}%
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isBookmarked
                    ? "bg-emerald-500 text-white"
                    : isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Enhanced Layout */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Video Section with Professional YouTube Player */}
        <div
          style={{ width: `${videoSize}%` }}
          className={`${isDark ? "bg-gray-900" : "bg-black"} border-r ${
            isDark ? "border-gray-700" : "border-gray-200"
          } flex flex-col relative`}
        >
          {/* 🎬 Simple YouTube Player - No complex API needed! */}
          <div
            ref={playerRef}
            className="flex-1 bg-black relative group overflow-hidden rounded-lg m-2"
          >
            {/* Direct YouTube Embed - Super Simple! */}
            <iframe
              src={getYouTubeEmbedUrl(currentCourse.youtubeVideoId)}
              title={currentCourse.currentLesson}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            
            {/* Simple info overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-semibold text-lg">
                  {currentCourse.currentLesson}
                </h3>
                <p className="text-gray-300 text-sm">
                  {currentCourse.instructor}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-red-500 text-xs font-medium">
                    ● YouTube
                  </span>
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-300">
                    {currentCourse.rating}
                  </span>
                  <span className="text-green-400 text-xs font-medium bg-green-500/20 px-2 py-0.5 rounded-full">
                    🎬 Native Controls
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.open(`https://youtube.com/watch?v=${currentCourse.youtubeVideoId}`, '_blank')}
                  className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors"
                  title="Open in YouTube"
                >
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
                <button className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 🎬 Simple Video Navigation - No complex controls needed! */}
          <div
            className={`p-6 ${isDark ? "bg-gray-800" : "bg-white"} border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Previous Lesson</span>
              </button>

              <div className="text-center">
                <p className="text-lg font-semibold">
                  {currentCourse.currentLesson}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentCourse.lessonNumber} of {currentCourse.totalLessons} •{" "}
                  {currentCourse.category}
                </p>
              </div>

              <button className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <span className="font-medium">Next Lesson</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Simple Actions */}
            <div className="flex items-center justify-center space-x-4">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Like Video</span>
              </button>
              <button 
                onClick={() => window.open(`https://youtube.com/watch?v=${currentCourse.youtubeVideoId}`, '_blank')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm">Open in YouTube</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Resize Handle */}
        <div
          className={`w-2 cursor-col-resize ${
            isDark
              ? "bg-gray-700 hover:bg-emerald-500"
              : "bg-gray-200 hover:bg-emerald-500"
          } transition-all duration-300 relative group`}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = videoSize;

            const handleMouseMove = (e) => {
              const container = document.querySelector(
                ".flex.h-\\[calc\\(100vh-180px\\)\\]"
              );
              const rect = container.getBoundingClientRect();
              const newSize = Math.min(
                Math.max(((e.clientX - rect.left) / rect.width) * 100, 30),
                80
              );
              setVideoSize(newSize);
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
        </div>

        {/* Enhanced Right Panel */}
        <div
          style={{ width: `${100 - videoSize}%` }}
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } flex flex-col relative`}
        >
          {/* Enhanced Tab Navigation */}
          <div
            className={`border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            } px-6 py-2 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/50`}
          >
            <div className="flex space-x-0">
              {[
                {
                  id: "chat",
                  label: "AI Assistant",
                  icon: MessageCircle,
                  badge: "3",
                },
                {
                  id: "summary",
                  label: "Summary",
                  icon: FileText,
                  badge: null,
                },
                {
                  id: "transcript",
                  label: "Transcript",
                  icon: Mic,
                  badge: null,
                },
                { id: "notes", label: "My Notes", icon: BookOpen, badge: "2" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-6 py-3 border-b-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : `border-transparent ${
                          isDark
                            ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                            : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        }`
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "chat" && (
              <div className="h-full flex flex-col">
                {/* AI Assistant Header */}
                <div
                  className={`p-4 rounded-xl mb-4 bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-900/30 to-teal-900/30 border border-emerald-500/30"
                      : "from-emerald-50 to-teal-50 border border-emerald-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        AI Study Assistant
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Ask questions about React Hooks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 animate-slide-in ${
                        message.type === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.type === "ai" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">
                            {message.avatar}
                          </span>
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                          message.type === "ai"
                            ? isDark
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
                        <p className={`text-xs mt-2 opacity-70`}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">
                            {message.avatar}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Enhanced Chat Input */}
                <div
                  className={`border rounded-xl p-4 ${
                    isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask about React Hooks, state management, or any concept..."
                        className={`w-full px-4 py-3 rounded-lg border resize-none ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                        rows="2"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!chatMessage.trim()}
                      className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick Questions */}
                  <div className="mt-3">
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Quick questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "What is useEffect?",
                        "Difference between useState and useReducer?",
                        "When to use useCallback?",
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setChatMessage(question)}
                          className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                            isDark
                              ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Lesson Summary</h3>
                </div>

                {/* Key Concepts */}
                <div
                  className={`p-6 rounded-xl ${
                    isDark
                      ? "bg-gray-700 border border-gray-600"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <h4 className="font-semibold mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Key Concepts</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        concept: "useEffect Hook",
                        description:
                          "Manages side effects in functional components",
                        mastery: 85,
                      },
                      {
                        concept: "Dependency Arrays",
                        description:
                          "Controls when effects run based on changing values",
                        mastery: 72,
                      },
                      {
                        concept: "Cleanup Functions",
                        description:
                          "Prevents memory leaks by cleaning up subscriptions",
                        mastery: 90,
                      },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.concept}</span>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              item.mastery >= 80
                                ? "bg-green-100 text-green-700"
                                : item.mastery >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.mastery}% mastered
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              item.mastery >= 80
                                ? "bg-green-500"
                                : item.mastery >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${item.mastery}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Objectives */}
                <div
                  className={`p-6 rounded-xl ${
                    isDark ? "bg-gray-700" : "bg-green-50"
                  }`}
                >
                  <h4 className="font-semibold mb-4 flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Learning Objectives</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Understand the purpose and syntax of useEffect",
                      "Master dependency arrays and their impact",
                      "Implement proper cleanup to prevent memory leaks",
                      "Compare useEffect with class component lifecycle methods",
                    ].map((objective, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Quiz */}
                <div
                  className={`p-6 rounded-xl border-2 border-dashed ${
                    isDark
                      ? "border-gray-600 bg-gray-800/50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <Award className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Test Your Knowledge</h4>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mb-4`}
                    >
                      Ready to practice what you've learned?
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105">
                      Take Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-emerald-500" />
                    <span>Video Transcript</span>
                  </h3>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download
                  </button>
                </div>

                <div className="space-y-4">
                  {transcript.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        // Jump to timestamp logic would go here
                      }}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-emerald-500 font-mono text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                          {item.time}
                        </span>
                        <p className="text-sm leading-relaxed flex-1">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search Transcript */}
                <div className="mt-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search transcript..."
                      className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <span>My Notes</span>
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes Editor */}
                <div
                  className={`border rounded-xl overflow-hidden ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`p-4 border-b ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Note title..."
                      className={`w-full font-semibold text-lg bg-transparent border-none outline-none ${
                        isDark
                          ? "text-white placeholder-gray-400"
                          : "text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                  <textarea
                    placeholder="Take detailed notes while watching. Use timestamps [00:30] to reference specific moments..."
                    className={`w-full h-64 p-4 bg-transparent border-none outline-none resize-none ${
                      isDark
                        ? "text-white placeholder-gray-400"
                        : "text-gray-900 placeholder-gray-500"
                    }`}
                    defaultValue="[00:30] Introduction to useEffect hook - manages side effects in functional components

Key points:
- useEffect runs after render
- Can replace componentDidMount, componentDidUpdate, and componentWillUnmount
- Dependency array controls when effect runs

[02:45] Example: API call with useEffect
- Empty dependency array [] means effect runs only once
- Including variables in dependency array means effect runs when those variables change

[06:10] Cleanup functions
- Return a function from useEffect to clean up
- Prevents memory leaks
- Unsubscribe from event listeners, cancel network requests"
                  />
                </div>

                {/* Note Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
                      Save Notes
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Auto-save: ON
                    </button>
                  </div>
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Last saved: 2 minutes ago
                  </span>
                </div>

                {/* Previous Notes */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                    Previous Lesson Notes
                  </h4>
                  {[
                    {
                      title: "useState Hook Fundamentals",
                      date: "2 days ago",
                      preview: "State management in functional components...",
                    },
                    {
                      title: "Component Lifecycle Methods",
                      date: "1 week ago",
                      preview:
                        "Understanding mounting, updating, and unmounting...",
                    },
                  ].map((note, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{note.title}</h5>
                        <span
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {note.date}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {note.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Recommendations Section */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-t px-6 py-8`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Continue Learning</h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Recommended courses based on your progress and interests
            </p>
          </div>
          <button className="flex items-center space-x-2 text-emerald-500 hover:text-emerald-600 transition-colors font-medium">
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((course) => (
            <div
              key={course.id}
              className={`group ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-50 hover:bg-white"
              } rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-2xl border ${
                isDark
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Course Image with Overlay */}
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-teal-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>

                {/* Course Status Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  {course.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      NEW
                    </span>
                  )}
                  {course.isPopular && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>POPULAR</span>
                    </span>
                  )}
                  {course.isTrending && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                      TRENDING
                    </span>
                  )}
                  {course.isCompleted && (
                    <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  )}
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Progress Bar (if course is started) */}
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-5">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : course.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.level}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-emerald-500 transition-colors">
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } mb-3`}
                  >
                    by {course.instructor}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Action Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold ${
                        course.price === "Free"
                          ? "text-green-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {course.price}
                    </span>
                    {course.progress > 0 && (
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {course.progress}% complete
                      </span>
                    )}
                  </div>

                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      course.isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : course.progress > 0
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {course.isCompleted
                      ? "Review"
                      : course.progress > 0
                      ? "Continue"
                      : "Start"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Stats Footer */}
      <div
        className={`${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-200"
        } border-t px-6 py-6`}
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {[
            {
              label: "Total Watch Time",
              value: learningStats.totalWatchTime,
              icon: Clock,
            },
            {
              label: "Courses Completed",
              value: learningStats.coursesCompleted,
              icon: CheckCircle2,
            },
            {
              label: "Current Streak",
              value: `${learningStats.currentStreak} days`,
              icon: Zap,
            },
            {
              label: "Skill Points",
              value: learningStats.skillPoints.toLocaleString(),
              icon: Star,
            },
            {
              label: "Certificates",
              value: learningStats.certificates,
              icon: Award,
            },
            { label: "Rank", value: learningStats.rank, icon: TrendingUp },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {stat.value}
              </div>
              <div
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-2xl border max-w-md w-full p-6 animate-slide-in`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: "Space", action: "Play/Pause" },
                { key: "← →", action: "Skip 10 seconds" },
                { key: "↑ ↓", action: "Volume up/down" },
                { key: "M", action: "Mute/Unmute" },
                { key: "F", action: "Fullscreen" },
                { key: "1-5", action: "Jump to 10%-50%" },
              ].map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-mono ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {shortcut.key}
                  </span>
                  <span className="text-sm">{shortcut.action}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } text-center`}
              >
                Press these keys while the video player is focused
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        /* Custom Scrollbar */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#10b981" : "#059669"}
            ${isDark ? "#374151" : "#f3f4f6"};
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: ${isDark ? "#374151" : "#f3f4f6"};
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }

        /* Custom Range Slider */
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* 🔥 YouTube Suggestion Blocker Styles */
        #youtube-player iframe {
          pointer-events: ${isPlaying ? 'auto' : 'none'} !important;
        }
        
        /* Hide YouTube end screen overlay and suggestions */
        .ytp-pause-overlay,
        .ytp-scroll-min,
        .ytp-suggestion-container,
        .ytp-endscreen-content,
        .ytp-ce-element,
        .ytp-cards-teaser,
        .ytp-endscreen-element,
        .ytp-ce-covering-overlay,
        .ytp-ce-element-shadow,
        .ytp-ce-covering-image,
        .ytp-ce-expanding-image,
        .ytp-watermark {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Block YouTube player interactions when paused */
        .video-suggestion-blocker {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          z-index: 50;
          pointer-events: ${isPlaying ? 'none' : 'auto'};
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 🎬 Simple iframe responsive styling */
        iframe {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default CoursesInterface;
