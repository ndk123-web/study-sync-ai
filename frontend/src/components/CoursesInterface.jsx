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

const CoursesInterface = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const [searchParams] = useSearchParams();
  const isDark = theme === "dark";
  const [coursePlaylist, setCoursePlaylist] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notStoreNotes, setNotStoreNotes] = useState("");
  const [storedNotes, setStoredNotes] = useState("");
  const [completedVideosIndex, setCompletedVideosIndex] = useState(-1);
  const navigate = useNavigate();

  const notStoreNotesFromZustand = useNotes((state) => state.notStoreNotes);
  const storedNotesFromZustand = useNotes((state) => state.storeNotes);
  const setNotStoreNotesFromZustand = useNotes(
    (state) => state.setNotStoreNotes
  );
  const setStoredNotesFromZustand = useNotes((state) => state.setStoreNotes);

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

  const notesLoader = useLoaders((state) => state.notesLoader);
  const setNotesLoader = useLoaders((state) => state.setNotesLoader);
  const unsetNotesLoader = useLoaders((state) => state.unsetNotesLoader);

  const chatLoader = useLoaders((state) => state.chatLoader);
  const summarizeLoader = useLoaders((state) => state.summarizeLoader);
  const assessmentLoader = useLoaders((state) => state.assessmentLoader);
  const playlistLoader = useLoaders((state) => state.playlistLoader);
  const isAuth = useIsAuth((state) => state.isAuth);
  const removeAuth = useIsAuth((state) => state.removeAuth);
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [videoSize, setVideoSize] = useState(55); // Default 50%
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message:
        "Hello! I'm your AI study assistant. I can help you understand React Hooks concepts. What would you like to learn about?",
      timestamp: new Date(),
      avatar: "🤖",
    },
    {
      id: 2,
      type: "user",
      message:
        "Can you explain the difference between useState and useReducer?",
      timestamp: new Date(),
      avatar: "👤",
    },
    {
      id: 3,
      type: "ai",
      message:
        "Great question! useState is perfect for simple state management, while useReducer is better for complex state logic with multiple sub-values or when the next state depends on the previous one. useReducer follows the Redux pattern with actions and reducers.",
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

  const { courseId } = useParams();

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
  useEffect(() => {
    const fetchTranscript = async () => {
      const apiResponse = await GetCurrentVideoTranscriptApi({
        currentVideoId,
      });

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        // alert("Error fetching video transcript: " + apiResponse?.error || apiResponse?.message || "Error in fetching transcript");
        return;
      }

      setTranscriptText(apiResponse?.data?.transcript);
      console.log("Transcript: ", transcriptText);

      console.log("ApiResponse for Transcript: ", apiResponse);
    };

    fetchTranscript();
  }, [currentVideoId]);

  // To Get Notes on the basis of courseId
  useEffect(() => {
    const fetchNotes = async () => {
      console.log("🔍 Fetching notes for courseId:", courseId);

      if (!courseId) {
        console.log("❌ No courseId provided, skipping notes fetch");
        return;
      }

      try {
        // First check if we have notes in Zustand (local storage)
        if (storedNotesFromZustand) {
          console.log("📱 Using notes from Zustand:", storedNotesFromZustand);
          setStoredNotes(storedNotesFromZustand);
          setNotStoreNotes(notStoreNotesFromZustand || storedNotesFromZustand);
          return;
        }

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
        setStoredNotes(notesData);
        setNotStoreNotes(notesData);
        setStoredNotesFromZustand(notesData);
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
  }, [courseId, storedNotesFromZustand]);

  // Debug useEffect to log state changes
  useEffect(() => {
    console.log("🔄 State updated - storedNotes:", storedNotes);
    console.log("🔄 State updated - notStoreNotes:", notStoreNotes);

  }, [storedNotes, notStoreNotes]);

  // Auto-save to Zustand when user types (with debounce)
  useEffect(() => {
    if (!courseId || !notStoreNotes) return;

    const autoSaveTimer = setTimeout(async () => {
      console.log("💾 Auto-saving notes to Zustand...");
      setNotStoreNotesFromZustand(notStoreNotes); // when user types then this will be called 

      try{
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

      }
      catch(err){
        console.error("💥 Error in auto-save:", err)
        alert("Error in Saving Notes after 2 seconds");
      }
      finally{
        unsetNotesLoader(); // whether error or success this will be called 
      }

      console.log("✅ Notes auto-saved to Zustand");
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(autoSaveTimer);
  }, [notStoreNotes, courseId]);

  const handleSaveNotes = async () => {
    try {

      console.log("notStoreNotes:", notStoreNotes);
      console.log("storedNotesFromZustand:", storedNotesFromZustand);
      console.log("storedNotes:", storedNotes);
      console.log("notStoreNotesFromZustand:", notStoreNotesFromZustand);

      // if stored notes are equal to not stored notes then no need to call API
      if (notStoreNotes.trim() === notStoreNotesFromZustand.trim()) {
        alert("No changes detected in notes.");
        return;
      }

      setNotesLoader();
      // if notStoreNotes is not equal to storedNotes then call API to create a new Note
      const apiResponse = await SaveCourseNotesApi({
        courseId,
        notes: notStoreNotes,
      });
      console.log("Api Response for Creating Note: ", apiResponse);
      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        // Logic For Error Notification
        console.log(
          "Error in fetching notes: ",
          apiResponse?.message || "Error in fetching notes"
        );
        return;
      }

      unsetNotesLoader();
      
      // Update both local state and Zustand with the saved notes
      const savedNotes = apiResponse?.data?.notes || "";
      setStoredNotes(savedNotes);
      setNotStoreNotes(savedNotes);
      
      // Update Zustand store as well
      setStoredNotesFromZustand(savedNotes);
      setNotStoreNotesFromZustand(savedNotes);
      
      console.log("✅ Notes saved successfully and synced with Zustand");
      alert("Notes Saved Successfully")
    } catch (err) {
      alert("Error fetching notes: " + err.message);
      // unsetNotesLoader();
    } finally {
      unsetNotesLoader();
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

  const sendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: chatMessage,
      timestamp: new Date(),
      avatar: "👤",
    };

    setChatMessages([...chatMessages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        message:
          "That's an excellent question about React Hooks! Let me explain that concept in detail...",
        timestamp: new Date(),
        avatar: "🤖",
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setChatMessage("");
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
                          {index + 1 <= completedVideosIndex && (
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
                            <p className="leading-relaxed">{message.message}</p>
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
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">📝</span>
                      <h3 className="text-lg font-semibold">My Notes</h3>
                    </div>
                    <textarea
                      placeholder="Take notes while watching..."
                      className={`w-full h-48 p-3 rounded-lg border text-sm resize-none ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      value={notStoreNotes}
                      onChange={(e) => setNotStoreNotes(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Auto-saved
                      </span>
                      <button onClick={handleSaveNotes} className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                        { notesLoader ? "Saving..." : "Save" }
                      </button>
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
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <h4 className="font-medium mb-2">Key Points:</h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • React Hooks enable state in functional components
                        </li>
                        <li>
                          • useState is the basic hook for state management
                        </li>
                        <li>• Always call hooks at the top level</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "transcript" && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">📜</span>
                      <h3 className="text-lg font-semibold">Transcript</h3>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      } max-h-64 overflow-y-auto`}
                    >
                      <div className="space-y-2 text-sm">
                        <div>
                          {transcriptText &&
                            transcriptText.map((snippet, index) => (
                              <div key={index}>
                                <span className="text-emerald-500 font-mono text-xs">
                                  {snippet.startTime +
                                    " - " +
                                    snippet.endTime +
                                    "\n"}
                                </span>
                                <p>{snippet.text}</p>
                              </div>
                            ))}
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
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
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
                  <button className="text-emerald-500 text-sm hover:text-emerald-600 transition-colors">
                    Export PDF
                  </button>
                </div>

                <textarea
                  placeholder="Take notes while watching the video...

Tips:
• Use timestamps like [05:30] for important moments
• Write key concepts and definitions
• Note questions to ask later"
                  value={notStoreNotes} // Changed from storedNotes to notStoreNotes
                  className={`w-full h-48 p-4 rounded-lg border resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                  // This is important for validating notes
                  onChange={(e) => {
                    setNotStoreNotes(e.target.value);
                  }}
                />

                {/* Debug info - you can remove this later */}
                {/* <div className="mt-2 text-xs text-gray-500">
                  <p>Debug: notStoreNotes length: {notStoreNotes.length}</p>
                  <p>Debug: storedNotes length: {storedNotes.length}</p>
                </div> */}

                {/* button to save notes */}
                <button
                  onClick={handleSaveNotes}
                  className={`mt-4 px-4 py-2 rounded-lg text-white ${
                    isDark
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } transition-all duration-200`}
                >
                  {notesLoader ? "Saving..." : "Save Notes"}
                </button>
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
                <h3 className="text-xl font-bold">Video Transcript 📜</h3>
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } max-h-96 overflow-y-auto`}
                >
                  <div className="space-y-3 text-sm leading-relaxed">
                    {transcriptText?.map((item, index) => (
                      <div key={index}>
                        <span className="font-semibold">
                          {item.startTime} - {item.endTime}:{" "}
                        </span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Lesson Summary 📚</h3>
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4 className="font-semibold mb-3">
                    🎯 Key Learning Points:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>
                        React Hooks allow you to use state in functional
                        components
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>
                        useState is the most basic hook for managing state
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>
                        Always call hooks at the top level of your function
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Hooks follow the naming convention "use..."</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4 className="font-semibold mb-3">💡 Quick Recap:</h4>
                  <p className="text-sm">
                    This lesson covered the fundamentals of React Hooks,
                    focusing on useState for state management in functional
                    components. You learned the rules of hooks and best
                    practices for implementation.
                  </p>
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
