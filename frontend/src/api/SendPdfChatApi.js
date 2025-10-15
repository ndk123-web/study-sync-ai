import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const SendPdfChatApi = async ({ pdfId , question }) => {
  try {
      const backendResponse = await axios.post(
        `${BaseUrl}/api/v1/pdf/rag-chat`,
        {
          pdfId,
          question
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    console.log("backendApiResponse for SendPdfChatApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("Err in Getting PDF Chat Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { SendPdfChatApi };

    