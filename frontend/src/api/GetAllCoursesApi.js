import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const getAllCoursesApi = async () => {
  try {
    
    const authConfig = await getAuthConfig();

    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/courses/`,
      {
        authConfig
      }
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

export { getAllCoursesApi };
