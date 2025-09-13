import axios from "axios";

const GetPDFSummaryApi = async ({ pdfId }) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:8000/api/v1/pdf/get-pdf-summary",
      {
        pdfId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for GetPDFSummaryApi: ", backendResponse);

    return {
      status: backendResponse.status,
      data: backendResponse.data.data, // Return the full data object
    };
  } catch (err) {
    console.log("Err in Getting PDF Summary Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetPDFSummaryApi };
