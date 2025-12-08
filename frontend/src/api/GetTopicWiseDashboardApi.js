import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";
import { useUserStore } from "../store/slices/useUserStore.js";

const GetTopicsWiseProgressApi = async () => {
  const token = useUserStore().getState()._acccessToken;
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/dashboard/get-topics-wise-progress/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "backendApiResponse for Getting Summary of Current Course: ",
      backendResponse
    );

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in GetTopicsWiseProgressApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetTopicsWiseProgressApi };
