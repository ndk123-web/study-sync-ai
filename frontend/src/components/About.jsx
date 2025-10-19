import React, { useEffect, useState } from "react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";
import {
  Users,
  TrendingUp,
  Clock,
  Brain,
  Rocket,
  Target,
  Shield,
  Zap,
  Heart,
  Award,
  Globe,
  CheckCircle,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

const About = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>About | StudySyncAI</title>
        <meta
          name="description"
          content="Learn more about StudySync AI, our mission, vision, and how we're revolutionizing education through artificial intelligence and personalized learning experiences."
        />
      </Helmet>
      
      <Header />
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Hero Section */}
        <div
          className={`relative py-24 ${
            isDark
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900"
              : "bg-gradient-to-br from-emerald-50 via-white to-teal-50"
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div
            className={`relative container mx-auto px-4 text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-bounce">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              About StudySync AI
            </h1>
            <p
              className={`text-xl md:text-2xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Revolutionizing education through artificial intelligence and
              personalized learning experiences
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          {/* Mission Section */}
          <div
            className={`grid lg:grid-cols-2 gap-16 items-center mb-20 transition-all duration-1000 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p
                className={`text-lg mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                At StudySync AI, we believe that every student deserves a
                personalized learning experience. Our mission is to harness the
                power of artificial intelligence to create adaptive, intelligent
                study tools that grow with each learner.
              </p>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                We're committed to making quality education accessible,
                engaging, and effective for students around the world.
              </p>

              <div className="mt-8 flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <span
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Trusted by 50,000+ learners worldwide
                </span>
              </div>
            </div>

            <div
              className={`p-10 rounded-3xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-2xl border ${
                isDark ? "border-gray-700" : "border-gray-100"
              } hover:scale-105 transition-all duration-500 group`}
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 group-hover:text-emerald-500 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Smart Learning
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  AI-powered adaptive learning that understands your unique
                  needs and learning patterns
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div
            className={`grid md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-900 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div
              className={`text-center p-8 rounded-3xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:scale-105 transition-all duration-300 group`}
            >
              <Users className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-5xl font-bold text-emerald-500 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                50K+
              </div>
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Active Students
              </p>
            </div>

            <div
              className={`text-center p-8 rounded-3xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:scale-105 transition-all duration-300 group`}
            >
              <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-5xl font-bold text-emerald-500 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                95%
              </div>
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Success Rate
              </p>
            </div>

            <div
              className={`text-center p-8 rounded-3xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:scale-105 transition-all duration-300 group`}
            >
              <Clock className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-5xl font-bold text-emerald-500 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                24/7
              </div>
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                AI Support
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div
            className={`p-12 rounded-3xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-2xl border ${
              isDark ? "border-gray-700" : "border-gray-100"
            } transition-all duration-1000 delay-1100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Why Choose StudySync AI?
              </h2>
              <p
                className={`text-xl ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } max-w-3xl mx-auto`}
              >
                Experience the future of learning with our cutting-edge
                technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 group-hover:text-emerald-500 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Intelligent
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  AI adapts to your unique learning style and preferences
                </p>
              </div>

              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 group-hover:text-emerald-500 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Fast
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  Quick setup and instant results for immediate progress
                </p>
              </div>

              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 group-hover:text-emerald-500 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Accurate
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  Precise assessments and personalized feedback
                </p>
              </div>

              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 group-hover:text-emerald-500 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Secure
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div
            className={`mt-20 text-center transition-all duration-1000 delay-1300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div
              className={`p-12 rounded-3xl ${
                isDark
                  ? "bg-gradient-to-br from-emerald-900/30 to-teal-900/30"
                  : "bg-gradient-to-br from-emerald-50 to-teal-50"
              } border ${isDark ? "border-emerald-800" : "border-emerald-200"}`}
            >
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our Vision for the Future
              </h2>
              <p
                className={`text-xl ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } max-w-4xl mx-auto leading-relaxed`}
              >
                We envision a world where personalized AI-powered education is
                accessible to everyone, breaking down barriers and unlocking
                human potential through intelligent learning experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
