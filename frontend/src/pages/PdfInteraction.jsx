import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  MessageSquare,
  BookOpen,
  FileCheck,
  StickyNote,
  Download,
  Eye,
  Trash2,
  Send,
  Bot,
  User,
  Lightbulb,
  CheckCircle,
  X,
} from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import { useLoaders } from "../store/slices/useLoaders.js";
import CryptoJS from "crypto-js";
import Header from "../components/Header";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LoadPdfFileApi } from "../api/LoadPdfFileApi.js";
import { GetPdfMetaDataApi } from "../api/GetPdfMetaDataApi.js";
import { GetPDFSummaryApi } from "../api/GetPDFSummaryApi.js";
import { SendPdfChatApi } from "../api/SendPdfChatApi.js";
import { GetPdfChats } from "../api/GetPdfChatsApi.js";

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

const PdfInteraction = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [pdfSummary, setPdfSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [notesPreviewMode, setNotesPreviewMode] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfSize, setPdfSize] = useState(55); // Default 55% for resizable panels
  const fileInputRef = useRef(null);

  // Global loaders from store
  const pdfLoader = useLoaders((state) => state.pdfLoader);
  const setPdfLoader = useLoaders((state) => state.setPdfLoader);
  const unsetPdfLoader = useLoaders((state) => state.unsetPdfLoader);

  const [searchParams] = useSearchParams();
  const pdf = searchParams.get("pdf");
  console.log("PDF Param:", pdf);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "summary", label: "Summary", icon: BookOpen },
    { id: "assessment", label: "Assessment", icon: FileCheck },
  ];

  useEffect(() => {
    const fetchPdfMetadata = async () => {
      try {
        if (pdf) {
          setIsUploadingPdf(true);
          setPdfLoader();
          const apiResponse = await GetPdfMetaDataApi({ pdfId: pdf });
          if (apiResponse.status !== 200 && apiResponse.status !== 201) {
            alert("Failed to fetch PDF metadata. Please try again.");
            return;
          }
          setUploadedPdf({
            file: apiResponse?.data?.pdfLink,
            name: apiResponse?.data?.pdfName,
            size: apiResponse?.data?.pdfSize,
            url: apiResponse?.data?.pdfLink,
          });
          setChatMessages();
          setChatMessages([
            {
              id: 1,
              type: "bot",
              message: `Great! I've successfully Fetched "${apiResponse?.data?.pdfName}" to the cloud and it's ready for analysis. I can help you understand this document. What would you like to know?`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching PDF metadata:", err);
        alert("An error occurred while fetching PDF metadata.");
      } finally {
        setIsUploadingPdf(false);
        unsetPdfLoader();
      }
    };
    fetchPdfMetadata();
  }, []);

  // Apply Prism syntax highlighting whenever chat messages change
  useEffect(() => {
    if (typeof window === "undefined" || !window.Prism) return;

    const timeoutId = setTimeout(() => {
      try {
        const chatElems = Array.from(
          document.querySelectorAll(".prose code[data-raw-code]")
        ).filter((el) => !el.hasAttribute("data-prism-processed"));

        console.log(
          "🎨 Found",
          chatElems.length,
          "unprocessed chat code blocks"
        );

        chatElems.forEach((el) => {
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
            if (decoded) el.textContent = decoded;
            window.Prism.highlightElement(el);
          } catch (err) {
            console.error("Error processing code element:", err);
          }
        });

        console.log(
          "🎨 Prism highlighting applied to",
          chatElems.length,
          "code blocks"
        );
      } catch (error) {
        console.error("Prism highlighting error:", error);
      }
    }, 200); // small delay to let React paint

    return () => clearTimeout(timeoutId);
  }, [chatMessages]);

  // Also apply Prism when component mounts and Prism is available
  useEffect(() => {
    if (window.Prism) {
      const timeoutId = setTimeout(() => {
        window.Prism.highlightAll();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, []);

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

  useEffect(() => {
    // here user chat and ai chat interaction

    const fetchPdfChats = async () => {
      try {
        const apiResponse = await GetPdfChats({ pdfId: pdf });
        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          alert("Failed to fetch PDF chat history. Please try again.");
          return;
        }
        console.log("Fetched PDF Chats:", apiResponse);
        const formattedChats = apiResponse?.data?.chats?.map((chat) => {
          let user = {
            id: chat.id * 2,
            type: "user",
            message: chat.prompt,
          };
          let bot = {
            id: chat.id * 2 + 1,
            type: "bot",
            message: chat.response,
          };
          return [user, bot];
        });
        setChatMessages(formattedChats.flat() || []);
      } catch (err) {
        alert("Error: ", err.message);
        console.error("Error in chat interaction:", err);
      }
    };

    fetchPdfChats();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      let maxSizeMB = 100;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(
          `File size exceeds the ${maxSizeMB}MB limit. Please upload a smaller file.`
        );
        return;
      }

      try {
        // Start loading state
        setIsUploadingPdf(true);
        setPdfLoader();

        console.log("🚀 Uploading PDF file:", file.name);

        const apiResponse = await LoadPdfFileApi({ pdfFile: file });

        console.log("📄 PDF Upload Response:", apiResponse);

        if (apiResponse.status !== 200 && apiResponse.status !== 201) {
          console.error("❌ PDF upload failed:", apiResponse);
          alert("Failed to load PDF. Please try again.");
          return;
        }

        setUploadedPdf({
          file: file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
          url: URL.createObjectURL(file),
        });

        // Initialize with welcome message
        setChatMessages([
          {
            id: 1,
            type: "bot",
            message: `Great! I've successfully uploaded "${file.name}" to the cloud and it's ready for analysis. I can help you understand this document. What would you like to know?`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        console.log("✅ PDF uploaded successfully!");
        navigate("?pdf=" + apiResponse?.data?.enrollmentId);
      } catch (error) {
        console.error("💥 Error during PDF upload:", error);
        alert("An error occurred while uploading the PDF. Please try again.");
      } finally {
        // End loading state
        setIsUploadingPdf(false);
        unsetPdfLoader();
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const newMessage = {
        id: Date.now(),
        type: "user",
        message: messageInput,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setMessageInput("");

      const apiResponse = await SendPdfChatApi({
        pdfId: pdf,
        question: messageInput,
      });

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        console.log("PDF Chat Response:", apiResponse);
        alert("Failed to fetch PDF chat response. Please try again.");
        return;
      }

      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        message: apiResponse?.data?.answer || "No response from AI.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      alert("Error: ", err.message);
    } finally {
      setIsLoading(false);
    }

    // setChatMessages((prev) => [...prev, newMessage]);

    // // Simulate AI response (replace with actual API call)
    // setTimeout(() => {
    //   const botResponse = {
    //     id: Date.now() + 1,
    //     type: "bot",
    //     message: `I understand you're asking about: "${messageInput}". Based on the PDF content, here's what I can tell you... (This would be the actual AI response)`,
    //     timestamp: new Date().toLocaleTimeString(),
    //   };
    //   setChatMessages((prev) => [...prev, botResponse]);
    // }, 1000);
  };

  const generateSummary = async () => {
    try {
      // Simulate API call

      const apiResponse = await GetPDFSummaryApi({ pdfId: pdf });
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        console.log("PDF Summary Response:", apiResponse);
        alert("Failed to fetch PDF summary. Please try again.");
        return;
      }

      console.log("PDF Summary Response:", apiResponse);

      setPdfSummary(apiResponse?.data?.summary || "No summary available.");
      setIsLoading(false);
    } catch (err) {
      alert("Error: ", err.message);
      console.log("Err in Generating PDF Summary: ", err.message);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(true);
  };

  const generateAssessment = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssessmentQuestions([
        {
          id: 1,
          question: "What is the main concept discussed in this document?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
        },
        {
          id: 2,
          question: "Which of the following best describes the key findings?",
          options: ["Finding A", "Finding B", "Finding C", "Finding D"],
          correct: 1,
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              PDF Learning Assistant
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Upload your PDF and get instant summaries, chat assistance, and
              assessments
            </p>
          </div>

          {!uploadedPdf ? (
            // Upload Section
            <div className="max-w-2xl mx-auto">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isUploadingPdf
                    ? isDark
                      ? "border-emerald-500 bg-emerald-900/20"
                      : "border-emerald-500 bg-emerald-50"
                    : isDark
                    ? "border-gray-600 hover:border-emerald-500 bg-gray-800/50"
                    : "border-gray-300 hover:border-emerald-500 bg-gray-50/50"
                }`}
              >
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isUploadingPdf
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                  }`}
                >
                  {isUploadingPdf ? (
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {isUploadingPdf ? "Uploading PDF..." : "Upload Your PDF"}
                </h3>
                <p
                  className={`text-lg mb-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isUploadingPdf
                    ? "Please wait while we process your PDF file"
                    : "Drop your PDF file here or click to browse"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploadingPdf}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPdf}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform shadow-lg ${
                    isUploadingPdf
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:scale-105"
                  }`}
                >
                  {isUploadingPdf ? "Uploading..." : "Choose PDF File"}
                </button>
                <p
                  className={`text-sm mt-4 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Supported format: PDF (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            // Main Interface with VideoInteraction-style layout
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
              {/* Left Section - PDF Viewer */}
              <div
                className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                style={{
                  width: window.innerWidth >= 1024 ? `${pdfSize}%` : "100%",
                }}
              >
                {/* PDF Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{uploadedPdf.name}</h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        PDF Document • {uploadedPdf.size}MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setUploadedPdf(null)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 p-4">
                  {uploadedPdf.url ? (
                    <iframe
                      src={uploadedPdf.url}
                      className="w-full h-full rounded-xl border border-gray-200 dark:border-gray-700"
                      title="PDF Viewer"
                      style={{ minHeight: "500px" }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center ${
                        isDark
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-bold mb-2">PDF Viewer</h3>
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Your PDF will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resizable Divider - Only show on large screens */}
              <div className="hidden lg:flex items-center">
                <div
                  className={`w-1 h-full rounded-full cursor-col-resize transition-colors hover:bg-emerald-500 ${
                    isDark ? "bg-gray-600" : "bg-gray-300"
                  }`}
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startSize = pdfSize;

                    const handleMouseMove = (e) => {
                      const diff =
                        ((e.clientX - startX) / window.innerWidth) * 100;
                      const newSize = Math.min(
                        Math.max(startSize + diff, 30),
                        70
                      );
                      setPdfSize(newSize);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                />
              </div>

              {/* Right Section - Interactive Features */}
              <div
                className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                style={{
                  width:
                    window.innerWidth >= 1024
                      ? `${100 - pdfSize - 1}%`
                      : "100%",
                }}
              >
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 transition-all duration-300 ${
                          activeTab === tab.id
                            ? "border-b-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
                            : isDark
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm hidden sm:inline">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === "chat" && (
                    <div className="h-full flex flex-col p-4">
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[calc(100vh-400px)]">
                        {chatMessages?.length > 0 ? (
                          chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.type === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[85%] rounded-2xl p-4 ${
                                  msg.type === "user"
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                    : isDark
                                    ? "bg-gray-700 text-gray-100"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {msg.type === "bot" ? (
                                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
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
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <p
                                className={`text-lg ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Start a conversation about your PDF
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="flex space-x-2 flex-shrink-0">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                          placeholder="Ask me anything about this PDF..."
                          className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="h-full flex flex-col p-4">
                      {/* Notes Header */}
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">My Notes</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              setNotesPreviewMode(!notesPreviewMode)
                            }
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                              notesPreviewMode
                                ? "bg-emerald-500 text-white"
                                : isDark
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {notesPreviewMode ? "Edit" : "Preview"}
                          </button>
                          <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Notes Content */}
                      <div className="flex-1 min-h-0">
                        {notesPreviewMode ? (
                          <div className="h-full overflow-y-auto">
                            <div
                              className={`p-4 rounded-xl border min-h-full ${
                                isDark
                                  ? "bg-gray-700/50 border-gray-600"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              {notes ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: formatNotesToHTML(notes, isDark),
                                  }}
                                />
                              ) : (
                                <div className="text-center py-12">
                                  <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                  <p
                                    className={`${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    No notes yet. Switch to edit mode to start
                                    writing!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Take notes while reading the PDF...

You can use Markdown formatting:
- **Bold text**
- *Italic text*
- # Headers
- ```code blocks```
- - Bullet points
- [x] Checkboxes"
                            className={`w-full h-full p-4 rounded-xl border resize-none transition-all duration-200 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "summary" && (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Document Summary</h3>
                        <button
                          onClick={generateSummary}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Generating..." : "Generate Summary"}
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0">
                        {pdfSummary ? (
                          <div
                            className={`p-4 rounded-xl border ${
                              isDark
                                ? "bg-gray-700 border-gray-600"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                              {pdfSummary}
                            </pre>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Click "Generate Summary" to get an AI-powered
                              summary of your PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "assessment" && (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Assessment</h3>
                        <button
                          onClick={generateAssessment}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Generating..." : "Generate Questions"}
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0">
                        {assessmentQuestions.length > 0 ? (
                          <div className="space-y-4">
                            {assessmentQuestions.map((q, index) => (
                              <div
                                key={q.id}
                                className={`p-4 rounded-xl border ${
                                  isDark
                                    ? "bg-gray-700 border-gray-600"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <h4 className="font-semibold mb-3">
                                  Q{index + 1}. {q.question}
                                </h4>
                                <div className="space-y-2">
                                  {q.options.map((option, optIndex) => (
                                    <label
                                      key={optIndex}
                                      className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                      <input
                                        type="radio"
                                        name={`q${q.id}`}
                                        className="text-emerald-500 focus:ring-emerald-500"
                                      />
                                      <span>{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200">
                              Submit Assessment
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Click "Generate Questions" to create assessment
                              questions based on your PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfInteraction;
