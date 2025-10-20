import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const GetRecommendedCoursesApi = async () => {
  try {
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.get(
      `${AI_SERVICE_URL}/api/v1/recommend/recommend-courses`,
      authConfig
    );

    console.log("Recommendation API Response: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
      message: backendResponse.data.message,
      meta: {
        predicted_categories: backendResponse.data.data?.predicted_categories || [],
        total_enrollments: backendResponse.data.data?.total_enrollments || 0,
        model_type: backendResponse.data.data?.model_type || "unknown",
        reason: backendResponse.data.data?.reason || ""
      }
    };
  } catch (err) {
    console.log("Error in Getting Recommended Courses API: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.response?.data?.message || err.message,
      error: err.message
    };
  }
};

export { GetRecommendedCoursesApi };