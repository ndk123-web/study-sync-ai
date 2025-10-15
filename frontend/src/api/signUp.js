import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

// ✅ Correct version
const signUpApi = async ({ username, token }) => {
  try {
    const backendResponse = await axios.post(
      `${BaseUrl}/api/v1/user/create-user`,
      { username }, // only send username in body
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ include Firebase token
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

export { signUpApi };
