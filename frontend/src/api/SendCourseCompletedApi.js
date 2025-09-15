import axios from "axios";

const SendCourseQuizCompletedApi = async ({ score , quizId }) => {
  try {
    const backendResponse = await axios.post(
      "http://localhost:8000/api/v1/quiz/complete-quiz",
      {
        score: score,
        quizId: quizId
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("backendApiResponse for SendCourseQuizCompletedApi: ", backendResponse);

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

export { SendCourseQuizCompletedApi };
