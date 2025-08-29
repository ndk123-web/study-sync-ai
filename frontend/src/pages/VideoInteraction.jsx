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
import CryptoJS from "crypto-js";
import Header from "../components/Header";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EnrollmentVideoApi } from '../api/EnrollVideoApi.js'
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
        }"><code class="language-${language || "text"}">${escapedCode}</code></pre>`
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
      if (paragraph.trim() && 
          !paragraph.includes('<h') && 
          !paragraph.includes('<div') && 
          !paragraph.includes('<hr') &&
          !paragraph.includes('__CODE_BLOCK_')) {
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
        }"><code class="language-${language || "text"}">${escapedCode}</code></pre>`
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
    if (section.includes('<h') || 
        section.includes('<pre') || 
        section.includes('<code') ||
        section.includes('<div')) {
      return section;
    }
    
    if (section.trim()) {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 1) {
        return `<p class="mb-3 leading-relaxed">${lines[0]}</p>`;
      } else {
        return `<p class="mb-3 leading-relaxed">${lines.join('<br>')}</p>`;
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
  const encryptedVideoUrl = searchParams.get('v') || v;
  console.log("Encrypted video param v:", encryptedVideoUrl);

  const [videoUrl, setVideoUrl] = useState("");
  const [loadedVideo, setLoadedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [notesPreviewMode, setNotesPreviewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Mobile preview toggle
  const [notesLoader, setNotesLoader] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  // Decrypt and load video from URL params
  useEffect(() => {
    if (encryptedVideoUrl) {
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

  const extractVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLoadVideo = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const encryptedVideoUrl = CryptoJS.AES.encrypt(
        videoUrl,
        import.meta.env.VITE_ENCRYPTION_SECRET
      ).toString();

      const apiResponse = await EnrollmentVideoApi(encryptedVideoUrl);
      if (apiResponse.status !== 200 && apiResponse.status !== 201){
        alert(apiResponse.message || "Failed to enroll video. Please try again.");
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

        // Navigate to the video learning URL with encrypted parameter
        navigate(`/learn/video?v=${encodeURIComponent(encryptedVideoUrl)}`);
      } else {
        alert("Please enter a valid YouTube URL");
      }
    } catch (err) {
      console.error("Error loading video:", err);
      alert("Failed to load video. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        message: `Based on the video content, here's what I can tell you about "${messageInput}": This topic is discussed around the 5:30 mark where the speaker explains... (This would be the actual AI response with timestamp references)`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setMessageInput("");
  };

  const generateSummary = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVideoSummary(`This video provides a comprehensive overview of the topic with the following key points:

🎯 Main Topics Covered:
• Introduction to the subject (0:00 - 2:30)
• Key concepts and definitions (2:30 - 7:15)
• Practical examples and applications (7:15 - 12:00)
• Conclusion and next steps (12:00 - 15:30)

💡 Key Takeaways:
• Important insight 1 from the discussion
• Critical point 2 mentioned by the speaker
• Practical tip 3 for implementation

📊 Statistics/Data Mentioned:
• Key statistic 1
• Important figure 2
• Research finding 3

🔗 Resources Referenced:
• Book/article mentioned
• Website or tool recommended
• Additional learning material suggested`);
      setIsLoading(false);
    }, 2000);
  };

  const generateTranscript = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTranscript(`[00:00] Welcome everyone to today's session. In this video, we'll be covering...

[00:15] Let me start by explaining the fundamental concepts that we need to understand...

[01:30] Now, moving on to the practical applications, you'll notice that...

[03:45] This is particularly important because it helps us understand...

[05:20] Let me show you an example to illustrate this point...

[07:10] As we can see from this demonstration, the key principle is...

[09:30] Now let's discuss some common challenges and how to overcome them...

[12:15] To summarize what we've learned today...

[14:45] For next steps, I recommend that you...

[15:20] Thank you for watching, and don't forget to subscribe for more content like this!`);
      setIsLoading(false);
    }, 2000);
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
    if (typeof window !== 'undefined' && window.Prism) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        try {
          window.Prism.highlightAll();
        } catch (err) {
          console.log('Prism highlighting error:', err);
        }
      }, 100);
    }
  }, [notes, notesPreviewMode, activeTab]);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "summary", label: "Summary", icon: BookOpen },
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "assessment", label: "Assessment", icon: FileCheck },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  // Professional Loader Component
  const LoaderOverlay = ({ message = "Loading...", show }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className={`p-8 rounded-2xl border max-w-md mx-4 ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {message}
            </h3>
            <p className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
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
      <LoaderOverlay show={loader || isLoading} message={loader ? "Loading Video..." : "Processing..."} />
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
            // Main Interface
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Section - Video Player */}
              <div
                className={`rounded-2xl border overflow-hidden ${
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

              {/* Right Section - Interactive Features */}
              <div
                className={`rounded-2xl border overflow-hidden flex flex-col h-full shadow-lg ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Enhanced Header */}
                <div className={`p-4 border-b ${
                  isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/50"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        AI Learning Assistant
                      </h3>
                      <p className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Interactive video analysis
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tabs */}
                <div className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}>
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center justify-center space-x-2 py-4 px-6 whitespace-nowrap transition-all duration-300 relative group ${
                            activeTab === tab.id
                              ? "text-emerald-500 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-900/20"
                              : isDark
                              ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className={`w-5 h-5 transition-transform duration-300 ${
                            activeTab === tab.id ? "scale-110" : "group-hover:scale-105"
                          }`} />
                          <span className="font-medium text-sm">
                            {tab.label}
                          </span>
                          {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full p-4 flex flex-col">
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
                              <p className={`text-sm mb-4 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}>
                                Ask questions about the video content, timestamps, or concepts
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
                                      <span className="text-white text-xs">🤖</span>
                                    </div>
                                  )}
                                  {msg.type === "user" && (
                                    <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
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
                              <div className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                                isDark
                                  ? "bg-gray-700 border border-gray-600"
                                  : "bg-gray-50 border border-gray-200"
                              }`}>
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs">🤖</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                      </div>
                                      <span className="text-sm text-emerald-500 font-medium">Thinking...</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Message Input */}
                        <div className={`border rounded-xl p-3 ${
                          isDark ? "border-gray-600 bg-gray-700/50" : "border-gray-200 bg-gray-50"
                        }`}>
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
                            <BookOpen className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-lg font-bold">Video Summary</h3>
                          </div>
                          <button
                            onClick={generateSummary}
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                          >
                            {isLoading && (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            <span>{isLoading ? "Generating..." : "Generate Summary"}</span>
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                          {videoSummary ? (
                            <div
                              className={`p-6 rounded-xl border shadow-sm ${
                                isDark
                                  ? "bg-gray-700/50 border-gray-600"
                                  : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
                              }`}
                            >
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                                {videoSummary}
                              </pre>
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <Lightbulb className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                Generate AI Summary
                              </h3>
                              <p className={`text-sm mb-4 max-w-sm mx-auto ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}>
                                Get an intelligent summary with key points, timestamps, and insights from the video content
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
                            <FileText className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-lg font-bold">Video Transcript</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={generateTranscript}
                              disabled={isLoading}
                              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                            >
                              {isLoading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              )}
                              <span>{isLoading ? "Generating..." : "Generate Transcript"}</span>
                            </button>
                            {transcript && (
                              <button className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-300">
                                <Download className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                          {transcript ? (
                            <div
                              className={`p-6 rounded-xl border shadow-sm h-full ${
                                isDark
                                  ? "bg-gray-700/50 border-gray-600"
                                  : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
                              }`}
                            >
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                                {transcript}
                              </pre>
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <FileText className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                Extract Transcript
                              </h3>
                              <p className={`text-sm mb-4 max-w-sm mx-auto ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}>
                                Generate a complete transcript with precise timestamps for easy reference and study
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
                            <h3 className="text-lg font-bold">Video Assessment</h3>
                          </div>
                          <button
                            onClick={generateAssessment}
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                          >
                            {isLoading && (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            <span>{isLoading ? "Generating..." : "Generate Questions"}</span>
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
                                      <span className="text-emerald-500 mr-2">Q{index + 1}.</span>
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
                                        <span className="text-sm font-medium">{option}</span>
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
                              <p className={`text-sm mb-4 max-w-sm mx-auto ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}>
                                Generate intelligent questions to test understanding of key concepts from the video
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
                              style={{ minHeight: showPreview ? "200px" : "300px" }}
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
                                    <span className="text-2xl mb-2 block">📝</span>
                                    <p className="text-sm">
                                      Start typing to see your formatted notes...
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
