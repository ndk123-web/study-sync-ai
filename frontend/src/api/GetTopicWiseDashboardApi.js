import axios from "axios";

const GetTopicsWiseProgressApi = async () => {
  try {
    const backendResponse = await axios.get(
      `http://localhost:5000/api/v1/dashboard/get-topics-wise-progress/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
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
