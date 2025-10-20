import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const SendAiChatApi = async ({ type , courseId , prompt }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.post(
      `${AI_SERVICE_URL}/api/v1/chat/send-chat`,
      {
        role: type,
        courseId: courseId,
        prompt: prompt
      },
      authConfig
    );

    console.log("backendApiResponse for SaveCourseNotesApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("Err in Getting Current Notes Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { SendAiChatApi };

    