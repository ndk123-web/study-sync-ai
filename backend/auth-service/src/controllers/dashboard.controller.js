import wrapper from "../utils/Wrapper.js";
import Enrollment from "../models/enrollments.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import Course from "../models/courses.models.js";
// import { wrap } from "module";

const GetTrendAnalysisYearController = wrapper(async (req, res) => {
  const userData = req.user;

  const userInstance = await User.findOne({ uid: userData.uid });
  if (!userInstance) {
    throw new ApiError("User not found", 404);
  }

  let userFirstTimeYear = userInstance.createdAt.getFullYear();
  console.log("User's first time year:", userFirstTimeYear);

  let currentYear = new Date().getFullYear();
  console.log("Current year:", currentYear);

  let availableYears = [];
  for (let year = userFirstTimeYear; year <= currentYear; year++) {
    availableYears.push(year);
  }

  console.log("Available years for trend analysis:", availableYears);

  // if length is 0 or current array and availableYears are different means new year came
  if (
    userInstance.availableYears.length === 0 ||
    userInstance.availableYears.toString().length <
      availableYears.toString().length
  ) {
    userInstance.availableYears = availableYears;
    await userInstance.save();
  } else {
    availableYears = userInstance.availableYears;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { availableYears },
        "Successfully retrieved available years for trend analysis"
      )
    );
});

const GetTrendAnalysisController = wrapper(async (req, res) => {
  const userData = req.user;
  const requestedYear = req.query.year;

  console.log("Requested Year: ", requestedYear);

  if (!requestedYear) {
    throw new ApiError(400, "Year is required");
  }

  const userInstance = await User.findOne({ uid: userData.uid });
  if (!userInstance) {
    throw new ApiError(400, "User Not Found");
  }

  const trendData = await Enrollment.aggregate([
    { $match: { userId: userInstance._id } },
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        type: 1,
      },
    },
    {
      $match: {
        year: parseInt(requestedYear),
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
          type: "$type",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Prepare base structure (Jan-Dec with 0 values)
  const months = [
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
  let learningTrendData = months.map((m) => ({
    month: m,
    courses: 0,
    videos: 0,
    pdfs: 0,
    quizzes: 0,
  }));

  // Map DB results to this structure
  trendData.forEach((item) => {
    const monthIndex = item._id.month - 1; // because $month returns 1-12
    const type = item._id.type;

    if (type === "course") {
      learningTrendData[monthIndex].courses = item.count;
    } else if (type === "video") {
      learningTrendData[monthIndex].videos = item.count;
    } else if (type === "pdf") {
      learningTrendData[monthIndex].pdfs = item.count;
    } else if (type === "quiz") {
      learningTrendData[monthIndex].quizzes = item.count;
    }
  });

  console.log("Learning trend data:", learningTrendData);

  // output will be like this
  /*
  const learningTrendData = [
    { month: 'Jan', courses: 2, videos: 8, pdfs: 3, quizzes: 0 },
    { month: 'Feb', courses: 1, videos: 10, pdfs: 4, quizzes: 0 },
    { month: 'Mar', courses: 2, videos: 12, pdfs: 5, quizzes: 0 },
    { month: 'Apr', courses: 3, videos: 9, pdfs: 4, quizzes: 0 },
    { month: 'May', courses: 1, videos: 11, pdfs: 6, quizzes: 0 },
    { month: 'Jun', courses: 2, videos: 13, pdfs: 5, quizzes: 0 },
    { month: 'Jul', courses: 3, videos: 14, pdfs: 6, quizzes: 0 },
    { month: 'Aug', courses: 2, videos: 12, pdfs: 5, quizzes: 0 },
  ];
  */

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { analyticsData: learningTrendData },
        "Trend data fetched successfully"
      )
    );
});

export { GetTrendAnalysisYearController, GetTrendAnalysisController };
