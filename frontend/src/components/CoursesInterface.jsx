import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  List,
  Check,
  MoreVertical,
  ThumbsUp,
  Share2,
  Brain,
  Award,
  TrendingUp,
} from "lucide-react";
import Header from "./Header";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJS from "crypto-js";

const CoursesInterface = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";

  // Course data with playlist
  const coursePlaylist = [
    {
      id: 1,
      youtubeVideoId: "O6P86uwfdR0", 
      title: "Introduction to React Hooks",
      duration: "15:30",
      completed: true,
    },
    {
      id: 2,
      youtubeVideoId: "TNhaISOUy6Q", 
      title: "useState Hook Deep Dive",
      duration: "22:45",
      completed: true,
    },
    {
      id: 3,
      youtubeVideoId: "0ZJgIjIuY7U", 
      title: "useEffect Hook & Side Effects",
      duration: "28:12",
      completed: false,
    },
    {
      id: 4,
      youtubeVideoId: "t2ypzz6gJm0", 
      title: "useContext for State Management",
      duration: "19:34",
      completed: false,
    },
    {
      id: 5,
      youtubeVideoId: "kVeOpcw4GWY", 
      title: "useReducer for Complex State",
      duration: "25:18",
      completed: false,
    },
    {
      id: 6,
      youtubeVideoId: "AHNcOXku8aY", 
      title: "useMemo & useCallback Optimization",
      duration: "21:07",
      completed: false,
    },
    {
      id: 7,
      youtubeVideoId: "raNActRyCeA", 
      title: "Custom Hooks Creation",
      duration: "24:56",
      completed: false,
    },
    {
      id: 8,
      youtubeVideoId: "j942wKiXFu8", 
      title: "useRef & DOM Manipulation",
      duration: "18:43",
      completed: false,
    },
    {
      id: 9,
      youtubeVideoId: "HQq1lq3F4ys", 
      title: "React Testing Library with Hooks",
      duration: "32:21",
      completed: false,
    },
    {
      id: 10,
      youtubeVideoId: "Ke90Tje7VS0", 
      title: "Performance Optimization Patterns",
      duration: "27:14",
      completed: false,
    },
    {
      id: 11,
      youtubeVideoId: "FHvZuS1XpbM", 
      title: "Error Boundaries & Error Handling",
      duration: "20:38",
      completed: false,
    },
    {
      id: 12,
      youtubeVideoId: "dpw9EHDh2bM", 
      title: "React Hooks Best Practices",
      duration: "26:45",
      completed: false,
    },
  ];

  const currentCourse = {
    title: "Complete React Hooks Guide",
    instructor: "React Developer Pro",
    duration: "8 hours",
    level: "Intermediate",
    students: "45,234",
    rating: "4.9",
    category: "Frontend Development",
    currentLesson: "Introduction to React Hooks",
    lessonNumber: "1",
    totalLessons: "12",
    youtubeVideoId: "O6P86uwfdR0", // Default video
  };

  // States
  const [currentVideoId, setCurrentVideoId] = useState(currentCourse.youtubeVideoId);
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [videoSize, setVideoSize] = useState(66.67); // Default 2/3 width
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message: "Hello! I'm your AI study assistant. I can help you understand React Hooks concepts. What would you like to learn about?",
      timestamp: new Date(),
      avatar: "🤖",
    },
    {
      id: 2,
      type: "user",
      message: "Can you explain the difference between useState and useReducer?",
      timestamp: new Date(),
      avatar: "👤",
    },
    {
      id: 3,
      type: "ai",
      message: "Great question! useState is perfect for simple state management, while useReducer is better for complex state logic with multiple sub-values or when the next state depends on the previous one. useReducer follows the Redux pattern with actions and reducers.",
      timestamp: new Date(),
      avatar: "🤖",
    },
  ]);

  // Video functions
  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1`;
  };

  const changeYouTubeVideo = (newVideoId) => {
    console.log("🎬 Changing video to:", newVideoId);
    setCurrentVideoId(newVideoId);
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: chatMessage,
      timestamp: new Date(),
      avatar: "👤",
    };

    setChatMessages([...chatMessages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        message: "That's an excellent question about React Hooks! Let me explain that concept in detail...",
        timestamp: new Date(),
        avatar: "🤖",
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setChatMessage("");
  };

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
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {currentCourse.title}
                </h1>
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
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{currentCourse.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                Progress: {Math.round((2 / 12) * 100)}%
              </p>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${(2 / 12) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Responsive Content Area */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-180px)] max-w-full overflow-hidden">
        
        {/* 🎬 Left Section: Video Player + Playlist (Desktop) */}
        <div 
          className="w-full lg:flex lg:flex-col flex-shrink-0"
          style={{ width: window.innerWidth >= 1024 ? `${videoSize}%` : '100%' }}
        >
          
          {/* Video Player */}
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl lg:rounded-none shadow-lg lg:shadow-none overflow-hidden m-4 lg:m-0`}>
            <div className="relative group">
              {/* YouTube iframe */}
              <div className="aspect-video">
                <iframe
                  key={currentVideoId}
                  src={getYouTubeEmbedUrl(currentVideoId)}
                  title={coursePlaylist.find(v => v.youtubeVideoId === currentVideoId)?.title || currentCourse.currentLesson}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video info overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="text-white font-semibold text-lg">
                    {coursePlaylist.find(video => video.youtubeVideoId === currentVideoId)?.title || currentCourse.currentLesson}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {currentCourse.instructor}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-red-500 text-xs font-medium">● YouTube</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-300">{currentCourse.rating}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open(`https://youtube.com/watch?v=${currentVideoId}`, '_blank')}
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

            {/* Video Controls */}
            <div className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"} border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    const currentIndex = coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId);
                    if (currentIndex > 0) {
                      changeYouTubeVideo(coursePlaylist[currentIndex - 1].youtubeVideoId);
                    }
                  }}
                  disabled={coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId) === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId) === 0
                      ? "opacity-50 cursor-not-allowed"
                      : isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">Previous</span>
                </button>

                <div className="text-center flex-1 mx-4">
                  <p className="text-lg font-semibold">
                    {coursePlaylist.find(video => video.youtubeVideoId === currentVideoId)?.title || currentCourse.currentLesson}
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Lesson {coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId) + 1} of {coursePlaylist.length}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    const currentIndex = coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId);
                    if (currentIndex < coursePlaylist.length - 1) {
                      changeYouTubeVideo(coursePlaylist[currentIndex + 1].youtubeVideoId);
                    }
                  }}
                  disabled={coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId) === coursePlaylist.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    coursePlaylist.findIndex(video => video.youtubeVideoId === currentVideoId) === coursePlaylist.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                  }`}
                >
                  <span className="font-medium hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-2 lg:space-x-4">
                <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Like</span>
                </button>
                <button 
                  onClick={() => window.open(`https://youtube.com/watch?v=${currentVideoId}`, '_blank')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-sm hidden sm:inline">YouTube</span>
                </button>
                <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Playlist - Below Video */}
          <div className="hidden lg:block flex-1 p-4">
            <div className={`h-full ${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg overflow-hidden`}>
              
              {/* Playlist Header */}
              <div className={`p-4 border-b ${isDark ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"}`}>
                <h3 className="text-lg font-semibold mb-1">Course Playlist</h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {coursePlaylist.length} videos • React Hooks Masterclass
                </p>
              </div>

              {/* Playlist Videos */}
              <div className="max-h-80 overflow-y-auto">
                {coursePlaylist.map((video, index) => (
                  <div
                    key={video.youtubeVideoId}
                    onClick={() => changeYouTubeVideo(video.youtubeVideoId)}
                    className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                      video.youtubeVideoId === currentVideoId
                        ? isDark
                          ? "bg-emerald-900/30 border-emerald-500/30"
                          : "bg-emerald-50 border-emerald-200"
                        : isDark
                        ? "border-gray-700 hover:bg-gray-700/50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          video.youtubeVideoId === currentVideoId
                            ? "bg-emerald-500 text-white"
                            : isDark
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {video.youtubeVideoId === currentVideoId ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm leading-tight ${
                          video.youtubeVideoId === currentVideoId
                            ? isDark ? "text-emerald-400" : "text-emerald-600"
                            : ""
                        }`}>
                          {video.title}
                        </h4>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {video.duration}
                        </p>
                        {video.completed && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Playlist - Collapsible */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setShowMobilePlaylist(!showMobilePlaylist)}
              className={`w-full p-4 flex items-center justify-between ${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg mb-4`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <List className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Course Playlist</h3>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {coursePlaylist.length} videos
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                showMobilePlaylist ? "rotate-180" : ""
              }`} />
            </button>

            {showMobilePlaylist && (
              <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg mb-4`}>
                <div className="max-h-80 overflow-y-auto">
                  {coursePlaylist.map((video, index) => (
                    <div
                      key={video.youtubeVideoId}
                      onClick={() => {
                        changeYouTubeVideo(video.youtubeVideoId);
                        setShowMobilePlaylist(false);
                      }}
                      className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                        video.youtubeVideoId === currentVideoId
                          ? isDark
                            ? "bg-emerald-900/30 border-emerald-500/30"
                            : "bg-emerald-50 border-emerald-200"
                          : isDark
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            video.youtubeVideoId === currentVideoId
                              ? "bg-emerald-500 text-white"
                              : isDark
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {video.youtubeVideoId === currentVideoId ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm leading-tight ${
                            video.youtubeVideoId === currentVideoId
                              ? isDark ? "text-emerald-400" : "text-emerald-600"
                              : ""
                          }`}>
                            {video.title}
                          </h4>
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {video.duration}
                          </p>
                          {video.completed && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Resize Handle */}
        <div
          className={`hidden lg:block w-2 cursor-col-resize ${
            isDark
              ? "bg-gray-700 hover:bg-emerald-500"
              : "bg-gray-200 hover:bg-emerald-500"
          } transition-all duration-300 relative group`}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = videoSize;

            const handleMouseMove = (e) => {
              const container = document.querySelector(".flex.min-h-\\[calc\\(100vh-180px\\)\\]");
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

        {/* 📋 Right Section: Chat, Test, Summary, Transcript */}
        <div 
          className="hidden lg:flex lg:flex-col flex-shrink-0 min-w-0"
          style={{ width: `${100 - videoSize}%` }}
        >
          
          {/* Enhanced Tab Navigation - Horizontal Scrollable like YouLearn */}
          <div
            className={`border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            } bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/50`}
          >
            <div className="flex overflow-x-auto scrollbar-hide px-4 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {[
                {
                  id: "chat",
                  label: "AI Assistant",
                  icon: MessageCircle,
                  badge: "3",
                  color: "bg-blue-500",
                },
                {
                  id: "notes",
                  label: "Notes",
                  icon: BookOpen,
                  badge: "2",
                  color: "bg-green-500",
                },
                {
                  id: "transcript",
                  label: "Transcript",
                  icon: Mic,
                  badge: null,
                  color: "bg-purple-500",
                },
                {
                  id: "summary",
                  label: "Summary",
                  icon: FileText,
                  badge: null,
                  color: "bg-orange-500",
                },
                {
                  id: "quiz",
                  label: "Quiz",
                  icon: BookOpen,
                  badge: "5",
                  color: "bg-red-500",
                },
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 mr-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : `${isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"}`
                  }`}
                >
                  {/* Icon with colored background */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id ? "bg-white/20" : tab.color
                  }`}>
                    <tab.icon className={`w-3 h-3 ${
                      activeTab === tab.id ? "text-white" : "text-white"
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <span className="text-xs font-medium hidden sm:inline">{tab.label}</span>
                  
                  {/* Badge */}
                  {tab.badge && (
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeTab === tab.id ? "bg-white text-emerald-500" : "bg-red-500 text-white"
                    } animate-pulse shadow-lg`}>
                      {tab.badge}
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              ))}
              
              {/* Scroll indicators */}
              <div className="flex items-center space-x-2 pl-4 flex-shrink-0">
                <div className={`w-1 h-8 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Scroll →</span>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Content - Optimized for horizontal scrollable tabs */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden max-w-full">
            {activeTab === "chat" && (
              <div className="h-full flex flex-col max-w-full">
                {/* AI Assistant Header */}
                <div
                  className={`p-4 rounded-2xl mb-4 bg-gradient-to-r max-w-full ${
                    isDark
                      ? "from-blue-900/30 to-indigo-900/30 border border-blue-500/30"
                      : "from-blue-50 to-indigo-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate">
                        AI Study Assistant
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } truncate`}
                      >
                        Ask questions about this lesson
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

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">My Notes 📝</h3>
                  <button className="text-emerald-500 text-sm hover:text-emerald-600 transition-colors">
                    Export PDF
                  </button>
                </div>  
                
                <textarea
                  placeholder="Take notes while watching the video...

Tips:
• Use timestamps like [05:30] for important moments
• Write key concepts and definitions
• Note questions to ask later"
                  className={`w-full h-64 p-4 rounded-lg border resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                />
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    💾 Auto-saved • Last saved: 2 minutes ago
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                      Clear
                    </button>
                    <button className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors">
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Previous Notes */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Previous Lesson Notes</h4>
                  <div className="space-y-2">
                    {[
                      { lesson: "useState Hook", note: "useState returns array with [state, setState]", time: "2 days ago" },
                      { lesson: "useEffect Hook", note: "useEffect runs after every render by default", time: "3 days ago" }
                    ].map((note, index) => (
                      <div key={index} className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{note.lesson}</p>
                            <p className="text-sm mt-1">{note.note}</p>
                          </div>
                          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {note.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-6 max-w-full">
                {/* Quiz Header */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r max-w-full ${
                  isDark
                    ? "from-red-900/30 to-pink-900/30 border border-red-500/30"
                    : "from-red-50 to-pink-50 border border-red-200"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold truncate">Quiz Time! 🧠</h3>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} truncate`}>
                        Test your knowledge on React Hooks
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Quiz Question */}
                <div className={`p-6 rounded-2xl ${isDark ? "bg-gray-800/50" : "bg-white/50"} border ${isDark ? "border-gray-700" : "border-gray-200"} max-w-full backdrop-blur-sm`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Question 1 of 5</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Easy Level
                    </div>
                  </div>
                  
                  <p className="mb-6 text-lg leading-relaxed break-words">
                    Which hook is used for managing state in functional components?
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "useEffect",
                      "useState", 
                      "useContext",
                      "useReducer"
                    ].map((option, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] break-words ${
                          isDark 
                            ? "border-gray-600 hover:border-emerald-500 hover:bg-gray-700/50 bg-gray-800/30" 
                            : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 bg-white/80"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="break-words font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-emerald-500`}></div>
                      <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Progress: 1/5
                      </span>
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium flex-shrink-0 shadow-lg transform hover:scale-105">
                      Next Question →
                    </button>
                  </div>
                </div>

                {/* Enhanced Quiz Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-6 rounded-2xl text-center border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"} backdrop-blur-sm`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-500 mb-1">85%</div>
                    <div className="text-sm font-medium">Accuracy Rate</div>
                  </div>
                  <div className={`p-6 rounded-2xl text-center border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"} backdrop-blur-sm`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-500 mb-1">12</div>
                    <div className="text-sm font-medium">Completed</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="space-y-4 max-w-full">
                <h3 className="text-xl font-bold">Video Transcript 📜</h3>
                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} max-h-96 overflow-y-auto`}>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-500 font-mono text-xs flex-shrink-0">00:15</span>
                      <p className="break-words">Welcome to our comprehensive guide on React Hooks. In this lesson, we'll explore how hooks revolutionized React development.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-500 font-mono text-xs flex-shrink-0">01:30</span>
                      <p className="break-words">React Hooks allow functional components to have state and lifecycle methods that were previously only available in class components.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-500 font-mono text-xs flex-shrink-0">02:45</span>
                      <p className="break-words">The useState hook is the most fundamental hook. It allows you to add state to functional components with a simple API.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-500 font-mono text-xs flex-shrink-0">04:10</span>
                      <p className="break-words">When you call useState, it returns an array with two elements: the current state value and a function to update it.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-500 font-mono text-xs flex-shrink-0">05:25</span>
                      <p className="break-words">It's important to follow the rules of hooks: only call hooks at the top level and only call them from React functions.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Lesson Summary 📚</h3>
                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h4 className="font-semibold mb-3">🎯 Key Learning Points:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>React Hooks allow you to use state in functional components</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>useState is the most basic hook for managing state</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Always call hooks at the top level of your function</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Hooks follow the naming convention "use..."</span>
                    </li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h4 className="font-semibold mb-3">💡 Quick Recap:</h4>
                  <p className="text-sm">
                    This lesson covered the fundamentals of React Hooks, focusing on useState for state management 
                    in functional components. You learned the rules of hooks and best practices for implementation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesInterface;
