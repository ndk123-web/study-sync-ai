import axios from "axios";

const EnrollmentVideoApi = async (encryptedVideoUrl) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:5000/api/v1/video/enroll-video",
      {
        videoUrl: encryptedVideoUrl,
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

export { EnrollmentVideoApi };
