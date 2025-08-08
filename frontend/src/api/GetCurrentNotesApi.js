import axios from "axios";

const GetCurrentNotesApi = async ({ courseId }) => {
  try {
    console.log("🚀 Calling notes API with courseId:", courseId);
    
    const backendResponse = await axios.get(
      `http://localhost:5000/api/v1/notes/get-notes/${courseId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "backendApiResponse for GetCurrentCourseNotesApi: ",
      backendResponse
    );

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

export { GetCurrentNotesApi };
