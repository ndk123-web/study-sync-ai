import axios from "axios";
import { AUTH_SERVICE_URL, AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const extractVideoId = (urlOrId) => {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = urlOrId.match(regex);
  return match ? match[1] : urlOrId;
};

const GetCurrentVideoTranscriptApi = async ({ currentVideoId }) => {
  try {
    // 🟢 Pehle ID extract karo
    const properVideoId = extractVideoId(currentVideoId);

    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${AI_SERVICE_URL}/api/v1/transcripts/get-transcript`,
      {
        videoId: properVideoId, // ✅ Ab backend ko sirf ID bhej raha hai
      },
      authConfig
    );

    console.log("backendApiResponse for transcript: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data,
    };
  } catch (err) {
    console.log("Err in GetCurrentVideoTranscript Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetCurrentVideoTranscriptApi };
