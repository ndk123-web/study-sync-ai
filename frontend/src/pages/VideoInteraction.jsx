import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  MessageSquare,
  BookOpen,
  FileCheck,
  StickyNote,
  FileText,
  Send,
  Bot,
  User,
  Lightbulb,
  CheckCircle,
  Link as LinkIcon,
  Video,
  Volume2,
  Download,
  Clock,
  Eye,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useLoaders } from "../store/slices/useLoaders.js";
import CryptoJS from "crypto-js";
import Header from "../components/Header";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EnrollmentVideoApi } from "../api/EnrollVideoApi.js";
import { SendAiChatApi } from "../api/SendAiChatApi.js";
import { FetchUserChatsApi } from "../api/fetchUserChatsApi.js";
import { GetVideoSummaryApi } from "../api/GetVideoSummaryApi.js";
import { GetCurrentVideoTranscriptApi } from '../api/GetCurrentVideoTranscript.js';
import { SaveCourseNotesApi } from "../api/SaveCurrentCourseNotesApi.js";
import { GetCurrentNotesApi } from "../api/GetCurrentNotesApi.js";

// import { useParams } from "react-router-dom";

// Notion-style formatting function
const formatNotesToHTML = (text, isDark = false) => {
  if (!text) return "";

  // Handle code blocks first (same logic as chat)
  const codeBlockPlaceholders = [];
  let tempText = text.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`;
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      codeBlockPlaceholders.push(
        `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 border ${
          isDark ? "border-gray-700" : "border-gray-300"
        }"><code class="language-${
          language || "text"
        }">${escapedCode}</code></pre>`
      );
      return placeholder;
    }
  );

  let html = tempText
    // Process headers
    .replace(
      /^### (.*$)/gm,
      `<h3 class="text-lg font-bold mt-3 mb-1 ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</h3>`
    )
    .replace(
      /^## (.*$)/gm,
      `<h2 class="text-xl font-bold mt-4 mb-2 ${
        isDark ? "text-white-400" : "text-dark-600"
      }">$1</h2>`
    )
    .replace(
      /^# (.*$)/gm,
      `<h1 class="text-2xl font-bold mt-5 mb-2 ${
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
    // Nested bullets
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
    // Inline code
    .replace(
      /`([^`]+)`/g,
      `<code class="px-2 py-1 rounded text-sm font-mono ${
        isDark
          ? "bg-gray-800 text-green-400 border border-gray-700"
          : "bg-gray-100 text-green-600 border border-gray-200"
      }">$1</code>`
    )
    // Convert paragraphs
    .split("\n\n")
    .map((paragraph) => {
      if (
        paragraph.trim() &&
        !paragraph.includes("<h") &&
        !paragraph.includes("<div") &&
        !paragraph.includes("<hr") &&
        !paragraph.includes("__CODE_BLOCK_")
      ) {
        return `<p class="mb-3 leading-relaxed">${paragraph}</p>`;
      }
      return paragraph;
    })
    .join("");

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, replacement);
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
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      codeBlockPlaceholders.push(
        `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 border ${
          isDark ? "border-gray-700" : "border-gray-300"
        }"><code class="language-${
          language || "text"
        }">${escapedCode}</code></pre>`
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
      .replace(/>/g, "&gt;");

    inlineCodePlaceholders.push(
      `<code class="px-2 py-1 rounded text-sm font-mono bg-gray-800 text-green-400 border border-gray-700">${escapedCode}</code>`
    );
    return placeholder;
  });

  // Now process other markdown elements on the protected text
  let html = tempText
    // Headers
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
    if (
      section.includes("<h") ||
      section.includes("<pre") ||
      section.includes("<code") ||
      section.includes("<div")
    ) {
      return section;
    }

    if (section.trim()) {
      const lines = section.split("\n").filter((line) => line.trim());
      if (lines.length === 1) {
        return `<p class="mb-3 leading-relaxed">${lines[0]}</p>`;
      } else {
        return `<p class="mb-3 leading-relaxed">${lines.join("<br>")}</p>`;
      }
    }
    return section;
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

