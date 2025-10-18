import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const SaveCourseNotesApi = async ({ courseId , notes , type  }) => {
  try {
    const backendResponse = await axios.post(
      `${AUTH_SERVICE_URL}/api/v1/notes/save-notes`,
      {
        type: type,
        courseId: courseId,
        notes: notes
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for GetCurrentCourseNotesApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("Err in Getting Current Notes Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { SaveCourseNotesApi };

    