import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  BookOpen,
  Zap,
  ChevronRight,
  ChevronDown,
  Youtube,
  FileText,
  Brain,
  PieChart,
  Shield,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  Database,
  Code,
  Lightbulb,
  Star,
  Heart,
  Users,
  Award,
  Rocket,
  Target,
  Globe,
  Download,
  Upload,
  PlayCircle,
  PenTool,
  BarChart3,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Bookmark,
  Tag,
  Filter,
  Calendar,
  Folder,
  File,
  Link,
  ExternalLink,
  ArrowRight,
  Plus,
  Minus,
  X,
  Home,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/Header";
import { Helmet } from "react-helmet";

const HelpSupport = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // FAQ Categories and Data
  const faqCategories = [
    {
      id: "all",
      label: "All Topics",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: "getting-started",
      label: "Getting Started",
      icon: <Rocket className="w-4 h-4" />,
    },
    { id: "features", label: "Features", icon: <Star className="w-4 h-4" /> },
    {
      id: "account",
      label: "Account & Auth",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "ai-features",
      label: "AI Features",
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: "technical",
      label: "Technical Issues",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const faqData = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I get started with StudySync AI?",
      answer:
        "Getting started is easy! Simply sign up using your Google or GitHub account, browse our course catalog, and enroll in any course that interests you. Once enrolled, you can watch videos, take notes, chat with AI, and track your progress.",
      tags: ["beginner", "signup", "enrollment"],
    },
    {
      id: 2,
      category: "features",
      question:
        "What makes StudySync AI different from other learning platforms?",
      answer:
        "StudySync AI transforms YouTube videos into personalized learning experiences. Our AI-powered features include automatic transcript extraction, intelligent summaries, contextual chat assistance, smart note-taking with markdown support, and comprehensive progress tracking.",
      tags: ["ai", "unique", "features"],
    },
    {
      id: 3,
      category: "ai-features",
      question: "How does the AI chat assistant work?",
      answer:
        "Our AI chat assistant is context-aware and can answer questions about the specific course content you're studying. It uses advanced language models to provide relevant explanations, examples, and clarifications based on the video transcripts and course materials.",
      tags: ["ai", "chat", "context"],
    },
    {
      id: 4,
      category: "features",
      question: "Can I take notes while watching videos?",
      answer:
        "Yes! StudySync AI features a real-time markdown editor with live preview and syntax highlighting. You can take notes while watching videos, and our AI can even help you organize and summarize your notes.",
      tags: ["notes", "markdown", "real-time"],
    },
    {
      id: 5,
      category: "account",
      question: "How do I track my learning progress?",
      answer:
        "Our analytics dashboard provides comprehensive progress tracking across all your courses. You can view completion rates, time spent learning, quiz scores, and learning trends with beautiful visualizations.",
      tags: ["progress", "analytics", "dashboard"],
    },
    {
      id: 6,
      category: "technical",
      question: "What browsers are supported?",
      answer:
        "StudySync AI works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome or Firefox with JavaScript enabled.",
      tags: ["browser", "compatibility", "technical"],
    },
    {
      id: 7,
      category: "features",
      question: "Can I use StudySync AI on mobile devices?",
      answer:
        "Yes! StudySync AI is fully responsive and works great on smartphones and tablets. The interface adapts to your screen size, ensuring a seamless learning experience across all devices.",
      tags: ["mobile", "responsive", "devices"],
    },
    {
      id: 8,
      category: "ai-features",
      question: "How accurate are the AI-generated summaries?",
      answer:
        "Our AI summaries are generated using advanced language models and are highly accurate. However, we always recommend reviewing the original content for critical information. The AI continuously improves based on user feedback.",
      tags: ["accuracy", "summaries", "ai"],
    },
    {
      id: 9,
      category: "account",
      question: "Is my data secure and private?",
      answer:
        "Absolutely! We use Firebase Authentication for secure login, and all data is encrypted both in transit and at rest. We follow industry best practices for data protection and never share your personal information with third parties.",
      tags: ["security", "privacy", "data"],
    },
    {
      id: 10,
      category: "technical",
      question: "What should I do if I encounter a bug or error?",
      answer:
        "If you encounter any issues, please contact our support team through the contact form below or check our GitHub repository for known issues. Include as much detail as possible, including browser type, error messages, and steps to reproduce the issue.",
      tags: ["bugs", "errors", "support"],
    },
  ];

  const features = [
    {
      title: "AI-Powered Learning",
      description:
        "Transform YouTube videos into personalized learning experiences with AI summaries and contextual chat assistance.",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Smart Note-Taking",
      description:
        "Real-time markdown editor with live preview and syntax highlighting for efficient note organization.",
      icon: <PenTool className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Progress Analytics",
      description:
        "Comprehensive dashboard with learning trends, completion rates, and performance visualizations.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Secure Authentication",
      description:
        "Firebase-powered OAuth integration with Google and GitHub for secure, hassle-free access.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  const quickActions = [
    {
      title: "Browse Courses",
      description: "Explore our course catalog",
      icon: <BookOpen className="w-5 h-5" />,
      link: "/courses",
      color: "bg-blue-500",
    },
    {
      title: "Dashboard",
      description: "View your learning progress",
      icon: <BarChart3 className="w-5 h-5" />,
      link: "/dashboard",
      color: "bg-green-500",
    },
    {
      title: "PDF Learning",
      description: "Study with documents",
      icon: <FileText className="w-5 h-5" />,
      link: "/pdf-learning",
      color: "bg-purple-500",
    },
    {
      title: "Video Learning",
      description: "Learn from YouTube videos",
      icon: <Youtube className="w-5 h-5" />,
      link: "/video-learning",
      color: "bg-red-500",
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Support",
      value: "support@studysync.ai",
      description: "Get help via email",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "GitHub Repository",
      value: "github.com/ndk123-web/study-sync-ai",
      description: "Report issues & contribute",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Response Time",
      value: "24-48 hours",
      description: "Typical support response",
    },
  ];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      <Helmet>
        <title>Help & Support | StudySyncAI</title>
        <meta
          name="description"
          content="Get in touch with StudySync AI for any inquiries, support, or feedback. We're here to help you on your learning journey."
        />
      </Helmet>

      <Header />
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-white via-gray-50 to-white"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
                } shadow-2xl`}
              >
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1
              className={`text-4xl lg:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Help & Support
            </h1>
            <p
              className={`text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Welcome to StudySync AI support center. Find answers, get help,
              and learn how to make the most of your AI-powered learning
              experience.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 text-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/20`}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <RouterLink
                  key={index}
                  to={action.link}
                  className={`${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  } border rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group`}
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <h3
                    className={`font-semibold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {action.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {action.description}
                  </p>
                </RouterLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Powerful Features
          </h2>
          <p
            className={`text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            Discover what makes StudySync AI the ultimate learning platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 text-white`}
              >
                {feature.icon}
              </div>
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`${
                  isDark ? "text-gray-400" : "text-gray-600"
                } leading-relaxed`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Frequently Asked Questions
          </h2>
          <p
            className={`text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            Find quick answers to common questions about StudySync AI
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : `${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className={`w-full p-6 text-left flex items-center justify-between hover:${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                } transition-colors duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${
                      expandedFaq === faq.id
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : `${isDark ? "bg-gray-700" : "bg-gray-100"}`
                    } flex items-center justify-center transition-all duration-200`}
                  >
                    <HelpCircle
                      className={`w-4 h-4 ${
                        expandedFaq === faq.id
                          ? "text-white"
                          : `${isDark ? "text-gray-400" : "text-gray-600"}`
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {faq.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    expandedFaq === faq.id ? "rotate-180" : ""
                  } ${isDark ? "text-gray-400" : "text-gray-600"}`}
                />
              </button>

              {expandedFaq === faq.id && (
                <div
                  className={`px-6 pb-6 ${
                    isDark ? "bg-gray-700/30" : "bg-gray-50/50"
                  }`}
                >
                  <div className="ml-12">
                    <p
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } leading-relaxed`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No results found
            </h3>
            <p className={`${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div
        className={`${isDark ? "bg-gray-800" : "bg-white"} border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Still Need Help?
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              Our support team is here to help you succeed with StudySync AI
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white`}
                >
                  {info.icon}
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {info.label}
                </h3>
                <p
                  className={`font-medium mb-1 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  {info.value}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {info.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              } border rounded-2xl p-8`}
            >
              <h3
                className={`text-2xl font-bold mb-6 text-center ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Send us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 resize-none ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="Describe your issue or question in detail..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`${
          isDark ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"
        } border-t`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  }`}
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  StudySync AI
                </span>
              </div>
              <p
                className={`${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-4 max-w-md`}
              >
                Transform your learning experience with AI-powered tools,
                intelligent summaries, and personalized progress tracking.
              </p>
              <div className="flex space-x-4">
                <div
                  className={`w-10 h-10 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  } rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200`}
                >
                  <Globe
                    className={`w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </div>
                <div
                  className={`w-10 h-10 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  } rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200`}
                >
                  <Code
                    className={`w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Dashboard", link: "/dashboard" },
                  { label: "Courses", link: "/courses" },
                  { label: "PDF Learning", link: "/pdf-learning" },
                  { label: "Video Learning", link: "/video-learning" },
                ].map((item, index) => (
                  <RouterLink
                    key={index}
                    to={item.link}
                    className={`block ${
                      isDark
                        ? "text-gray-400 hover:text-emerald-400"
                        : "text-gray-600 hover:text-emerald-600"
                    } transition-colors duration-200`}
                  >
                    {item.label}
                  </RouterLink>
                ))}
              </div>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Support
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Help Center", link: "#" },
                  { label: "Contact Us", link: "#contact" },
                  {
                    label: "GitHub Issues",
                    link: "https://github.com/ndk123-web/study-sync-ai/issues",
                  },
                  { label: "Documentation", link: "#" },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className={`block ${
                      isDark
                        ? "text-gray-400 hover:text-emerald-400"
                        : "text-gray-600 hover:text-emerald-600"
                    } transition-colors duration-200`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`border-t ${
              isDark ? "border-gray-800" : "border-gray-200"
            } mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center`}
          >
            <p
              className={`${
                isDark ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              © 2025 StudySync AI. Built with ❤️ by Navnath & Sahil
            </p>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a
                href="#"
                className={`${
                  isDark
                    ? "text-gray-400 hover:text-emerald-400"
                    : "text-gray-600 hover:text-emerald-600"
                } text-sm transition-colors duration-200`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`${
                  isDark
                    ? "text-gray-400 hover:text-emerald-400"
                    : "text-gray-600 hover:text-emerald-600"
                } text-sm transition-colors duration-200`}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