const VideoInteraction = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";

  const { v } = useParams();
  const [searchParams] = useSearchParams();
  const encryptedVideoUrl = searchParams.get("v") || v;
  console.log("Encrypted video param v:", encryptedVideoUrl);

  const [videoUrl, setVideoUrl] = useState("");
  const [loadedVideo, setLoadedVideo] = useState(null);
  const [isLoadingNewVideo, setIsLoadingNewVideo] = useState(false); // Track if loading new video
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [notes, setNotes] = useState("");
  const [notesPreviewMode, setNotesPreviewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Mobile preview toggle
  const [showAllTranscript, setShowAllTranscript] = useState(false); // For transcript show more
  const [videoSize, setVideoSize] = useState(55); // Default 55% for resizable panels
  // const [notesLoader, setNotesLoader] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const chatLoader = useLoaders((state) => state.chatLoader);
  const setChatLoader = useLoaders((state) => state.setChatLoader);
  const unsetChatLoader = useLoaders((state) => state.unsetChatLoader);

  const notesLoader = useLoaders((state) => state.notesLoader);
  const setNotesLoader = useLoaders((state) => state.setNotesLoader);
  const unsetNotesLoader = useLoaders((state) => state.unsetNotesLoader);

  const summaryLoader = useLoaders((state) => state.summarizeLoader);
  const setSummaryLoader = useLoaders((state) => state.setSummarizeLoader);
  const unsetSummaryLoader = useLoaders((state) => state.unsetSummarizeLoader);

  const transcriptLoader = useLoaders((state) => state.transcriptLoader);
  const setTranscriptLoader = useLoaders((state) => state.setTranscriptLoader);
  const unsetTranscriptLoader = useLoaders(
    (state) => state.unsetTranscriptLoader
  );

  // Decrypt and load video from URL params
  useEffect(() => {
    if (encryptedVideoUrl && !isLoadingNewVideo) {
      try {
        const decryptedUrl = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedVideoUrl),
          import.meta.env.VITE_ENCRYPTION_SECRET
        ).toString(CryptoJS.enc.Utf8);

        if (decryptedUrl) {
          setVideoUrl(decryptedUrl);
          const videoId = extractVideoId(decryptedUrl);
          if (videoId) {
            const videoData = {
              id: videoId,
              url: decryptedUrl,
              embedUrl: `https://www.youtube.com/embed/${videoId}`,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              title: "Video Learning Session",
              duration: "N/A",
              views: "Learning Mode",
            };
            setLoadedVideo(videoData);

            // Initialize with welcome message
            setChatMessages([
              {
                id: 1,
                type: "bot",
                message: `Welcome to your learning session! I'm here to help you understand this video content. Ask me questions, request summaries, or get assessments based on what you're watching.`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to decrypt video URL:", err);
      }
    }
  }, [encryptedVideoUrl]);

  // Fetch User Chats Api
  useEffect(() => {
    const fetchVideoChats = async () => {
      if (!encryptedVideoUrl) return;
      const apiResponse = await FetchUserChatsApi({
        courseId: encryptedVideoUrl,
        role: "video",
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert("Error fetching user chats");
        return;
      }

      // Process the fetched video chats
      const videoChats = apiResponse?.data?.chats || [];
      setChatMessages(videoChats);
    };

    fetchVideoChats();
  }, []);

  const extractVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLoadVideo = async (e) => {
    e.preventDefault();
    setLoader(true);
    setIsLoadingNewVideo(true);

    try {
      const encryptedVideoUrl = CryptoJS.AES.encrypt(
        videoUrl,
        import.meta.env.VITE_ENCRYPTION_SECRET
      ).toString();

      console.log("Enrolling video with encrypted URL:", encryptedVideoUrl);
      const apiResponse = await EnrollmentVideoApi(encryptedVideoUrl);
      console.log("API Response:", apiResponse);

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to enroll video. Please check your authentication and try again."
        );
        setIsLoadingNewVideo(false);
        return;
      }

      const videoId = extractVideoId(videoUrl);
      if (videoId) {
        const videoData = {
          id: videoId,
          url: videoUrl,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          title: "Video Learning Session",
          duration: "N/A",
          views: "Learning Mode",
        };

        setLoadedVideo(videoData);

        // Initialize with welcome message
        setChatMessages([
          {
            id: 1,
            type: "bot",
            message: `Great! I've loaded the YouTube video. I can help you understand the content, provide summaries, and answer questions about what's discussed in the video.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        // Update URL without causing a page reload
        const newUrl = `/learn/video?v=${encodeURIComponent(
          encryptedVideoUrl
        )}`;
        window.history.replaceState(null, "", newUrl);
      } else {
        alert("Please enter a valid YouTube URL");
      }
    } catch (err) {
      console.error("Error loading video:", err);
      alert(`Failed to load video: ${err.message || "Please try again."}`);
    } finally {
      setLoader(false);
      setIsLoadingNewVideo(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    unsetChatLoader();
    console.log("Message input to send:", messageInput);
    console.log("Using encrypted video URL as courseId:", encryptedVideoUrl);

    try {
      const newMessage = {
        id: Date.now(),
        type: "user",
        message: messageInput,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, newMessage]);

      const apiResponse = await SendAiChatApi({
        type: "video",
        courseId: encryptedVideoUrl,
        prompt: messageInput,
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to get response from AI. Please try again."
        );
      }

      const aiMessage = {
        id: Date.now(), // Use timestamp for unique ID
        type: "ai",
        message: apiResponse?.data?.response || "No response received",
        timestamp: new Date().getDate().toLocaleString(),
        avatar: "🤖",
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setMessageInput("");
    } catch (err) {
      alert("Error in sending message to AI. Please try again.");
      return;
    } finally {
      unsetChatLoader();
    }
  };

  const generateSummary = async () => {
    //     setIsLoading(true);
    //     // Simulate API call
    //     setTimeout(() => {
    //       setVideoSummary(`This video provides a comprehensive overview of the topic with the following key points:

    // 🎯 Main Topics Covered:
    // • Introduction to the subject (0:00 - 2:30)
    // • Key concepts and definitions (2:30 - 7:15)
    // • Practical examples and applications (7:15 - 12:00)
    // • Conclusion and next steps (12:00 - 15:30)

    // 💡 Key Takeaways:
    // • Important insight 1 from the discussion
    // • Critical point 2 mentioned by the speaker
    // • Practical tip 3 for implementation

    // 📊 Statistics/Data Mentioned:
    // • Key statistic 1
    // • Important figure 2
    // • Research finding 3

    // 🔗 Resources Referenced:
    // • Book/article mentioned
    // • Website or tool recommended
    // • Additional learning material suggested`);
    //       setIsLoading(false);
    //     }, 2000);
    setIsLoading(false); 

    try {
      setIsLoading(true);
      console.log("Summary Clicked");
      const apiResponse = await GetVideoSummaryApi({
        videoId: encryptedVideoUrl,
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to get video summary. Please try again."
        );
      }
      setVideoSummary(apiResponse.summary || "No summary available.");
    } catch (err) {
      alert("Error in generating summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateTranscript = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await GetCurrentVideoTranscriptApi({
        currentVideoId: CryptoJS.AES.decrypt(encryptedVideoUrl, import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8),
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to get video transcript. Please try again."
        );
      }
      setTranscript(apiResponse?.data?.data?.transcript || "No transcript available.");
    } catch (err) {
      alert("Error in generating transcript. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAssessment = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssessmentQuestions([
        {
          id: 1,
          question: "What was the main topic discussed in the video?",
          options: ["Topic A", "Topic B", "Topic C", "Topic D"],
          correct: 0,
          timestamp: "2:30",
        },
        {
          id: 2,
          question: "Which practical example was demonstrated?",
          options: ["Example A", "Example B", "Example C", "Example D"],
          correct: 1,
          timestamp: "7:15",
        },
        {
          id: 3,
          question: "What was the key recommendation at the end?",
          options: [
            "Recommendation A",
            "Recommendation B",
            "Recommendation C",
            "Recommendation D",
          ],
          correct: 2,
          timestamp: "14:45",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  // Auto-save notes with debounce (2 seconds like CourseInterface)
  useEffect(() => {
    if (!loadedVideo?.videoId || !notes) return;

    const autoSaveTimer = setTimeout(async () => {
      console.log("💾 Auto-saving notes...");
      
      try {
        setNotesLoader();

        const apiResponse = await SaveCourseNotesApi({
          courseId: loadedVideo.videoId, // Using videoId as courseId
          notes: notes,
        });

        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("❌ Error auto-saving notes:", apiResponse?.message);
          // Don't show alert as it's auto-save
          return;
        }
        
        console.log("✅ Notes auto-saved successfully");
      } catch (err) {
        console.error("💥 Error in auto-save:", err);
      } finally {
        unsetNotesLoader();
      }
    }, 2000); // Save after 2 seconds of no typing

    return () => clearTimeout(autoSaveTimer);
  }, [notes, loadedVideo?.videoId]);

  // Auto-fetch notes when video loads
  useEffect(() => {
    const fetchNotes = async () => {
      if (!loadedVideo?.videoId) return;
      
      try {
        console.log("📝 Fetching notes for video:", loadedVideo.videoId);
        
        const apiResponse = await GetCurrentNotesApi({ 
          courseId: loadedVideo.videoId 
        });
        
        if (apiResponse.status === 200 || apiResponse.status === 201) {
          const fetchedNotes = apiResponse.data?.notes || "";
          setNotes(fetchedNotes);
          console.log("✅ Notes fetched successfully:", fetchedNotes);
        } else {
          console.log("📝 No existing notes found");
          setNotes(""); // Reset notes if none found
        }
      } catch (err) {
        console.error("💥 Error fetching notes:", err);
        setNotes(""); // Reset on error
      }
    };

    fetchNotes();
  }, [loadedVideo?.videoId]);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!notes.trim()) return;

    setNotesLoader(true);
    const saveTimeout = setTimeout(() => {
      // Simulate auto-save API call
      console.log("Auto-saving notes:", notes);
      setNotesLoader(false);
    }, 1000);

    return () => {
      clearTimeout(saveTimeout);
      setNotesLoader(false);
    };
  }, [notes]);

  // Apply Prism syntax highlighting when component mounts and content changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        try {
          window.Prism.highlightAll();
        } catch (err) {
          console.log("Prism highlighting error:", err);
        }
      }, 100);
    }
  }, [notes, notesPreviewMode, activeTab]);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "summary", label: "Summary", icon: BookOpen },
    { id: "assessment", label: "Assessment", icon: FileCheck },
  ];

  // Professional Loader Component
  const LoaderOverlay = ({ message = "Loading...", show }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          className={`p-8 rounded-2xl border max-w-md mx-4 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {message}
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Please wait while we process your request...
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <LoaderOverlay
        show={loader || isLoading}
        message={loader ? "Loading Video..." : "Processing..."}
      />
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              YouTube Learning Assistant
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter a YouTube URL to get instant summaries, transcripts, chat
              assistance, and assessments
            </p>
          </div>

          {!loadedVideo ? (
            // URL Input Section
            <div className="max-w-2xl mx-auto">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDark
                    ? "border-gray-600 hover:border-emerald-500 bg-gray-800/50"
                    : "border-gray-300 hover:border-emerald-500 bg-gray-50/50"
                }`}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enter YouTube URL</h3>
                <p
                  className={`text-lg mb-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Paste the YouTube video link you want to analyze
                </p>

                <div className="flex space-x-4 mb-6">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full pl-10 pr-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        isDark
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-4 focus:ring-emerald-500/20`}
                    />
                  </div>
                  <button
                    onClick={handleLoadVideo}
                    disabled={!videoUrl.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load Video
                  </button>
                </div>

                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Supports: youtube.com/watch?v=... or youtu.be/... links
                </p>
              </div>
            </div>
          ) : (
            // Main Interface - CourseInterface Style Layout
            <div className="flex min-h-[calc(100vh-180px)]">
              {/* 🎬 Left Section: Video Player */}
              <div
                className="flex-shrink-0 min-w-0 flex flex-col"
                style={{
                  width: window.innerWidth >= 1024 ? `${videoSize}%` : "100%",
                }}
              >
                <div
                  className={`rounded-2xl border overflow-hidden h-full ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Video className="w-6 h-6 text-emerald-500" />
                      <div className="flex-1">
                        <h3 className="font-bold line-clamp-2">
                          {loadedVideo.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{loadedVideo.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{loadedVideo.views}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setLoadedVideo(null)}
                      className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      Change Video
                    </button>
                  </div>

                  <div className="relative aspect-video">
                    <iframe
                      src={loadedVideo.embedUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="p-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm text-center">
                        <span className="font-medium">💡 Pro Tip:</span> Use the
                        chat to ask specific questions about timestamps, concepts,
                        or details from the video!
                      </p>
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

              {/* 📋 Right Section: Interactive Features */}
              <div
                className="hidden lg:flex lg:flex-col flex-shrink-0 min-w-0"
                style={{ width: `${100 - videoSize}%` }}
              >
                {/* Enhanced Tab Navigation */}
                <div
                  className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/50`}
                >
                  <div
                    className="flex overflow-x-auto scrollbar-hide px-4 py-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`group relative flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-all duration-300 rounded-lg mx-1 whitespace-nowrap ${
                            activeTab === tab.id
                              ? isDark
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : isDark
                              ? "text-gray-300 hover:text-white hover:bg-gray-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-transform duration-300 ${
                              activeTab === tab.id ? "scale-110" : "group-hover:scale-105"
                            }`}
                          />
                          <span>{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Tab Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  {/* Chat Tab */}
                  {activeTab === "chat" && (
                      <div className="h-full flex flex-col p-4">
                        {/* Chat Messages */}
                        <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-0">
                          {chatMessages.length === 0 && (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                Start a Conversation
                              </h3>
                              <p
                                className={`text-sm mb-4 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Ask questions about the video content,
                                timestamps, or concepts
                              </p>
                            </div>
                          )}
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.type === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                                  msg.type === "user"
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                    : isDark
                                    ? "bg-gray-700 border border-gray-600"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  {msg.type === "bot" && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                      <span className="text-white text-xs">
                                        🤖
                                      </span>
                                    </div>
                                  )}
                                  {msg.type === "user" && (
                                    <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">
                                      {msg.message}
                                    </p>
                                    <p className={`text-xs mt-2 opacity-70`}>
                                      {msg.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Professional Loading Indicator */}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div
                                className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                                  isDark
                                    ? "bg-gray-700 border border-gray-600"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs">
                                      🤖
                                    </span>
                                  </div>
                                  <div className="flex-1">
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
                                        Thinking...
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Message Input */}
                        <div
                          className={`border rounded-xl p-3 ${
                            isDark
                              ? "border-gray-600 bg-gray-700/50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSendMessage()
                              }
                              placeholder="Ask about the video content, timestamps, concepts..."
                              className={`flex-1 px-4 py-3 rounded-lg border-0 text-sm ${
                                isDark
                                  ? "bg-gray-800 text-white placeholder-gray-400"
                                  : "bg-white text-gray-900 placeholder-gray-500"
                              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!messageInput.trim() || isLoading}
                              className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "summary" && (
                      <div className="h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-6 flex-shrink-0">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-6 h-6 text-orange-500" />
                            <h3 className="text-lg font-bold">Video Summary</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={generateSummary}
                              disabled={summaryLoader}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
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
                            {videoSummary && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(videoSummary)}
                                className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-300"
                                title="Copy summary"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                          {videoSummary ? (
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
                                      Key insights from this video
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
                                    navigator.clipboard.writeText(videoSummary)
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
                                  <div
                                    className="prose prose-sm max-w-none prose-headings:text-orange-600 dark:prose-headings:text-orange-400 prose-strong:text-orange-700 dark:prose-strong:text-orange-300"
                                    dangerouslySetInnerHTML={{
                                      __html: formatNotesToHTML(videoSummary, isDark),
                                    }}
                                  />
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
                                Click "Generate Summary" to get AI insights from the video
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "transcript" && (
                      <div className="h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-6 flex-shrink-0">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-purple-500" />
                            <h3 className="text-lg font-bold">
                              Video Transcript
                            </h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={generateTranscript}
                              disabled={transcriptLoader}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
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
                            {transcript && transcript.length > 0 && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(transcript.map(t => `${Math.floor(t.startTime)}s-${Math.floor(t.endTime)}s: ${t.text}`).join('\n'))}
                                className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-300"
                                title="Copy transcript"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                          {transcript && transcript.length > 0 ? (
                            <div className="space-y-4">
                              {/* Header Stats */}
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
                                      {transcript.length} segments • Auto-generated
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Transcript Segments */}
                              <div className="space-y-3">
                                {(showAllTranscript
                                  ? transcript
                                  : transcript.slice(0, 5)
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
                                {transcript.length > 5 && (
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
                                          ? `Show Less (${transcript.length - 5} hidden)`
                                          : `Show More (${transcript.length - 5} remaining)`}
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

                    {activeTab === "assessment" && (
                      <div className="h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-6 flex-shrink-0">
                          <div className="flex items-center space-x-3">
                            <FileCheck className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-lg font-bold">
                              Video Assessment
                            </h3>
                          </div>
                          <button
                            onClick={generateAssessment}
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                          >
                            {isLoading && (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            <span>
                              {isLoading
                                ? "Generating..."
                                : "Generate Questions"}
                            </span>
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                          {assessmentQuestions.length > 0 ? (
                            <div className="space-y-6">
                              {assessmentQuestions.map((q, index) => (
                                <div
                                  key={q.id}
                                  className={`p-6 rounded-xl border shadow-sm ${
                                    isDark
                                      ? "bg-gray-700/50 border-gray-600"
                                      : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-semibold flex-1 text-base">
                                      <span className="text-emerald-500 mr-2">
                                        Q{index + 1}.
                                      </span>
                                      {q.question}
                                    </h4>
                                    <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full ml-3 flex-shrink-0">
                                      🕐 {q.timestamp}
                                    </span>
                                  </div>
                                  <div className="space-y-3">
                                    {q.options.map((option, optIndex) => (
                                      <label
                                        key={optIndex}
                                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                                          isDark
                                            ? "border-gray-600 hover:border-emerald-500 hover:bg-gray-600/50"
                                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`q${q.id}`}
                                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-medium">
                                          {option}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Submit Assessment
                              </button>
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                Create Assessment
                              </h3>
                              <p
                                className={`text-sm mb-4 max-w-sm mx-auto ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Generate intelligent questions to test
                                understanding of key concepts from the video
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "notes" && (
                      <div className="h-full flex flex-col p-4">
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
                        <div className="space-y-4 flex-1 flex flex-col">
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
                          <div className="relative flex-1 flex flex-col">
                            <textarea
                              className={`w-full p-4 rounded-xl border text-sm font-mono resize-none transition-all duration-300 flex-1 ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-750"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:bg-gray-50"
                              } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Take notes while watching the video...\n\n✨ Tip: Use markdown formatting:\n• **bold text**\n• *italic text*\n• # Headers\n• - Bullet points\n• ```code blocks```\n• [12:34] timestamps"
                              style={{
                                minHeight: showPreview ? "200px" : "300px",
                              }}
                            />

                            {/* Character count */}
                            <div
                              className={`absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full ${
                                isDark
                                  ? "bg-gray-700 text-gray-400"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {notes.length} chars
                            </div>
                          </div>

                          {/* Preview Panel */}
                          {showPreview && (
                            <div className="border-t pt-4 space-y-2 flex-1">
                              <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                                <span>✨</span>
                                <span>Live Preview</span>
                              </div>
                              <div
                                className={`p-4 rounded-xl border min-h-[200px] overflow-y-auto flex-1 ${
                                  isDark
                                    ? "bg-gray-900/50 border-gray-600 text-white"
                                    : "bg-gradient-to-br from-gray-50 to-white border-gray-200 text-gray-900"
                                }`}
                              >
                                {notes ? (
                                  <div
                                    className="prose prose-sm max-w-none prose-headings:text-emerald-600 dark:prose-headings:text-emerald-400 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300"
                                    dangerouslySetInnerHTML={{
                                      __html: formatNotesToHTML(notes, isDark),
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={`text-center py-8 ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    <span className="text-2xl mb-2 block">
                                      📝
                                    </span>
                                    <p className="text-sm">
                                      Start typing to see your formatted
                                      notes...
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status & Actions */}
                          <div className="flex justify-between items-center mt-3">
                            {/* Professional Auto-Save Loader */}
                            <div
                              className={`flex items-center space-x-2 px-2 py-1 rounded-full transition-all duration-300 ${
                                notesLoader
                                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30"
                                  : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                              }`}
                            >
                              {notesLoader ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                    Saving...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    Saved
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button
                                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                  isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                }`}
                                title="Download Notes"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
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
  );
};

export default VideoInteraction;
