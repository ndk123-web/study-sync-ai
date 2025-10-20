import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const GetSummaryOfCurrentCourse = async ({ courseId, videoId }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${AI_SERVICE_URL}/api/v1/summaries/get-summary`,
      {
        courseId,
        videoId
      },
      authConfig
    );

    console.log("backendApiResponse for Getting Summary of Current Course: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
      summary: backendResponse.data.summary || backendResponse.data.data?.summary,
    };
  } catch (err) {
    console.log("Err in GetSummaryOfCurrentCourse Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetSummaryOfCurrentCourse };
