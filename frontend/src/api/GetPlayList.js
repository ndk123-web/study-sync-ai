import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const GetPlayListApi = async ({ courseId, token }) => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/courses/${courseId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("backendApiResponse: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in SignUp Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetPlayListApi };
