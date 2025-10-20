import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const SendCourseQuizApi = async ({ level, courseId }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${AI_SERVICE_URL}/api/v1/quiz/generate-quiz`,
      {
        level,
        courseId,
      },
      authConfig
    );

    console.log("backendApiResponse for SendPdfChatApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data, // Return the full response data object
    };
  } catch (err) {
    console.log("Err in Getting PDF Chat Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { SendCourseQuizApi };
