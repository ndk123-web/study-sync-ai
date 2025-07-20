import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Zap, User, LogOut, Home, Search, BookOpen, MessageCircle } from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";
import CryptoJs from "crypto-js";
import { Link } from "react-router-dom";

const Header = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode = useThemeStore((state) => state.setMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Auth and User states
  const isAuth = useIsAuth((state) => state.isAuth);
  const removeAuth = useIsAuth((state) => state.removeAuth);
  const user = useUserStore((state) => state);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const handleLogout = () => {
    removeAuth();
    logoutUser();
    setIsMenuOpen(false);
  };

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
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
                {isAuth && user.name ? (
                  <>
                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {user.photoURL ? (
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
                        <div className="text-left">
                          <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {user.name}
                          </div>
                          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {user.isPremium ? "Premium" : "Free"}
                          </div>
                        </div>
                      </div>
                      
                      <Link to="/dashboard">
                        <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}>
                          Dashboard
                        </button>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
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

              {/* Mobile User Avatar (Only show if authenticated) */}
              {isAuth && user.name && (
                <div className="flex lg:hidden items-center space-x-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {user.name.split(' ')[0]}
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
          }`}
        >
          <div className="p-6">
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
            {isAuth && user.name && (
              <div className={`mb-8 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {user.name}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {user.email}
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                      {user.isPremium ? "Premium Member" : "Free Plan"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link to="/">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Home className="w-5 h-5 text-emerald-500" />
                  <span>Home</span>
                </button>
              </Link>

              {isAuth && user.name && (
                <Link to="/dashboard">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
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

              <Link to="/features">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
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
                  className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
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
                  className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center space-x-3 ${
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
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {isAuth && user.name ? (
                <button
                  onClick={handleLogout}
                  className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                    isDark
                      ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      : "text-red-600 hover:text-red-700 hover:bg-red-100"
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <Link to="/signin">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 flex items-center space-x-3 ${
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
                      className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
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
    </>
  );
};

export default Header;