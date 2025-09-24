import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Activity,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Home,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Bell,
  PlayCircle,
  FileText,
  Video,
  Eye,
  CheckCircle,
  GraduationCap,
  Monitor,
  PieChart,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";
import CryptoJs from "crypto-js";
import Header from "../components/Header";
import * as Recharts from "recharts";
import {
  GetAdminStatsControllerApi,
  GetAdminSpecificControllerApi,
} from "../api/AdminApis";

const AdminDashboard = () => {
  // Theme and auth
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const setMode = useThemeStore((state) => state.setMode);
  const { isAuth, removeAuth } = useIsAuth();
  const { username, logoutUser } = useUserStore();

  const isDark = theme === "dark";

  // State for year selection
  const [selectedYear, setSelectedYear] = useState(2025);

  const Loader = () => {};

  // Simple admin stats
  const [adminStats, setAdminStats] = useState({
    totalUsers: "Loading...",
    totalCourses: "Loading...",
    totalEnrollments: "Loading...",
    totalCompletions: "Loading...",
    completionRate: "Loading...",

    // Enrollment breakdown by type
    enrollmentBreakdown: {
      courses: 2145,
      videos: 856,
      pdfs: 455,
    },

    // Individual course data with user counts
    courseData: [
      {
        id: 1,
        name: "Complete React Development",
        category: "Frontend",
        totalUsers: 456,
        completedUsers: 312,
        activeUsers: 144,
        completionRate: 68,
        difficulty: "Intermediate",
      },
      {
        id: 2,
        name: "Python Programming Fundamentals",
        category: "Programming",
        totalUsers: 387,
        completedUsers: 289,
        activeUsers: 98,
        completionRate: 75,
        difficulty: "Beginner",
      },
      {
        id: 3,
        name: "Data Science & Machine Learning",
        category: "AI/ML",
        totalUsers: 324,
        completedUsers: 145,
        activeUsers: 179,
        completionRate: 45,
        difficulty: "Advanced",
      },
      {
        id: 4,
        name: "JavaScript ES6+ Complete Guide",
        category: "Programming",
        totalUsers: 298,
        completedUsers: 198,
        activeUsers: 100,
        completionRate: 66,
        difficulty: "Intermediate",
      },
      {
        id: 5,
        name: "Node.js Backend Development",
        category: "Backend",
        totalUsers: 267,
        completedUsers: 89,
        activeUsers: 178,
        completionRate: 33,
        difficulty: "Intermediate",
      },
      {
        id: 6,
        name: "Flutter Mobile App Development",
        category: "Mobile",
        totalUsers: 234,
        completedUsers: 156,
        activeUsers: 78,
        completionRate: 67,
        difficulty: "Intermediate",
      },
    ],

    // Topic-wise enrollments data
    topicWiseData: [
      {
        topic: "React Development",
        enrollments: 856,
        courses: 3,
        completions: 421,
      },
      {
        topic: "Python Programming",
        enrollments: 743,
        courses: 2,
        completions: 489,
      },
      {
        topic: "Data Science & AI",
        enrollments: 612,
        courses: 2,
        completions: 145,
      },
      {
        topic: "JavaScript Fundamentals",
        enrollments: 534,
        courses: 2,
        completions: 298,
      },
      {
        topic: "Node.js Backend",
        enrollments: 423,
        courses: 1,
        completions: 89,
      },
      {
        topic: "Flutter Mobile Dev",
        enrollments: 288,
        courses: 2,
        completions: 156,
      },
    ],

    // User activity over time by year
    userActivityData: {
      2024: [
        { month: "Jan", newUsers: 89, enrollments: 234, completions: 67 },
        { month: "Feb", newUsers: 124, enrollments: 289, completions: 89 },
        { month: "Mar", newUsers: 156, enrollments: 367, completions: 123 },
        { month: "Apr", newUsers: 198, enrollments: 445, completions: 156 },
        { month: "May", newUsers: 234, enrollments: 512, completions: 198 },
        { month: "Jun", newUsers: 267, enrollments: 589, completions: 234 },
        { month: "Jul", newUsers: 289, enrollments: 645, completions: 267 },
        { month: "Aug", newUsers: 312, enrollments: 712, completions: 298 },
        { month: "Sep", newUsers: 345, enrollments: 789, completions: 334 },
        { month: "Oct", newUsers: 378, enrollments: 856, completions: 367 },
        { month: "Nov", newUsers: 412, enrollments: 923, completions: 398 },
        { month: "Dec", newUsers: 445, enrollments: 998, completions: 429 },
      ],
      2025: [
        { month: "Jan", newUsers: 156, enrollments: 345, completions: 123 },
        { month: "Feb", newUsers: 189, enrollments: 412, completions: 156 },
        { month: "Mar", newUsers: 223, enrollments: 489, completions: 189 },
        { month: "Apr", newUsers: 267, enrollments: 567, completions: 223 },
        { month: "May", newUsers: 298, enrollments: 645, completions: 267 },
        { month: "Jun", newUsers: 334, enrollments: 723, completions: 298 },
        { month: "Jul", newUsers: 367, enrollments: 801, completions: 334 },
        { month: "Aug", newUsers: 398, enrollments: 879, completions: 367 },
        { month: "Sep", newUsers: 429, enrollments: 957, completions: 398 },
      ],
    },

    availableYears: [2024, 2025],

    // Course completion rates
    completionRateData: [
      { category: "Beginner", completed: 75, inProgress: 25 },
      { category: "Intermediate", completed: 58, inProgress: 42 },
      { category: "Advanced", completed: 35, inProgress: 65 },
    ],

    // Recent user activities
    recentActivity: [
      {
        user: "Alice Johnson",
        action: "enrolled in React Advanced",
        time: "2 min ago",
        type: "enrollment",
      },
      {
        user: "Bob Smith",
        action: "completed Python Basics",
        time: "5 min ago",
        type: "completion",
      },
      {
        user: "Carol Davis",
        action: "started Data Science course",
        time: "8 min ago",
        type: "enrollment",
      },
      {
        user: "David Wilson",
        action: "enrolled in Flutter course",
        time: "12 min ago",
        type: "enrollment",
      },
      {
        user: "Emma Brown",
        action: "completed JS Fundamentals",
        time: "15 min ago",
        type: "completion",
      },
    ],
  });

  // Auth check
  useEffect(() => {
    if (!isAuth) {
      window.location.href = "/signin";
    }
    // TODO: Add admin role check here
    // const userRole = localStorage.getItem('userRole');
    // if (userRole !== 'admin') {
    //   window.location.href = "/dashboard";
    // }
  }, [isAuth]);

  useEffect(() => {
    const fetchAdminStatsCards = async () => {
      try {
        const apiResponse = await GetAdminStatsControllerApi();
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("Error in fetching admin stats cards: ", apiResponse);
          return;
        }
        console.log("Admin stats cards apiResponse: ", apiResponse);
        setAdminStats((prev) => ({
          ...prev,
          totalUsers: apiResponse?.totalUsers || 0,
          totalCourses: apiResponse?.totalCourses || 0,
          totalEnrollments: apiResponse?.totalEnrollments || 0,
          totalCompletions: apiResponse?.totalCompletions || 0,
          completionRate: apiResponse?.completionRate || 0,
        }));
      } catch (err) {
        console.log("Err in Getting Admin Stats Cards: ", err.message);
      }
    };

    fetchAdminStatsCards();
  }, []);

  useEffect(() => {
    const fetchAdminSpecificStats = async () => {
      try {
        const apiResponse = await GetAdminSpecificControllerApi();
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("Error in fetching admin specific stats: ", apiResponse);
          return;
        }
        console.log("Admin specific stats apiResponse: ", apiResponse);
        setAdminStats((prev) => ({
          ...prev,
          enrollmentBreakdown: {
            courses: apiResponse?.userSpecificCourses || 0,
            videos: apiResponse?.userSpecificVideos || 0,
            pdfs: apiResponse?.userSpecificPdfs || 0,
          },
        }));
      } catch (err) {
        console.log("Err in Getting Admin Specific Stats: ", err.message);
      }
    };

    fetchAdminSpecificStats();
  }, []);

  const handleLogout = () => {
    removeAuth();
    logoutUser();
  };

  // Chart tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div
        className={`px-3 py-2 rounded-lg border shadow-lg ${
          isDark
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        {label && <div className="text-xs font-semibold mb-1">{label}</div>}
        {payload.map((item, idx) => (
          <div key={idx} className="text-xs flex items-center space-x-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}: </span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Chart container
  const ChartContainer = ({ children, height = 300 }) => (
    <div style={{ width: "100%", height }}>
      <Recharts.ResponsiveContainer width="100%" height="100%">
        {children}
      </Recharts.ResponsiveContainer>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Use existing Header component */}
      <Header />

      {/* Main Content - Fixed spacing issue */}
      <main className="pt-4">
        <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Admin Dashboard
                </h1>
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  StudySync AI Platform Overview
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Users */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-1`}
              >
                Total Users
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {adminStats.totalUsers.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Registered users
              </p>
            </div>

            {/* Total Courses */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+3</span>
                </div>
              </div>
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-1`}
              >
                Total Courses
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {adminStats.totalCourses}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Available courses
              </p>
            </div>

            {/* Total Enrollments */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+18%</span>
                </div>
              </div>
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-1`}
              >
                Total Enrollments
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {adminStats.totalEnrollments.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Course enrollments
              </p>
            </div>

            {/* Total Completions */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+22%</span>
                </div>
              </div>
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-1`}
              >
                Completions
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {adminStats.totalCompletions.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Course completions
              </p>
            </div>

            {/* Completion Rate */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+5%</span>
                </div>
              </div>
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mb-1`}
              >
                Completion Rate
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {adminStats?.completionRate}%
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Average completion
              </p>
            </div>
          </div>

          {/* Enrollment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Course Enrollments
              </h3>
              <p className={`text-3xl font-bold text-blue-500 mb-2`}>
                {adminStats.enrollmentBreakdown.courses}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Students enrolled in structured courses
              </p>
            </div>

            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-red-500" />
              </div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Video Learning
              </h3>
              <p className={`text-3xl font-bold text-red-500 mb-2`}>
                {adminStats.enrollmentBreakdown.videos}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                YouTube video interactions
              </p>
            </div>

            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                PDF Learning
              </h3>
              <p className={`text-3xl font-bold text-purple-500 mb-2`}>
                {adminStats.enrollmentBreakdown.pdfs}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                PDF document interactions
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* User Activity Chart */}
            <div className="lg:col-span-2">
              <div
                className={`${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-2xl p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      } flex items-center space-x-2`}
                    >
                      <BarChart3 className="w-6 h-6 text-blue-500" />
                      <span>User Activity Trends</span>
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mt-1`}
                    >
                      Monthly overview of user registrations, enrollments, and
                      completions for {selectedYear}
                    </p>
                  </div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {adminStats.availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <ChartContainer height={300}>
                  <Recharts.LineChart
                    data={adminStats.userActivityData[selectedYear]}
                  >
                    <Recharts.CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#374151" : "#E5E7EB"}
                    />
                    <Recharts.XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                        fill: isDark ? "#9CA3AF" : "#6B7280",
                      }}
                      axisLine={{ stroke: isDark ? "#374151" : "#E5E7EB" }}
                    />
                    <Recharts.YAxis
                      tick={{
                        fontSize: 12,
                        fill: isDark ? "#9CA3AF" : "#6B7280",
                      }}
                      axisLine={{ stroke: isDark ? "#374151" : "#E5E7EB" }}
                    />
                    <Recharts.Tooltip content={<CustomTooltip />} />
                    <Recharts.Legend />
                    <Recharts.Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3B82F6" }}
                      name="New Users"
                    />
                    <Recharts.Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10B981" }}
                      name="Enrollments"
                    />
                    <Recharts.Line
                      type="monotone"
                      dataKey="completions"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#F59E0B" }}
                      name="Completions"
                    />
                  </Recharts.LineChart>
                </ChartContainer>
              </div>
            </div>

            {/* Platform Quick Stats */}
            <div className="lg:col-span-1">
              <div
                className={`${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-2xl p-6`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      } flex items-center space-x-2`}
                    >
                      <Zap className="w-6 h-6 text-purple-500" />
                      <span>Platform Insights</span>
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mt-1`}
                    >
                      Key platform statistics and metrics
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Top Performing Course */}
                  <div
                    className={`p-4 rounded-xl ${
                      isDark
                        ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-800/50"
                        : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-green-300" : "text-green-700"
                        }`}
                      >
                        🏆 Top Performing Course
                      </span>
                    </div>
                    <h4
                      className={`font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      } mb-1`}
                    >
                      Python Programming Fundamentals
                    </h4>
                    <p
                      className={`text-sm ${
                        isDark ? "text-green-400" : "text-green-600"
                      } font-semibold`}
                    >
                      75% completion rate • 387 students
                    </p>
                  </div>

                  {/* Most Popular Topic */}
                  <div
                    className={`p-4 rounded-xl ${
                      isDark
                        ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/50"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        🔥 Most Popular Topic
                      </span>
                    </div>
                    <h4
                      className={`font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      } mb-1`}
                    >
                      React Development
                    </h4>
                    <p
                      className={`text-sm ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      } font-semibold`}
                    >
                      856 enrollments • 3 courses
                    </p>
                  </div>

                  {/* Growth Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-lg text-center ${
                        isDark
                          ? "bg-purple-900/30 border border-purple-800/50"
                          : "bg-purple-50 border border-purple-200"
                      }`}
                    >
                      <p
                        className={`text-lg font-bold ${
                          isDark ? "text-purple-300" : "text-purple-600"
                        }`}
                      >
                        +22%
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        Monthly Growth
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-center ${
                        isDark
                          ? "bg-orange-900/30 border border-orange-800/50"
                          : "bg-orange-50 border border-orange-200"
                      }`}
                    >
                      <p
                        className={`text-lg font-bold ${
                          isDark ? "text-orange-300" : "text-orange-600"
                        }`}
                      >
                        4.7★
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-orange-400" : "text-orange-600"
                        }`}
                      >
                        Avg Rating
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {/* <div className="space-y-2">
                    <button className={`w-full p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${isDark ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200" : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">📊 View Detailed Analytics</span>
                        <Eye className="w-4 h-4" />
                      </div>
                    </button>
                    <button className={`w-full p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${isDark ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200" : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">📈 Export Reports</span>
                        <ArrowUp className="w-4 h-4" />
                      </div>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Individual Course Statistics */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    } flex items-center space-x-2`}
                  >
                    <Monitor className="w-6 h-6 text-emerald-500" />
                    <span>Course Performance</span>
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } mt-1`}
                  >
                    Detailed statistics for each course
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {adminStats.courseData.map((course, index) => (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? "border-gray-700 bg-gray-700/30"
                        : "border-gray-200 bg-gray-50"
                    } hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-1`}
                        >
                          {course.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDark
                                ? "bg-blue-900/30 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {course.category}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              course.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : course.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {course.totalUsers}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          total users
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <p
                          className={`text-sm font-semibold ${
                            isDark ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {course.completedUsers}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Completed
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-sm font-semibold ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {course.activeUsers}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Active
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-sm font-semibold ${
                            isDark ? "text-purple-400" : "text-purple-600"
                          }`}
                        >
                          {course.completionRate}%
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Rate
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    } flex items-center space-x-2`}
                  >
                    <Activity className="w-6 h-6 text-green-500" />
                    <span>Recent Activity</span>
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } mt-1`}
                  >
                    Latest user activities on the platform
                  </p>
                </div>
                <button
                  className={`p-2 rounded-lg ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {adminStats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl border ${
                      isDark
                        ? "border-gray-700 bg-gray-700/30"
                        : "border-gray-200 bg-gray-50"
                    } hover:shadow-md transition-all duration-200`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "enrollment"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      {activity.type === "enrollment" ? (
                        <BookOpen
                          className={`w-5 h-5 ${
                            activity.type === "enrollment"
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <span className="text-blue-500">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {activity.time}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.type === "enrollment"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      {activity.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Topic-wise Analytics */}
          <div
            className={`mt-8 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  } flex items-center space-x-2`}
                >
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <span>Topic-wise Performance Analytics</span>
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } mt-1`}
                >
                  Comprehensive overview of enrollments and completions by topic
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {adminStats.topicWiseData.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border ${
                    isDark
                      ? "border-gray-700 bg-gray-700/30"
                      : "border-gray-200 bg-gray-50"
                  } hover:shadow-lg transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className={`font-bold text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.topic}
                    </h4>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        isDark
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.courses} courses
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Enrollments
                      </span>
                      <span
                        className={`font-semibold ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {item.enrollments.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Completions
                      </span>
                      <span
                        className={`font-semibold ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {item.completions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Completion Rate
                      </span>
                      <span
                        className={`font-semibold ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        {Math.round(
                          (item.completions / item.enrollments) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Progress
                      </span>
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        {Math.round(
                          (item.completions / item.enrollments) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div
                      className={`w-full h-3 rounded-full ${
                        isDark ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (item.completions / item.enrollments) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Logic Note */}
          <div
            className={`mt-8 p-6 rounded-2xl border-2 border-dashed ${
              isDark
                ? "border-gray-600 bg-gray-800/50"
                : "border-gray-300 bg-gray-50/50"
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Revenue Model Logic (For Future Implementation)
                </h3>
                <div
                  className={`space-y-2 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p>
                    <strong>Option 1:</strong> Premium Subscription - Users pay
                    monthly/yearly for premium features
                  </p>
                  <p>
                    <strong>Option 2:</strong> Course Certificates - Charge for
                    verified certificates after course completion
                  </p>
                  <p>
                    <strong>Option 3:</strong> Advanced AI Features - Premium AI
                    tutoring, personalized learning paths
                  </p>
                  <p>
                    <strong>Option 4:</strong> Corporate Training - Bulk
                    enrollment packages for companies
                  </p>
                  <p className="pt-2 text-xs opacity-75">
                    Currently all courses are free. Revenue tracking will be
                    implemented based on chosen monetization strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
