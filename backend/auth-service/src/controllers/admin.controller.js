import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import wrapper from "../utils/Wrapper.js";

import User from "../models/user.models.js";
import Enrollment from "../models/enrollments.models.js";
import Course from "../models/courses.models.js";
import Activity from "../models/activity.models.js";

const GetAdminStatsController = wrapper(async (req, res) => {
  const totalUsers = await User.find({}).countDocuments();
  const totalCourses = await Course.find({}).countDocuments();
  const totalEnrollments = await Enrollment.find({}).countDocuments(); // with type course, video, pdf
  const totalEnrollmentsCourse = await Enrollment.find({
    // only with type course
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

//         { month: "Jan", newUsers: 89, enrollments: 234, completions: 67 },
//         { month: "Feb", newUsers: 124, enrollments: 289, completions: 89 },
//         { month: "Mar", newUsers: 156, enrollments: 367, completions: 123 },
//         { month: "Apr", newUsers: 198, enrollments: 445, completions: 156 },
//         { month: "May", newUsers: 234, enrollments: 512, completions: 198 },
//         { month: "Jun", newUsers: 267, enrollments: 589, completions: 234 },
//         { month: "Jul", newUsers: 289, enrollments: 645, completions: 267 },
//         { month: "Aug", newUsers: 312, enrollments: 712, completions: 298 },
//         { month: "Sep", newUsers: 345, enrollments: 789, completions: 334 },
//         { month: "Oct", newUsers: 378, enrollments: 856, completions: 367 },
//         { month: "Nov", newUsers: 412, enrollments: 923, completions: 398 },
//         { month: "Dec", newUsers: 445, enrollments: 998, completions: 429 },
const GetAdminGraphController = wrapper(async (req, res) => {
  const year = req.query.year;
  if (!year) {
    throw new ApiError(400, "Year is required");
  }

  const newUsersData = await User.find({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    },
  });

  const enrollmentsData = await Enrollment.find({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    },
  });

  const completionsData = await Enrollment.find({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    },
    completed: true,
  });

  const graphData = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const monthName = monthNames[i];
    const newUsers = newUsersData.filter((user) => {
      const userMonth = user.createdAt.getMonth() + 1;
      return userMonth === month;
    }).length;
    const enrollments = enrollmentsData.filter((enrollment) => {
      const enrollmentMonth = enrollment.createdAt.getMonth() + 1;
      return enrollmentMonth === month;
    }).length;
    const completions = completionsData.filter((completion) => {
      const completionMonth = completion.createdAt.getMonth() + 1;
      return completionMonth === month;
    }).length;
    graphData.push({ month: monthName, newUsers, enrollments, completions });
  }

  console.log("graphData", graphData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { graphData },
        "Admin graph data fetched successfully"
      )
    );
});

const GetUserActivitiesController = wrapper(async (req, res) => {
  const activities = await Activity.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("userId", "username email");
  console.log("activities", activities);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { activities },
        "User activities fetched successfully"
      )
    );
});

export {
  GetAdminStatsController,
  GetAdminSpecificController,
  GetAdminGraphController,
  GetUserActivitiesController
};
