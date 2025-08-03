import axios from "axios";

const ChangeCourseProgressApi = async (courseId, currentIndex) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:5000/api/v1/courses/change-course-progress",
      {
        courseId: courseId,
        currentIndex: currentIndex,
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
      data: backendResponse.data.data.progress,
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

export { ChangeCourseProgressApi };
