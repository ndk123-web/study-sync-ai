import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";
import CryptoJS from "crypto-js";

const EnrollmentVideoApi = async (videoUrl) => {
  try {
    // Get authentication config with fresh Firebase token
    const authConfig = await getAuthConfig();
    
    // Encrypt the video URL as backend expects encrypted URL
    const encryptedVideoUrl = CryptoJS.AES.encrypt(
      videoUrl,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString();

    const backendResponse = await axios.post(
      `${BaseUrl}/api/v1/video/enroll-video`,
      {
        videoUrl: encryptedVideoUrl,
      },
      authConfig
    );

    console.log("backendApiResponse: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in Getting All Courses Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { EnrollmentVideoApi };
