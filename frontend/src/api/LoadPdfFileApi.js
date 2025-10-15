import axios from "axios";
import BaseUrl from "./BaseApiUrl.js";

const LoadPdfFileApi = async ({ pdfFile }) => {
  try {
    // Create FormData to properly send file
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    console.log("📄 Sending PDF file:", pdfFile.name, "Size:", pdfFile.size);

      const backendResponse = await axios.post(
        `${BaseUrl}/api/v1/pdf/load-pdf`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    console.log("backendApiResponse for LoadPdfFileApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("Err in Getting PDF Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { LoadPdfFileApi };
