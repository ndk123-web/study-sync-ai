import axios from "axios";

const GetPdfMetaDataApi = async ({ pdfId }) => {
  try {
    // Create FormData to properly send file
    const formData = new FormData();
    formData.append('Pdf Id', pdfId);

    const backendResponse = await axios.get(
      "http://localhost:8000/api/v1/pdf/get-pdf-metadata",
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

    console.log("backendApiResponse for GetPdfMetaDataApi: ", backendResponse);

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

export { GetPdfMetaDataApi };
