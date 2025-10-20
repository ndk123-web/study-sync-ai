import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const SendCourseQuizCompletedApi = async ({ score, quizId }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${AI_SERVICE_URL}/api/v1/quiz/complete-quiz`,
      {
        score: score,
        quizId: quizId,
      },
      authConfig
    );

    console.log(
      "backendApiResponse for SendCourseQuizCompletedApi: ",
      backendResponse
    );

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
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

export { SendCourseQuizCompletedApi };
