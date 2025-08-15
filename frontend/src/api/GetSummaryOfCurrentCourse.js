import axios from "axios";

const GetSummaryOfCurrentCourse = async ({ courseId, videoId }) => {
  try {
    const backendResponse = await axios.post(
      `http://localhost:8000/api/v1/summaries/get-summary`,
      {
        courseId,
        videoId
      },
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
    console.log("Err in GetSummaryOfCurrentCourse Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetSummaryOfCurrentCourse };
