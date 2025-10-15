import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const GetTrendAnalysisYearApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${BaseUrl}/api/v1/dashboard/get-trend-analysis-year`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for Getting Summary of Current Course: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
      summary: backendResponse.data.summary || backendResponse.data.data?.summary,
    };
  } catch (err) {
    console.log("Err in GetTrendAnalysisApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetTrendAnalysisYearApi };
