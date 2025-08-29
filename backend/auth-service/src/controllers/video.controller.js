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
    throw ApiError(400, "Video URL is required");
  }

  const decryptedVideoUrl = CryptoJS.AES.decrypt(
    videoUrl,
    process.env.ENCRYPTION_SECRET
  ).toString(CryptoJS.enc.Utf8); 

  console.log("Video URL: ", videoUrl);
  console.log("Decrypted Video URL: ", decryptedVideoUrl);

  if (!decryptedVideoUrl) {
    throw ApiError(400, "Video URL is required");
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
