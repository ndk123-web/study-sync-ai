import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const signInApi = async ({ token }) => {
  try {
    const backendResponse = await axios.post(
      `${AUTH_SERVICE_URL}/api/v1/user/login-user`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
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
    console.log("Err in SignUp Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { signInApi };
