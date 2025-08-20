import wrapper from "../utils/Wrapper.js";
import Enrollment from "../models/enrollments.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import Course from "../models/courses.models.js";

const GetTrendAnalysisYearController = wrapper(async (req, res) => {
  const userData = req.user;

  const userInstance = await User.findOne({ uid: userData.uid });
  if (!userInstance){
    throw new ApiError("User not found", 404);
  }

  let userFirstTimeYear = userInstance.createdAt.getFullYear();
  console.log("User's first time year:", userFirstTimeYear);

  let currentYear = new Date().getFullYear();
  console.log("Current year:", currentYear);

  let availableYears = [];
  for (let year = userFirstTimeYear; year <= currentYear; year++){
    availableYears.push(year);
  }

  console.log("Available years for trend analysis:", availableYears);

  // if length is 0 or current array and availableYears are different means new year came 
  if (userInstance.availableYears.length === 0 || userInstance.availableYears.toString().length < availableYears.toString().length) {
      userInstance.availableYears = availableYears;
      await userInstance.save();
  }else{
    availableYears = userInstance.availableYears;
  }

  return res.status(200).json(new ApiResponse(200,{ availableYears } , "Successfully retrieved available years for trend analysis"))

});

export { GetTrendAnalysisYearController }
