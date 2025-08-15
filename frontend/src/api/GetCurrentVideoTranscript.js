import axios from "axios";

const GetCurrentVideoTranscriptApi = async ({ currentVideoId }) => {
  try {
    const backendResponse = await axios.post(
      `http://localhost:8000/api/v1/transcripts/get-transcript`,
      {
        videoId: currentVideoId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for transcript: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data,
    };
  } catch (err) {
    console.log("Err in GetCurrentVideoTranscript Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetCurrentVideoTranscriptApi };
