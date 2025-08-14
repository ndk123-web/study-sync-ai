import axios from "axios";

const GetSummaryOfCurrentCourse = async ({ courseId }) => {
  try {
    const backendResponse = await axios.get(
      `http://localhost:8000/api/v1/summaries/get-summary`,
      {
        params: { courseId },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in SignUp Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetSummaryOfCurrentCourse };
