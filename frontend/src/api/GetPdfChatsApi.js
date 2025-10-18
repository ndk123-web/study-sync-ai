import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";

const GetPdfChats = async ({ pdfId }) => {
  try {
    console.log("📄 Fetching PDF metadata for ID:", pdfId);

    const backendResponse = await axios.get(
      `${AI_SERVICE_URL}/api/v1/pdf/get-pdf-chats`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
            pdfId: pdfId,
        },
      }
    );

    console.log("📄 PDF GetPdfChats Response:", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("❌ Error in GetPdfChats:", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetPdfChats };
