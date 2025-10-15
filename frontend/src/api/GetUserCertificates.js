import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const GetUserCertificatesApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${BaseUrl}/api/v1/certificate/get-user-certificates/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse GetUserActivitiesApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data,
    };
  } catch (err) {
    console.log("Err in GetUserActivitiesApi: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetUserCertificatesApi };
