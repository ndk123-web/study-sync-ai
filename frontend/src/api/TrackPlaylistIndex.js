import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";
import { useUserStore } from "../store/slices/useUserStore.js";

const TrackPlaylistIndexApi = async (courseId) => {
  const token = useUserStore().getState()._acccessToken;
  try {
    const backendResponse = await axios.post(
      `${AUTH_SERVICE_URL}/api/v1/courses/track-playlist-index`,
      {
        courseId: courseId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("backendApiResponse in TrackPlaylistIndexController: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
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

export { TrackPlaylistIndexApi };
