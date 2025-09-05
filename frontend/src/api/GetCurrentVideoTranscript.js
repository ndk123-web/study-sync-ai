import axios from "axios";

const extractVideoId = (urlOrId) => {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = urlOrId.match(regex);
  return match ? match[1] : urlOrId;
};

const GetCurrentVideoTranscriptApi = async ({ currentVideoId }) => {
  try {
    // 🟢 Pehle ID extract karo
    const properVideoId = extractVideoId(currentVideoId);

    const backendResponse = await axios.post(
      `http://localhost:8000/api/v1/transcripts/get-transcript`,
      {
        videoId: properVideoId, // ✅ Ab backend ko sirf ID bhej raha hai
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
