import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const GetPerformanceApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${BaseUrl}/api/v1/dashboard/get-performance-data/`,
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

export { GetPerformanceApi };
