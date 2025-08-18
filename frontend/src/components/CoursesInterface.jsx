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
import { GetSummaryOfCurrentCourse } from "../api/GetSummaryOfCurrentCourse.js";
import { SendAiChatApi } from '../api/SendAiChatApi.js'

// Notion-style formatting function
const formatNotesToHTML = (text, isDark = false) => {
  if (!text) return '<p class="text-gray-500">Start typing your notes...</p>';

  let html = text
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

  return `<div class="${
    isDark ? "text-gray-100" : "text-gray-800"
  }">${html}</div>`;
};

// Simple chat message formatter matching notes style
const formatChatMessageHTML = (text, isDark = false) => {
  if (!text) return '';

  let html = text
    // Code blocks (multiline) - Handle BEFORE converting newlines to <br>
    .replace(
      /```(\w*)\n?([\s\S]*?)\n?```/g,
      (match, language, code) => {
        const lang = language || 'text';
        return `<pre class="line-numbers bg-gray-900 rounded-lg p-3 my-2 overflow-x-auto"><code class="language-${lang} text-sm">${escapeHtml(code.trim())}</code></pre>`;
      }
    )
    
    // Headers
    .replace(
      /^### (.*$)/gm,
      `<h3 class="text-lg font-bold mt-4 mb-2 ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</h3>`
    )
    .replace(
      /^## (.*$)/gm,
      `<h2 class="text-xl font-bold mt-5 mb-2 ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</h2>`
    )
    .replace(
      /^# (.*$)/gm,
      `<h1 class="text-2xl font-bold mt-6 mb-3 ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</h1>`
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

    // Bullet points
    .replace(
      /^- (.*$)/gm,
      `<div class="flex items-start space-x-2 mb-2"><span class="${
        isDark ? "text-emerald-400" : "text-emerald-600"
      }">•</span><span>$1</span></div>`
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

    // Blockquotes
    .replace(
      /^> (.*$)/gm,
      `<div class="border-l-4 pl-4 py-3 my-3 ${
        isDark
          ? "border-blue-500 bg-blue-900/20 text-blue-200"
          : "border-blue-500 bg-blue-50 text-blue-800"
      }">$1</div>`
    );

  // Split into sections and handle properly
  const sections = html.split('\n\n').filter(s => s.trim());
  
  const formattedSections = sections.map(section => {
    const trimmed = section.trim();
    
    // If it's already a formatted element (header, div, pre, etc.), keep as is
    if (trimmed.match(/^<(h[1-6]|div|pre|blockquote)/)) {
      return trimmed;
    }
    
    // If it contains bullet points, keep as is
    if (trimmed.includes('<div class="flex items-start')) {
      return trimmed;
    }
    
    // Regular text - wrap in paragraph with proper spacing
    return `<p class="mb-3 leading-relaxed">${trimmed.replace(/\n/g, ' ')}</p>`;
  });

  return `<div class="${
    isDark ? "text-gray-100" : "text-gray-800"
  }">${formattedSections.join('')}</div>`;
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
  const [coursePlaylist, setCoursePlaylist] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notStoreNotes, setNotStoreNotes] = useState("");
  const [storedNotes, setStoredNotes] = useState("");
  const [completedVideosIndex, setCompletedVideosIndex] = useState(-1);
  const [summaryText, setSummaryText] = useState("");
  // Real-time markdown editor - no view mode switching needed
  const [activeNotesTab, setActiveNotesTab] = useState("editor"); // "editor", "preview", "split"
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

  const summaryLoader = useLoaders((state) => state.summarizeLoader);
  const transcriptLoader = useLoaders((state) => state.transcriptLoader);
  const setSummaryLoader = useLoaders((state) => state.setSummarizeLoader);
  const unsetSummaryLoader = useLoaders((state) => state.unsetSummarizeLoader);
  const setTranscriptLoader = useLoaders((state) => state.setTranscriptLoader);
  const unsetTranscriptLoader = useLoaders(
    (state) => state.unsetTranscriptLoader
  );

  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [videoSize, setVideoSize] = useState(55); // Default 50%
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message: `Hello! I'm your AI study assistant for course "${courseId}" , how can I assist you today ?`,
      timestamp: new Date(),
      avatar: "🤖",
    },
  ]);
  const [transcriptText, setTranscriptText] = useState([]);
  const currentCourse = {
    title: "Complete React Hooks Guide",
    instructor: "React Developer Pro",
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

  // On CourseId change , change the courseId in Zustand state
  useEffect(() => {
    console.log("Course ID changed:", courseId);
    setCourseIdFromZustand(courseId);
    clearNotesFromZustand(); // it will clear the notes in zustand for the new course
    console.log("✅ Cleared Zustand notes for new course");
  }, [courseId]);

  // fetch the ai chat response
  useEffect( () => {

  }, [] )

  // Simple Prism highlighting on chat message updates
  useEffect(() => {
    if (window.Prism) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        window.Prism.highlightAll();
      }, 100);
    }
  }, [chatMessages]);

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

  // const handleSaveNotes = async () => {
  //   try {

  //     console.log("notStoreNotes:", notStoreNotes);
  //     console.log("storedNotesFromZustand:", storedNotesFromZustand);
  //     console.log("storedNotes:", storedNotes);
  //     console.log("notStoreNotesFromZustand:", notStoreNotesFromZustand);

  //     // if stored notes are equal to not stored notes then no need to call API
  //     if (notStoreNotes.trim() === notStoreNotesFromZustand.trim()) {
  //       alert("No changes detected in notes.");
  //       return;
  //     }

  //     setNotesLoader();
  //     // if notStoreNotes is not equal to storedNotes then call API to create a new Note
  //     const apiResponse = await SaveCourseNotesApi({
  //       courseId,
  //       notes: notStoreNotes,
  //     });
  //     console.log("Api Response for Creating Note: ", apiResponse);
  //     if (apiResponse.status !== 200 && apiResponse.status !== 201) {
  //       // Logic For Error Notification
  //       console.log(
  //         "Error in fetching notes: ",
  //         apiResponse?.message || "Error in fetching notes"
  //       );
  //       return;
  //     }

  //     unsetNotesLoader();

  //     // Update both local state and Zustand with the saved notes
  //     const savedNotes = apiResponse?.data?.notes || "";
  //     // setStoredNotes(savedNotes);

  //     // Update Zustand store as well
  //     // setStoredNotesFromZustand(savedNotes);
  //     setNotStoreNotesFromZustand(savedNotes);

  //     console.log("✅ Notes saved successfully and synced with Zustand");
  //     alert("Notes Saved Successfully");

  //   } catch (err) {
  //     alert("Error fetching notes: " + err.message);
  //     // unsetNotesLoader();
  //   } finally {
  //     unsetNotesLoader();
  //   }
  // };

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
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: chatMessage,
      timestamp: new Date(),
      avatar: "👤",
    };

    setChatMessages([...chatMessages, newMessage]);

    // // Simulate AI response
    // setTimeout(() => {
    //   const aiResponse = {
    //     id: chatMessages.length + 2,
    //     type: "ai",
    //     message:
    //       "That's an excellent question about React Hooks! Let me explain that concept in detail...",
    //     timestamp: new Date(),
    //     avatar: "🤖",
    //   };
    //   setChatMessages((prev) => [...prev, aiResponse]);
    // }, 1000);

    const apiResponse = await SendAiChatApi({ prompt: chatMessage, courseId })
    setChatMessage("");

    console.log("Api Response for send Chat: ", apiResponse)

    if (apiResponse.status !== 200 && apiResponse.status !== 201) {
      alert("Error sending message: " + apiResponse?.message || "Error in sending message");
      return; 
    }

      const aiMessage = {
        id: chatMessages.length + 2,
        type: "ai",
        message: apiResponse?.data?.response,
        timestamp: new Date(),
        avatar: "🤖",
      };

    setChatMessages((prev) => [...prev , aiMessage]);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
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
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    by {currentCourse.instructor}
                  </span>
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
                      label: "Summary",
                      icon: FileText,
                      badge: null,
                      color: "from-orange-500 to-orange-600",
                      emoji: "📚",
                    },
                    {
                      id: "transcript",
                      label: "Transcript",
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
                                  __html: formatChatMessageHTML(message.message, isDark)
                                }}
                              />
                            ) : (
                              <p className="leading-relaxed">{message.message}</p>
                            )}
                          </div>

                          {message.type === "user" && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">👤</span>
                            </div>
                          )}
                        </div>
                      ))}
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
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live Preview</span>
                      </div>
                    </div>

                    {/* Professional Notes Interface */}
                    <div className="space-y-4">
                      {/* Header with Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📝</span>
                          <span className="font-medium text-sm">Notes Editor</span>
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
                          <span className="text-xs">{showPreview ? '👁️' : '📝'}</span>
                          <span className="text-xs font-medium">
                            {showPreview ? 'Preview' : 'Editor'}
                          </span>
                        </button>
                      </div>

                      {/* Main Editor */}
                      <div className="relative">
                        <textarea
                          placeholder="# My Lesson Notes

