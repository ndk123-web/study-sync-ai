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
import { GetCurrentVideoTranscriptApi } from "../api/GetCurrentVideoTranscript.js";
import { SaveCourseNotesApi } from "../api/SaveCurrentCourseNotesApi.js";
import { GetCurrentNotesApi } from "../api/GetCurrentNotesApi.js";
import { Helmet } from "react-helmet";

// Notion-style formatting function
const formatNotesToHTML = (text, isDark = false) => {
  if (!text) return "";

  // Handle code blocks first (same logic as chat)
  const codeBlockPlaceholders = [];
  let tempText = text.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const placeholder = `CODEBLOCK_PLACEHOLDER_${codeBlockPlaceholders.length}`;
      const b64Code = window.btoa(unescape(encodeURIComponent(code)));
      const langClass = language
        ? `language-${language}`
        : "language-javascript";
      codeBlockPlaceholders.push(
        `<pre class="${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } p-4 rounded-lg overflow-x-auto border ${
          isDark ? "border-gray-700" : "border-gray-200"
        } my-4"><code class="${langClass} text-sm" data-raw-code="${b64Code}">${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
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
          ? "bg-gray-800 text-emerald-400 border border-gray-700"
          : "bg-gray-100 text-emerald-600 border border-gray-200"
      }">$1</code>`
    )
    // Paragraphs
    .split("\n\n")
    .map((paragraph) => {
      if (paragraph.trim() && !paragraph.includes("<")) {
        return `<p class="mb-3 leading-relaxed">${paragraph}</p>`;
      }
      return paragraph;
    })
    .join("");

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, index) => {
    html = html.replace(`CODEBLOCK_PLACEHOLDER_${index}`, replacement);
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
      const placeholder = `CODEBLOCK_PLACEHOLDER_${codeBlockPlaceholders.length}`;
      const b64Code = window.btoa(unescape(encodeURIComponent(code)));
      const langClass = language
        ? `language-${language}`
        : "language-javascript";
      codeBlockPlaceholders.push(
        `<pre class="${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } p-4 rounded-lg overflow-x-auto border ${
          isDark ? "border-gray-700" : "border-gray-200"
        } my-4"><code class="${langClass} text-sm" data-raw-code="${b64Code}">${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
      );
      return placeholder;
    }
  );

  // Also protect inline code blocks
  const inlineCodePlaceholders = [];
  tempText = tempText.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `INLINECODE_PLACEHOLDER_${inlineCodePlaceholders.length}`;
    inlineCodePlaceholders.push(
      `<code class="px-2 py-1 rounded text-sm font-mono ${
        isDark
          ? "bg-gray-800 text-emerald-400 border border-gray-700"
          : "bg-gray-100 text-emerald-600 border border-gray-200"
      }">${code}</code>`
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
    html = html.replace(`INLINECODE_PLACEHOLDER_${index}`, replacement);
  });

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, index) => {
    html = html.replace(`CODEBLOCK_PLACEHOLDER_${index}`, replacement);
  });

  // Split into sections and handle properly
  const sections = html.split("\n\n").filter((s) => s.trim());

  const formattedSections = sections.map((section) => {
    if (
      section.includes("<h") ||
      section.includes("<pre") ||
      section.includes("<code")
    ) {
      return section;
    }
    if (section.trim()) {
      return `<p class="mb-3 leading-relaxed">${section}</p>`;
    }
    return section;
  });

  return `<div class="prose prose-sm max-w-none ${
    isDark ? "text-gray-100" : "text-gray-800"
  }">${formattedSections.join("")}</div>`;
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

  // Debug logging for encryptedVideoUrl
  console.log("🔍 Debug - encryptedVideoUrl:", encryptedVideoUrl);
  console.log("🔍 Debug - searchParams.get('v'):", searchParams.get("v"));
  console.log("🔍 Debug - v from useParams:", v);

  const [videoUrl, setVideoUrl] = useState("");
  const [loadedVideo, setLoadedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [notes, setNotes] = useState("");
  const [notesPreviewMode, setNotesPreviewMode] = useState(false);
  const [showAllTranscript, setShowAllTranscript] = useState(false);
  const [videoSize, setVideoSize] = useState(55); // Default 55% for resizable panels
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  // Decrypt and load video from URL params
  useEffect(() => {
    if (encryptedVideoUrl) {
      try {
        const decryptedUrl = CryptoJS.AES.decrypt(
          encryptedVideoUrl,
          import.meta.env.VITE_ENCRYPTION_SECRET
        ).toString(CryptoJS.enc.Utf8);

        setVideoUrl(decryptedUrl);
        console.log("Decrypted URL:", decryptedUrl);

        // Auto-load the video
        const videoId = extractVideoId(decryptedUrl);
        if (videoId) {
          const videoData = {
            videoId,
            title: "YouTube Video",
            duration: "N/A",
            views: "N/A",
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            originalUrl: decryptedUrl,
          };
          setLoadedVideo(videoData);
        }
      } catch (error) {
        console.error("Failed to decrypt video URL:", error);
      }
    }
  }, [encryptedVideoUrl]);

  // Fetch User Chats Api
  useEffect(() => {
    const fetchUserChats = async () => {
      if (!encryptedVideoUrl) return;

      try {
        const apiResponse = await FetchUserChatsApi({
          courseId: encryptedVideoUrl,
          role: "video",
        });

        if (apiResponse.status === 200 || apiResponse.status === 201) {
          const videoChats = apiResponse?.data?.chats || [];
          setChatMessages(videoChats);
        }
      } catch (err) {
        console.error("Error fetching video chats:", err);
      }
    };

    fetchUserChats();
  }, [encryptedVideoUrl]);

  // Auto-save notes with debounce (2 seconds like CourseInterface)
  useEffect(() => {
    if (!encryptedVideoUrl || !notes) return;

    const autoSaveTimer = setTimeout(async () => {
      console.log("💾 Auto-saving video notes...");

      try {
        setNotesLoader();

        const apiResponse = await SaveCourseNotesApi({
          type: "video",
          courseId: encryptedVideoUrl, // Send encrypted URL for video
          notes: notes,
        });

        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.log("❌ Error auto-saving notes:", apiResponse?.message);
          return;
        }

        console.log("✅ Video notes auto-saved successfully");
      } catch (err) {
        console.error("💥 Error in auto-save:", err);
      } finally {
        unsetNotesLoader();
      }
    }, 2000); // Save after 2 seconds of no typing

    return () => clearTimeout(autoSaveTimer);
  }, [notes, encryptedVideoUrl]);

  // Auto-fetch notes when video loads
  useEffect(() => {
    const fetchNotes = async () => {
      if (!encryptedVideoUrl) {
        console.log("🚫 No encryptedVideoUrl found, skipping notes fetch");
        return;
      }

      try {
        console.log("📝 Fetching notes for video:", encryptedVideoUrl);

        // Create a special API call for video notes
        const apiResponse = await GetCurrentNotesApi({
          courseId: encryptedVideoUrl,
          type: "video", // Add type parameter
        });

        console.log("🚀 API Response for GetCurrentNotesApi:", apiResponse);

        if (apiResponse.status === 200 || apiResponse.status === 201) {
          const fetchedNotes = apiResponse.data?.notes || "";
          setNotes(fetchedNotes);
          console.log("✅ Video notes fetched successfully:", fetchedNotes);
        } else {
          console.log("📝 No existing video notes found");
          setNotes(""); // Reset notes if none found
        }
      } catch (err) {
        console.error("💥 Error fetching video notes:", err);
        setNotes(""); // Reset on error
      }
    };

    fetchNotes();
  }, [encryptedVideoUrl]); // Add encryptedVideoUrl as dependency

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const handleLoadVideo = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsLoading(true);
    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        alert("Invalid YouTube URL");
        return;
      }

      const response = await EnrollmentVideoApi(videoUrl);
      console.log("EnrollmentVideoApi response:", response);

      if (response.status === 200 || response.status === 201) {
        // Encrypt the video URL for browser URL
        const encryptedUrl = CryptoJS.AES.encrypt(
          videoUrl,
          import.meta.env.VITE_ENCRYPTION_SECRET
        ).toString();

        // Update browser URL with encrypted video parameter
        // Use canonical path; alias /video-interaction still supported
        navigate(`/video-learning?v=${encodeURIComponent(encryptedUrl)}`, {
          replace: true,
        });

        const videoData = {
          videoId,
          title: response.data?.title || "YouTube Video",
          duration: response.data?.duration || "N/A",
          views: response.data?.views || "N/A",
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          originalUrl: videoUrl,
        };
        setLoadedVideo(videoData);
      }
    } catch (error) {
      console.error("Error loading video:", error);
      alert("Error loading video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || chatLoader) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = messageInput;
    setMessageInput("");
    setChatLoader();

    try {
      const response = await SendAiChatApi({
        type: "video",
        courseId: encryptedVideoUrl,
        prompt: currentInput,
      });

      if (response.status === 200 || response.status === 201) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          message:
            response.data?.response || "I couldn't process that request.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      unsetChatLoader();
    }
  };

  const generateSummary = async () => {
    setSummaryLoader();

    try {
      console.log("Summary Clicked");
      const apiResponse = await GetVideoSummaryApi({
        videoId: encryptedVideoUrl,
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to get video summary. Please try again."
        );
        return;
      }
      setVideoSummary(apiResponse.data?.summary || "No summary available.");
    } catch (err) {
      alert("Error in generating summary. Please try again.");
    } finally {
      unsetSummaryLoader();
    }
  };

  const generateTranscript = async () => {
    setTranscriptLoader();
    try {
      const apiResponse = await GetCurrentVideoTranscriptApi({
        currentVideoId: CryptoJS.AES.decrypt(
          encryptedVideoUrl,
          import.meta.env.VITE_ENCRYPTION_SECRET
        ).toString(CryptoJS.enc.Utf8),
      });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        alert(
          apiResponse.message ||
            "Failed to get video transcript. Please try again."
        );
        return;
      }
      setTranscript(apiResponse?.data?.data?.transcript || []);
    } catch (err) {
      alert("Error in generating transcript. Please try again.");
    } finally {
      unsetTranscriptLoader();
    }
  };

  const generateAssessment = () => {
    // Mock assessment generation
    const mockQuestions = [
      {
        id: 1,
        question: "What is the main topic of this video?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        timestamp: "2:30",
      },
      {
        id: 2,
        question: "Which concept was explained first?",
        options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
        timestamp: "5:15",
      },
    ];
    setAssessmentQuestions(mockQuestions);
  };

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "summary", label: "Summary", icon: BookOpen },
  ];

  // // Apply Prism syntax highlighting when chat messages change
  // useEffect(() => {
  //   if (window.Prism && activeTab === "chat") {
  //     // Wait for DOM to render and then populate code elements from data-raw-code
  //     const timeoutId = setTimeout(() => {
  //       try {
  //         const codeElems = Array.from(
  //           document.querySelectorAll("code[data-raw-code]")
  //         );

  //         codeElems.forEach((el) => {
  //           try {
  //             const b64 = el.getAttribute("data-raw-code") || "";
  //             let decoded = "";
  //             if (b64) {
  //               try {
  //                 decoded = decodeURIComponent(escape(window.atob(b64)));
  //               } catch (e) {
  //                 // fallback for environments without atob/unescape
  //                 try {
  //                   decoded = Buffer.from(b64, "base64").toString("utf-8");
  //                 } catch (err) {
  //                   decoded = "";
  //                 }
  //               }
  //             }
  //             // Set the raw code as textContent to preserve whitespace/newlines
  //             if (decoded) el.textContent = decoded;
  //             // Now highlight the element individually
  //             window.Prism.highlightElement(el);
  //           } catch (err) {
  //             console.error("Error processing code element:", err);
  //           }
  //         });

  //         console.log(
  //           "🎨 Prism highlighting applied to",
  //           codeElems.length,
  //           "code blocks"
  //         );
  //       } catch (error) {
  //         console.error("Prism highlighting error:", error);
  //       }
  //     }, 200); // small delay to let React paint

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [chatMessages]);

  // // Also apply Prism when component mounts and Prism is available
  // useEffect(() => {
  //   if (window.Prism) {
  //     const timeoutId = setTimeout(() => {
  //       window.Prism.highlightAll();
  //     }, 300);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, []);

  // // Apply Prism syntax highlighting for notes area - only when content finishes changing
  // useEffect(() => {
  //   if (
  //     typeof window === "undefined" ||
  //     activeTab !== "notes" ||
  //     !notesPreviewMode
  //   )
  //     return;

  //   const timeoutId = setTimeout(() => {
  //     try {
  //       const notesCodeElems = Array.from(
  //         document.querySelectorAll(
  //           '[data-notes-area="true"] code[data-raw-code]'
  //         )
  //       ).filter((el) => !el.hasAttribute("data-prism-processed"));

  //       notesCodeElems.forEach((el) => {
  //         try {
  //           const b64 = el.getAttribute("data-raw-code") || "";
  //           let decoded = "";
  //           if (b64) {
  //             try {
  //               decoded = decodeURIComponent(escape(window.atob(b64)));
  //             } catch (e) {
  //               try {
  //                 decoded = Buffer.from(b64, "base64").toString("utf-8");
  //               } catch (err) {
  //                 decoded = "";
  //               }
  //             }
  //           }
  //           if (decoded) {
  //             el.textContent = decoded;
  //             if (
  //               window.Prism &&
  //               typeof window.Prism.highlightElement === "function"
  //             ) {
  //               window.Prism.highlightElement(el);
  //             }
  //             el.setAttribute("data-prism-processed", "1");
  //           }
  //         } catch (err) {
  //           console.error("Error processing notes code element:", err);
  //         }
  //       });

  //       if (notesCodeElems.length > 0) {
  //         console.log(
  //           "🎨 Prism notes highlighting applied to",
  //           notesCodeElems.length,
  //           "code blocks"
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Prism notes highlighting error:", error);
  //     }
  //   }, 800); // Longer delay to avoid constant re-processing

  //   return () => clearTimeout(timeoutId);
  // }, [notesPreviewMode, activeTab]); // Only when switching to preview mode

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Helmet>
        <title>Video Interaction | StudySyncAI</title>
        <meta
          name="description"
          content="Engage with your video content like never before."
        />
      </Helmet>

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
                    disabled={!videoUrl.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Load Video"}
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
                        chat to ask specific questions about timestamps,
                        concepts, or details from the video!
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
                      Math.max(
                        ((e.clientX - rect.left) / rect.width) * 100,
                        30
                      ),
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
                              activeTab === tab.id
                                ? "scale-110"
                                : "group-hover:scale-105"
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
                      <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)] pr-2">
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
                              Ask questions about the video content, timestamps,
                              or concepts
                            </p>
                          </div>
                        )}
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex w-full ${
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
                                <div className="flex-1 min-w-0">
                                  <div
                                    className="text-sm leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{
                                      __html: formatChatMessageHTML(
                                        msg.message,
                                        isDark
                                      ),
                                    }}
                                  />
                                  <p className="text-xs mt-2 opacity-70">
                                    {msg.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {chatLoader && (
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
                                  <span className="text-white text-xs">🤖</span>
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
                            disabled={!messageInput.trim() || chatLoader}
                            className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">📝</span>
                          <h3 className="text-lg font-semibold">My Notes</h3>
                        </div>

                        <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Live Preview
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📝</span>
                            <span className="font-medium text-sm">
                              Notes Editor
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setNotesPreviewMode(!notesPreviewMode)
                            }
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                              notesPreviewMode
                                ? isDark
                                  ? "border-emerald-600 bg-emerald-900/20 text-emerald-400"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-600"
                                : isDark
                                ? "border-gray-600 bg-gray-700 text-gray-300"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            <span className="text-xs">
                              {notesPreviewMode ? "👁️" : "📝"}
                            </span>
                            <span className="text-xs font-medium">
                              {notesPreviewMode ? "Preview" : "Editor"}
                            </span>
                          </button>
                        </div>

                        {!notesPreviewMode ? (
                          <div className="relative flex-1 flex flex-col">
                            <textarea
                              className={`w-full p-4 rounded-xl border text-sm font-mono resize-none transition-all duration-300 flex-1 ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-750"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:bg-gray-50"
                              } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder={`Take notes while watching the video...

✨ Tip: Use markdown formatting:
• **bold text**
• *italic text*
• # Headers
• - Bullet points
• \`\`\`code blocks\`\`\`
• [12:34] timestamps`}
                              style={{ minHeight: "300px" }}
                            />

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
                        ) : (
                          <div className="border-t pt-4 space-y-2 flex-1">
                            <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                              <span>✨</span>
                              <span>Live Preview</span>
                            </div>
                            <div
                              className={`p-4 rounded-xl border min-h-[300px] overflow-y-auto flex-1 ${
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
                                    Start typing to see your formatted notes...
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
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

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(notes)
                              }
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                isDark
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                              }`}
                              title="Copy Notes"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Tab */}
                  {activeTab === "summary" && (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-6 h-6 text-orange-500" />
                          <h3 className="text-lg font-bold">Video Summary</h3>
                        </div>
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
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)] pr-2">
                        {videoSummary ? (
                          <div className="space-y-4">
                            <div
                              className={`p-6 rounded-xl border transition-all duration-300 ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 hover:border-orange-500"
                                  : "bg-white border-gray-200 hover:border-orange-400"
                              }`}
                            >
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: formatNotesToHTML(
                                    videoSummary,
                                    isDark
                                  ),
                                }}
                              />
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
                              Click "Generate Summary" to get AI insights from
                              the video
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Transcript Tab */}
                  {activeTab === "transcript" && (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-purple-500" />
                          <h3 className="text-lg font-bold">
                            Video Transcript
                          </h3>
                        </div>
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
                              <span>Fetch Transcript</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)] pr-2">
                        {transcript && transcript.length > 0 ? (
                          <div className="space-y-3">
                            {transcript.map((item, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                                  isDark
                                    ? "bg-gray-800 border-gray-600 hover:border-purple-500"
                                    : "bg-white border-gray-200 hover:border-purple-400"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div
                                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                                      isDark
                                        ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                                        : "bg-purple-100 text-purple-700 border border-purple-200"
                                    }`}
                                  >
                                    {Math.floor(item.startTime || 0)}s -{" "}
                                    {Math.floor(item.endTime || 0)}s
                                  </div>
                                </div>
                                <div
                                  className={`text-sm leading-relaxed ${
                                    isDark ? "text-gray-100" : "text-gray-800"
                                  }`}
                                >
                                  <p>{item.text}</p>
                                </div>
                              </div>
                            ))}
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
                  )}

                  {/* Assessment Tab */}
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
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            isLoading
                              ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <span>⚙️</span>
                              <span>Generate Questions</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)] pr-2">
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

                  {/* Other tabs remain the same... */}
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
