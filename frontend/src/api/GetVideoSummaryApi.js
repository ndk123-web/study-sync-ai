import axios from "axios";
import { AES } from "crypto-js";
import CryptoJS from "crypto-js";
import { AI_SERVICE_URL as BaseUrl } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const GetVideoSummaryApi = async ({ courseId, videoId }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${BaseUrl}/api/v1/summaries/get-video-summary`,
      {
        videoId: CryptoJS.AES.decrypt(
          videoId,
          import.meta.env.VITE_ENCRYPTION_SECRET
        ).toString(CryptoJS.enc.Utf8),
      },
      authConfig
    );

    console.log(
      "backendApiResponse for Getting Video Summary: ",
      backendResponse
    );

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
      summary:
        backendResponse.data.summary || backendResponse.data.data?.summary,
    };
  } catch (err) {
    console.log("Err in GetVideoSummaryApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetVideoSummaryApi };
