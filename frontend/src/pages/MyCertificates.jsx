import React, { useState, useEffect } from "react";
import {
  Award,
  Download,
  Share2,
  CheckCircle,
  Trophy,
  Calendar,
  User,
  BookOpen,
  Youtube,
  FileText,
  MessageCircle,
  Home,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";
import { useNotifications } from "../store/slices/useNotifications.js";
import Header from "../components/Header";
import CryptoJs from "crypto-js";

const MyCertificates = () => {
  // Zustand store hooks
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode = useThemeStore((state) => state.setMode);
  const navigate = useNavigate();

  // App stores
  const { isAuth, removeAuth } = useIsAuth();
  const { username, email, photoURL, isPremium, logoutUser } = useUserStore();
  const clearNotifications = useNotifications((state) => state.clearNotifications);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDark = theme === "dark";

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

    return () => {
      delete window.dashboardSidebar;
    };
  }, []);

  const handleLogout = () => {
    removeAuth();
    logoutUser();
    clearNotifications();
    setIsSidebarOpen(false);
  };

  // Demo Certificates Data
  const certificates = [
    {
      id: 1,
      title: "React Fundamentals",
      issueDate: "March 15, 2024",
      courseId: "REACT2025HINDI",
      instructor: "StudySync AI",
      thumbnail: "⚛️",
      grade: "A+",
      skills: ["React", "JSX", "Components", "Props"],
      certificateUrl: "/certificates/react-fundamentals.pdf"
    },
    {
      id: 2,
      title: "JavaScript ES6+",
      issueDate: "February 28, 2024",
      courseId: "JS2025ENG",
      instructor: "StudySync AI",
      thumbnail: "🟨",
      grade: "A",
      skills: ["ES6", "Async/Await", "Promises", "Modules"],
      certificateUrl: "/certificates/javascript-es6.pdf"
    },
    {
      id: 3,
      title: "Git & GitHub Mastery",
      issueDate: "January 20, 2024",
      courseId: "GIT2025HINDI",
      instructor: "StudySync AI",
      thumbnail: "🔧",
      grade: "A+",
      skills: ["Git", "GitHub", "Version Control", "Collaboration"],
      certificateUrl: "/certificates/git-github.pdf"
    },
    {
      id: 4,
      title: "Python Data Science",
      issueDate: "April 10, 2024",
      courseId: "PYTHONDATASCIENCE2025ENGLISH",
      instructor: "StudySync AI",
      thumbnail: "🐍",
      grade: "A",
      skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
      certificateUrl: "/certificates/python-data-science.pdf"
    },
    {
      id: 5,
      title: "DevOps Fundamentals",
      issueDate: "May 5, 2024",
      courseId: "DEVOPS2025HINDI",
      instructor: "StudySync AI",
      thumbnail: "🚀",
      grade: "A+",
      skills: ["Docker", "CI/CD", "AWS", "Kubernetes"],
      certificateUrl: "/certificates/devops-fundamentals.pdf"
    },
    {
      id: 6,
      title: "Node.js Backend Development",
      issueDate: "June 18, 2024",
      courseId: "NODEJS2025HINDI",
      instructor: "StudySync AI",
      thumbnail: "💚",
      grade: "A",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
      certificateUrl: "/certificates/nodejs-backend.pdf"
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
      <div
        className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-all duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0 animate-slide-in" : "-translate-x-full"
        } ${isDark ? "bg-gray-900" : "bg-white"} shadow-2xl overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 animate-bounce-in">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
                } shadow-lg transform hover:scale-110 transition-transform`}
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
                  My Certificates
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
              {/* Welcome Message - Mobile Only */}
              <div
                className={`p-4 rounded-xl mb-6 animate-fade-in glass-effect ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                <h3
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  🏆 My Certificates
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {certificates.length} certificates earned
                </p>
              </div>

              {/* User Profile in Sidebar */}
              <div
                className={`p-4 rounded-xl mb-6 animate-fade-in ${
                  isDark ? "bg-gray-800" : "bg-gray-50"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center transform hover:scale-110 transition-transform">
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
                    href: "/enrolled-courses",
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
                    id: "certificates",
                    label: "My Certificates",
                    icon: <Award className="w-5 h-5" />,
                    emoji: "🏆",
                    active: true,
                  },
                ].map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in ${
                      item.active
                        ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg`
                        : `${
                            isDark
                              ? "hover:bg-gray-800 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                          }`
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    <span
                      className="text-lg animate-bounce-in"
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      {item.emoji}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {item.active && (
                      <ChevronRight className="w-4 h-4 ml-auto animate-slide-in-right" />
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Footer Section - Theme Toggle & Logout */}
            <div
              className={`p-6 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              } space-y-2 animate-fade-in`}
              style={{ animationDelay: "0.8s" }}
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
                href: "/enrolled-courses",
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
                id: "certificates",
                label: "My Certificates",
                icon: <Award className="w-5 h-5" />,
                emoji: "🏆",
                active: true,
              },
              {
                id: "help",
                label: "Help & Support",
                icon: <MessageCircle className="w-5 h-5" />,
                emoji: "❓",
                href: "/help"
              },
            ].map((item, index) => (
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
                {item.active && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </a>
            ))}
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

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Use the existing Header component */}
      <Header />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  } animate-bounce-in flex items-center space-x-3`}
                >
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span>My Certificates</span>
                </h1>
                <p
                  className={`text-lg transition-colors duration-300 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } animate-fade-in`}
                  style={{ animationDelay: "0.2s" }}
                >
                  View and download your earned certificates
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {certificates.length} Certificates Earned
                </span>
              </div>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <div
                key={certificate.id}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer animate-fade-in relative overflow-hidden ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Certificate Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-10 rounded-full transform translate-x-6 -translate-y-6"></div>
                
                {/* Certificate Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{certificate.thumbnail}</div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {certificate.grade}
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>

                {/* Certificate Title */}
                <h3
                  className={`font-bold text-lg mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {certificate.title}
                </h3>

                {/* Certificate Details */}
                <div className="space-y-2 mb-4">
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Issued:</strong> {certificate.issueDate}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Instructor:</strong> {certificate.instructor}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Course ID:</strong> {certificate.courseId}
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Demo download functionality
                      const link = document.createElement('a');
                      link.href = certificate.certificateUrl;
                      link.download = `${certificate.title.replace(/\s+/g, '-')}-Certificate.pdf`;
                      link.click();
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Verified Certificate
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (if needed in future) */}
          {certificates.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No Certificates Yet
              </h3>
              <p
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Complete courses and quizzes to earn your first certificate!
              </p>
              <a
                href="/courses"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto inline-flex"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Courses</span>
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Custom Styles */}
      <style>{`
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
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
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

export default MyCertificates;