import axios from "axios";

const SendAiChatApi = async ({ courseId , prompt }) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:8000/api/v1/chat/send-chat",
      {
        courseId: courseId,
        prompt: prompt
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for SaveCourseNotesApi: ", backendResponse);

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

export { SendAiChatApi };

    