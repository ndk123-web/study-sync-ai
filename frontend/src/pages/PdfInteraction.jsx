import React, { useState, useRef } from 'react';
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
  X
} from 'lucide-react';
import { useThemeStore } from "../store/slices/useThemeStore";
import { useLoaders } from "../store/slices/useLoaders.js";
import CryptoJS from "crypto-js";
import Header from "../components/Header";
import { LoadPdfFileApi } from '../api/LoadPdfFileApi.js';

const PdfInteraction = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";

  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [pdfSummary, setPdfSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const fileInputRef = useRef(null);

  // Global loaders from store
  const pdfLoader = useLoaders((state) => state.pdfLoader);
  const setPdfLoader = useLoaders((state) => state.setPdfLoader);
  const unsetPdfLoader = useLoaders((state) => state.unsetPdfLoader);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {

      let maxSizeMB = 100;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds the ${maxSizeMB}MB limit. Please upload a smaller file.`);
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
          url: URL.createObjectURL(file)
        });
        
        // Initialize with welcome message
        setChatMessages([
          {
            id: 1,
            type: 'bot',
            message: `Great! I've successfully uploaded "${file.name}" to the cloud and it's ready for analysis. I can help you understand this document. What would you like to know?`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        
        console.log("✅ PDF uploaded successfully!");
        
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
  };  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: messageInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: `I understand you're asking about: "${messageInput}". Based on the PDF content, here's what I can tell you... (This would be the actual AI response)`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);

    setMessageInput('');
  };

  const generateSummary = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPdfSummary(`This is a comprehensive summary of the uploaded PDF document. The document covers key topics including...
      
Key Points:
• Main concept 1: Lorem ipsum dolor sit amet
• Main concept 2: Consectetur adipiscing elit
• Main concept 3: Sed do eiusmod tempor incididunt

Important Details:
The document provides detailed insights into various aspects of the subject matter, including practical applications and theoretical foundations.`);
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
          question: "What is the main concept discussed in this document?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0
        },
        {
          id: 2,
          question: "Which of the following best describes the key findings?",
          options: ["Finding A", "Finding B", "Finding C", "Finding D"],
          correct: 1
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'assessment', label: 'Assessment', icon: FileCheck },
    { id: 'notes', label: 'Notes', icon: StickyNote }
  ];

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
    }`}>
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              PDF Learning Assistant
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload your PDF and get instant summaries, chat assistance, and assessments
            </p>
          </div>

          {!uploadedPdf ? (
            // Upload Section
            <div className="max-w-2xl mx-auto">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isUploadingPdf 
                    ? (isDark ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50') 
                    : (isDark 
                      ? 'border-gray-600 hover:border-emerald-500 bg-gray-800/50' 
                      : 'border-gray-300 hover:border-emerald-500 bg-gray-50/50')
                }`}
              >
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isUploadingPdf 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}>
                  {isUploadingPdf ? (
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {isUploadingPdf ? 'Uploading PDF...' : 'Upload Your PDF'}
                </h3>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isUploadingPdf 
                    ? 'Please wait while we process your PDF file' 
                    : 'Drop your PDF file here or click to browse'
                  }
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
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:scale-105'
                  }`}
                >
                  {isUploadingPdf ? 'Uploading...' : 'Choose PDF File'}
                </button>
                <p className={`text-sm mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Supported format: PDF (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            // Main Interface
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Section - PDF Viewer */}
              <div className={`rounded-2xl border overflow-hidden flex flex-col ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h3 className="font-bold">{uploadedPdf.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {uploadedPdf.size} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}>
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setUploadedPdf(null)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  {uploadedPdf.url ? (
                    <iframe
                      src={uploadedPdf.url}
                      className="w-full h-full rounded-xl border"
                      title="PDF Viewer"
                      style={{ minHeight: '400px' }}
                    />
                  ) : (
                    <div className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center ${
                      isDark ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          PDF Viewer
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Upload a PDF to view it here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Interactive Features */}
              <div className={`rounded-2xl border overflow-hidden flex flex-col h-full ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'border-b-2 border-emerald-500 text-emerald-500'
                              : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full p-4 flex flex-col">
                    {activeTab === 'chat' && (
                      <div className="h-full flex flex-col">
                        {/* Chat Messages */}
                        <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-0">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                : isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <div className="flex items-start space-x-2">
                                {msg.type === 'bot' && <Bot className="w-4 h-4 mt-1 text-emerald-500" />}
                                {msg.type === 'user' && <User className="w-4 h-4 mt-1" />}
                                <div>
                                  <p className="text-sm">{msg.message}</p>
                                  <p className={`text-xs mt-1 opacity-70`}>{msg.timestamp}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        </div>

                        {/* Message Input */}
                        <div className="flex space-x-2 flex-shrink-0">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask me anything about this PDF..."
                          className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Document Summary</h3>
                        <button
                          onClick={generateSummary}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                        >
                          {isLoading ? 'Generating...' : 'Generate Summary'}
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto min-h-0">
                        {pdfSummary ? (
                          <div className={`p-4 rounded-xl border ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{pdfSummary}</pre>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Click "Generate Summary" to get an AI-powered summary of your PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'assessment' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Assessment</h3>
                        <button
                          onClick={generateAssessment}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                        >
                          {isLoading ? 'Generating...' : 'Generate Questions'}
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto min-h-0">
                        {assessmentQuestions.length > 0 ? (
                          <div className="space-y-4">
                            {assessmentQuestions.map((q, index) => (
                              <div key={q.id} className={`p-4 rounded-xl border ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                              }`}>
                                <h4 className="font-semibold mb-3">Q{index + 1}. {q.question}</h4>
                                <div className="space-y-2">
                                  {q.options.map((option, optIndex) => (
                                    <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                                      <input type="radio" name={`q${q.id}`} className="text-emerald-500" />
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
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Click "Generate Questions" to create assessment questions based on your PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">My Notes</h3>
                        <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 min-h-0">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Take notes while reading the PDF..."
                          className={`w-full h-full p-4 rounded-xl border resize-none transition-all duration-200 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
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

export default PdfInteraction;
