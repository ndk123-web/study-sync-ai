import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  FileText,
  BookOpen,
  Clock,
  Users,
  Star,
  RotateCcw,
  Bookmark,
  Settings,
  Mic,
  Send,
  Download,
  List,
  Check,
  MoreVertical,
  ThumbsUp,
  Share2,
  Brain,
  Award,
  TrendingUp,
} from "lucide-react";
import Header from "./Header";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJS from "crypto-js";
import {
  useNavigate,
  useSearchParams,
  useParams,
  Link,
} from "react-router-dom";
import { useCurrentPlaylist } from "../store/slices/useCurrentPlaylist.js";
import { useLoaders } from "../store/slices/useLoaders.js";
import { useNotes } from "../store/slices/useNotes.js";
import { GetPlayListApi } from "../api/GetPlayList.js";
import { useIsAuth } from "../store/slices/useIsAuth.js";
import { ChangeCourseProgressApi } from "../api/ChangeCourseProgressApi.js";
import { GetCurrentCourseProgressApi } from "../api/GetCurrentCourseProgressApi.js";
import { TrackPlaylistIndexApi } from "../api/TrackPlaylistIndex.js";
import { GetCurrentVideoTranscriptApi } from "../api/GetCurrentVideoTranscript.js";
import { SaveCourseNotesApi } from "../api/SaveCurrentCourseNotesApi.js";
import { GetCurrentNotesApi } from "../api/GetCurrentNotesApi.js";
import { GetRecommendedCoursesApi } from "../api/GetRecommendedCoursesApi.js";
import { GetSummaryOfCurrentCourse } from "../api/GetSummaryOfCurrentCourse.js";
import { SendAiChatApi } from "../api/SendAiChatApi.js";
import { FetchUserChatsApi } from "../api/fetchUserChatsApi.js";
import { SendCourseQuizApi } from "../api/sendQuizCourseApi.js";
import { SendCourseQuizCompletedApi } from "../api/SendCourseCompletedApi.js";
import { EnrollmentCourseApi } from "../api/EnrollmentCourseApi.js";
import EnrollmentModal from "./EnrollmentModal";
import SuccessNotification from "./SuccessNotification";
import { Helmet } from "react-helmet";

// Notion-style formatting function
const formatNotesToHTML = (text, isDark = false) => {
  if (!text) return '<p class="text-gray-500">Start typing your notes...</p>';

  // Handle code blocks first (same logic as chat)
  const codeBlockPlaceholders = [];
  let tempText = text.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const placeholder = `__NOTES_CODE_BLOCK_${codeBlockPlaceholders.length}__`;
      const lang = language && language !== "" ? language : "javascript";
      const rawCode = code;
      const base64 =
        typeof window !== "undefined" && window.btoa
          ? window.btoa(unescape(encodeURIComponent(rawCode)))
          : Buffer.from(rawCode, "utf-8").toString("base64");

      const escapedForHTML = rawCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      codeBlockPlaceholders.push(
        `<pre class="line-numbers ${
          isDark
            ? "bg-gray-800 text-green-400 border border-gray-700"
            : "bg-gray-100 text-green-600 border border-gray-200"
        } rounded-lg p-4 my-4 overflow-x-auto" data-notes-area="true"><code data-raw-code="${base64}" class="language-${lang}" style="white-space: pre; font-family: 'Fira Mono', 'Menlo', 'Consolas', 'monospace'; font-size: 1em; display: block; line-height: 1.5;">${escapedForHTML}</code></pre>`
      );
      return placeholder;
    }
  );

  let html = tempText
    // Headers
    .replace(
      /^### (.*$)/gm,
      `<h3 class="text-lg font-bold mt-3 mb-1 ${
        isDark ? "text-white-400" : "text-dark-600"
      }"">$1</h3>`
    )
    .replace(
      /^## (.*$)/gm,
      `<h2 class="text-xl font-bold mt-4 mb-2 ${
        isDark ? "text-white-400" : "text-dark-600"
      }"">$1</h2>`
    )
    .replace(
      /^# (.*$)/gm,
      `<h1 class="text-2xl font-bold mt-5 mb-2 ${
        isDark ? "text-white-400" : "text-dark-600"
      }"">$1</h1>`
    )

    // Bold text
    .replace(
      /\*\*(.*?)\*\*/g,
      `<strong class="font-bold ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</strong>`
    )

    // Italic text
    .replace(
      /\*(.*?)\*/g,
      `<em class="italic ${
        isDark ? "text-white-300" : "text-dark-700"
      }">$1</em>`
    )

    // Timestamps
    .replace(
      /\[(\d{1,2}:\d{2})\]/g,
      `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono ${
        isDark
          ? "bg-orange-900/30 text-orange-400 border border-orange-700"
          : "bg-orange-100 text-orange-700 border border-orange-200"
      }">🕐 $1</span>`
    )

    // Checkboxes
    .replace(
      /- \[x\] (.*$)/gm,
      `<div class="flex items-center space-x-2 mb-1"><span class="text-green-500">✅</span><span class="line-through ${
        isDark ? "text-gray-400" : "text-gray-500"
      }">$1</span></div>`
    )
    .replace(
      /- \[ \] (.*$)/gm,
      `<div class="flex items-center space-x-2 mb-1"><span class="${
        isDark ? "text-gray-500" : "text-gray-400"
      }">☐</span><span>$1</span></div>`
    )

    // Bullet points with sub-bullets (fix spacing)
    .replace(
      /^  - (.*$)/gm,
      `<div class="ml-6 flex items-start space-x-2 mb-1"><span class="${
        isDark ? "text-gray-400" : "text-gray-500"
      }">◦</span><span>$1</span></div>`
    )
    .replace(
      /^- (.*$)/gm,
      `<div class="flex items-start space-x-2 mb-1"><span class="${
        isDark ? "text-emerald-400" : "text-emerald-600"
      }">•</span><span>$1</span></div>`
    )

    // Horizontal rules
    .replace(
      /^---$/gm,
      `<hr class="my-4 ${isDark ? "border-gray-600" : "border-gray-300"}">`
    )

    // Code blocks (inline)
    .replace(
      /`([^`]+)`/g,
      `<code class="px-2 py-1 rounded text-sm font-mono ${
        isDark
          ? "bg-gray-800 text-green-400 border border-gray-700"
          : "bg-gray-100 text-green-600 border border-gray-200"
      }">$1</code>`
    )

    // Split into paragraphs and handle line breaks properly
    .split("\n\n")
    .map((paragraph) => {
      // If paragraph contains bullet points, checkboxes, or headers, don't wrap in <p>
      if (paragraph.match(/^(#{1,3}|<div|<h[1-3]|<hr)/m)) {
        return paragraph.replace(/\n/g, "");
      }
      // Regular paragraphs
      return `<p class="mb-2 leading-relaxed">${paragraph.replace(
        /\n/g,
        "<br>"
      )}</p>`;
    })
    .join("");

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, index) => {
    html = html.replace(`__NOTES_CODE_BLOCK_${index}__`, replacement);
  });

  return `<div class="${
    isDark ? "text-gray-100" : "text-gray-800"
  }" data-notes-area="true">${html}</div>`;
};

// Simple chat message formatter matching notes style
const formatChatMessageHTML = (text, isDark = false) => {
  if (!text) return "";

  // Strictly preserve code block formatting and Prism compatibility
  const codeBlockPlaceholders = [];
  let tempText = text.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`;
      // Prism expects language class, default to 'python' if not specified
      const lang = language && language !== "" ? language : "python";
      // Strictly escape HTML but preserve ALL whitespace and newlines
      // DO NOT trim or modify whitespace in code blocks - keep exact formatting
      // Keep the original code untouched for accurate whitespace/newlines
      // Store a base64-encoded version on a data attribute so we can set
      // the `textContent` of the code element later (avoids HTML entity/whitespace issues)
      const rawCode = code;
      const base64 =
        typeof window !== "undefined" && window.btoa
          ? window.btoa(unescape(encodeURIComponent(rawCode)))
          : Buffer.from(rawCode, "utf-8").toString("base64");

      codeBlockPlaceholders.push(
        `<pre class="line-numbers ${
          isDark
            ? "bg-gray-800 text-green-400 border border-gray-700"
            : "bg-gray-100 text-green-600 border border-gray-200"
        } rounded-lg p-4 my-4 overflow-x-auto"><code data-raw-code="${base64}" class="language-${lang}" style="white-space: pre; font-family: 'Fira Mono', 'Menlo', 'Consolas', 'monospace'; font-size: 1em; display: block; line-height: 1.5;"></code></pre>`
      );
      return placeholder;
    }
  );

  // Also protect inline code blocks
  const inlineCodePlaceholders = [];
  tempText = tempText.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodePlaceholders.length}__`;
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    inlineCodePlaceholders.push(
      `<code class="px-2 py-1 rounded text-sm font-mono ${
        isDark
          ? "bg-gray-800 text-green-400 border border-gray-700"
          : "bg-gray-100 text-green-600 border border-gray-200"
      }">${escapedCode}</code>`
    );
    return placeholder;
  });

  // Now process other markdown elements on the protected text
  let html = tempText
    // Headers - only process lines that start with # (not inside code)
    .replace(
      /^### (.*$)/gm,
      `<h3 class="text-lg font-bold mt-4 mb-2 ${
        isDark ? "text-blue-400" : "text-blue-600"
      }">$1</h3>`
    )
    .replace(
      /^## (.*$)/gm,
      `<h2 class="text-xl font-bold mt-5 mb-2 ${
        isDark ? "text-blue-400" : "text-blue-600"
      }">$1</h2>`
    )
    .replace(
      /^# (.*$)/gm,
      `<h1 class="text-2xl font-bold mt-6 mb-3 ${
        isDark ? "text-blue-400" : "text-blue-600"
      }">$1</h1>`
    )
    // Bold text
    .replace(
      /\*\*(.*?)\*\*/g,
      `<strong class="font-bold ${
        isDark ? "text-yellow-400" : "text-gray-900"
      }">$1</strong>`
    );

  // Restore inline code blocks first
  inlineCodePlaceholders.forEach((replacement, index) => {
    html = html.replace(`__INLINE_CODE_${index}__`, replacement);
  });

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, replacement);
  });

  // Split into sections and handle properly
  const sections = html.split("\n\n").filter((s) => s.trim());

  const formattedSections = sections.map((section) => {
    const trimmed = section.trim();

    // If it's already a formatted element (header, div, pre, etc.), keep as is
    if (trimmed.match(/^<(h[1-6]|div|pre|blockquote)/)) {
      return trimmed;
    }

    // If it contains bullet points, keep as is
    if (trimmed.includes('<div class="flex items-start')) {
      return trimmed;
    }

    // If it contains code placeholders or code blocks, keep as is
    if (
      trimmed.includes("__CODE_BLOCK_") ||
      trimmed.includes("__INLINE_CODE_") ||
      trimmed.includes("<code") ||
      trimmed.includes("<pre")
    ) {
      return trimmed;
    }

    // Regular text - wrap in paragraph with proper spacing and preserve line breaks
    const withLineBreaks = trimmed.replace(/\n/g, "<br>");
    return `<p class="mb-3 leading-relaxed">${withLineBreaks}</p>`;
  });

  return `<div class="prose prose-sm max-w-none ${
    isDark ? "text-gray-100" : "text-gray-800"
  }">${formattedSections.join("")}</div>`;
};

// Helper function to escape HTML
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// (Prism highlight is handled inside component-level hooks where chatMessages/isDark are available)

