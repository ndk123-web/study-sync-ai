import React, { useState, useEffect } from "react";
import {
  Search,
  Play,
  BookOpen,
  Brain,
  FileText,
  TrendingUp,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Users,
  Award,
  Globe,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  // const [theme, setMode] = useState(() => {
  //   if (typeof window !== 'undefined') {
  //     return localStorage.getItem('mode') || 'light';
  //   }
  //   return 'light';
  // });

  // Zustand Config
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            if (entry.target.id === "stats-section") {
              setAnimatedStats(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Topic Search",
      description:
        "Search manually or ask AI to fetch resources intelligently with advanced algorithms",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "YouTube Transcript Fetcher",
      description:
        "Extract full transcripts from any YouTube video instantly with perfect accuracy",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI-Powered Summarizer",
      description:
        "Get comprehensive bullet-point summaries powered by advanced Gemini AI technology",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Chatbot Doubt Solver",
      description:
        "Ask concept doubts and get real-time AI responses with detailed explanations",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Note-Taking",
      description:
        "Save personal notes organized by topics with intelligent categorization",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracker",
      description:
        "Visual overview of your learning completion with detailed analytics",
    },
  ];

  const stats = [
    {
      number: "25K+",
      label: "Videos Processed",
      icon: <Play className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      number: "12K+",
      label: "Active Learners",
      icon: <Users className="w-6 h-6" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/10",
      shadowColor: "shadow-violet-500/20",
    },
    {
      number: "80K+",
      label: "AI Summaries",
      icon: <Brain className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      shadowColor: "shadow-amber-500/20",
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: <Award className="w-6 h-6" />,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500/10",
      shadowColor: "shadow-rose-500/20",
    },
  ];

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900"
      }`}
    >
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div
          className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          id="hero"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Learning with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse">
              AI-Powered
            </span>{" "}
            Study Tools
          </h1>
          <p
            className={`text-lg md:text-xl mb-8 leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            StudySync AI turns YouTube videos and study content into
            personalized learning experiences. Get summaries, quizzes, and track
            your progress with the power of Gemini AI.
          </p>
          <Link to={"/dashboard"}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 font-medium">
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-medium ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-white hover:shadow-lg"
                }`}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-20 ${isDark ? "bg-gray-800" : "bg-white"}`}
        id="stats-section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Students Worldwide
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Join thousands of learners who are already transforming their
              education with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-700 delay-${
                  index * 150
                } ${
                  animatedStats
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    stat.shadowColor
                  } ${
                    isDark
                      ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-gray-600"
                      : "bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 hover:border-gray-300"
                  }`}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-20 transition-all duration-500`}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${stat.bgColor} backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                  >
                    <div
                      className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-3 shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                  </div>

                  {/* Number */}
                  <div
                    className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-base md:text-lg font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {stat.label}
                  </div>

                  {/* Animated border */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-all duration-500 -z-10`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`container mx-auto px-4 py-16 md:py-24 ${
          isDark ? "" : "bg-gradient-to-br from-slate-50 to-blue-50"
        }`}
      >
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.features
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p
            className={`text-lg ${
              isDark ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Everything you need to transform your study sessions into efficient,
            AI-powered learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 delay-${
                index * 100
              } ${
                isVisible.features
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 hover:border-emerald-500"
                  : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-emerald-100"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                  isDark
                    ? "bg-emerald-900 text-emerald-400"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-section"
        className={`container mx-auto px-4 py-16 md:py-24 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl ${
            isDark
              ? "bg-gradient-to-r from-emerald-900 to-teal-900"
              : "bg-gradient-to-r from-emerald-50 to-teal-50"
          } border-2 ${isDark ? "border-emerald-800" : "border-emerald-200"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p
            className={`text-lg mb-8 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join thousands of students who are already learning smarter with
            StudySync AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-medium">
              Start Free Trial
            </button>
            <button
              className={`px-8 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 font-medium ${
                isDark
                  ? "border-gray-600 hover:bg-gray-800"
                  : "border-gray-300 hover:bg-white hover:shadow-lg"
              }`}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
