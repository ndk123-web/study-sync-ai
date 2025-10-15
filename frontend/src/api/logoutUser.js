import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const logoutUserApi = async () => {
  try {
    const backendResponse = await axios.post(
      `${BaseUrl}/api/v1/user/logout-user`,
      {},
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
    console.log("Err in SignUp Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { logoutUserApi };
