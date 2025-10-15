import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const GetPdfMetaDataApi = async ({ pdfId }) => {
  try {
    console.log("📄 Fetching PDF metadata for ID:", pdfId);

    const backendResponse = await axios.get(
      `${BaseUrl}/api/v1/pdf/get-pdf-metadata`,
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

    console.log("📄 PDF Metadata Response:", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("❌ Error in GetPdfMetaDataApi:", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetPdfMetaDataApi };
