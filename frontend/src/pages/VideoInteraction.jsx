import React, { useState, useRef } from 'react';
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
  Eye
} from 'lucide-react';
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJS from "crypto-js";
import Header from "../components/Header";

const VideoInteraction = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === "dark";

  const [videoUrl, setVideoUrl] = useState('');
  const [loadedVideo, setLoadedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [videoSummary, setVideoSummary] = useState('');
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLoadVideo = () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      const videoData = {
        id: videoId,
        url: videoUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        title: 'Video Title', // This would come from YouTube API
        duration: '15:30', // This would come from YouTube API
        views: '1.2M views' // This would come from YouTube API
      };
      
      setLoadedVideo(videoData);
      
      // Initialize with welcome message
      setChatMessages([
        {
          id: 1,
          type: 'bot',
          message: `Great! I've loaded the YouTube video. I can help you understand the content, provide summaries, and answer questions about what's discussed in the video.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  const handleSendMessage = () => {
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
        message: `Based on the video content, here's what I can tell you about "${messageInput}": This topic is discussed around the 5:30 mark where the speaker explains... (This would be the actual AI response with timestamp references)`,
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
          timestamp: "2:30"
        },
        {
          id: 2,
          question: "Which practical example was demonstrated?",
          options: ["Example A", "Example B", "Example C", "Example D"],
          correct: 1,
          timestamp: "7:15"
        },
        {
          id: 3,
          question: "What was the key recommendation at the end?",
          options: ["Recommendation A", "Recommendation B", "Recommendation C", "Recommendation D"],
          correct: 2,
          timestamp: "14:45"
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'transcript', label: 'Transcript', icon: FileText },
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
              YouTube Learning Assistant
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter a YouTube URL to get instant summaries, transcripts, chat assistance, and assessments
            </p>
          </div>

          {!loadedVideo ? (
            // URL Input Section
            <div className="max-w-2xl mx-auto">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-600 hover:border-emerald-500 bg-gray-800/50' 
                    : 'border-gray-300 hover:border-emerald-500 bg-gray-50/50'
                }`}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enter YouTube URL</h3>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Supports: youtube.com/watch?v=... or youtu.be/... links
                </p>
              </div>
            </div>
          ) : (
            // Main Interface
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Section - Video Player */}
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <Video className="w-6 h-6 text-emerald-500" />
                    <div className="flex-1">
                      <h3 className="font-bold line-clamp-2">{loadedVideo.title}</h3>
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
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-sm text-center">
                      <span className="font-medium">💡 Pro Tip:</span> Use the chat to ask specific questions about timestamps, concepts, or details from the video!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - Interactive Features */}
              <div className={`rounded-2xl border overflow-hidden flex flex-col h-full ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center justify-center space-x-2 py-4 px-4 whitespace-nowrap transition-all duration-200 ${
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
                          placeholder="Ask about the video content, timestamps, concepts..."
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
                        <h3 className="text-lg font-bold">Video Summary</h3>
                        <button
                          onClick={generateSummary}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                        >
                          {isLoading ? 'Generating...' : 'Generate Summary'}
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto min-h-0">
                        {videoSummary ? (
                          <div className={`p-4 rounded-xl border ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{videoSummary}</pre>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Click "Generate Summary" to get an AI-powered summary with timestamps
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'transcript' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Video Transcript</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={generateTranscript}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                          >
                            {isLoading ? 'Generating...' : 'Generate Transcript'}
                          </button>
                          {transcript && (
                            <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto min-h-0">
                        {transcript ? (
                          <div className={`p-4 rounded-xl border h-full ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{transcript}</pre>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Click "Generate Transcript" to extract video transcript with timestamps
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'assessment' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-bold">Video Assessment</h3>
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
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold flex-1">Q{index + 1}. {q.question}</h4>
                                  <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded ml-2">
                                    @{q.timestamp}
                                  </span>
                                </div>
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
                            Click "Generate Questions" to create assessment questions based on video content
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
                          placeholder="Take notes while watching the video..."
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

export default VideoInteraction;