const CoursesInterface = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const isDark = theme === "dark";

  // Add shimmer animation styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
      }
      /* Custom Scrollbar Styles */
      .scrollbar-thin {
        scrollbar-width: thin;
      }
      .scrollbar-thin::-webkit-scrollbar {
        height: 8px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #10b981, #14b8a6);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(90deg, #059669, #0d9488);
      }
      /* Mobile Touch Scrolling */
      .scrolling-touch {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [coursePlaylist, setCoursePlaylist] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notStoreNotes, setNotStoreNotes] = useState("");
  const [storedNotes, setStoredNotes] = useState("");
  const [completedVideosIndex, setCompletedVideosIndex] = useState(-1);
  const [quizId, setQuizId] = useState("");
  const [summaryText, setSummaryText] = useState("");
  // Real-time markdown editor - live preview only
  const [showPreview, setShowPreview] = useState(false); // Mobile preview toggle
  const [showAllTranscript, setShowAllTranscript] = useState(false); // For transcript show more
  const navigate = useNavigate();

  const notStoreNotesFromZustand = useNotes((state) => state.notStoreNotes);
  const storedNotesFromZustand = useNotes((state) => state.storedNotes); // ✅ Fixed property name
  const setNotStoreNotesFromZustand = useNotes(
    (state) => state.setNotStoreNotes
  );
  const setStoredNotesFromZustand = useNotes((state) => state.setStoredNotes); // ✅ Fixed function name
  const clearNotesFromZustand = useNotes((state) => state.clearNotes);

  const setCurrentVideoIdFromZustand = useCurrentPlaylist(
    (state) => state.setCurrentVideoId
  );
  const currentVideoIdFromZustand = useCurrentPlaylist(
    (state) => state.currentVideoId
  );
  const [currentVideoId, setCurrentVideoId] = useState(
    currentVideoIdFromZustand
  );
  const setCurrentPlaylistFromZustand = useCurrentPlaylist(
    (state) => state.setCurrentPlaylist
  );
  const currentPlaylistFromZustand = useCurrentPlaylist(
    (state) => state.currentPlaylist
  );
  const setCourseIdFromZustand = useCurrentPlaylist(
    (state) => state.setCourseId
  );
  const courseIdFromZustand = useCurrentPlaylist((state) => state.courseId);

  const notesLoader = useLoaders((state) => state.notesLoader);
  const setNotesLoader = useLoaders((state) => state.setNotesLoader);
  const unsetNotesLoader = useLoaders((state) => state.unsetNotesLoader);
  const removeAuth = useIsAuth((state) => state.removeAuth);

  const chatLoader = useLoaders((state) => state.chatLoader);
  const setChatLoader = useLoaders((state) => state.setChatLoader);
  const unsetChatLoader = useLoaders((state) => state.unsetChatLoader);
  const chatPageLoader = useLoaders((state) => state.chatPageLoader);
  const setChatPageLoader = useLoaders((state) => state.setChatPageLoader);
  const unsetChatPageLoader = useLoaders((state) => state.unsetChatPageLoader);

  const summaryLoader = useLoaders((state) => state.summarizeLoader);
  const transcriptLoader = useLoaders((state) => state.transcriptLoader);
  const setSummaryLoader = useLoaders((state) => state.setSummarizeLoader);
  const unsetSummaryLoader = useLoaders((state) => state.unsetSummarizeLoader);
  const setTranscriptLoader = useLoaders((state) => state.setTranscriptLoader);
  const unsetTranscriptLoader = useLoaders(
    (state) => state.unsetTranscriptLoader
  );

  // Quiz loader
  const quizLoader = useLoaders((state) => state.quizLoader);
  const setQuizLoader = useLoaders((state) => state.setQuizLoader);
  const unsetQuizLoader = useLoaders((state) => state.unsetQuizLoader);

  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [notesPreviewMode, setNotesPreviewMode] = useState(false); // Toggle between edit and preview
  const [chatMessage, setChatMessage] = useState("");
  const [videoSize, setVideoSize] = useState(55); // Default 50%
  const [chatMessages, setChatMessages] = useState([]); // Start with empty array
  const [transcriptText, setTranscriptText] = useState([]);

  // Quiz related state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [isQuizGenerated, setIsQuizGenerated] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Store user selected answers
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false); // Track if quiz is submitted

  // Dynamic course title state
  const [dynamicCourseTitle, setDynamicCourseTitle] = useState("");

  // Dynamic course title mapping
  const getCourseTitle = (courseId) => {
    const courseTitleMap = {
      PYTHON2025ENG: "Complete Python Programming Course 2025",
      PYTHON2025HINDI: "Complete Python Programming Course - Hindi",
      REACT2025HINDI: "Complete React.js Course - Hindi",
      NODEJS2025HINDI: "Complete Node.js Course - Hindi",
      FLUTTER2025EN: "Flutter Mobile Development Course",
      GIT2025ENG: "Complete Git & GitHub Tutorial",
      GIT2025HINDI: "Complete Git और GitHub Tutorial - Hindi",
      AIML2025ENG: "Artificial Intelligence & Machine Learning Course",
      UIUXHINDI: "Complete UI/UX Design Course - Hindi",
      PYTHONDATASCIENCE2025ENGLISH: "Python for Data Science - Complete Course",
      DEVOPS2025HINDI: "Complete DevOps Course - Zero to Hero",
    };

    return courseTitleMap[courseId] || courseId || "Course";
  };

  // Dynamic instructor mapping
  const getCourseInstructor = (courseId) => {
    const instructorMap = {
      PYTHON2025ENG: "Code With Harry",
      PYTHON2025HINDI: "Code With Harry",
      REACT2025HINDI: "Chai aur Code",
      NODEJS2025HINDI: "Thapa Technical",
      FLUTTER2025EN: "Flutter Team",
      GIT2025ENG: "Programming with Mosh",
      GIT2025HINDI: "Engineering Digest",
      AIML2025ENG: "Andrew Ng",
      UIUXHINDI: "Design Course",
      PYTHONDATASCIENCE2025ENGLISH: "NPTEL-NOC IITM",
      DEVOPS2025HINDI: "M Prashant",
    };

    return instructorMap[courseId] || "Expert Instructor";
  };

  // Set dynamic title based on courseId
  useEffect(() => {
    if (courseId) {
      const title = getCourseTitle(courseId);
      setDynamicCourseTitle(title);

      // Update document title (tab name)
      document.title = `${title} | StudySync AI`;
      console.log("📝 Dynamic title set:", title);
    }
  }, [courseId]);

  // Handle dynamic title update from recommendations
  const handleRecommendationTitleUpdate = (newCourseId, newCourseTitle) => {
    console.log(
      "🔄 Updating title from recommendation:",
      newCourseId,
      newCourseTitle
    );

    const title = getCourseTitle(newCourseId);
    setDynamicCourseTitle(title);

    // Update document title (tab name)
    document.title = `${title} | StudySync AI`;
    console.log(
      "📝 Document title updated from recommendation:",
      document.title
    );
  };

  const currentCourse = {
    title: dynamicCourseTitle || "Complete React Hooks Guide",
    instructor: getCourseInstructor(courseId) || "Expert Instructor",
    duration: "8 hours",
    level: "Intermediate",
    students: "45,234",
    rating: "4.9",
    category: "Frontend Development",
    currentLesson: "Introduction to React Hooks",
    lessonNumber: "1",
    totalLessons: "12",
    youtubeVideoId: "O6P86uwfdR0", // Default video
  };

  const coursePlaylistDemo = [
    {
      id: 1,
      youtubeVideoId: "O6P86uwfdR0",
      title: "Introduction to React Hooks",
      duration: "15:30",
      completed: true,
    },
    {
      id: 2,
      youtubeVideoId: "TNhaISOUy6Q",
      title: "useState Hook Deep Dive",
      duration: "22:45",
      completed: true,
    },
    {
      id: 3,
      youtubeVideoId: "0ZJgIjIuY7U",
      title: "useEffect Hook & Side Effects",
      duration: "28:12",
      completed: false,
    },
    {
      id: 4,
      youtubeVideoId: "t2ypzz6gJm0",
      title: "useContext for State Management",
      duration: "19:34",
      completed: false,
    },
    {
      id: 5,
      youtubeVideoId: "kVeOpcw4GWY",
      title: "useReducer for Complex State",
      duration: "25:18",
      completed: false,
    },
    {
      id: 6,
      youtubeVideoId: "AHNcOXku8aY",
      title: "useMemo & useCallback Optimization",
      duration: "21:07",
      completed: false,
    },
    {
      id: 7,
      youtubeVideoId: "raNActRyCeA",
      title: "Custom Hooks Creation",
      duration: "24:56",
      completed: false,
    },
    {
      id: 8,
      youtubeVideoId: "j942wKiXFu8",
      title: "useRef & DOM Manipulation",
      duration: "18:43",
      completed: false,
    },
    {
      id: 9,
      youtubeVideoId: "HQq1lq3F4ys",
      title: "React Testing Library with Hooks",
      duration: "32:21",
      completed: false,
    },
    {
      id: 10,
      youtubeVideoId: "Ke90Tje7VS0",
      title: "Performance Optimization Patterns",
      duration: "27:14",
      completed: false,
    },
    {
      id: 11,
      youtubeVideoId: "FHvZuS1XpbM",
      title: "Error Boundaries & Error Handling",
      duration: "20:38",
      completed: false,
    },
    {
      id: 12,
      youtubeVideoId: "dpw9EHDh2bM",
      title: "React Hooks Best Practices",
      duration: "26:45",
      completed: false,
    },
  ];

  useEffect(() => {
    unsetChatLoader();
    unsetChatPageLoader();
    unsetNotesLoader();
    unsetSummaryLoader();
    unsetTranscriptLoader();
  }, []);

  useEffect(() => {
    if (window.Prism) {
      const timeoutId = setTimeout(() => {
        try {
          window.Prism.highlightAll();
        } catch (err) {
          console.error("Prism highlight error:", err);
        }
      }, 0); // <- zero delay better than 200/800

      return () => clearTimeout(timeoutId);
    }
  }, [chatMessages, activeTab, notesPreviewMode]);

  // Apply Prism syntax highlighting when chat messages change
  useEffect(() => {
    if (window.Prism && activeTab === "chat") {
      // Wait for DOM to render and then populate code elements from data-raw-code
      const timeoutId = setTimeout(() => {
        try {
          const codeElems = Array.from(
            document.querySelectorAll("code[data-raw-code]")
          );

          codeElems.forEach((el) => {
            try {
              const b64 = el.getAttribute("data-raw-code") || "";
              let decoded = "";
              if (b64) {
                try {
                  decoded = decodeURIComponent(escape(window.atob(b64)));
                } catch (e) {
                  // fallback for environments without atob/unescape
                  try {
                    decoded = Buffer.from(b64, "base64").toString("utf-8");
                  } catch (err) {
                    decoded = "";
                  }
                }
              }
              // Set the raw code as textContent to preserve whitespace/newlines
              if (decoded) el.textContent = decoded;
              // Now highlight the element individually
              window.Prism.highlightElement(el);
            } catch (err) {
              console.error("Error processing code element:", err);
            }
          });

          console.log(
            "🎨 Prism highlighting applied to",
            codeElems.length,
            "code blocks"
          );
        } catch (error) {
          console.error("Prism highlighting error:", error);
        }
      }, 200); // small delay to let React paint

      return () => clearTimeout(timeoutId);
    }
  }, [chatMessages, activeTab, notesPreviewMode]);

  // Apply Prism syntax highlighting for notes area - only when content finishes changing
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      activeTab !== "notes" ||
      !notesPreviewMode
    )
      return;

    const timeoutId = setTimeout(() => {
      try {
        const notesCodeElems = Array.from(
          document.querySelectorAll(
            '[data-notes-area="true"] code[data-raw-code]'
          )
        ).filter((el) => !el.hasAttribute("data-prism-processed"));

        notesCodeElems.forEach((el) => {
          try {
            const b64 = el.getAttribute("data-raw-code") || "";
            let decoded = "";
            if (b64) {
              try {
                decoded = decodeURIComponent(escape(window.atob(b64)));
              } catch (e) {
                try {
                  decoded = Buffer.from(b64, "base64").toString("utf-8");
                } catch (err) {
                  decoded = "";
                }
              }
            }
            if (decoded) {
              el.textContent = decoded;
              if (
                window.Prism &&
                typeof window.Prism.highlightElement === "function"
              ) {
                window.Prism.highlightElement(el);
              }
              el.setAttribute("data-prism-processed", "1");
            }
          } catch (err) {
            console.error("Error processing notes code element:", err);
          }
        });

        if (notesCodeElems.length > 0) {
          console.log(
            "🎨 Prism notes highlighting applied to",
            notesCodeElems.length,
            "code blocks"
          );
        }
      } catch (error) {
        console.error("Prism notes highlighting error:", error);
      }
    }, 800); // Longer delay to avoid constant re-processing

    return () => clearTimeout(timeoutId);
  }, [notesPreviewMode, activeTab]); // Only when switching to preview mode

  // On CourseId change , change the courseId in Zustand state
  useEffect(() => {
    console.log("Course ID changed:", courseId);
    setCourseIdFromZustand(courseId);
    clearNotesFromZustand(); // it will clear the notes in zustand for the new course
    console.log("✅ Cleared Zustand notes for new course");

    //   const demoMessage = {
    //   id: chatMessages.length + 1,
    //   type: "ai",
    //   message: "## This is Heading \n ```python print(\"hello\")  ```",
    //   timestamp: new Date(),
    //   avatar: "👤",
    // };

    // setChatMessages((prev) => [...prev, demoMessage]);
  }, [courseId]);

  // fetch the ai chat response
  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        setChatPageLoader();
        const apiResponse = await FetchUserChatsApi({
          courseId,
          role: "course",
        });

        console.log("🗨️ Fetch User Chats API Response:", apiResponse);
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          // alert("Error fetching user chats");
          return;
        }

        const messages = apiResponse?.data?.chats || [];

        // Convert backend messages to frontend format
        const formattedMessages = messages.map((message, idx) => ({
          id: message.id || idx,
          type: message.type,
          message: message.message,
          timestamp: new Date(message.timestamp), // Convert string back to Date
          avatar: message.avatar,
        }));

        // If we have messages from backend, use them, otherwise keep the welcome message
        if (formattedMessages.length > 0) {
          setChatMessages(formattedMessages);
        } else {
          // Reset to initial welcome message for new course
          setChatMessages([
            {
              id: 1,
              type: "ai",
              message: `Hello! I'm your AI study assistant for course "${courseId}", how can I assist you today?`,
              timestamp: new Date(),
              avatar: "🤖",
            },
          ]);
        }
      } catch (error) {
        console.error("💥 Error fetching user chats:", error);
      } finally {
        unsetChatPageLoader();
      }
    };

    fetchUserChats();
  }, []);

  // Simple Prism highlighting on chat message updates

  // To Get Notes on the basis of courseId
  useEffect(() => {
    const fetchNotes = async () => {
      console.log("🔍 Fetching notes for courseId:", courseId);

      if (!courseId) {
        console.log("❌ No courseId provided, skipping notes fetch");
        return;
      }

      try {
        // If no Zustand data, then fetch from backend
        console.log("🌐 Fetching notes from backend...");
        const apiResponse = await GetCurrentNotesApi({ courseId });
        console.log("📝 Notes API Response:", apiResponse);

        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("❌ Error fetching notes:", apiResponse?.message);
          // Don't show alert for empty notes, just set empty state
          const emptyNotes = "";
          setStoredNotes(emptyNotes);
          setNotStoreNotes(emptyNotes);
          setStoredNotesFromZustand(emptyNotes);
          setNotStoreNotesFromZustand(emptyNotes);
          return;
        }

        const notesData = apiResponse?.data?.notes || "";
        console.log("✅ Notes fetched from backend:", notesData);

        // Update both local state and Zustand
        // setStoredNotes(notesData);

        // this is the main that it re renders the component because of the useState
        setNotStoreNotes(notesData);

        // setStoredNotesFromZustand(notesData);
        setNotStoreNotesFromZustand(notesData);
      } catch (error) {
        console.error("💥 Error in fetchNotes:", error);
        // Set empty notes on error
        const emptyNotes = "";
        setStoredNotes(emptyNotes);
        setNotStoreNotes(emptyNotes);
        setStoredNotesFromZustand(emptyNotes);
        setNotStoreNotesFromZustand(emptyNotes);
      }
    };

    fetchNotes();
  }, [courseId]); // ✅ Only courseId dependency

  // Set current video ID from URL
  useEffect(() => {
    const getPlaylist = async () => {
      console.log("Course ID:", courseId);

      try {
        const apiResponse = await GetPlayListApi(courseId);
        const playlist = apiResponse?.data?.[0]?.videoLinks;

        if (apiResponse.status === 200 || apiResponse.status === 201) {
          if (!playlist || playlist.length === 0) {
            alert("No videos found in this course.");
            return;
          }

          setCoursePlaylist(playlist);
          setCurrentPlaylistFromZustand(playlist);

          // Only set videoId if it exists and is valid
          const firstVideoId =
            playlist[0]?.youtubeVideoId || playlist[0]?.url?.split("v=")[1];

          if (firstVideoId) {
            setCurrentVideoId(firstVideoId);
          } else {
            alert("No valid video ID found.");
          }

          // After playlist is loaded, get progress and set correct video
          await getCurrentCourseProgress(playlist);
        } else {
          alert("Error fetching playlist: " + apiResponse.message);
          // removeAuth();
        }
      } catch (err) {
        alert("Error fetching playlist: " + err.message);
        removeAuth();
      }
    };

    const getCurrentCourseProgress = async (playlistData = coursePlaylist) => {
      try {
        const apiResponse = await GetCurrentCourseProgressApi(courseId);
        console.log("Api Response to get progress: ", apiResponse);
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          alert(
            "Error fetching course progress: " +
              (apiResponse?.message || "Err in 201")
          );
          return;
        }

        // Fix: Access data from the correct structure
        console.log("Current Progress:", apiResponse?.data?.progress);
        console.log("Current Index:", apiResponse?.data?.currentIndex);
        console.log("Total Videos:", apiResponse?.data?.totalVideos);

        const progressValue = parseInt(apiResponse?.data?.progress) ?? 0;
        const currentIndex = apiResponse?.data?.currentIndex ?? 0;

        setProgress(progressValue);
        setCompletedVideosIndex(currentIndex);

        // Set the current video based on the progress index
        if (playlistData.length > 0 && currentIndex < playlistData.length) {
          const currentVideo = playlistData[currentIndex];
          if (currentVideo?.youtubeVideoId) {
            console.log(
              "Setting video from progress - Index:",
              currentIndex,
              "Video ID:",
              currentVideo.youtubeVideoId
            );
            setCurrentVideoId(currentVideo.youtubeVideoId);
            setCurrentVideoIdFromZustand(currentVideo.youtubeVideoId);
          }
        }
      } catch (err) {
        alert("Error fetching course progress: " + err.message);
        // removeAuth();
      }
    };

    getPlaylist();
  }, []);

  // Track completed videos index
  useEffect(() => {
    const trackPlaylistIndex = async () => {
      try {
        const apiResponse = await TrackPlaylistIndexApi(courseId);
        console.log(
          "Api Response in TrackPlaylistIndexController:",
          apiResponse
        );
        setCompletedVideosIndex(
          apiResponse?.data?.trackCompletedVideosIndex || -1
        );
        console.log("Current Video Watching By User: ", completedVideosIndex);
      } catch (err) {
        alert("Err: ", err.message);
      }
    };
    trackPlaylistIndex();
  }, [completedVideosIndex]);

  // Set current video ID from URL
  useEffect(() => {
    const query = searchParams.get("currentvideoid");
    setCurrentVideoIdFromZustand(query || currentVideoId);
  }, [currentVideoId]);

  // get the transcript of current going video
  // useEffect(() => {
  // const fetchTranscript = async () => {
  //   const apiResponse = await GetCurrentVideoTranscriptApi({
  //     currentVideoId,
  //   });

  //   if (apiResponse.status !== 200 && apiResponse.status !== 201) {
  //     // alert("Error fetching video transcript: " + apiResponse?.error || apiResponse?.message || "Error in fetching transcript");
  //     return;
  //   }

  //   setTranscriptText(apiResponse?.data?.transcript);
  //   console.log("Transcript: ", transcriptText);

  //   console.log("ApiResponse for Transcript: ", apiResponse);
  // };

  //   fetchTranscript();
  // }, [currentVideoId]);

  // Auto-save to Zustand as well as dtabase after typing 1 seconds when user types (with debounce)
  useEffect(() => {
    if (!courseId || !notStoreNotes) return;

    const autoSaveTimer = setTimeout(async () => {
      console.log("💾 Auto-saving notes to Zustand...");
      setNotStoreNotesFromZustand(notStoreNotes); // when user types then this will be called

      try {
        setNotesLoader();

        const apiResponse = await SaveCourseNotesApi({
          type: "course",
          courseId,
          notes: notStoreNotes,
        });

        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("❌ Error auto-saving notes:", apiResponse?.message);
          alert("Error in Saving Notes after 2 seconds");
          return;
        }
      } catch (err) {
        console.error("💥 Error in auto-save:", err);
        alert("Error in Saving Notes after 2 seconds");
      } finally {
        unsetNotesLoader(); // whether error or success this will be called
      }

      console.log("✅ Notes auto-saved to Zustand");
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(autoSaveTimer);
  }, [notStoreNotes, courseId]);

  const fetchSummary = async () => {
    if (!courseId) {
      alert("No course selected for summary generation.");
      return;
    }

    setSummaryLoader(); // Start loading

    try {
      const apiResponse = await GetSummaryOfCurrentCourse({
        courseId,
        videoId: currentVideoIdFromZustand,
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          "Error fetching summary: " + apiResponse?.message ||
            "Error in fetching summary"
        );
        return;
      }

      console.log(
        "Summary Response: ",
        apiResponse?.summary || "No summary available"
      );
      setSummaryText(apiResponse?.summary || "No summary available");
    } catch (err) {
      alert(err.message || "Error in fetching summary");
      return;
    } finally {
      unsetSummaryLoader(); // Stop loading
    }
  };

  const fetchTranscript = async () => {
    if (!currentVideoId) {
      alert("No video selected for transcript generation.");
      return;
    }

    setTranscriptLoader(); // Start loading

    try {
      const apiResponse = await GetCurrentVideoTranscriptApi({
        currentVideoId,
      });

      console.log("Manual Transcript Fetch Response: ", apiResponse);

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          "Error fetching video transcript: " + apiResponse?.error ||
            apiResponse?.message ||
            "Error in fetching transcript"
        );
        return;
      }

      // Fix: Access the correct nested path - apiResponse.data.data.transcript
      setTranscriptText(apiResponse?.data?.data?.transcript || []);
      console.log(
        "Transcript set to state: ",
        apiResponse?.data?.data?.transcript
      );
    } catch (err) {
      console.error("Error in manual transcript fetch:", err);
      alert(err.message || "Error in fetching transcript");
    } finally {
      unsetTranscriptLoader(); // Stop loading
    }
  };

  const handlePreviousVideo = async () => {
    const currentIndex = coursePlaylist.findIndex(
      (video) => video.youtubeVideoId === currentVideoId
    );
    if (currentIndex > 0) {
      const previousVideo = coursePlaylist[currentIndex - 1];
      setCurrentVideoId(previousVideo.youtubeVideoId);

      // Update URL
      navigate(`?currentvideoid=${currentCourse.youtubeVideoId}`);
    }
  };

  const handleNextVideo = async () => {
    const currentIndex = coursePlaylist.findIndex(
      (video) => video.youtubeVideoId === currentVideoId
    );
    if (currentIndex < coursePlaylist.length - 1) {
      const nextVideo = coursePlaylist[currentIndex + 1];

      const apiResponse = await ChangeCourseProgressApi(courseId, currentIndex);
      if (apiResponse.status !== 200 || apiResponse.status !== 201) {
        // Logic For Error Notification
      }

      console.log("API Response:", apiResponse);

      const progressValue = parseInt(apiResponse?.progress) ?? 0;
      console.log("Prgoress value: ", progressValue);
      // If Success then follow next steps
      setProgress(progressValue);

      setCurrentVideoId(nextVideo.youtubeVideoId);

      setCompletedVideosIndex(apiResponse?.currentIndex);
      console.log("Current Video Watching By User: ", completedVideosIndex);

      // Update URL
      navigate(`?currentvideoid=${nextVideo.youtubeVideoId}`);
    }
  };

  // Video functions
  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1`;
  };

  const changeYouTubeVideo = (newVideoId) => {
    console.log("🎬 Changing video to:", newVideoId);
    setCurrentVideoId(newVideoId);
  };

  const sendMessage = async () => {
    unsetChatLoader();
    if (!chatMessage.trim()) return;

    const currentMessage = chatMessage.trim();

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: currentMessage,
      timestamp: new Date(),
      avatar: "👤",
    };

    // Clear input immediately after getting the message
    setChatMessage("");
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      setChatLoader(); // Start loader
      const apiResponse = await SendAiChatApi({
        type: "course",
        prompt: currentMessage,
        courseId,
      });

      console.log("Api Response for send Chat: ", apiResponse);

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          "Error sending message: " +
            (apiResponse?.message || "Error in sending message")
        );
        return;
      }

      const aiMessage = {
        id: Date.now(), // Use timestamp for unique ID
        type: "ai",
        message: apiResponse?.data?.response || "No response received",
        timestamp: new Date(),
        avatar: "🤖",
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      unsetChatLoader();
    } catch (error) {
      console.error("Error sending chat message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      unsetChatLoader(); // Stop loader
    }
  };

  // Generate Quiz function
  const generateQuiz = async () => {
    setQuizLoader();

    try {
      // Simulate API call - replace with actual API when backend is ready

      const apiResponse = await SendCourseQuizApi({
        level: selectedDifficulty,
        courseId: courseId,
      });

      console.log("Api Response for Quiz: ", apiResponse);
      console.log(
        "Full API Response structure:",
        JSON.stringify(apiResponse, null, 2)
      );

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          "Error generating quiz: " + (apiResponse?.message || "Unknown error")
        );
        unsetQuizLoader();
        return;
      }

      const questionsFromApi =
        apiResponse?.data?.data?.questions?.questions || [];
      const generatedQuizId = apiResponse?.data?.data?.id;

      console.log("Generated Quiz ID:", generatedQuizId);
      console.log("Generated Quiz ID type:", typeof generatedQuizId);
      console.log("Raw _id object:", apiResponse?.data?.data?.questions?._id);

      // Validate that we have a valid quizId
      if (
        !generatedQuizId ||
        typeof generatedQuizId !== "string" ||
        generatedQuizId.trim() === ""
      ) {
        console.error("❌ Invalid quiz ID received:", generatedQuizId);
        console.error(
          "❌ Raw _id object:",
          apiResponse?.data?.data?.questions?._id
        );
        console.error(
          "❌ Full API response structure:",
          JSON.stringify(apiResponse, null, 2)
        );
        alert("Error: Invalid quiz ID received from server. Please try again.");
        unsetQuizLoader();
        return;
      }

      console.log("Questions from API:", questionsFromApi);
      console.log("Questions from API type:", typeof questionsFromApi);

      setQuizId(generatedQuizId); // this is important for fetching the quiz later

      if (questionsFromApi.length === 0) {
        alert("No questions found for the selected course and difficulty.");
        unsetQuizLoader();
        return;
      }

      setQuizQuestions(questionsFromApi);
      setIsQuizGenerated(true);
      setUserAnswers({}); // Reset user answers
      setIsQuizSubmitted(false); // Reset submission state
      unsetQuizLoader();
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
      unsetQuizLoader();
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Submit quiz and show results
  const handleQuizSubmit = async () => {
    if (!quizId) {
      alert("Quiz ID not found. Please regenerate the quiz.");
      console.error("❌ Quiz ID is missing:", quizId);
      return;
    }

    console.log("Submitting quiz with ID:", quizId);

    try {
      const score = calculateScore();
      console.log(
        "📊 Quiz Submitted. Score:",
        score,
        "Total Questions:",
        quizQuestions.length,
        "Quiz ID:",
        quizId
      );
      console.log(
        "📊 Data Types - Score type:",
        typeof score,
        "QuizId type:",
        typeof quizId
      );
      console.log(
        "📊 Data Values - Score value:",
        score,
        "QuizId value:",
        quizId
      );

      // Ensure score is an integer and quizId is a string
      const payload = {
        score: parseInt(score),
        quizId: String(quizId),
      };

      console.log("📊 Final payload to send:", payload);
      console.log(
        "📊 Payload types - score:",
        typeof payload.score,
        "quizId:",
        typeof payload.quizId
      );

      const apiResponse = await SendCourseQuizCompletedApi(payload);

      console.log("✅ Quiz completion API response:", apiResponse);

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        console.error("❌ API Error:", apiResponse);
        alert(
          "Error submitting quiz results: " +
            (apiResponse?.message ||
              apiResponse?.data?.message ||
              "Unknown error")
        );
        return;
      }

      setIsQuizSubmitted(true);
      console.log(
        `🎉 Quiz completed successfully! Score: ${score}/${
          quizQuestions.length
        } (${Math.round((score / quizQuestions.length) * 100)}%)`
      );
    } catch (err) {
      console.error("💥 Error in submitting quiz:", err);
      alert("Error in submitting quiz: " + (err.message || "Unknown error"));
      return;
    }
  };

  // Reset quiz to generate new one
  const handleResetQuiz = () => {
    setIsQuizGenerated(false);
    setQuizQuestions([]);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setQuizId(null); // Reset quiz ID
  };

  // Calculate quiz score
  const calculateScore = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Helmet>
        <title>{`${currentCourse.title} | StudySyncAI`}</title>
        <meta
          name="description"
          content="Explore the course content, engage with interactive quizzes, and enhance your learning experience with StudySync AI."
        />
      </Helmet>

      {/* Include Header Component */}
      <Header />

      {/* Animated Course Progress Bar */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b px-6 py-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5">
                  <div
                    className={`w-full h-full rounded-2xl ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } flex items-center justify-center`}
                  >
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {currentCourse.title}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">
                      {currentCourse.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{currentCourse.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">Progress: {progress}%</p>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Responsive Content Area */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-180px)] max-w-full overflow-hidden">
        {/* 🎬 Left Section: Video Player + Playlist (Desktop) */}
        <div
          className="w-full lg:flex lg:flex-col flex-shrink-0"
          style={{
            width: window.innerWidth >= 1024 ? `${videoSize}%` : "100%",
          }}
        >
          {/* Video Player */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl lg:rounded-none shadow-lg lg:shadow-none overflow-hidden m-4 lg:m-0`}
          >
            <div className="relative group">
              {/* YouTube iframe */}
              <div className="aspect-video">
                <iframe
                  key={currentVideoId}
                  src={getYouTubeEmbedUrl(currentVideoId)}
                  title={
                    coursePlaylist.find(
                      (v) => v.youtubeVideoId === currentVideoId
                    )?.title || currentCourse.currentLesson
                  }
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video info overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="text-white font-semibold text-lg">
                    {coursePlaylist.find(
                      (video) => video.youtubeVideoId === currentVideoId
                    )?.title || currentCourse.currentLesson}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {currentCourse.instructor}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-red-500 text-xs font-medium">
                      ● YouTube
                    </span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-300">
                      {currentCourse.rating}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      window.open(
                        `https://youtube.com/watch?v=${currentVideoId}`,
                        "_blank"
                      )
                    }
                    className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors"
                    title="Open in YouTube"
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </button>
                  <button className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div
              className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"} border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePreviousVideo}
                  disabled={
                    coursePlaylist.findIndex(
                      (video) => video.youtubeVideoId === currentVideoId
                    ) === 0
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    coursePlaylist.findIndex(
                      (video) => video.youtubeVideoId === currentVideoId
                    ) === 0
                      ? "opacity-50 cursor-not-allowed"
                      : isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">Previous</span>
                </button>

                <div className="text-center flex-1 mx-4">
                  <p className="text-lg font-semibold">
                    {coursePlaylist.find(
                      (video) => video.youtubeVideoId === currentVideoId
                    )?.title || currentCourse.currentLesson}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Lesson{" "}
                    {coursePlaylist.findIndex(
                      (video) => video.youtubeVideoId === currentVideoId
                    ) + 1}{" "}
                    of {coursePlaylist.length}
                  </p>
                </div>

                <button
                  onClick={handleNextVideo}
                  disabled={
                    coursePlaylist.findIndex(
                      (video) => video.youtubeVideoId === currentVideoId
                    ) ===
                    coursePlaylist.length - 1
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    coursePlaylist.findIndex(
                      (video) => video.youtubeVideoId === currentVideoId
                    ) ===
                    coursePlaylist.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                  }`}
                >
                  <span className="font-medium hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-2 lg:space-x-4">
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Like</span>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://youtube.com/watch?v=${currentVideoId}`,
                      "_blank"
                    )
                  }
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span className="text-sm hidden sm:inline">YouTube</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Playlist - Below Video */}
          <div className="hidden lg:block flex-1 p-4">
            <div
              className={`h-full ${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg overflow-hidden`}
            >
              {/* Playlist Header */}
              <div
                className={`p-4 border-b ${
                  isDark
                    ? "border-gray-700 bg-gray-750"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-1">Course Playlist</h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {coursePlaylist.length} videos • React Hooks Masterclass
                </p>
              </div>

              {/* Playlist Videos */}
              <div className="max-h-80 overflow-y-auto">
                {coursePlaylist.map((video, index) => (
                  <div
                    key={video.youtubeVideoId}
                    onClick={() => {
                      changeYouTubeVideo(video.youtubeVideoId);
                      navigate(`?currentvideoid=${video.youtubeVideoId}`);
                    }}
                    className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                      video.youtubeVideoId === currentVideoId // after refresh still it will preserver user ongoing video
                        ? isDark
                          ? "bg-emerald-900/30 border-emerald-500/30"
                          : "bg-emerald-50 border-emerald-200"
                        : isDark
                        ? "border-gray-700 hover:bg-gray-700/50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            video.youtubeVideoId === currentVideoId
                              ? "bg-emerald-500 text-white"
                              : isDark
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {video.youtubeVideoId === currentVideoId ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm leading-tight ${
                            video.youtubeVideoId === currentVideoId
                              ? isDark
                                ? "text-emerald-400"
                                : "text-emerald-600"
                              : ""
                          }`}
                        >
                          {video.title}
                        </h4>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {video.duration}
                        </p>
                        {index + 1 < completedVideosIndex && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Playlist - Collapsible */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setShowMobilePlaylist(!showMobilePlaylist)}
              className={`w-full p-4 flex items-center justify-between ${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg mb-4`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <List className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Course Playlist</h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {coursePlaylist.length} videos
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  showMobilePlaylist ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMobilePlaylist && (
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg mb-4`}
              >
                <div className="max-h-80 overflow-y-auto">
                  {coursePlaylist.map((video, index) => (
                    <div
                      key={video.youtubeVideoId}
                      onClick={() => {
                        changeYouTubeVideo(video.youtubeVideoId);
                        setShowMobilePlaylist(false);
                      }}
                      className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                        video.youtubeVideoId === currentVideoId
                          ? isDark
                            ? "bg-emerald-900/30 border-emerald-500/30"
                            : "bg-emerald-50 border-emerald-200"
                          : isDark
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              video.youtubeVideoId === currentVideoId
                                ? "bg-emerald-500 text-white"
                                : isDark
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {video.youtubeVideoId === currentVideoId ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium text-sm leading-tight ${
                              video.youtubeVideoId === currentVideoId
                                ? isDark
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                                : ""
                            }`}
                          >
                            {video.title}
                          </h4>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {video.duration}
                          </p>
                          {index + 1 < completedVideosIndex && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500">
                                Completed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Horizontal Tabs - Below Playlist */}
            <div className="lg:hidden p-4">
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-4`}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Learning Tools</span>
                </h3>

                {/* Mobile Horizontal Scrollable Tabs */}
                <div
                  className="flex overflow-x-auto scrollbar-hide pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {[
                    {
                      id: "chat",
                      label: "AI Assistant",
                      icon: MessageCircle,
                      badge: "3",
                      color: "from-blue-500 to-blue-600",
                      emoji: "🤖",
                    },
                    {
                      id: "notes",
                      label: "Notes",
                      icon: BookOpen,
                      badge: "2",
                      color: "from-green-500 to-green-600",
                      emoji: "📝",
                    },
                    {
                      id: "quiz",
                      label: "Quiz",
                      icon: Award,
                      badge: "5",
                      color: "from-red-500 to-red-600",
                      emoji: "🧠",
                    },
                    {
                      id: "summary",
                      label: "Summary 🚧",
                      icon: FileText,
                      badge: null,
                      color: "from-orange-500 to-orange-600",
                      emoji: "📚",
                    },
                    {
                      id: "transcript",
                      label: "Transcript 🚧",
                      icon: Mic,
                      badge: null,
                      color: "from-purple-500 to-purple-600",
                      emoji: "📜",
                    },
                  ].map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 min-w-[100px] flex-shrink-0 mr-3 transform hover:scale-105 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : `${
                              isDark
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            } border ${
                              isDark ? "border-gray-600" : "border-gray-200"
                            }`
                      }`}
                    >
                      {/* Icon with emoji */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activeTab === tab.id
                            ? "bg-white/20"
                            : `bg-gradient-to-r ${tab.color}`
                        }`}
                      >
                        <span className="text-xl">{tab.emoji}</span>
                      </div>

                      {/* Label */}
                      <span className="text-xs font-medium text-center leading-tight">
                        {tab.label}
                      </span>

                      {/* Badge */}
                      {tab.badge && (
                        <div
                          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            activeTab === tab.id
                              ? "bg-white text-red-500"
                              : "bg-red-500 text-white"
                          } animate-pulse shadow-lg border-2 ${
                            activeTab === tab.id
                              ? "border-white"
                              : "border-red-600"
                          }`}
                        >
                          {tab.badge}
                        </div>
                      )}

                      {/* Active indicator */}
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      )}
                    </button>
                  ))}

                  {/* Scroll indicator */}
                  <div className="flex items-center justify-center min-w-[60px] flex-shrink-0">
                    <div
                      className={`w-1 h-12 rounded-full ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tab Content */}
            <div className="lg:hidden p-4">
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-4 min-h-[400px]`}
              >
                {activeTab === "chat" && (
                  <div className="h-full flex flex-col">
                    {/* AI Assistant Header */}
                    <div
                      className={`p-4 rounded-xl mb-4 bg-gradient-to-r ${
                        isDark
                          ? "from-blue-900/30 to-indigo-900/30 border border-blue-500/30"
                          : "from-blue-50 to-indigo-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🤖</div>
                        <div>
                          <h3 className="font-semibold">AI Study Assistant</h3>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Ask questions about this lesson
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}

                    <div className="flex-1 space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {chatPageLoader ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full border-3 border-emerald-200 border-t-emerald-500 animate-spin"></div>
                              <div
                                className="absolute inset-0 w-8 h-8 rounded-full border-3 border-transparent border-r-teal-500 animate-spin"
                                style={{ animationDelay: "0.15s" }}
                              ></div>
                            </div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Loading chats...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {chatMessages.slice(-3).map((message) => (
                            <div
                              key={message.id}
                              className={`flex items-start space-x-2 ${
                                message.type === "user" ? "justify-end" : ""
                              }`}
                            >
                              {message.type === "ai" && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs">🤖</span>
                                </div>
                              )}

                              <div
                                className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                  message.type === "ai"
                                    ? isDark
                                      ? "bg-gray-700 text-white"
                                      : "bg-gray-100 text-gray-900"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                }`}
                              >
                                {message.type === "ai" ? (
                                  <div
                                    className="leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: formatChatMessageHTML(
                                        message.message,
                                        isDark
                                      ),
                                    }}
                                  />
                                ) : (
                                  <p className="leading-relaxed">
                                    {message.message}
                                  </p>
                                )}
                              </div>

                              {message.type === "user" && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs">👤</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}

                      {/* Mobile Chat Loading Indicator */}
                      {chatLoader && (
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">🤖</span>
                          </div>
                          <div
                            className={`max-w-[85%] p-3 rounded-xl text-sm ${
                              isDark
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-xs text-emerald-500 font-medium">
                                Thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Chat Input */}
                    <div
                      className={`border rounded-xl p-3 ${
                        isDark
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Ask about React Hooks..."
                          className={`flex-1 px-3 py-2 rounded-lg border-0 text-sm ${
                            isDark
                              ? "bg-gray-800 text-white placeholder-gray-400"
                              : "bg-white text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!chatMessage.trim()}
                          className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">📝</span>
                        <h3 className="text-lg font-semibold">My Notes</h3>
                      </div>

                      {/* Live Preview Indicator */}
                      <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Live Preview
                        </span>
                      </div>
                    </div>
                    {/* Professional Notes Interface */}
                    <div className="space-y-4">
                      {/* Header with Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📝</span>
                          <span className="font-medium text-sm">
                            Notes Editor
                          </span>
                        </div>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                            showPreview
                              ? isDark
                                ? "border-emerald-600 bg-emerald-900/20 text-emerald-400"
                                : "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : isDark
                              ? "border-gray-600 bg-gray-700 text-gray-300"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          <span className="text-xs">
                            {showPreview ? "👁️" : "📝"}
                          </span>
                          <span className="text-xs font-medium">
                            {showPreview ? "Preview" : "Editor"}
                          </span>
                        </button>
                      </div>

                      {/* Main Editor */}
                      <div className="relative">
                        <textarea
                          className={`w-full p-4 rounded-xl border text-sm font-mono resize-none transition-all duration-300 ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-750"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:bg-gray-50"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                          value={notStoreNotes}
                          onChange={(e) => setNotStoreNotes(e.target.value)}
                          style={{ height: showPreview ? "200px" : "300px" }}
                        />

                        {/* Character count */}
                        <div
                          className={`absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full ${
                            isDark
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {notStoreNotes.length} chars
                        </div>
                      </div>

                      {/* Preview Panel */}
                      {showPreview && (
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                            <span>✨</span>
                            <span>Live Preview</span>
                          </div>
                          <div
                            className={`p-4 rounded-xl border min-h-[200px] overflow-y-auto ${
                              isDark
                                ? "bg-gray-900/50 border-gray-600 text-white"
                                : "bg-gradient-to-br from-gray-50 to-white border-gray-200 text-gray-900"
                            }`}
                          >
                            {notStoreNotes ? (
                              <div
                                className="prose prose-sm max-w-none prose-headings:text-emerald-600 dark:prose-headings:text-emerald-400 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300"
                                dangerouslySetInnerHTML={{
                                  __html: formatNotesToHTML(
                                    notStoreNotes,
                                    isDark
                                  ),
                                }}
                              />
                            ) : (
                              <div
                                className={`text-center py-8 ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                <span className="text-2xl mb-2 block">📝</span>
                                <p className="text-sm">
                                  Start typing to see your formatted notes...
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>{" "}
                    {/* Status & Actions */}
                    <div className="flex justify-between items-center mt-3">
                      {/* Professional Mobile Auto-Save Loader */}
                      <div
                        className={`flex items-center space-x-2 px-2 py-1 rounded-full transition-all duration-300 ${
                          notesLoader
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                        }`}
                      >
                        {notesLoader ? (
                          <>
                            <div className="flex items-center space-x-0.5">
                              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                isDark ? "text-yellow-400" : "text-yellow-600"
                              }`}
                            >
                              Saving...
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span
                              className={`text-xs font-medium ${
                                isDark ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              Saved
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">🧠</span>
                      <h3 className="text-lg font-semibold">Quiz Time</h3>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      } mb-4`}
                    >
                      <p className="text-sm mb-4">
                        Which hook is used for managing state?
                      </p>
                      <div className="space-y-2">
                        {["useEffect", "useState", "useContext"].map(
                          (option, index) => (
                            <button
                              key={index}
                              className={`w-full text-left p-3 text-sm rounded-lg transition-colors ${
                                isDark
                                  ? "bg-gray-800 hover:bg-gray-600"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium">
                      Submit Answer
                    </button>
                  </div>
                )}

                {activeTab === "summary" && (
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <div
                      className={`text-center max-w-md ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="text-6xl mb-6">🚧</div>
                      <h3
                        className={`text-2xl font-bold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Under Construction
                      </h3>
                      <p className="text-lg mb-2">
                        AI lesson summary generation coming soon!
                      </p>
                      <p className="text-sm">
                        We're building intelligent summarization to enhance your
                        learning experience.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "transcript" && (
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <div
                      className={`text-center max-w-md ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="text-6xl mb-6">🚧</div>
                      <h3
                        className={`text-2xl font-bold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Under Construction
                      </h3>
                      <p className="text-lg mb-2">
                        Video transcript feature coming soon!
                      </p>
                      <p className="text-sm">
                        We're working on automatic transcript generation for all
                        videos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Resize Handle */}
        <div
          className={`hidden lg:block w-2 cursor-col-resize ${
            isDark
              ? "bg-gray-700 hover:bg-emerald-500"
              : "bg-gray-200 hover:bg-emerald-500"
          } transition-all duration-300 relative group`}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = videoSize;

            const handleMouseMove = (e) => {
              const container = document.querySelector(
                ".flex.min-h-\\[calc\\(100vh-180px\\)\\]"
              );
              const rect = container.getBoundingClientRect();
              const newSize = Math.min(
                Math.max(((e.clientX - rect.left) / rect.width) * 100, 30),
                80
              );
              setVideoSize(newSize);
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
        </div>

        {/* 📋 Right Section: Chat, Test, Summary, Transcript */}
        <div
          className="hidden lg:flex lg:flex-col flex-shrink-0 min-w-0"
          style={{ width: `${100 - videoSize}%` }}
        >
          {/* Enhanced Tab Navigation - Horizontal Scrollable like YouLearn */}
          <div
            className={`border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            } bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/50`}
          >
            <div
              className="flex overflow-x-auto scrollbar-hide px-4 py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {[
                {
                  id: "chat",
                  label: "AI Assistant",
                  icon: MessageCircle,
                  badge: "3",
                  color: "bg-blue-500",
                },
                {
                  id: "notes",
                  label: "Notes",
                  icon: BookOpen,
                  badge: "2",
                  color: "bg-green-500",
                },
                {
                  id: "transcript",
                  label: "Transcript 🚧",
                  icon: Mic,
                  badge: null,
                  color: "bg-purple-500",
                },
                {
                  id: "summary",
                  label: "Summary 🚧",
                  icon: FileText,
                  badge: null,
                  color: "bg-orange-500",
                },
                {
                  id: "quiz",
                  label: "Quiz",
                  icon: BookOpen,
                  badge: "5",
                  color: "bg-red-500",
                },
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 mr-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : `${
                          isDark
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        } border ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`
                  }`}
                >
                  {/* Icon with colored background */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      activeTab === tab.id ? "bg-white/20" : tab.color
                    }`}
                  >
                    <tab.icon
                      className={`w-3 h-3 ${
                        activeTab === tab.id ? "text-white" : "text-white"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-medium hidden sm:inline">
                    {tab.label}
                  </span>

                  {/* Badge */}
                  {tab.badge && (
                    <div
                      className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeTab === tab.id
                          ? "bg-white text-emerald-500"
                          : "bg-red-500 text-white"
                      } animate-pulse shadow-lg`}
                    >
                      {tab.badge}
                    </div>
                  )}

                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              ))}

              {/* Scroll indicators */}
              <div className="flex items-center space-x-2 pl-4 flex-shrink-0">
                <div
                  className={`w-1 h-8 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Scroll →
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Content - Optimized for horizontal scrollable tabs */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden max-w-full">
            {activeTab === "chat" && (
              <div className="h-full flex flex-col max-w-full max-h-[calc(100vh-12rem)]">
                {/* AI Assistant Header */}
                <div
                  className={`p-4 rounded-2xl mb-4 bg-gradient-to-r max-w-full flex-shrink-0 ${
                    isDark
                      ? "from-blue-900/30 to-indigo-900/30 border border-blue-500/30"
                      : "from-blue-50 to-indigo-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate">
                        AI Study Assistant
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } truncate`}
                      >
                        Ask questions about this lesson
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages - Scrollable Container */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 max-h-[calc(100vh-20rem)]">
                  {chatPageLoader ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
                          <div
                            className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-teal-500 animate-spin"
                            style={{ animationDelay: "0.15s" }}
                          ></div>
                        </div>
                        <div className="text-center">
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Loading chat history...
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Please wait while we fetch your conversations
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    // Empty state when no messages
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🤖</span>
                        </div>
                      </div>
                      <h3
                        className={`text-xl font-semibold mb-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        AI Study Assistant
                      </h3>
                      <p
                        className={`text-sm mb-4 max-w-md ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Ask me anything related to this course. I can help you
                        with explanations, code examples, concepts, and more!
                      </p>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isDark
                            ? "bg-blue-900/30 text-blue-400 border border-blue-700"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        💡 Ready to help with your studies
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 animate-slide-in ${
                            message.type === "user" ? "justify-end" : ""
                          }`}
                        >
                          {message.type === "ai" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm">
                                {message.avatar}
                              </span>
                            </div>
                          )}

                          <div
                            className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                              message.type === "ai"
                                ? isDark
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-100 text-gray-900"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                            }`}
                          >
                            {message.type === "ai" ? (
                              <div
                                className="text-sm leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: formatChatMessageHTML(
                                    message.message,
                                    isDark
                                  ),
                                }}
                              />
                            ) : (
                              <p className="text-sm leading-relaxed">
                                {message.message}
                              </p>
                            )}
                            <p className={`text-xs mt-2 opacity-70`}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          {message.type === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm">
                                {message.avatar}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* Chat Loading Indicator */}
                  {chatLoader && (
                    <div className="flex items-start space-x-3 animate-slide-in">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          isDark
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-emerald-500 font-medium">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Chat Input - Fixed at bottom */}
                <div
                  className={`border rounded-xl p-4 flex-shrink-0 ${
                    isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask about React Hooks, state management, or any concept..."
                        className={`w-full px-4 py-3 rounded-lg border resize-none ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                        rows="2"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!chatMessage.trim()}
                      className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick Questions */}
                  <div className="mt-3">
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      Quick questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "What is useEffect?",
                        "Difference between useState and useReducer?",
                        "When to use useCallback?",
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setChatMessage(question)}
                          className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                            isDark
                              ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">My Notes 📝</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-emerald-500 text-sm hover:text-emerald-600 transition-colors">
                      Export PDF
                    </button>
                    <button className="text-gray-500 text-sm hover:text-gray-600 transition-colors">
                      📋 Templates
                    </button>
                  </div>
                </div>

                {/* Real-time Editor Header */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>✏️</span>
                    <span className="font-medium">Live Markdown Editor</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Real-time Preview
                    </span>
                  </div>
                </div>

                {/* Professional Notes Interface */}
                <div className="h-[500px] space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📝</span>
                      <h3 className="font-semibold text-lg">Notes</h3>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {notStoreNotes.length} characters
                    </div>
                  </div>

                  {/* Enhanced Notes Editor with Toggle */}
                  <div className="h-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <span>📝</span>
                        <span>
                          {notesPreviewMode
                            ? "Formatted Preview"
                            : "Markdown Editor"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* Auto-saving indicator */}
                        <div className="flex items-center space-x-1.5">
                          {notesLoader ? (
                            <>
                              <div className="flex space-x-0.5">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  isDark ? "text-yellow-400" : "text-yellow-600"
                                }`}
                              >
                                Saving...
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span
                                className={`text-xs font-medium ${
                                  isDark ? "text-green-400" : "text-green-600"
                                }`}
                              >
                                Saved
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => setNotesPreviewMode(!notesPreviewMode)}
                          className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                            isDark
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {notesPreviewMode ? "✏️ Edit" : "👁️ Preview"}
                        </button>
                      </div>
                    </div>

                    {notesPreviewMode ? (
                      /* Preview Mode */
                      <div
                        className={`h-full p-6 rounded-xl border overflow-y-auto ${
                          isDark
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-200"
                        }`}
                        data-notes-area="true"
                      >
                        {notStoreNotes ? (
                          <div
                            className="prose prose-base max-w-none prose-headings:text-emerald-600 dark:prose-headings:text-emerald-400 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300"
                            dangerouslySetInnerHTML={{
                              __html: formatNotesToHTML(notStoreNotes, isDark),
                            }}
                          />
                        ) : (
                          <div
                            className={`text-center py-16 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <span className="text-4xl mb-4 block">📝</span>
                            <h3 className="text-lg font-medium mb-2">
                              No notes yet
                            </h3>
                            <p className="text-sm">
                              Switch to Edit mode to start writing
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Edit Mode */
                      <textarea
                        placeholder="# My Lesson Notes

## Key Concepts
- **Important insight** - This is crucial for understanding  
- Another key point with detailed explanation

## Code Snippets
```javascript
// Example code I want to remember
const example = 'This is important';
```

## Timestamps & References
[05:30] - Key explanation about the main concept"
                        className={`w-full h-full p-6 rounded-xl border text-sm font-mono resize-none transition-all duration-300 ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-400"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                        value={notStoreNotes}
                        onChange={(e) => setNotStoreNotes(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-6 max-w-full h-full flex flex-col">
                {/* Quiz Header */}
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r flex-shrink-0 ${
                    isDark
                      ? "from-red-900/30 to-pink-900/30 border border-red-500/30"
                      : "from-red-50 to-pink-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold truncate">
                        Quiz Time! 🧠
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } truncate`}
                      >
                        Test your knowledge with AI-generated questions
                      </p>
                    </div>
                  </div>
                </div>

                {!isQuizGenerated ? (
                  /* Generate Quiz Section */
                  <div
                    className={`p-6 rounded-2xl border flex-1 ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/50 border-gray-200"
                    } backdrop-blur-sm flex flex-col justify-center items-center space-y-6`}
                  >
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold">Generate Quiz</h4>
                      <p
                        className={`text-lg ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Choose difficulty level and generate AI-powered quiz
                        questions
                      </p>
                    </div>

                    {/* Difficulty Level Options */}
                    <div className="w-full max-w-md space-y-4">
                      <h5 className="text-lg font-semibold text-center mb-4">
                        Select Difficulty Level:
                      </h5>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          {
                            id: "easy",
                            label: "Easy",
                            color: "from-green-500 to-emerald-500",
                            emoji: "😊",
                          },
                          {
                            id: "intermediate",
                            label: "Intermediate",
                            color: "from-yellow-500 to-orange-500",
                            emoji: "🤔",
                          },
                          {
                            id: "legend",
                            label: "Legend",
                            color: "from-red-500 to-purple-500",
                            emoji: "🔥",
                          },
                        ].map((level) => (
                          <button
                            key={level.id}
                            onClick={() => setSelectedDifficulty(level.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              selectedDifficulty === level.id
                                ? `bg-gradient-to-r ${level.color} text-white border-transparent shadow-lg`
                                : isDark
                                ? "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                                : "border-gray-200 hover:border-gray-300 bg-white/80"
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <span className="text-2xl">{level.emoji}</span>
                              <div className="text-center">
                                <div className="text-lg font-bold">
                                  {level.label}
                                </div>
                                <div
                                  className={`text-sm ${
                                    selectedDifficulty === level.id
                                      ? "text-white/80"
                                      : isDark
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {level.id === "easy" && "Basic questions"}
                                  {level.id === "intermediate" &&
                                    "Moderate challenge"}
                                  {level.id === "legend" && "Expert level"}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={generateQuiz}
                      disabled={quizLoader}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                    >
                      {quizLoader ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating Quiz...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-6 h-6" />
                          <span>Generate Quiz</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Quiz Questions Display */
                  <div className="flex-1 min-h-0">
                    <div
                      className={`h-full rounded-2xl border overflow-hidden ${
                        isDark
                          ? "bg-gray-800/50 border-gray-700"
                          : "bg-white/50 border-gray-200"
                      } backdrop-blur-sm`}
                    >
                      {/* Quiz Content Header */}
                      <div
                        className={`p-4 border-b flex items-center justify-between ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {quizQuestions.length}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              Quiz Questions
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {selectedDifficulty.charAt(0).toUpperCase() +
                                selectedDifficulty.slice(1)}{" "}
                              Level
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleResetQuiz}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            isDark
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Generate New Quiz
                        </button>
                      </div>

                      {/* Scrollable Quiz Area */}
                      <div className="h-full overflow-y-auto p-6 space-y-6">
                        {quizQuestions.map((question, questionIndex) => (
                          <div
                            key={questionIndex}
                            className={`p-6 rounded-xl border ${
                              isDark
                                ? "bg-gray-900/50 border-gray-600"
                                : "bg-white/80 border-gray-200"
                            } space-y-4`}
                          >
                            {/* Question Header */}
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">
                                  {questionIndex + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-lg font-semibold mb-2">
                                  Question {questionIndex + 1}
                                </h5>
                                <p className="text-base leading-relaxed">
                                  {question.question}
                                </p>
                              </div>
                            </div>

                            {/* Interactive Options */}
                            <div className="space-y-3 ml-11">
                              {question.options.map((option, optionIndex) => {
                                const isSelected =
                                  userAnswers[questionIndex] === option;
                                const isCorrect = option === question.answer;
                                const isWrong =
                                  isQuizSubmitted && isSelected && !isCorrect;
                                const showCorrect =
                                  isQuizSubmitted && isCorrect;

                                return (
                                  <button
                                    key={optionIndex}
                                    onClick={() =>
                                      !isQuizSubmitted &&
                                      handleAnswerSelect(questionIndex, option)
                                    }
                                    disabled={isQuizSubmitted}
                                    className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                                      isQuizSubmitted
                                        ? showCorrect
                                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                          : isWrong
                                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                          : isDark
                                          ? "border-gray-600 bg-gray-800/30"
                                          : "border-gray-200 bg-gray-50/50"
                                        : isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-[1.02]"
                                        : isDark
                                        ? "border-gray-600 bg-gray-800/30 hover:border-blue-400 hover:bg-blue-900/10"
                                        : "border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50"
                                    } ${
                                      !isQuizSubmitted
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                          isQuizSubmitted
                                            ? showCorrect
                                              ? "bg-emerald-500 text-white"
                                              : isWrong
                                              ? "bg-red-500 text-white"
                                              : isDark
                                              ? "bg-gray-700 text-gray-300"
                                              : "bg-gray-200 text-gray-600"
                                            : isSelected
                                            ? "bg-blue-500 text-white"
                                            : isDark
                                            ? "bg-gray-700 text-gray-300"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                      >
                                        {isQuizSubmitted && showCorrect && (
                                          <Check className="w-4 h-4" />
                                        )}
                                        {isQuizSubmitted && isWrong && "✕"}
                                        {(!isQuizSubmitted ||
                                          (!showCorrect && !isWrong)) &&
                                          String.fromCharCode(65 + optionIndex)}
                                      </div>
                                      <span
                                        className={`text-sm ${
                                          isQuizSubmitted
                                            ? showCorrect
                                              ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                              : isWrong
                                              ? "text-red-700 dark:text-red-300"
                                              : ""
                                            : isSelected
                                            ? "text-blue-700 dark:text-blue-300 font-medium"
                                            : ""
                                        }`}
                                      >
                                        {option}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Show result after submission */}
                            {isQuizSubmitted && (
                              <div className="ml-11">
                                {userAnswers[questionIndex] ===
                                question.answer ? (
                                  <div className="p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20">
                                    <div className="flex items-center space-x-2">
                                      <Check className="w-4 h-4 text-emerald-500" />
                                      <span className="text-sm font-medium text-emerald-500">
                                        Correct! Well done! 🎉
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-red-500 text-sm">
                                          ✕
                                        </span>
                                        <span className="text-sm font-medium text-red-500">
                                          Incorrect. You selected:{" "}
                                          {userAnswers[questionIndex] ||
                                            "No answer"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20">
                                      <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-emerald-500">
                                          Correct Answer: {question.answer}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Quiz Submission Section */}
                        {quizQuestions.length > 0 && !isQuizSubmitted && (
                          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pt-6 pb-4">
                            <div
                              className={`p-6 rounded-xl border ${
                                isDark
                                  ? "bg-gray-800/50 border-gray-700"
                                  : "bg-white/50 border-gray-200"
                              } backdrop-blur-sm`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div
                                    className={`text-sm ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    Progress: {Object.keys(userAnswers).length}/
                                    {quizQuestions.length} answered
                                  </div>
                                  <div className="flex space-x-1">
                                    {quizQuestions.map((_, index) => (
                                      <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${
                                          userAnswers[index]
                                            ? "bg-emerald-500"
                                            : isDark
                                            ? "bg-gray-600"
                                            : "bg-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  onClick={handleQuizSubmit}
                                  disabled={
                                    Object.keys(userAnswers).length === 0
                                  }
                                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                  <span>Submit Quiz</span>
                                  <span>📝</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quiz Results */}
                        {isQuizSubmitted && (
                          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pt-6 pb-4">
                            <div
                              className={`p-6 rounded-xl border ${
                                isDark
                                  ? "bg-gray-800/50 border-gray-700"
                                  : "bg-white/50 border-gray-200"
                              } backdrop-blur-sm`}
                            >
                              <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                  <Award className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-emerald-500 mb-2">
                                    Quiz Complete! 🎉
                                  </h4>
                                  <div className="text-3xl font-bold mb-2">
                                    {calculateScore()}/{quizQuestions.length}
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    Score:{" "}
                                    {Math.round(
                                      (calculateScore() /
                                        quizQuestions.length) *
                                        100
                                    )}
                                    %
                                  </p>
                                </div>
                                <button
                                  onClick={handleResetQuiz}
                                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium"
                                >
                                  Try Again
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {quizQuestions.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                              <Brain className="w-8 h-8 text-gray-500" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2">
                              No Questions Generated
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Click "Generate New Quiz" to create questions
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "summary" && (
              <div className="flex-1 flex items-center justify-center p-40">
                <div
                  className={`text-center max-w-md ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="text-6xl mb-6">🚧</div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Under Construction
                  </h3>
                  <p className="text-lg mb-2">
                    AI lesson summary generation coming soon!
                  </p>
                  <p className="text-sm">
                    We're building intelligent summarization to enhance your
                    learning experience.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="flex-1 flex items-center justify-center p-40">
                <div
                  className={`text-center max-w-md ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="text-6xl mb-6">🚧</div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Under Construction
                  </h3>
                  <p className="text-lg mb-2">
                    Video transcript feature coming soon!
                  </p>
                  <p className="text-sm">
                    We're working on automatic transcript generation for all
                    videos.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <RecommendedCoursesSection
        isDark={isDark}
        onTitleUpdate={handleRecommendationTitleUpdate}
        chatMessages={chatMessages}
        progress={progress}
      />
    </div>
  );
};

// Recommended Courses Component
const RecommendedCoursesSection = ({ isDark, onTitleUpdate, chatMessages, progress }) => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [recommendationMeta, setRecommendationMeta] = useState(null);

  // Import navigate hook properly
  const navigate = useNavigate();

  // Dummy recommended courses data
  const dummyRecommendedCourses = [
    {
      id: "REACT2025HINDI",
      courseId: "REACT2025HINDI",
      title: "Complete React.js Course - Hindi",
      instructor: "Chai aur Code",
      category: "Development",
      level: "Intermediate",
      duration: "20 hours",
      students: "45,234",
      rating: 4.9,
      price: "Free",
      thumbnail: "https://i.ytimg.com/vi/vz1RlUyrc3w/hqdefault.jpg",
      lessons: 35,
      description:
        "Complete React.js course from basics to advanced with real projects",
    },
    {
      id: "PYTHONDATASCIENCE2025ENGLISH",
      courseId: "PYTHONDATASCIENCE2025ENGLISH",
      title: "Python for Data Science - Complete Course",
      instructor: "NPTEL-NOC IITM",
      category: "Data Science",
      level: "Beginner",
      duration: "15 hours",
      students: "32,156",
      rating: 4.8,
      price: "Free",
      thumbnail: "https://i.ytimg.com/vi/tA42nHmmEKw/hqdefault.jpg",
      lessons: 27,
      description:
        "Learn Python programming for data analysis and machine learning",
    },
    {
      id: "DEVOPS2025HINDI",
      courseId: "DEVOPS2025HINDI",
      title: "Complete DevOps Course - Zero to Hero",
      instructor: "M Prashant",
      category: "DevOps",
      level: "Advanced",
      duration: "25 hours",
      students: "28,923",
      rating: 4.7,
      price: "Free",
      thumbnail: "https://i.ytimg.com/vi/BNTFJJMh2eU/hqdefault.jpg",
      lessons: 20,
      description: "Master DevOps with Docker, Kubernetes, Jenkins and more",
    },
    {
      id: "GIT2025HINDI",
      courseId: "GIT2025HINDI",
      title: "Complete Git and GitHub Tutorial Series",
      instructor: "Engineering Digest",
      category: "Development",
      level: "Beginner",
      duration: "3 hours",
      students: "67,891",
      rating: 4.6,
      price: "Free",
      thumbnail: "https://i.ytimg.com/vi/-3SMW-3Z4OM/hqdefault.jpg",
      lessons: 18,
      description: "Master Git version control and GitHub collaboration",
    },
    {
      id: "FLUTTER2025EN",
      courseId: "FLUTTER2025EN",
      title: "Flutter Mobile Development Course",
      instructor: "Flutter Team",
      category: "Mobile",
      level: "Intermediate",
      duration: "18 hours",
      students: "23,445",
      rating: 4.5,
      price: "Free",
      thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
      lessons: 25,
      description: "Build beautiful cross-platform mobile apps with Flutter",
    },
  ];

  // Fetch real recommendations from TensorFlow model
  useEffect(() => {
    // Only fetch recommendations on initial load and progress changes
    const fetchRecommendedCourses = async () => {
      setIsLoading(true);

      try {
        console.log("🤖 Fetching AI-powered course recommendations...");
        const apiResponse = await GetRecommendedCoursesApi();
        console.log("🎯 Recommendation API Response:", apiResponse);

        if (apiResponse.status === 200 || apiResponse.status === 201) {
          const recommendations = apiResponse.data.recommendations || [];
          console.log(
            "✅ Got recommendations:",
            recommendations.length,
            "courses"
          );

          // Store meta information about recommendations
          setRecommendationMeta({
            predicted_categories: apiResponse.meta?.predicted_categories || [],
            total_enrollments: apiResponse.meta?.total_enrollments || 0,
            model_type: apiResponse.meta?.model_type || "unknown",
            reason: apiResponse.meta?.reason || apiResponse.data?.reason || "",
          });

          // Map backend course data to frontend format
          const formattedCourses = recommendations.map((course) => ({
            id: course.courseId || course._id,
            courseId: course.courseId || course._id,
            title: course.title || course.courseName || "Untitled Course",
            instructor:
              course.instructor || course.createdBy || "Expert Instructor",
            category: course.category || "General",
            level: course.level || course.difficulty || "Beginner",
            duration: course.duration || "Varies",
            students: course.students || course.studentsEnrolled || "0",
            rating: course.rating || 4.5,
            price: course.price || "Free",
            thumbnail:
              course.thumbnail ||
              course.thumbnailUrl ||
              `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                course.title || "Course"
              )}`,
            lessons:
              course.lessons || course.totalLessons || course.videoCount || 10,
            description:
              course.description ||
              course.shortDescription ||
              "Comprehensive course to enhance your skills",
          }));

          setRecommendedCourses(formattedCourses);
          console.log("📚 Formatted courses:", formattedCourses);
        } else {
          console.warn(
            "❌ API returned non-success status:",
            apiResponse.status
          );
          console.warn("📝 API message:", apiResponse.message);

          // Fallback to dummy data if API fails
          console.log("🔄 Falling back to dummy data...");
          setRecommendedCourses(dummyRecommendedCourses);
          setRecommendationMeta({
            reason: "Using fallback data due to API error",
          });
        }
      } catch (error) {
        console.error("💥 Error fetching recommendations:", error);
        console.log("🔄 Falling back to dummy data due to error...");

        // Fallback to dummy data on error
        setRecommendedCourses(dummyRecommendedCourses);
        setRecommendationMeta({
          reason: "Using fallback data due to connection error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [progress]); // Only re-fetch when progress changes

  // Handle enrollment modal
  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsEnrollmentModalOpen(true);
  };

  const handleEnrollmentConfirm = async (course) => {
    // Here you can add your enrollment logic
    console.log("🎓 Enrolling in recommended course:", course);
    console.log("🔍 Course properties:", Object.keys(course));
    console.log("🆔 course.id:", course.id);
    console.log("🆔 course.courseId:", course.courseId);

    try {
      // Call the enrollment API - use courseId consistently
      const courseIdToUse = course.courseId || course.id;
      console.log("📝 Using course ID for API:", courseIdToUse);

      const apiResponse = await EnrollmentCourseApi(courseIdToUse);
      console.log("📡 API Response:", apiResponse);
      console.log("📊 API Status:", apiResponse.status);

      // Fix the condition logic - should be OR, not AND
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        console.error("❌ API Error:", apiResponse);
        alert("Error is there: " + apiResponse?.message);
        return;
      }

      console.log("✅ Enrollment successful!");

      // Use the shared getCourseTitle function
      const dynamicTitle = getCourseTitle(
        courseIdToUse,
        apiResponse?.data?.title || course.title
      );

      console.log("🎯 Dynamic course title set:", dynamicTitle);
      console.log("📝 Course ID used:", courseIdToUse);

      // Close the modal first
      setIsEnrollmentModalOpen(false);
      setSelectedCourse(null);

      // Show success notification
      setSuccessMessage(
        `Successfully enrolled in "${course.title}"! Redirecting to course...`
      );
      setShowSuccessNotification(true);

      // Auto-hide notification after 2 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 2000);

      // Navigate to the course after a short delay
      setTimeout(() => {
        const finalCourseId = courseIdToUse;
        console.log("🚀 Navigating to course with ID:", finalCourseId);
        console.log("🌐 Navigation URL will be:", `/learn/${finalCourseId}`);
        console.log("🔄 Current URL before navigation:", window.location.href);

        // Force page reload to ensure proper navigation
        window.location.href = `/learn/${finalCourseId}`;

        // Alternative approach using navigate with replace and reload
        // navigate(`/learn/${finalCourseId}`, { replace: true });
        // window.location.reload();

        // Check if navigation happened
        setTimeout(() => {
          console.log("🔍 URL after navigation:", window.location.href);
        }, 500);
      }, 1500);
    } catch (error) {
      console.error("💥 Enrollment error:", error);
      alert("Error enrolling in course: " + error.message);
    }
  };

  const handleModalClose = () => {
    setIsEnrollmentModalOpen(false);
    setSelectedCourse(null);
  };

  // Handle dynamic title change
  const handleTitleChange = (courseId, courseTitle) => {
    console.log("🔄 Title change requested for:", courseId, courseTitle);

    // Call parent callback if available
    if (onTitleUpdate) {
      onTitleUpdate(courseId, courseTitle);
    } else {
      // Fallback: Update document title directly
      const dynamicTitle = getCourseTitle(courseId, courseTitle);
      document.title = `${dynamicTitle} | StudySync AI`;
      console.log("📝 Document title updated to:", document.title);
    }
  };

  // Course title mapping function (shared)
  const getCourseTitle = (courseId, fallbackTitle) => {
    const courseTitleMap = {
      PYTHON2025ENG: "Complete Python Programming Course 2025",
      PYTHON2025HINDI: "Complete Python Programming Course - Hindi",
      REACT2025HINDI: "Complete React.js Course - Hindi",
      NODEJS2025HINDI: "Complete Node.js Course - Hindi",
      FLUTTER2025EN: "Flutter Mobile Development Course",
      GIT2025ENG: "Complete Git & GitHub Tutorial",
      GIT2025HINDI: "Complete Git और GitHub Tutorial - Hindi",
      AIML2025ENG: "Artificial Intelligence & Machine Learning Course",
      UIUXHINDI: "Complete UI/UX Design Course - Hindi",
      PYTHONDATASCIENCE2025ENGLISH: "Python for Data Science - Complete Course",
      DEVOPS2025HINDI: "Complete DevOps Course - Zero to Hero",
    };

    return courseTitleMap[courseId] || fallbackTitle || courseId || "Course";
  };

  const RecommendedCourseCard = ({ course }) => (
    <div
      className={`flex-shrink-0 w-72 sm:w-80 md:w-96 ${
        isDark
          ? "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border-gray-700/50"
          : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-200/50"
      } border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 
      transform hover:-translate-y-3 hover:scale-[1.05] group backdrop-blur-lg
      ${
        isDark ? "shadow-xl shadow-gray-900/30" : "shadow-xl shadow-gray-300/20"
      }
      hover:border-emerald-500/50 relative`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

      {/* Course Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-44 sm:h-48 object-cover group-hover:scale-115 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-700"></div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
          </div>
        </div>

        {/* Level Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg ${
            course.level === "Beginner"
              ? "bg-green-500/90 text-white border-green-400/50"
              : course.level === "Intermediate"
              ? "bg-yellow-500/90 text-white border-yellow-400/50"
              : "bg-red-500/90 text-white border-red-400/50"
          }`}
        >
          🎯 {course.level}
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg border border-white/20">
          💎 {course.price}
        </div>

        {/* Featured Badge */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
          ⭐ Recommended
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6 relative">
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-3 ${
              isDark
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-300"
            } shadow-sm`}
          >
            📚 {course.category}
          </span>
          <h4 className="font-bold text-lg leading-tight mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:bg-clip-text transition-all duration-500 line-clamp-2">
            {course.title}
          </h4>
        </div>

        <p
          className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4 text-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-3 shadow-md">
            <span className="text-white text-xs">👨‍🏫</span>
          </div>
          <div>
            <p className="font-semibold truncate">{course.instructor}</p>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Expert Instructor
            </p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? "bg-gray-700/50 hover:bg-gray-700/70"
                : "bg-gray-50 hover:bg-gray-100"
            } border ${isDark ? "border-gray-600/50" : "border-gray-200"}`}
          >
            <span className="text-emerald-500 text-lg">⏱️</span>
            <div>
              <p className="text-xs font-medium">{course.duration}</p>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Duration
              </p>
            </div>
          </div>
          <div
            className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? "bg-gray-700/50 hover:bg-gray-700/70"
                : "bg-gray-50 hover:bg-gray-100"
            } border ${isDark ? "border-gray-600/50" : "border-gray-200"}`}
          >
            <span className="text-emerald-500 text-lg">�</span>
            <div>
              <p className="text-xs font-medium">{course.lessons} lessons</p>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Content
              </p>
            </div>
          </div>
        </div>

        {/* Rating & Students */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm transition-all duration-200 ${
                    i < Math.floor(course.rating)
                      ? "text-yellow-500 scale-110"
                      : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="font-bold text-lg text-yellow-500">
              {course.rating}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span className="text-blue-500">👥</span>
            <span className="font-semibold">{course.students}</span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              students
            </span>
          </div>
        </div>

        {/* Enroll Button */}
        <button
          onClick={() => handleEnrollClick(course)}
          className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white py-4 px-6 rounded-2xl 
                   hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600 transition-all duration-500 font-bold text-base
                   flex items-center justify-center space-x-3 group shadow-xl hover:shadow-2xl transform hover:scale-[1.02]
                   border border-emerald-400/30 hover:border-emerald-300/50 relative overflow-hidden"
        >
          {/* Button Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <span className="relative z-10">🚀 Enroll Now</span>
          <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-300 text-xl">
            →
          </span>
        </button>
      </div>
    </div>
  );

  // Professional Loader Component
  const RecommendationLoader = () => (
    <div className="flex space-x-6 overflow-hidden">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`flex-shrink-0 w-72 sm:w-80 md:w-96 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border-2 rounded-3xl overflow-hidden shadow-xl animate-pulse`}
        >
          {/* Thumbnail Skeleton */}
          <div
            className={`h-44 sm:h-48 ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            } relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>

            {/* Skeleton badges */}
            <div className="absolute top-4 left-4 w-20 h-6 bg-gray-500/50 rounded-full"></div>
            <div className="absolute top-4 right-4 w-16 h-6 bg-gray-500/50 rounded-xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-5 bg-gray-500/50 rounded-full"></div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Category Badge */}
            <div
              className={`h-6 w-28 ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              } rounded-full`}
            ></div>

            {/* Title */}
            <div className="space-y-2">
              <div
                className={`h-5 w-full ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded`}
              ></div>
              <div
                className={`h-5 w-4/5 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded`}
              ></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div
                className={`h-4 w-full ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded`}
              ></div>
              <div
                className={`h-4 w-3/5 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded`}
              ></div>
            </div>

            {/* Instructor */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded-full`}
              ></div>
              <div className="space-y-1">
                <div
                  className={`h-4 w-32 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                  } rounded`}
                ></div>
                <div
                  className={`h-3 w-24 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                  } rounded`}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`h-16 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded-xl`}
              ></div>
              <div
                className={`h-16 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded-xl`}
              ></div>
            </div>

            {/* Rating & Students */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div
                  className={`h-4 w-24 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                  } rounded`}
                ></div>
              </div>
              <div
                className={`h-4 w-20 ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                } rounded`}
              ></div>
            </div>

            {/* Button */}
            <div
              className={`h-14 w-full ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              } rounded-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`w-full ${isDark ? "bg-gray-900" : "bg-gray-50"} border-t ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="max-w-full px-6 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Recommended for You
            </h2>
          </div>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {isLoading
              ? "AI is analyzing your learning pattern..."
              : recommendationMeta?.reason
              ? recommendationMeta.reason
              : `Personalized course recommendations using ${
                  recommendationMeta?.model_type || "AI"
                } model${
                  recommendationMeta?.predicted_categories?.length > 0
                    ? ` • Predicted interests: ${recommendationMeta.predicted_categories.join(
                        ", "
                      )}`
                    : ""
                }`}
          </p>
        </div>

        {/* Courses Container */}
        <div className="relative">
          {isLoading ? (
            <div className="overflow-x-hidden">
              <RecommendationLoader />
            </div>
          ) : (
            <div className="relative">
              {/* Custom Scrollbar Container */}
              <div
                className={`flex space-x-6 overflow-x-auto pb-6 px-2 scroll-smooth
                  scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full
                  ${
                    isDark
                      ? "scrollbar-thumb-emerald-500/70 scrollbar-track-gray-700/50 hover:scrollbar-thumb-emerald-400"
                      : "scrollbar-thumb-emerald-500/70 scrollbar-track-gray-300/50 hover:scrollbar-thumb-emerald-600"
                  }
                  scrollbar-thumb-hover:bg-emerald-400 scrolling-touch`}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: isDark
                    ? "#10b981 #374151"
                    : "#10b981 #d1d5db",
                }}
              >
                {recommendedCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <RecommendedCourseCard course={course} />
                  </div>
                ))}

                {/* Scroll Padding */}
                <div className="flex-shrink-0 w-6"></div>
              </div>

              {/* Scroll Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {recommendedCourses.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isDark ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Mobile Scroll Hint */}
              <div className="md:hidden flex items-center justify-center mt-4 space-x-2 text-sm opacity-70">
                <span>👈</span>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Swipe to explore more courses
                </span>
                <span>👉</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Modal */}
      {isEnrollmentModalOpen && selectedCourse && (
        <EnrollmentModal
          isOpen={isEnrollmentModalOpen}
          onClose={handleModalClose}
          onConfirm={handleEnrollmentConfirm}
          course={selectedCourse}
          isDark={isDark}
          onTitleChange={handleTitleChange}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          message={successMessage}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default CoursesInterface;
