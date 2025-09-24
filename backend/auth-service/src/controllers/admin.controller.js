import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import wrapper from "../utils/Wrapper.js";

import User from "../models/user.models.js";
import Enrollment from "../models/enrollments.models.js";
import Course from "../models/courses.models.js";

const GetAdminStatsController = wrapper(async (req, res) => {
  const totalUsers = await User.find({}).countDocuments();
  const totalCourses = await Course.find({}).countDocuments();
  const totalEnrollments = await Enrollment.find({}).countDocuments(); // with type course, video, pdf
  const totalEnrollmentsCourse = await Enrollment.find({    // only with type course
    type: "course",
  }).countDocuments();

  const totalCourseCompletions = await Enrollment.find({
    completed: true,
  }).countDocuments();

  const completionRate = totalEnrollmentsCourse
    ? ((totalCourseCompletions / totalEnrollmentsCourse) * 100).toFixed(2)
    : 0;

  console.log("totalUsers", totalUsers);
  console.log("totalCourses", totalCourses);
  console.log("totalEnrollments", totalEnrollments);
  console.log("totalCourseCompletions", totalCourseCompletions);
  console.log("completionRate", completionRate);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCourseCompletions,
        completionRate,
      },
      "Admin stats fetched successfully"
    )
  );
});

const GetAdminSpecificController = wrapper(async (req, res) => {
  const userSpecificCourses = await Enrollment.find({
    type: "course",
  }).countDocuments();
  const userSpecificVideos = await Enrollment.find({
    type: "video",
  }).countDocuments();
  const userSpecificPdfs = await Enrollment.find({
    type: "pdf",
  }).countDocuments();

  console.log("userSpecificCourses", userSpecificCourses);
  console.log("userSpecificVideos", userSpecificVideos);
  console.log("userSpecificPdfs", userSpecificPdfs);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userSpecificCourses, userSpecificVideos, userSpecificPdfs },
        "User specific stats fetched successfully"
      )
    );
});

export { GetAdminStatsController, GetAdminSpecificController };
