import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const SendPdfChatApi = async ({ pdfId , question }) => {
  try {
      const authConfig = await getAuthConfig();

      const backendResponse = await axios.post(
        `${AI_SERVICE_URL}/api/v1/pdf/rag-chat`,
        {
          pdfId,
          question
        },
        authConfig
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

    