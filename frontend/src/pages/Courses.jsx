import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronRight,
  Award,
  Zap,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJS from "crypto-js";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { getAllCoursesApi } from "../api/GetAllCoursesApi.js";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.js";

const Courses = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const auth = getAuth(app);

  const [courses, setCourses] = useState([]);

  // Sample courses data - replace with your DB data
  const sample_courses = [
    {
      id: 1,
      title: "Complete React Hooks Masterclass",
      instructor: "John Developer",
      category: "Frontend",
      level: "Intermediate",
      duration: "8 hours",
      students: "45,234",
      rating: 4.9,
      price: "$99",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      description:
        "Master React Hooks with hands-on projects and real-world examples.",
      lessons: 24,
      lastUpdated: "2025-01-15",
      featured: true,
    },
    {
      id: 2,
      title: "Full Stack JavaScript Development",
      instructor: "Sarah Code",
      category: "Full Stack",
      level: "Advanced",
      duration: "12 hours",
      students: "32,156",
      rating: 4.8,
      price: "$149",
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      description:
        "Build complete web applications with Node.js, React, and MongoDB.",
      lessons: 36,
      lastUpdated: "2025-01-10",
      featured: false,
    },
    {
      id: 3,
      title: "Python for Data Science",
      instructor: "Dr. Data Smith",
      category: "Data Science",
      level: "Beginner",
      duration: "15 hours",
      students: "67,891",
      rating: 4.7,
      price: "$79",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
      description:
        "Learn Python programming for data analysis and machine learning.",
      lessons: 42,
      lastUpdated: "2025-01-12",
      featured: true,
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Designer",
      category: "Design",
      level: "Beginner",
      duration: "6 hours",
      students: "23,445",
      rating: 4.6,
      price: "$69",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      description:
        "Create beautiful and user-friendly interfaces with modern design principles.",
      lessons: 18,
      lastUpdated: "2025-01-08",
      featured: false,
    },
    {
      id: 5,
      title: "Machine Learning with TensorFlow",
      instructor: "Prof. AI Johnson",
      category: "AI/ML",
      level: "Advanced",
      duration: "20 hours",
      students: "18,923",
      rating: 4.9,
      price: "$199",
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      description:
        "Deep dive into machine learning algorithms and neural networks.",
      lessons: 48,
      lastUpdated: "2025-01-14",
      featured: true,
    },
    {
      id: 6,
      title: "Mobile App Development with React Native",
      instructor: "Mike Mobile",
      category: "Mobile",
      level: "Intermediate",
      duration: "10 hours",
      students: "29,567",
      rating: 4.5,
      price: "$119",
      thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
      description: "Build cross-platform mobile apps for iOS and Android.",
      lessons: 30,
      lastUpdated: "2025-01-09",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Full Stack",
    "Data Science",
    "AI/ML",
    "Mobile",
    "Design",
    "DevOps",
    "Cybersecurity",
    "Languages",
    "Git And GitHub",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourses(sample_courses)
        const apiResponse = await getAllCoursesApi();
        console.log("apiResponse: ", apiResponse);
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          alert("Failed to fetch courses: " + apiResponse.message);
          return;
        }
        console.log(apiResponse.data);
        setCourses((prev) => (
          [...apiResponse.data]
        ));
      } catch (err) {
        alert("Error fetching courses: " + err.message);
      }
    };

    fetchCourses(); // call the async function
  }, []);

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const CourseCard = ({ course }) => (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      } 
                     border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 
                     transform hover:-translate-y-2 hover:scale-[1.02] group backdrop-blur-sm
                     ${
                       isDark
                         ? "shadow-lg shadow-gray-900/20"
                         : "shadow-lg shadow-gray-200/50"
                     }`}
    >
      {/* Course Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all duration-500"></div>

        {/* Featured Badge */}
        {course.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            <span className="flex items-center space-x-1">
              <span>🔥</span>
              <span>HOT</span>
            </span>
          </div>
        )}

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl transform group-hover:scale-110 transition-all duration-300">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl font-bold text-sm shadow-lg border border-white/20">
          {course.price}
        </div>

        {/* Level Badge */}
        <div
          className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            course.level === "Beginner"
              ? "bg-green-500/80 text-white"
              : course.level === "Intermediate"
              ? "bg-yellow-500/80 text-white"
              : "bg-red-500/80 text-white"
          }`}
        >
          {course.level}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                isDark
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {course.category}
            </span>
            <h3 className="font-bold text-xl leading-tight mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:bg-clip-text transition-all duration-300">
              {course.title}
            </h3>
          </div>
        </div>

        <p
          className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {course.description}
        </p>

        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{course.instructor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-100/50"
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>{course.duration}</span>
          </div>
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-100/50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(course.rating)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-lg">{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Users className="w-4 h-4" />
              <span>{course.students} students</span>
            </div>
          </div>
        </div>

        <Link
          to={`/learn/${course.id || course.courseId}`}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl 
                   hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-bold text-center
                   flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>Enroll Now</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );

  const CourseListItem = ({ course }) => (
    <div
      className={`${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } 
                     border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="flex items-start space-x-6">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-32 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                  isDark
                    ? "bg-emerald-900/30 text-emerald-400"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {course.category}
              </span>
              <h3 className="font-bold text-xl group-hover:text-emerald-500 transition-colors">
                {course.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-500">
                {course.price}
              </div>
            </div>
          </div>

          <p
            className={`text-sm mb-3 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {course.description}
          </p>

          <div className="flex items-center space-x-6 mb-3 text-sm">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons} lessons</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{course.students}</span>
              </div>
            </div>

            <Link to={`/learn/${course.id}`}>
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-6 rounded-lg 
                       hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium 
                       flex items-center space-x-2 group"
              >
                <span>Enroll Now</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]"
          }`}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
      </div>

      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                        lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 
                        w-80 h-screen transition-transform duration-300 ease-in-out
                        ${
                          isDark
                            ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700"
                            : "bg-gradient-to-b from-white to-gray-50 border-gray-200"
                        } 
                        border-r pt-20 lg:pt-24 backdrop-blur-sm`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Discover
              </span>
            </h2>

            {/* Search */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-3 text-emerald-500">
                🔍 Search Courses
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Find your perfect course..."
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-700"
                      : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-white"
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 backdrop-blur-sm shadow-lg`}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-4 text-emerald-500">
                📚 Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                        : isDark
                        ? "hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700 hover:border-emerald-500/50"
                        : "hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-emerald-500/50"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {category}
                      {selectedCategory === category && <span>✨</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              className={`p-6 rounded-2xl border-2 ${
                isDark
                  ? "bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-gray-600"
                  : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
              } backdrop-blur-sm shadow-xl`}
            >
              <h3 className="font-bold mb-4 text-lg flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <span>Platform Stats</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-500/10">
                  <span className="flex items-center space-x-2">
                    <span>🎓</span>
                    <span>Total Courses:</span>
                  </span>
                  <span className="font-bold text-emerald-500">150+</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-blue-500/10">
                  <span className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>Students:</span>
                  </span>
                  <span className="font-bold text-blue-500">50K+</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-purple-500/10">
                  <span className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span>Instructors:</span>
                  </span>
                  <span className="font-bold text-purple-500">25+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Bar */}
          <div
            className={`sticky top-20 z-20 ${
              isDark ? "bg-gray-900/95" : "bg-gray-50/95"
            } 
                          backdrop-blur-sm border-b ${
                            isDark ? "border-gray-700" : "border-gray-200"
                          } 
                          px-4 py-4`}
          >
            <div className="flex items-center justify-between">
              {/* Mobile Menu & Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold">All Courses</h1>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {filteredCourses.length} courses found
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-emerald-500 text-white"
                      : isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-emerald-500 text-white"
                      : isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Courses Grid/List */}
          <div className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCourses.map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
              </div>
            )}

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
