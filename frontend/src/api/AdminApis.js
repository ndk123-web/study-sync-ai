import axios from "axios";
import { AUTH_SERVICE_URL } from "./BaseApiUrl.js";

const GetAdminStatsControllerApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/admin/get-admin-stats`,
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
      `${AUTH_SERVICE_URL}/api/v1/admin/get-admin-specific`,
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
      userSpecificCourses:
        backendResponse?.data?.data?.userSpecificCourses || 0,
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

const GetAdminGraphApi = async (year = new Date().getFullYear()) => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/admin/get-admin-graph`,
      {
        params: { year },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Graph data backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse?.data?.statusCode,
      graphData: backendResponse?.data?.data?.graphData || [],
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

const GetUserActivitiesApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/admin/get-user-activities`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User Activities backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse?.data?.statusCode,
      activities: backendResponse?.data?.data?.activities || [],
    };
  } catch (err) {
    console.log("Err in Getting User Activities Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

const GetCourseDataApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/admin/get-course-data`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User Activities backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse?.data?.statusCode,
      courseData: backendResponse?.data?.data?.courseData || [],
    };
  } catch (err) {
    console.log("Err in Getting Course Data Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

const GetCategoryWiseDataApi = async () => {
  try {
    const backendResponse = await axios.get(
      `${AUTH_SERVICE_URL}/api/v1/admin/get-category-wise-course-data`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User Activities backendApiResponse: ", backendResponse.data);

    return {
      status: backendResponse?.data?.statusCode,
      categoryWiseData: backendResponse?.data?.data?.categoryWiseData || [],
    };
  } catch (err) {
    console.log("Err in Getting Course Data Api: ", err.message);
    return {
      status: err.response?.status || 500,
      data: err.response?.data || {},
      message: err.message,
    };
  }
};

export {
  GetAdminStatsControllerApi,
  GetAdminSpecificControllerApi,
  GetAdminGraphApi,
  GetUserActivitiesApi,
  GetCourseDataApi,
  GetCategoryWiseDataApi,
};