## Key Concepts
- **Important insight**
- Another key point
- Third important item

## Questions & Thoughts
- [ ] What should I research more?
- [x] Understood this concept
- [ ] Practice this tomorrow

## Timestamps
[05:30] - Key explanation
[12:45] - Important example
[18:20] - Summary

---

**Personal Summary**: Write your key takeaways here..."
                          className={`w-full p-4 rounded-xl border text-sm font-mono resize-none transition-all duration-300 ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-750"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:bg-gray-50"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                          value={notStoreNotes}
                          onChange={(e) => setNotStoreNotes(e.target.value)}
                          style={{ height: showPreview ? '200px' : '300px' }}
                        />
                        
                        {/* Character count */}
                        <div className={`absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full ${
                          isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                        }`}>
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
                                  __html: formatNotesToHTML(notStoreNotes, isDark),
                                }}
                              />
                            ) : (
                              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span className="text-2xl mb-2 block">📝</span>
                                <p className="text-sm">Start typing to see your formatted notes...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>                    {/* Status & Actions */}
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
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">📚</span>
                      <h3 className="text-lg font-semibold">Lesson Summary</h3>
                      <button
                        onClick={fetchSummary}
                        disabled={summaryLoader}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-300 flex items-center space-x-1.5 ${
                          summaryLoader
                            ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                        }`}
                      >
                        {summaryLoader ? (
                          <>
                            <div className="flex items-center space-x-0.5">
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                              <div
                                className="w-1 h-1 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1 h-1 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <span>🤖</span>
                            <span>Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      } max-h-96 overflow-y-auto`}
                    >
                      {summaryText ? (
                        <div className="space-y-4">
                          {/* Summary Header */}
                          <div
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                              isDark
                                ? "bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-orange-500/30"
                                : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                                <span className="text-white text-xl">📚</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">
                                  AI Generated Summary
                                </h4>
                                <p
                                  className={`text-sm ${
                                    isDark
                                      ? "text-orange-300"
                                      : "text-orange-600"
                                  }`}
                                >
                                  Key insights from this lesson
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Summary Content */}
                          <div
                            className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                              isDark
                                ? "bg-gray-800 border-gray-600 hover:border-orange-500 hover:bg-gray-750"
                                : "bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50"
                            }`}
                          >
                            {/* Copy Button */}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(summaryText)
                              }
                              className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                                isDark
                                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                              }`}
                              title="Copy summary"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>

                            {/* Summary Badge */}
                            <div className="flex items-center space-x-2 mb-4">
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  isDark
                                    ? "bg-orange-900/30 text-orange-400 border border-orange-700"
                                    : "bg-orange-100 text-orange-700 border border-orange-200"
                                }`}
                              >
                                AI Summary
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs ${
                                  isDark
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                Auto-generated
                              </div>
                            </div>

                            {/* Summary Text */}
                            <div
                              className={`text-sm leading-relaxed ${
                                isDark ? "text-gray-100" : "text-gray-800"
                              }`}
                            >
                              <div className="prose prose-sm max-w-none selection:bg-orange-200 selection:text-orange-900">
                                {summaryText.split("\n").map(
                                  (paragraph, index) =>
                                    paragraph.trim() && (
                                      <p key={index} className="mb-3 last:mb-0">
                                        {paragraph}
                                      </p>
                                    )
                                )}
                              </div>
                            </div>

                            {/* Summary Stats */}
                            <div
                              className={`mt-4 pt-4 border-t flex items-center justify-between ${
                                isDark ? "border-gray-700" : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-4 text-xs">
                                <div className="flex items-center space-x-1">
                                  <span className="text-orange-500">📊</span>
                                  <span
                                    className={
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }
                                  >
                                    {summaryText.split(" ").length} words
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-orange-500">⏱️</span>
                                  <span
                                    className={
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }
                                  >
                                    ~
                                    {Math.ceil(
                                      summaryText.split(" ").length / 200
                                    )}{" "}
                                    min read
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                                    isDark
                                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                  }`}
                                  onClick={fetchSummary}
                                >
                                  🔄 Regenerate
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`text-center py-12 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <div className="text-4xl mb-4">📚</div>
                          <p className="text-lg font-medium mb-2">
                            No summary available
                          </p>
                          <p className="text-sm">
                            Click "Generate Summary" to create an AI-powered
                            lesson summary
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "transcript" && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">📜</span>
                      <h3 className="text-lg font-semibold">Transcript</h3>
                      <button
                        onClick={fetchTranscript}
                        disabled={transcriptLoader}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-300 flex items-center space-x-1.5 ${
                          transcriptLoader
                            ? "bg-gradient-to-r from-purple-400 to-indigo-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                        }`}
                      >
                        {transcriptLoader ? (
                          <>
                            <div className="flex items-center space-x-0.5">
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                              <div
                                className="w-1 h-1 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1 h-1 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span>Fetching...</span>
                          </>
                        ) : (
                          <>
                            <span>📜</span>
                            <span>Fetch</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      } max-h-64 overflow-y-auto`}
                    >
                      <div className="space-y-2 text-sm">
                        <div>
                          {transcriptText && transcriptText.length > 0 ? (
                            <div className="space-y-3">
                              {(showAllTranscript
                                ? transcriptText
                                : transcriptText.slice(0, 3)
                              ).map((snippet, index) => (
                                <div
                                  key={index}
                                  className={`group relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                                    isDark
                                      ? "bg-gray-800 border-gray-600 hover:border-emerald-500 hover:bg-gray-750"
                                      : "bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
                                  }`}
                                >
                                  {/* Timestamp Badge */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                                          isDark
                                            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700"
                                            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        }`}
                                      >
                                        {Math.floor(snippet.startTime)}s -{" "}
                                        {Math.floor(snippet.endTime)}s
                                      </div>
                                      <div
                                        className={`px-2 py-1 rounded text-xs ${
                                          isDark
                                            ? "bg-gray-700 text-gray-300"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        #
                                        {showAllTranscript
                                          ? index + 1
                                          : index + 1}
                                      </div>
                                    </div>
                                    {/* Copy Button */}
                                    <button
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          snippet.text
                                        )
                                      }
                                      className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                                        isDark
                                          ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                      }`}
                                      title="Copy text"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Transcript Text */}
                                  <div
                                    className={`text-sm leading-relaxed ${
                                      isDark ? "text-gray-100" : "text-gray-800"
                                    }`}
                                  >
                                    <p className="selection:bg-emerald-200 selection:text-emerald-900">
                                      {snippet.text}
                                    </p>
                                  </div>

                                  {/* Progress Bar */}
                                  <div
                                    className={`mt-3 h-1 rounded-full overflow-hidden ${
                                      isDark ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                                  >
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          ((snippet.endTime -
                                            snippet.startTime) /
                                            Math.max(
                                              ...transcriptText.map(
                                                (s) => s.endTime
                                              )
                                            )) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}

                              {/* Mobile Show More/Less Button */}
                              {transcriptText.length > 3 && (
                                <div className="flex justify-center pt-2">
                                  <button
                                    onClick={() =>
                                      setShowAllTranscript(!showAllTranscript)
                                    }
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                                      isDark
                                        ? "border-emerald-600 bg-emerald-900/20 hover:bg-emerald-800/30 text-emerald-400"
                                        : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                    }`}
                                  >
                                    <span className="text-sm">
                                      {showAllTranscript ? "📋" : "📜"}
                                    </span>
                                    <span className="text-sm font-medium">
                                      {showAllTranscript
                                        ? `Show Less`
                                        : `+${transcriptText.length - 3} More`}
                                    </span>
                                    <svg
                                      className={`w-3 h-3 transition-transform duration-300 ${
                                        showAllTranscript ? "rotate-180" : ""
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`text-center py-12 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <div className="text-4xl mb-4">📜</div>
                              <p className="text-lg font-medium mb-2">
                                No transcript available
                              </p>
                              <p className="text-sm">
                                Click "Fetch Transcript" to load the video
                                transcript
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
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
                  label: "Transcript",
                  icon: Mic,
                  badge: null,
                  color: "bg-purple-500",
                },
                {
                  id: "summary",
                  label: "Summary",
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
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden max-w-full">
            {activeTab === "chat" && (
              <div className="h-full flex flex-col max-w-full">
                {/* AI Assistant Header */}
                <div
                  className={`p-4 rounded-2xl mb-4 bg-gradient-to-r max-w-full ${
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

                {/* Chat Messages */}

                <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
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
                              __html: formatChatMessageHTML(message.message, isDark)
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
                </div>

                {/* Enhanced Chat Input */}
                <div
                  className={`border rounded-xl p-4 ${
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
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Real-time Preview</span>
                  </div>
                </div>

                {/* Professional Notes Interface */}
                <div className="h-[500px] space-y-4">
                  {/* Header with Tabs */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📝</span>
                      <h3 className="font-semibold text-lg">Notes</h3>
                    </div>
                    
                    {/* Tab Switcher */}
                    <div className={`flex items-center space-x-1 p-1 rounded-xl border ${
                      isDark ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"
                    }`}>
                      <button
                        onClick={() => setActiveNotesTab('editor')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          activeNotesTab === 'editor'
                            ? isDark
                              ? "bg-emerald-900/30 text-emerald-400 shadow-lg"
                              : "bg-emerald-100 text-emerald-700 shadow-md"
                            : isDark
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <span>✏️</span>
                        <span className="font-medium">Editor</span>
                      </button>
                      <button
                        onClick={() => setActiveNotesTab('preview')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          activeNotesTab === 'preview'
                            ? isDark
                              ? "bg-emerald-900/30 text-emerald-400 shadow-lg"
                              : "bg-emerald-100 text-emerald-700 shadow-md"
                            : isDark
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <span>👁️</span>
                        <span className="font-medium">Preview</span>
                      </button>
                      <button
                        onClick={() => setActiveNotesTab('split')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          activeNotesTab === 'split'
                            ? isDark
                              ? "bg-emerald-900/30 text-emerald-400 shadow-lg"
                              : "bg-emerald-100 text-emerald-700 shadow-md"
                            : isDark
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <span>📊</span>
                        <span className="font-medium">Split</span>
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="h-full">
                    {activeNotesTab === 'editor' && (
                      <div className="h-full space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <span>⚡</span>
                            <span>Markdown Editor</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full ${
                            isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                          }`}>
                            {notStoreNotes.length} characters
                          </div>
                        </div>
                        <textarea
                          placeholder="# My Lesson Notes

## Key Concepts
- **Important insight** - This is crucial for understanding
- Another key point with detailed explanation
- Third important item that I need to remember

## Questions & Thoughts
- [ ] What should I research more about this topic?
- [x] I understand this concept now
- [ ] Practice this tomorrow with examples
- [ ] Create a project using this knowledge

## Timestamps & References
[05:30] - Key explanation about the main concept
[12:45] - Important example that clarifies everything
[18:20] - Summary and next steps

## Code Snippets
```javascript
// Example code I want to remember
const example = 'This is important';
```

---

**Personal Summary**: 
Write your key takeaways and insights here. What did you learn? How will you apply this knowledge?"
                          className={`w-full h-full p-6 rounded-xl border text-sm font-mono resize-none transition-all duration-300 ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-750"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:bg-gray-50"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                          value={notStoreNotes}
                          onChange={(e) => setNotStoreNotes(e.target.value)}
                        />
                      </div>
                    )}

                    {activeNotesTab === 'preview' && (
                      <div className="h-full space-y-3">
                        <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                          <span>✨</span>
                          <span>Formatted Preview</span>
                        </div>
                        <div
                          className={`w-full h-full p-6 rounded-xl border overflow-y-auto ${
                            isDark
                              ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-600 text-white"
                              : "bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-900"
                          }`}
                        >
                          {notStoreNotes ? (
                            <div
                              className="prose prose-base max-w-none prose-headings:text-emerald-600 dark:prose-headings:text-emerald-400 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800"
                              dangerouslySetInnerHTML={{
                                __html: formatNotesToHTML(notStoreNotes, isDark),
                              }}
                            />
                          ) : (
                            <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span className="text-4xl mb-4 block">📝</span>
                              <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                              <p className="text-sm">Switch to Editor tab to start writing your notes</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeNotesTab === 'split' && (
                      <div className="h-full grid grid-cols-2 gap-6">
                        {/* Editor Side */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span>✏️</span>
                            <span>Editor</span>
                          </div>
                          <textarea
                            placeholder="# Start writing your notes here...

## Use markdown for formatting
- **Bold text**
- *Italic text*
- [Links](url)
- `code snippets`"
                            value={notStoreNotes}
                            onChange={(e) => setNotStoreNotes(e.target.value)}
                            className={`w-full h-full p-4 rounded-xl border resize-none font-mono text-sm transition-all duration-300 ${
                              isDark
                                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400"
                            } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                          />
                        </div>
                        
                        {/* Preview Side */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span>👁️</span>
                            <span>Live Preview</span>
                          </div>
                          <div
                            className={`w-full h-full p-4 rounded-xl border overflow-y-auto ${
                              isDark
                                ? "bg-gray-900 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-gray-900"
                            }`}
                          >
                            {notStoreNotes ? (
                              <div
                                className="prose prose-sm max-w-none prose-headings:text-emerald-600 dark:prose-headings:text-emerald-400 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300"
                                dangerouslySetInnerHTML={{
                                  __html: formatNotesToHTML(notStoreNotes, isDark),
                                }}
                              />
                            ) : (
                              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span className="text-2xl mb-2 block">✨</span>
                                <p className="text-sm">Live preview will appear here...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Status & Actions */}
                <div className="flex items-center justify-between mt-30">
                  <div className="flex items-center space-x-3">
                    {/* Professional Auto-Save Loader */}
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-300 ${
                        notesLoader
                          ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-700"
                          : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700"
                      }`}
                    >
                      {notesLoader ? (
                        <>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"
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
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span
                            className={`text-xs font-medium ${
                              isDark ? "text-green-400" : "text-green-600"
                            }`}
                          >
                            Auto-saved
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {notStoreNotes.split(" ").length} words •{" "}
                      {notStoreNotes.split("\n").length} lines
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-6 max-w-full">
                {/* Quiz Header */}
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r max-w-full ${
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
                        Test your knowledge on React Hooks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quiz Question */}
                <div
                  className={`p-6 rounded-2xl ${
                    isDark ? "bg-gray-800/50" : "bg-white/50"
                  } border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } max-w-full backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Question 1 of 5</h4>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      Easy Level
                    </div>
                  </div>

                  <p className="mb-6 text-lg leading-relaxed break-words">
                    Which hook is used for managing state in functional
                    components?
                  </p>

                  <div className="space-y-3">
                    {["useEffect", "useState", "useContext", "useReducer"].map(
                      (option, index) => (
                        <button
                          key={index}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] break-words ${
                            isDark
                              ? "border-gray-600 hover:border-emerald-500 hover:bg-gray-700/50 bg-gray-800/30"
                              : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 bg-white/80"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                                isDark
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="break-words font-medium">
                              {option}
                            </span>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full bg-emerald-500`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Progress: 1/5
                      </span>
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium flex-shrink-0 shadow-lg transform hover:scale-105">
                      Next Question →
                    </button>
                  </div>
                </div>

                {/* Enhanced Quiz Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`p-6 rounded-2xl text-center border ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/50 border-gray-200"
                    } backdrop-blur-sm`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-500 mb-1">
                      85%
                    </div>
                    <div className="text-sm font-medium">Accuracy Rate</div>
                  </div>
                  <div
                    className={`p-6 rounded-2xl text-center border ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/50 border-gray-200"
                    } backdrop-blur-sm`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-500 mb-1">
                      12
                    </div>
                    <div className="text-sm font-medium">Completed</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="space-y-4 max-w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Video Transcript 📜</h3>
                  <button
                    onClick={fetchTranscript}
                    disabled={transcriptLoader}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center space-x-2 ${
                      transcriptLoader
                        ? "bg-gradient-to-r from-purple-400 to-indigo-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                    }`}
                  >
                    {transcriptLoader ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <span>📜</span>
                        <span>Fetch Transcript</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } max-h-96 overflow-y-auto`}
                >
                  {transcriptText && transcriptText.length > 0 ? (
                    <div className="space-y-4">
                      {/* Transcript Header */}
                      <div
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30"
                            : "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-xl">📜</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              Video Transcript
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-purple-300" : "text-purple-600"
                              }`}
                            >
                              {transcriptText.length} segments • Auto-generated
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Transcript Segments */}
                      <div className="space-y-3">
                        {(showAllTranscript
                          ? transcriptText
                          : transcriptText.slice(0, 5)
                        ).map((item, index) => (
                          <div
                            key={index}
                            className={`group relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                              isDark
                                ? "bg-gray-800 border-gray-600 hover:border-purple-500 hover:bg-gray-750"
                                : "bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                            }`}
                          >
                            {/* Timestamp Badge */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                                    isDark
                                      ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                                      : "bg-purple-100 text-purple-700 border border-purple-200"
                                  }`}
                                >
                                  {Math.floor(item.startTime)}s -{" "}
                                  {Math.floor(item.endTime)}s
                                </div>
                                <div
                                  className={`px-2 py-1 rounded text-xs ${
                                    isDark
                                      ? "bg-gray-700 text-gray-300"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  #{showAllTranscript ? index + 1 : index + 1}
                                </div>
                              </div>
                              {/* Copy Button */}
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(item.text)
                                }
                                className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                                  isDark
                                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                }`}
                                title="Copy text"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Transcript Text */}
                            <div
                              className={`text-sm leading-relaxed ${
                                isDark ? "text-gray-100" : "text-gray-800"
                              }`}
                            >
                              <p className="selection:bg-purple-200 selection:text-purple-900">
                                {item.text}
                              </p>
                            </div>

                            {/* Duration Indicator */}
                            <div
                              className={`mt-3 flex items-center justify-between text-xs ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-500">⏱️</span>
                                <span>
                                  {(item.endTime - item.startTime).toFixed(1)}s
                                  duration
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-purple-500">📝</span>
                                <span>{item.text.split(" ").length} words</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Show More/Less Button */}
                        {transcriptText.length > 5 && (
                          <div className="flex justify-center pt-4">
                            <button
                              onClick={() =>
                                setShowAllTranscript(!showAllTranscript)
                              }
                              className={`flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                                isDark
                                  ? "border-purple-600 bg-purple-900/20 hover:bg-purple-800/30 text-purple-400 hover:text-purple-300"
                                  : "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700"
                              }`}
                            >
                              <span className="text-lg">
                                {showAllTranscript ? "📋" : "📜"}
                              </span>
                              <span className="font-medium">
                                {showAllTranscript
                                  ? `Show Less (${
                                      transcriptText.length - 5
                                    } hidden)`
                                  : `Show More (${
                                      transcriptText.length - 5
                                    } remaining)`}
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  showAllTranscript ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`text-center py-12 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="text-4xl mb-4">📜</div>
                      <p className="text-lg font-medium mb-2">
                        No transcript available
                      </p>
                      <p className="text-sm">
                        Click "Fetch Transcript" to load the video transcript
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Lesson Summary 📚</h3>
                  <button
                    onClick={fetchSummary}
                    disabled={summaryLoader}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center space-x-2 ${
                      summaryLoader
                        ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                    }`}
                  >
                    {summaryLoader ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>🤖</span>
                        <span>Generate Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } max-h-96 overflow-y-auto`}
                >
                  {summaryText ? (
                    <div className="space-y-4">
                      {/* Summary Header */}
                      <div
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-orange-500/30"
                            : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                            <span className="text-white text-xl">📚</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              AI Generated Summary
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-orange-300" : "text-orange-600"
                              }`}
                            >
                              Key insights from this lesson
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Summary Content */}
                      <div
                        className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                          isDark
                            ? "bg-gray-800 border-gray-600 hover:border-orange-500 hover:bg-gray-750"
                            : "bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                      >
                        {/* Copy Button */}
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(summaryText)
                          }
                          className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                            isDark
                              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          }`}
                          title="Copy summary"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>

                        {/* Summary Badge */}
                        <div className="flex items-center space-x-2 mb-4">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-orange-900/30 text-orange-400 border border-orange-700"
                                : "bg-orange-100 text-orange-700 border border-orange-200"
                            }`}
                          >
                            AI Summary
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              isDark
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Auto-generated
                          </div>
                        </div>

                        {/* Summary Text */}
                        <div
                          className={`text-sm leading-relaxed ${
                            isDark ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none selection:bg-orange-200 selection:text-orange-900">
                            {summaryText.split("\n").map(
                              (paragraph, index) =>
                                paragraph.trim() && (
                                  <p key={index} className="mb-3 last:mb-0">
                                    {paragraph}
                                  </p>
                                )
                            )}
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div
                          className={`mt-4 pt-4 border-t flex items-center justify-between ${
                            isDark ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <span className="text-orange-500">📊</span>
                              <span
                                className={
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {summaryText.split(" ").length} words
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-orange-500">⏱️</span>
                              <span
                                className={
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                ~
                                {Math.ceil(summaryText.split(" ").length / 200)}{" "}
                                min read
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                                isDark
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                              }`}
                              onClick={fetchSummary}
                            >
                              🔄 Regenerate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`text-center py-12 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="text-4xl mb-4">📚</div>
                      <p className="text-lg font-medium mb-2">
                        No summary available
                      </p>
                      <p className="text-sm">
                        Click "Generate Summary" to create an AI-powered lesson
                        summary
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesInterface;
