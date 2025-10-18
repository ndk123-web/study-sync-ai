import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const ChangeCourseProgressApi = async (courseId, currentIndex) => {
  try {
    const backendResponse = await axios.post(
      `${AUTH_SERVICE_URL}/api/v1/courses/change-course-progress`,
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

    console.log("Change Course backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse.status,
      progress: backendResponse.data.data.progress || 0,
      currentIndex: backendResponse.data.data.currentIndex || 0,
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
