import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={"/"}>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  } shadow-lg`}
                >
                  <Zap className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
                </div>
              </Link>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  StudySync AI
                </span>
                <div className="text-xs text-gray-500">Learn Smarter</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo("features")}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => smoothScrollTo("stats-section")}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                About
              </button>
              <button
                onClick={() => smoothScrollTo("cta-section")}
                className={`hover:text-emerald-500 transition-all duration-300 transform hover:scale-105 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 text-gray-300"
                    : "hover:bg-gray-100 bg-gray-100/50 text-gray-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <button
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Sign In
                </button>

                <Link to={"/signup"}>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
                    Get Started
                  </button>
                </Link>
              </div>

              <button
                onClick={toggleMenu}
                className={`md:hidden p-3 rounded-xl transition-all duration-300 ${
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
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
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

            <nav className="space-y-2">
              <button
                onClick={() => {
                  smoothScrollTo("features");
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => {
                  smoothScrollTo("stats-section");
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                About
              </button>
              <button
                onClick={() => {
                  smoothScrollTo("cta-section");
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Contact
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                className={`w-full py-3 px-4 text-left rounded-lg transition-all duration-300 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Sign In
              </button>
              <button className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
