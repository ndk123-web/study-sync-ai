import axios from "axios";

const GetCurrentCourseProgressApi = async (courseId) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:5000/api/v1/courses/get-current-course-progress",
      {
        courseId: courseId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
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

export { GetCurrentCourseProgressApi };

    