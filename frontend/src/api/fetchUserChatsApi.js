import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const FetchUserChatsApi = async ({ courseId , role  }) => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.get(
      `${AI_SERVICE_URL}/api/v1/chat/fetch-chats`,
      {
        ...authConfig,
        params: { courseId , role },
      }
    );

    console.log("backendApiResponse for FetchUserChatsApi: ", backendResponse);

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

export { FetchUserChatsApi };

    