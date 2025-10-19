import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const GetEnrolledCourseApi = async () => {
  try {
    const authConfig = await getAuthConfig();
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/courses/get-enrolled-courses`,
      authConfig
    );

    console.log("backendApiResponse: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in GetEnrolledCourseApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetEnrolledCourseApi };
