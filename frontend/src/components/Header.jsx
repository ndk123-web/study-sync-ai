import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Zap, User, LogOut, Home, Search, BookOpen, MessageCircle, Bell, ChevronDown, Settings, CheckCircle2, Sparkles } from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";
import CryptoJs from "crypto-js";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode = useThemeStore((state) => state.setMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Auth and User states - Updated as per your requirement
  const isAuth = useIsAuth((state) => state.isAuth);
  const removeAuth = useIsAuth((state) => state.removeAuth);
  
  const username = useUserStore((state) => state.username);
  const email = useUserStore((state) => state.email);
  const photoURL = useUserStore((state) => state.photoURL);
  const isPremium = useUserStore((state) => state.isPremium);
  const logoutUser = useUserStore((state) => state.logoutUser);
  
  // Get current location to check if we're on dashboard
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    removeAuth();
    logoutUser();
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Load sample notifications - Available on all pages when authenticated
  useEffect(() => {
    if (isAuth) {
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
          },
          {
            id: 3,
            type: 'info',
            title: 'Study reminder',
            message: 'Don\'t forget to review yesterday\'s notes',
            time: '1 hour ago'
          }
        ]);
      }, 1000);
    }
  }, [isAuth]);

  useEffect(() => {
    console.log("Current Theme: ", theme);
  }, [theme]);

  const toggleTheme = () => {
    setMode();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isDark = theme === "dark";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.user-menu-dropdown') && !event.target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
          <div className="flex-1">
            <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {notification.message}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {notification.time}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          isDark
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } backdrop-blur-md`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              {/* Mobile Dashboard Menu Button */}
              {isDashboard && isAuth && (
                <button
                  onClick={() => {
                    if (window.dashboardSidebar?.toggle) {
                      window.dashboardSidebar.toggle();
                    }
                  }}
                  className={`lg:hidden p-2 rounded-lg mr-2 ${
                    isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  } transition-colors`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              <Link to={"/"}>
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  } shadow-lg`}
                >
                  <Zap className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
                </div>
              </Link>
              <div className="hidden sm:block">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  StudySync AI
                </span>
                <div className="text-xs text-gray-500">Learn Smarter</div>
              </div>
            </div>

            {/* Center - Search Bar (Only on Dashboard and Desktop) */}
            {isDashboard && isAuth && (
              <div className="hidden lg:flex flex-1 max-w-md mx-8">
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
                  />
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {isAuth && (
                <Link to="/courses">
                  <button className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } ${location.pathname === '/courses' ? 'text-emerald-500' : ''}`}>
                    Courses
                  </button>
                </Link>
              )}
              <Link to="/features">
                <button className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Features
                </button>
              </Link>
              <Link to="/about">
                <button className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  About
                </button>
              </Link>
              <Link to="/contact">
                <button className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Contact
                </button>
              </Link>
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 md:p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 text-gray-300"
                    : "hover:bg-gray-100 bg-gray-100/50 text-gray-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Moon className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

              {/* Desktop Auth Section */}
              <div className="hidden lg:flex items-center space-x-3">
                {isAuth && username ? (
                  <>
                    {/* Notifications - Show on all pages when authenticated */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotifications(!showNotifications);
                        }}
                        className={`notification-button p-2 rounded-lg transition-all duration-200 ${
                          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        } relative`}
                      >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                            {notifications.length}
                          </span>
                        )}
                      </button>
                      
                      {/* Notifications Dropdown */}
                      {showNotifications && (
                        <div className={`notification-dropdown absolute right-0 mt-2 w-80 ${
                          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } rounded-xl shadow-xl border z-50 animate-slide-down`}>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Notifications ({notifications.length})
                              </h3>
                              {notifications.length > 0 && (
                                <button
                                  onClick={() => setNotifications([])}
                                  className={`text-xs px-2 py-1 rounded ${isDark ? 'text-emerald-400 hover:bg-gray-700' : 'text-emerald-600 hover:bg-gray-100'}`}
                                >
                                  Clear all
                                </button>
                              )}
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                              {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                  <Bell className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No new notifications
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {notifications.map((notification) => (
                                    <NotificationCard
                                      key={notification.id}
                                      notification={notification}
                                      onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Profile Section */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUserMenu(!showUserMenu);
                        }}
                        className={`user-menu-button flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        }`}
                      >
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
                        <div className="text-left">
                          <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {username}
                          </div>
                          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {isPremium ? "Premium" : "Free"}
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                      
                      {/* User Menu Dropdown */}
                      {showUserMenu && (
                        <div className={`user-menu-dropdown absolute right-0 mt-2 w-64 ${
                          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } rounded-xl shadow-xl border z-50 animate-slide-down`}>
                          <div className="p-4">
                            {/* User Info */}
                            <div className={`flex items-center space-x-3 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                              {photoURL ? (
                                <img 
                                  src={photoURL} 
                                  alt={username}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div>
                                <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {username}
                                </div>
                                <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} truncate max-w-[150px]`} title={email}>
                                  {email}
                                </div>
                                <div className="text-xs text-emerald-500 font-medium">
                                  {isPremium ? "Premium Member" : "Free Plan"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Menu Items */}
                            <div className="py-3 space-y-1">
                              {!isDashboard && (
                                <Link to="/dashboard">
                                  <button
                                    onClick={() => setShowUserMenu(false)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                      isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Home className="w-4 h-4" />
                                    <span>Dashboard</span>
                                  </button>
                                </Link>
                              )}
                              
                              <button
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
                  </>
                ) : (
                  <>
                    <Link to={'/signin'}>
                      <button className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        isDark
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}>
                        Sign In
                      </button>
                    </Link>

                    <Link to={"/signup"}>
                      <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile User Avatar and Notification (Only show if authenticated) */}
              {isAuth && username && (
                <div className="flex lg:hidden items-center space-x-2">
                  {/* Mobile Notifications */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications(!showNotifications);
                      }}
                      className={`notification-button p-2 rounded-lg transition-all duration-200 ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      } relative`}
                    >
                      <Bell className="w-4 h-4" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                    
                    {/* Mobile Notifications Dropdown */}
                    {showNotifications && (
                      <div className={`notification-dropdown absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      } rounded-xl shadow-xl border z-50 animate-slide-down`}>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              Notifications
                            </h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No new notifications
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {notifications.map((notification) => (
                                  <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile User Avatar */}
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {username.split(' ')[0]}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className={`lg:hidden p-2 md:p-3 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
        ></div>
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] transform transition-all duration-500 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${
            isDark
              ? "bg-gray-900 border-l border-gray-800"
              : "bg-white border-l border-gray-200"
          } overflow-y-auto custom-scrollbar`}
        >
          <div className="p-6 min-h-full flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  }`}
                >
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  StudySync AI
                </span>
              </div>
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile in Mobile Menu */}
            {isAuth && username && (
              <div className={`mb-8 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-3">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {username}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {email}
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                      {isPremium ? "Premium Member" : "Free Plan"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search Bar (Dashboard only) */}
            {isDashboard && isAuth && (
              <div className="mb-6">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link to="/">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Home className="w-5 h-5 text-emerald-500" />
                  <span>Home</span>
                </button>
              </Link>

              {isAuth && username && (
                <Link to="/dashboard">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                      isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <User className="w-5 h-5 text-emerald-500" />
                    <span>Dashboard</span>
                  </button>
                </Link>
              )}

              {isAuth && username && (
                <Link to="/courses">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                      isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    } ${location.pathname === '/courses' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-500' : ''}`}
                  >
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <span>Courses</span>
                  </button>
                </Link>
              )}

              <Link to="/features">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Search className="w-5 h-5 text-emerald-500" />
                  <span>Features</span>
                </button>
              </Link>
              
              <Link to="/about">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <span>About</span>
                </button>
              </Link>
              
              <Link to="/contact">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span>Contact</span>
                </button>
              </Link>
            </nav>

            {/* Mobile Auth Section */}
            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
              {isAuth && username ? (
                <div className="space-y-2">
                  {/* Settings */}
                  <button
                    className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                      isDark
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="w-5 h-5 text-emerald-500" />
                    <span>Settings</span>
                  </button>
                  
                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      setMode();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                      isDark
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-emerald-500" />
                    )}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                      isDark
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : "text-red-600 hover:text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/signin">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className={`w-full py-3 px-4 text-left rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-5 h-5" />
                      <span>Get Started</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for slide-down animation and custom scrollbars */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
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
    </>
  );
};

export default Header;