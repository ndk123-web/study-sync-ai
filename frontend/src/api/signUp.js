import axios from "axios";

const signUpApi = async ({ token }) => {
  try {

    const backendResponse = await axios.post(
      "http://localhost:5000/api/v1/user/create-user",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("backendApiResponse: ",backendResponse)

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
