import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const GetQuizPerformanceApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/dashboard/get-quiz-performance/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse GetQuizPerformanceApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in GetQuizPerformanceApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetQuizPerformanceApi };
