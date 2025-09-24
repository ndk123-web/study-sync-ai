import axios from "axios";

const GetAdminStatsControllerApi = async () => {
  try {
    const backendResponse = await axios.get(
      "http://localhost:5000/api/v1/admin/get-admin-stats",
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Change Course backendApiResponse: ", backendResponse.data);

    return {
      totalUsers: backendResponse?.data?.data?.totalUsers || 0,
      totalCourses: backendResponse?.data?.data?.totalCourses || 0,
      totalEnrollments: backendResponse?.data?.data?.totalEnrollments || 0,
      totalCompletions:
        backendResponse?.data?.data?.totalCourseCompletions || 0,
      completionRate: backendResponse?.data?.data?.completionRate || 0,
      status: backendResponse?.data?.statusCode,
    };
  } catch (err) {
    console.log("Err in Getting All Courses Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

const GetAdminSpecificControllerApi = async () => {
  try {
    const backendResponse = await axios.get(
      "http://localhost:5000/api/v1/admin/get-admin-specific",
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Change Course backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse?.data?.statusCode,
      userSpecificCourses: backendResponse?.data?.data?.userSpecificCourses || 0,
      userSpecificVideos: backendResponse?.data?.data?.userSpecificVideos || 0,
      userSpecificPdfs: backendResponse?.data?.data?.userSpecificPdfs || 0,
    };
  } catch (err) {
    console.log("Err in Getting All Courses Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export { GetAdminStatsControllerApi, GetAdminSpecificControllerApi };
