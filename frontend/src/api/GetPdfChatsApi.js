import axios from "axios";
import { AI_SERVICE_URL } from "./BaseApiUrl.js";
import { getAuthConfig } from "./authUtils.js";

const GetPdfChats = async ({ pdfId }) => {
  try {
    console.log("📄 Fetching PDF metadata for ID:", pdfId);

    const authConfig = await getAuthConfig();

    const backendResponse = await axios.get(
      `${AI_SERVICE_URL}/api/v1/pdf/get-pdf-chats`,
      {
        ...authConfig,
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
