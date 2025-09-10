import React, { useState, useEffect } from "react";
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
  Lightbulb,
  Rocket,
  GraduationCap,
  Eye,
  Heart,
  Share2,
  BookmarkPlus,
  Home,
  Sun,
  LogOut,
  Moon,
  ArrowLeft,
  Users,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";
import Header from "../components/Header";
import CryptoJs from "crypto-js";
import { GetEnrolledCourseApi } from "../api/GetEnrolledCourseApi";

const EnrolledCoursesSample = () => {
  // Zustand store hooks
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const setMode = useThemeStore((state) => state.setMode);
  const isAuth = useIsAuth((state) => state.isAuth);
  const removeAuth = useIsAuth((state) => state.removeAuth);
  const username = useUserStore((state) => state.username);
  const email = useUserStore((state) => state.email);
  const photoURL = useUserStore((state) => state.photoURL);
  const isPremium = useUserStore((state) => state.isPremium);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const isDark = theme === "dark";

  // Component States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, in-progress, completed
  const [sortBy, setSortBy] = useState("recent"); // recent, progress, alphabetical
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalEnrolledCount, setTotalEnrolledCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Auth check
  useEffect(() => {
    if (!isAuth) {
      window.location.href = "/signin";
    }
  }, [isAuth]);

  // Expose toggle function globally for Header component
  useEffect(() => {
    window.dashboardSidebar = {
      toggle: () => setIsSidebarOpen((prev) => !prev),
    };

    const fetchUserEnrollCourses = async () => {
      const apiResponse = await GetEnrolledCourseApi();
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert("Something wrong in GetEnrolledCourseApi");
        return;
      }
      console.log("Api Response for Fetching User Enrolled Api: ", apiResponse);

      const enrollments = Array.isArray(apiResponse?.data)
        ? apiResponse.data
        : Array.isArray(apiResponse?.data?.getEnrollUserCourses)
        ? apiResponse.data.getEnrollUserCourses
        : [];

      setTotalEnrolledCount(enrollments.length);

      const inProg = enrollments.filter((e) => !e.completed).length;
      const comp = enrollments.filter((e) => e.completed).length;
      setInProgressCount(inProg);
      setCompletedCount(comp);

      // Normalize to UI shape used below
      const normalized = enrollments.map((enr) => {
        const c = enr?.courseId || {};

        // Handle different data structures for different types
        if (enr.type === "video") {
          return {
            id: enr._id || enr.id,
            title: enr.videoTitle || enr.title || "Video Learning Session",
            creator: enr.videoCreator || enr.creator || "Video Content",
            category: "Video Learning",
            rating: 0,
            progress: Number(enr?.progress ?? 0),
            totalLessons: 1,
            completedLessons: enr.completed ? 1 : 0,
            duration: enr.videoDuration || "",
            students: 0,
            difficulty: "Beginner",
            nextLesson: "Watch Video",
            certificate: Boolean(enr?.completed),
            lastAccessed:
              enr?.updatedAt || enr?.createdAt || new Date().toISOString(),
            completed: Boolean(enr?.completed),
            encryptedUrl: enr.videoLink, // Backend sends videoLink (encrypted)
            type: "video",
            enrolledDate:
              new Date(enr?.createdAt).toLocaleDateString() || "Recently",
          };
        } else if (enr.type === "pdf") {
          return {
            id: enr._id || enr.id,
            title: enr.title || "PDF Study Material",
            creator: `${enr.pdfSize.toFixed(5)} MB` || "PDF Content",
            pdfName: enr.pdfName || "Untitled PDF",
            category: "PDF Learning",
            rating: 0,
            progress: Number(enr?.progress ?? 0),
            totalLessons: 1,
            completedLessons: enr.completed ? 1 : 0,
            duration: "",
            students: 0,
            difficulty: "Beginner",
            nextLesson: "Read PDF",
            certificate: Boolean(enr?.completed),
            lastAccessed:
              enr?.updatedAt || enr?.createdAt || new Date().toISOString(),
            completed: Boolean(enr?.completed),
            encryptedUrl: enr.pdfLink, // Backend sends pdfLink (encrypted)
            type: "pdf",
            enrolledDate:
              new Date(enr?.createdAt).toLocaleDateString() || "Recently",
          };
        } else {
          // Course type (existing logic)
          return {
            id: c.courseId || c._id || enr._id,
            title: c.title || "Untitled Course",
            instructor: c.instructor || "Unknown Instructor",
            category: c.category || "General",
            rating: typeof c.rating === "number" ? c.rating : 0,
            progress: Number(enr?.progress ?? 0),
            totalLessons: Number(c?.lessons ?? 0),
            completedLessons: Math.round(
              (Number(enr?.progress ?? 0) / 100) * Number(c?.lessons ?? 0)
            ),
            duration: c.duration ? `${c.duration} min` : "",
            students: c.likes || 0,
            difficulty: c.featured ? "Advanced" : "Beginner",
            nextLesson: c.title
              ? `Continue: ${c.title}`
              : "Continue where you left",
            certificate: Boolean(enr?.completed),
            lastAccessed:
              enr?.updatedAt || enr?.createdAt || new Date().toISOString(),
            completed: Boolean(enr?.completed),
            type: "course",
            enrolledDate:
              new Date(enr?.createdAt).toLocaleDateString() || "Recently",
          };
        }
      });

      setEnrolledCourses(normalized);
    };

    fetchUserEnrollCourses();

    return () => {
      delete window.dashboardSidebar;
    };
  }, []);

  const handleLogout = () => {
    removeAuth();
    logoutUser();
    setIsSidebarOpen(false);
  };

  // Handle click based on content type
  const handleCourseClick = (course) => {
    if (course.type === "video") {
      // Navigate to video learning with encrypted URL
      if (course.encryptedUrl) {
        window.location.href = `/learn/video?v=${encodeURIComponent(
          course.encryptedUrl
        )}`;
      } else {
        window.location.href = `/learn/video`;
      }
    } else if (course.type === "pdf") {
      // Navigate to PDF learning with encrypted URL
      if (course.encryptedUrl) {
        window.location.href = `/pdf-learning?pdf=${encodeURIComponent(
          course.id
        )}`;
      } else {
        window.location.href = `/pdf-learning`;
      }
    } else {
      // Default course navigation
      window.location.href = `/learn/${course.id}`;
    }
  };

  // Dummy enrolled courses data (replace with API call later)
  // const enrolledCoursesSample = [
  //   {
  //     id: 1,
  //     title: "Complete React Development Course",
  //     instructor: "John Doe",
  //     progress: 75,
  //     totalLessons: 45,
  //     completedLessons: 34,
  //     duration: "15h 30m",
  //     thumbnail: "⚛️",
  //     category: "Frontend Development",
  //     enrolledDate: "2 weeks ago",
  //     lastAccessed: "1 day ago",
  //     nextLesson: "React Context API",
  //     difficulty: "Intermediate",
  //     rating: 4.8,
  //     students: "12.5k",
  //     certificate: false,
  //   },
  //   {
  //     id: 2,
  //     title: "JavaScript ES6 Masterclass",
  //     instructor: "Jane Smith",
  //     progress: 45,
  //     totalLessons: 32,
  //     completedLessons: 14,
  //     duration: "8h 45m",
  //     thumbnail: "🟨",
  //     category: "Programming",
  //     enrolledDate: "1 month ago",
  //     lastAccessed: "3 days ago",
  //     nextLesson: "Arrow Functions & Destructuring",
  //     difficulty: "Beginner",
  //     rating: 4.9,
  //     students: "8.2k",
  //     certificate: false,
  //   },
  //   {
  //     id: 3,
  //     title: "CSS Grid & Flexbox Mastery",
  //     instructor: "Mike Johnson",
  //     progress: 100,
  //     totalLessons: 28,
  //     completedLessons: 28,
  //     duration: "6h 15m",
  //     thumbnail: "🎨",
  //     category: "CSS & Design",
  //     enrolledDate: "3 weeks ago",
  //     lastAccessed: "2 hours ago",
  //     nextLesson: "Course Completed!",
  //     difficulty: "Intermediate",
  //     rating: 4.7,
  //     students: "5.8k",
  //     certificate: true,
  //   },
  //   {
  //     id: 4,
  //     title: "Node.js Backend Development",
  //     instructor: "Sarah Wilson",
  //     progress: 30,
  //     totalLessons: 52,
  //     completedLessons: 15,
  //     duration: "20h 10m",
  //     thumbnail: "🟢",
  //     category: "Backend Development",
  //     enrolledDate: "1 week ago",
  //     lastAccessed: "5 days ago",
  //     nextLesson: "Express.js Routing",
  //     difficulty: "Advanced",
  //     rating: 4.6,
  //     students: "9.1k",
  //     certificate: false,
  //   },
  //   {
  //     id: 5,
  //     title: "Python Machine Learning Basics",
  //     instructor: "Dr. Alex Chen",
  //     progress: 100,
  //     totalLessons: 38,
  //     completedLessons: 38,
  //     duration: "12h 20m",
  //     thumbnail: "🐍",
  //     category: "AI & Machine Learning",
  //     enrolledDate: "2 months ago",
  //     lastAccessed: "1 week ago",
  //     nextLesson: "Course Completed!",
  //     difficulty: "Intermediate",
  //     rating: 4.9,
  //     students: "15.2k",
  //     certificate: true,
  //   },
  //   {
  //     id: 6,
  //     title: "TypeScript for React Developers",
  //     instructor: "Emily Rodriguez",
  //     progress: 60,
  //     totalLessons: 25,
  //     completedLessons: 15,
  //     duration: "9h 45m",
  //     thumbnail: "📘",
  //     category: "Frontend Development",
  //     enrolledDate: "10 days ago",
  //     lastAccessed: "Yesterday",
  //     nextLesson: "Type Guards & Assertions",
  //     difficulty: "Advanced",
  //     rating: 4.8,
  //     students: "6.7k",
  //     certificate: false,
  //   },
  // ];

  // useEffect(() => {
  //   setEnrolledCourses(enrolledCoursesSample);
  // }, []);

  // Filter and sort courses
  const filteredAndSortedCourses = enrolledCourses
    .filter((course) => {
      const title = (course?.title || "").toLowerCase();
      const instructor = (course?.instructor || "").toLowerCase();
      const category = (course?.category || "").toLowerCase();
      const q = (searchQuery || "").toLowerCase();

      const matchesSearch =
        title.includes(q) || instructor.includes(q) || category.includes(q);

      const p = Number(course?.progress ?? 0);
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "in-progress" && p < 100 && p > 0) ||
        (filterStatus === "completed" && p === 100) ||
        (filterStatus === "not-started" && p === 0);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return Number(b?.progress ?? 0) - Number(a?.progress ?? 0);
        case "alphabetical":
          return (a?.title || "").localeCompare(b?.title || "");
        case "recent":
        default: {
          const ad = new Date(a?.lastAccessed || 0).getTime();
          const bd = new Date(b?.lastAccessed || 0).getTime();
          return bd - ad;
        }
      }
    });

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={`hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:top-[73px] ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      } border-r transition-all duration-300 custom-scrollbar`}
    >
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        <div className="px-6 flex-1">
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {[
              {
                id: "overview",
                label: "Dashboard",
                icon: <Home className="w-5 h-5" />,
                emoji: "🏠",
                href: "/dashboard",
              },
              {
                id: "all-courses",
                label: "All Courses",
                icon: <BookOpen className="w-5 h-5" />,
                emoji: "📚",
                href: "/courses",
              },
              {
                id: "enrolled-courses",
                label: "Enrolled Courses",
                icon: <Youtube className="w-5 h-5" />,
                emoji: "📹",
                active: true,
              },
              {
                id: "pdf-learning",
                label: "PDF Learning",
                icon: <FileText className="w-5 h-5" />,
                emoji: "📄",
                isLink: true,
                href: "/pdf-learning",
              },
              {
                id: "video-learning",
                label: "Video Learning",
                icon: <Youtube className="w-5 h-5" />,
                emoji: "🎥",
                isLink: true,
                href: "/video-learning",
              },
              {
                id: "notes",
                label: "My Notes",
                icon: <FileText className="w-5 h-5" />,
                emoji: "📝",
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: <BarChart3 className="w-5 h-5" />,
                emoji: "📊",
              },
              {
                id: "help",
                label: "Help & Support",
                icon: <MessageCircle className="w-5 h-5" />,
                emoji: "❓",
              },
            ].map((item, index) =>
              item.isLink || item.href ? (
                <a
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    item.active
                      ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                      : `${
                          isDark
                            ? "hover:bg-gray-800 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </a>
              ) : (
                <button
                  key={item.id}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    item.active
                      ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                      : `${
                          isDark
                            ? "hover:bg-gray-800 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Bottom Section - User Info */}
        <div
          className={`px-6 mt-6 pt-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`p-4 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {username || "User"}
                </p>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
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
      <div
        className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-all duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0 animate-slide-in" : "-translate-x-full"
        } ${isDark ? "bg-gray-900" : "bg-white"} shadow-2xl overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
                } shadow-lg`}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span
                  className={`font-bold text-lg ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  StudySync AI
                </span>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Enrolled Courses
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              {/* User Profile in Sidebar */}
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {username || "User"}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {email || "user@example.com"}
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
                  {
                    id: "overview",
                    label: "Dashboard",
                    icon: <Home className="w-5 h-5" />,
                    emoji: "🏠",
                    href: "/dashboard",
                  },
                  {
                    id: "all-courses",
                    label: "All Courses",
                    icon: <BookOpen className="w-5 h-5" />,
                    emoji: "📚",
                    href: "/courses",
                  },
                  {
                    id: "enrolled-courses",
                    label: "Enrolled Courses",
                    icon: <Youtube className="w-5 h-5" />,
                    emoji: "📹",
                    active: true,
                  },
                  {
                    id: "pdf-learning",
                    label: "PDF Learning",
                    icon: <FileText className="w-5 h-5" />,
                    emoji: "📄",
                    isLink: true,
                    href: "/pdf-learning",
                  },
                  {
                    id: "video-learning",
                    label: "Video Learning",
                    icon: <Youtube className="w-5 h-5" />,
                    emoji: "🎥",
                    isLink: true,
                    href: "/video-learning",
                  },
                  {
                    id: "notes",
                    label: "My Notes",
                    icon: <FileText className="w-5 h-5" />,
                    emoji: "📝",
                  },
                  {
                    id: "analytics",
                    label: "Analytics",
                    icon: <BarChart3 className="w-5 h-5" />,
                    emoji: "📊",
                  },
                ].map((item, index) =>
                  item.isLink || item.href ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        item.active
                          ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                          : `${
                              isDark
                                ? "hover:bg-gray-800 text-gray-300"
                                : "hover:bg-gray-100 text-gray-700"
                            }`
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                      {item.active && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </a>
                  ) : (
                    <button
                      key={item.id}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        item.active
                          ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                          : `${
                              isDark
                                ? "hover:bg-gray-800 text-gray-300"
                                : "hover:bg-gray-100 text-gray-700"
                            }`
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                      {item.active && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Footer Section - Theme Toggle & Logout */}
            <div
              className={`p-6 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              } space-y-2`}
            >
              <button
                onClick={() => {
                  setMode();
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDark
                    ? "hover:bg-red-900/30 text-red-400"
                    : "hover:bg-red-50 text-red-600"
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

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <Header />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <a
                  href="/dashboard"
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </a>
                <div>
                  <h1
                    className={`text-2xl md:text-3xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🎓 My Enrolled Courses
                  </h1>
                  <p
                    className={`text-sm md:text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Continue your learning journey •{" "}
                    {filteredAndSortedCourses.length} courses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: "Total Enrolled",
                value: totalEnrolledCount,
                icon: <BookOpen className="w-5 h-5" />,
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                title: "In Progress",
                value: inProgressCount,
                icon: <Clock className="w-5 h-5" />,
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
              },
              {
                title: "Completed",
                value: completedCount,
                icon: <CheckCircle className="w-5 h-5" />,
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50 dark:bg-green-900/20",
              },
              {
                title: "Certificates",
                value: "0",
                icon: <Award className="w-5 h-5" />,
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50 dark:bg-purple-900/20",
              },
            ].map((stat, index) => (
              <div
                key={stat.title}
                className={`${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } 
                  border rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer animate-bounce-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`${stat.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
                >
                  <div
                    className={`bg-gradient-to-r ${stat.color} text-white p-2 rounded-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <h3
                  className={`text-xs font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } mb-1`}
                >
                  {stat.title}
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.title === "Certificates" ? (
                    <p
                      className={`text-xs font-semibold italic mt-2 ${
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      Feature coming soon 🚀
                    </p>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search your courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="all">All Courses</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="not-started">Not Started</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="recent">Recently Accessed</option>
                  <option value="progress">By Progress</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedCourses.map((course, index) => (
              <div
                key={course.id}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer animate-fade-in ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCourseClick(course)}
              >
                {/* Content Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                      course.type === "course"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : course.type === "pdf"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    <span>
                      {course.type === "course"
                        ? "📚"
                        : course.type === "pdf"
                        ? "📄"
                        : "🎥"}
                    </span>
                    <span className="capitalize">{course.type} Learning</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {course.type === "course" && course.certificate && (
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-1 rounded-full">
                        <Award className="w-4 h-4" />
                      </div>
                    )}
                    {course.type === "course" && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Info */}
                <h3
                  className={`font-bold text-lg mb-2 line-clamp-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {course.title}
                </h3>

                {/* Different metadata based on type */}
                {course.type === "course" ? (
                  <>
                    <p
                      className={`text-sm mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      by {course.instructor}
                    </p>
                    <p
                      className={`text-xs mb-4 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {course.category}
                    </p>
                  </>
                ) : (
                  <>
                    {/* Simplified metadata for video/pdf */}
                    <p
                      className={`text-sm mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {course.type === "video"
                        ? "Video Learning Session"
                        : course.pdfName || "PDF Document"}
                    </p>
                    <p
                      className={`text-xs mb-4 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {course.creator || "Learning Content"}
                    </p>
                  </>
                )}

                {/* Progress Bar for courses only */}
                {course.type === "course" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Progress
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          course.progress === 100
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <div
                      className={`w-full h-3 rounded-full ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.progress === 100
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons
                      </span>
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {course.duration}
                      </span>
                    </div>
                  </div>
                )}

                {/* Simple info card for non-course content */}
                {course.type !== "course" && (
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      🕰️ Created:
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.enrolledDate || "Recently"}
                    </p>
                  </div>
                )}

                {/* Course Stats for courses only */}
                {course.type === "course" && (
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span
                      className={`flex items-center space-x-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>{course.students}</span>
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : course.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                )}

                {/* Next Lesson for courses */}
                {course.type === "course" && (
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {course.progress === 100
                        ? "🎉 Completed!"
                        : "Next Lesson:"}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.nextLesson}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    course.type === "course"
                      ? course.progress === 100
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : course.type === "pdf"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  } hover:shadow-lg`}
                >
                  {course.type === "course"
                    ? course.progress === 100
                      ? "✅ Review Course"
                      : "▶️ Continue Learning"
                    : course.type === "pdf"
                    ? "📄 Open PDF"
                    : "🎥 Watch Video"}
                </button>

                {/* Last Accessed */}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No courses found
              </h3>
              <p
                className={`text-lg mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter settings"
                  : "Start your learning journey by enrolling in courses"}
              </p>
              <a
                href="/courses"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Explore Courses</span>
              </a>
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
        
        @keyframes bounceIn {
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
        
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
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

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#10b981" : "#059669"} ${
        isDark ? "#374151" : "#f3f4f6"
      };
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? "#374151" : "#f3f4f6"};
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
      `}</style>
    </div>
  );
};

export default EnrolledCoursesSample;
