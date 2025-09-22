import wrapper from "../utils/Wrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Enrollment from "../models/enrollments.models.js";
import User from "../models/user.models.js";
import CryptoJS from "crypto-js";

// Logic to load and process video goes here

const LoadVideoController = wrapper(async (req, res) => {
  const user = req.user;

  // Accept either { videoUrl: "..." } or nested { videoUrl: { videoUrl: "..." } }
  let rawVideoUrl = req.body?.videoUrl;
  if (rawVideoUrl && typeof rawVideoUrl === 'object' && rawVideoUrl.videoUrl) {
    console.log('[Video] Unwrapping nested videoUrl object');
    rawVideoUrl = rawVideoUrl.videoUrl;
  }

  console.log('[Video] Received body.videoUrl =', req.body?.videoUrl);
  console.log('[Video] Normalized rawVideoUrl =', rawVideoUrl, 'type:', typeof rawVideoUrl);

  if (!rawVideoUrl || typeof rawVideoUrl !== 'string') {
    throw new ApiError(400, 'Video URL is required');
  }

  // Try decrypt – if fails, treat as plain URL
  let decryptedVideoUrl = rawVideoUrl;
  try {
    const bytes = CryptoJS.AES.decrypt(rawVideoUrl, process.env.ENCRYPTION_SECRET);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    if (decoded) {
      decryptedVideoUrl = decoded;
      console.log('[Video] Decryption successful');
    } else {
      console.log('[Video] Decryption returned empty string, assuming plain URL');
    }
  } catch (err) {
    console.log('[Video] Decryption error, assuming plain URL:', err.message);
  }

  // Normalize possible short forms
  decryptedVideoUrl = decryptedVideoUrl.trim();

  // Robust regex with grouping only for ID
  const YT_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = decryptedVideoUrl.match(YT_REGEX);
  const videoId = match ? match[1] : null;

  if (!videoId) {
    console.log('[Video] Failed to extract videoId from URL:', decryptedVideoUrl);
    throw new ApiError(400, 'Invalid YouTube URL');
  }

  console.log('[Video] Extracted videoId =', videoId);

  if (!process.env.GOOGLE_API_KEY) {
    throw new ApiError(500, 'Server missing GOOGLE_API_KEY');
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`;

  let videoDetails;
  try {
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    if (!data.items || data.items.length === 0) {
      throw new ApiError(404, 'Video not found');
    }
    videoDetails = data.items[0];
  } catch (err) {
    console.error('[Video] Error fetching YouTube metadata:', err.message);
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to fetch video details');
  }

  const videoTitle = videoDetails?.snippet?.title || 'Untitled Video';
  const videoCreator = videoDetails?.snippet?.channelTitle || 'Unknown Creator';
  const isoDuration = videoDetails?.contentDetails?.duration || 'PT0S';

  // Optional: convert ISO 8601 duration to HH:MM:SS
  const parseISODuration = (iso) => {
    const re = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const m = iso.match(re) || [];
    const h = parseInt(m[1] || '0', 10);
    const min = parseInt(m[2] || '0', 10);
    const s = parseInt(m[3] || '0', 10);
    return [h, min, s]
      .map((v) => String(v).padStart(2, '0'))
      .join(':');
  };
  const videoDuration = parseISODuration(isoDuration);

  console.log('[Video] Final metadata =>', { videoTitle, videoCreator, videoDuration });

  const userInstance = await User.findOne({ uid: user.uid });
  if (!userInstance) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent duplicate enrollment of same video for user
  const existing = await Enrollment.findOne({ uid: user.uid, videoLink: rawVideoUrl });
  if (existing) {
    return res.status(200).json(new ApiResponse(200, {
      alreadyEnrolled: true,
      videoId,
      title: videoTitle,
      creator: videoCreator,
      duration: videoDuration,
    }, 'Video already enrolled'));
  }

  const newVideoEnrollment = new Enrollment({
    userId: userInstance._id,
    type: 'video',
    uid: user.uid,
    videoLink: rawVideoUrl,
    videoTitle,
    videoCreator,
    videoDuration,
  });

  const savedEnrollment = await newVideoEnrollment.save();
  if (!savedEnrollment) {
    throw new ApiError(500, 'Failed to Enroll Video');
  }

  return res.status(200).json(new ApiResponse(200, {
    videoId,
    title: videoTitle,
    creator: videoCreator,
    duration: videoDuration,
  }, 'Video Enrolled Successfully'));
});

export { LoadVideoController };
