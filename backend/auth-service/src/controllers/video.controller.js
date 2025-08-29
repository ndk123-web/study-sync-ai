import wrapper from "../utils/Wrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Enrollment from "../models/enrollments.models.js";
import User from "../models/user.models.js";
import CryptoJS from "crypto-js";

// Logic to load and process video goes here

const LoadVideoController = wrapper(async (req, res) => {
  const user = req.user;

  const { videoUrl } = req.body;

  if (!videoUrl) {
    throw new ApiError(400, "Video URL is required");
  }

  const decryptedVideoUrl = CryptoJS.AES.decrypt(
    videoUrl,
    process.env.ENCRYPTION_SECRET
  ).toString(CryptoJS.enc.Utf8); 

  // use regex to find the videoId
  const videoIdMatch = decryptedVideoUrl.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/
  );

  const videoId = videoIdMatch
    ? videoIdMatch[1] || videoIdMatch[2]
    : null;

  if (!videoId) {
    throw new ApiError(400, "Invalid YouTube URL");
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  
  const videoDetails = await fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (data.items && data.items.length > 0) {
      return data.items[0];
    } else {
      throw new ApiError(404, "Video not found");
    }
  })
  .catch(error => {
    console.error("Error fetching video details:", error);
    throw new ApiError(500, "Failed to fetch video details");
  });

  const videoTitle = videoDetails.snippet.title;
  const videoCreator = videoDetails.snippet.channelTitle;
  const videoDuration = videoDetails.contentDetails.duration;

  console.log("Video Details: ", videoDetails);
  if (!videoDetails) {
    throw new ApiError(404, "Video details not found");
  }

  console.log("Video URL: ", videoUrl);
  console.log("Decrypted Video URL: ", decryptedVideoUrl);

  if (!decryptedVideoUrl) {
    throw new ApiError(400, "Video URL is required");
  }

  const userInstance = await User.findOne({ uid: user.uid });
  if (!userInstance) {
    throw new ApiError("User not found", 404);
  }

  const newVideoEnrollment = new Enrollment({
    userId: userInstance._id,
    type: "video",
    uid: user.uid,
    videoLink: videoUrl,
    videoTitle: videoTitle,
    videoCreator: videoCreator,
    videoDuration: videoDuration
  });

  const savedEnrollment = await newVideoEnrollment.save();
  if (!savedEnrollment) {
    throw new ApiError("Failed to Enroll Video", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Enrolled Successfully"));
});

export { LoadVideoController };
