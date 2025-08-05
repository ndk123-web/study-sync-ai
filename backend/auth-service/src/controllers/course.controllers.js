import Course from "../models/courses.models.js";
import Enrollment from "../models/enrollments.models.js";
import User from "../models/user.models.js";
import wrapper from "../utils/Wrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import coursesRouter from "../routes/course.routes.js";

const GetAllCoursesController = wrapper(async (req, res) => {
  const courses = await Course.find();
  return res.status(200).json(new ApiResponse(200, courses));
});

const GetCurrentPlayListController = wrapper(async (req, res) => {
  const { courseId } = req.params;
  console.log("Course ID:", courseId);

  const playlist = await Course.find({ courseId: courseId });
  console.log("Playlist:", playlist);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res.status(200).json(new ApiResponse(200, playlist));
});

const EnrollCurrentCourseController = wrapper(async (req, res) => {
  const { courseId } = req.body;
  const currentUser = req.user;
  console.log("CourseId: ", courseId);

  const getCurrentUser = await User.findOne({ uid: currentUser.uid });
  if (!getCurrentUser) {
    throw new ApiError("404", "User Not Found in DB");
  }
  console.log("User for enrollment found");
  
  const getCurrentCourse = await Course.findOne({ courseId: courseId });
  if (!getCurrentCourse) {
      throw new ApiError("404", "Course Not Found in DB");
    }
    console.log("Course for enrollment found");
    // console.log("Current Course: ", getCurrentCourse);
    
    const isAlreadyEnrolled = await Enrollment.findOne({
        userId: getCurrentUser._id,
        courseId: getCurrentCourse._id,
    });
    if (isAlreadyEnrolled) {
        console.log("Enrolled Already so Enrolling");
        throw new ApiError("400", "User is already enrolled in this course");
    }
    console.log("Not Enrolled so Enrolling");

  const enrollment = new Enrollment({
    userId: getCurrentUser._id,
    courseId: getCurrentCourse._id,
    progress: "0",
    completed: false,
  });
            
  const userEnrollment = await enrollment.save();
  if (!userEnrollment){
    console.log("Enrollment Creation Failed");
    throw new ApiError("500", "Enrollment Creation Failed");
  }

  console.log("Enrollment Created");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `Successfully enrolled in course ${getCurrentCourse.title}`
      )
    );
});

const ChangeCourseProgressController = wrapper(async (req, res) => {
  const { courseId, currentIndex } = req.body;
  const currentUser = req.user;

  const getCurrentUser = await User.findOne({ uid: currentUser.uid });
  if (!getCurrentUser) {
    throw new ApiError("404", "User Not Found in DB");
  }

  const getCurrentCourse = await Course.findOne({ courseId: courseId });
  if (!getCurrentCourse) {
    throw new ApiError("404", "Course Not Found in DB");
  }

  const isEnrollment = await Enrollment.findOne({
    userId: getCurrentUser._id,
    courseId: getCurrentCourse._id,
  });
  if (!isEnrollment) {
    throw new ApiError("404", "User is not enrolled in this course");
  }

  const totalVideos = getCurrentCourse.videoLinks.length;
  let lastVideo = false;
  let progressCalculation = 0;
  let actualIndex = isEnrollment.trackCompletedVideosIndex || 0;

  console.log("Actual Index: ",actualIndex + 1);
  console.log("Current Index: ",currentIndex + 2)

  if (actualIndex + 1 > currentIndex + 2){
    return res.status(200).json(new ApiResponse(200, { message : "User already completed this video" }))
  }

  if (actualIndex + 1 < currentIndex + 2) {
    return res.status(200).json(new ApiResponse(200, { message: "U cant go ahead before completing video" }));
  }

  if (currentIndex - 1 === totalVideos) {
    progressCalculation = 100;
    lastVideo = true;
  }

  if (!lastVideo) {
    progressCalculation = Math.min(
      Math.round(((currentIndex + 2) / totalVideos) * 100),
      100
    );
  }
  console.log(
    "Progress Calculation: ",
    progressCalculation,
    currentIndex+2,
    totalVideos
  );

  if (lastVideo || progressCalculation === 100) {
    const updateUserEnrollmentCourseProgress =
      await Enrollment.findOneAndUpdate(
        { userId: getCurrentUser._id, courseId: getCurrentCourse._id },
        { progress: progressCalculation, completed: true , trackCompletedVideosIndex: currentIndex+2},
        { new: true }
      );
    if (!updateUserEnrollmentCourseProgress) {
      throw new ApiError("404", "Enrollment not found");
    }
  }

  const updateUserEnrollmentCourseProgress = await Enrollment.findOneAndUpdate(
    { userId: getCurrentUser._id, courseId: getCurrentCourse._id },
    { progress: progressCalculation, trackCompletedVideosIndex: currentIndex + 2 },
    { new: true }
  );
  if (!updateUserEnrollmentCourseProgress) {
    throw new ApiError("404", "Enrollment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { progress: progressCalculation , currentIndex: currentIndex + 2 }));
});

const GetCurrentCourseProgressController = wrapper(async (req, res) => {
    const currentUser = req.user;
    const { courseId } = req.body;

    const getCurrentCourse = await Course.findOne({ courseId: courseId });
    if (!getCurrentCourse) {
        throw new ApiError("404", "Course Not Found in DB");
    }

    const getCurrentUser = await User.findOne({ uid: currentUser.uid });
    if (!getCurrentUser) {
        console.log("User Not Found");
        throw new ApiError("404", "User Not Found in DB");
    }
    
    const isEnrollment = await Enrollment.findOne({
        userId: getCurrentUser._id,
        courseId: getCurrentCourse._id,
    });
    
    if (!isEnrollment) {
        console.log("User Not Found");
        throw new ApiError("404", "User is not enrolled in this course");
    }
    
    // Calculate currentIndex based on progress
    const totalVideos = getCurrentCourse.videoLinks.length;
    const progressPercent = parseInt(isEnrollment.progress) || 0;
    
    // Calculate current video index based on progress
    let currentIndex = 0;
    if (progressPercent > 0) {
        currentIndex = Math.max(0, Math.floor((progressPercent / 100) * totalVideos) - 1);
    }
    
    console.log("Success From Here - Progress:", isEnrollment.progress, "CurrentIndex:", currentIndex);
    return res
        .status(200)
        .json(new ApiResponse(200, { 
            progress: isEnrollment.progress, 
            currentIndex: currentIndex,
            totalVideos: totalVideos 
        }));
});

const TrackPlaylistIndexController = wrapper(async (req, res) => {
  const { courseId } = req.body; // Fix: properly destructure courseId
  const currentUser = req.user; 

  console.log("TrackPlaylistIndex - CourseId:", courseId);
  console.log("TrackPlaylistIndex - User:", currentUser.uid);

  // get the courseId 
  const getCurrentCourse = await Course.findOne({ courseId: courseId });
  if (!getCurrentCourse){
    throw new ApiError('404', "Course Not Found");
  }

  // get the sign in user
  const getCurrentUser = await User.findOne({ uid: currentUser.uid });
  if (!getCurrentUser){
    throw new ApiError("404", "User Not Found");
  } 

  // if both user and course found
  const isEnrollment = await Enrollment.findOne({ userId: getCurrentUser._id, courseId: getCurrentCourse._id });
  if (!isEnrollment){
    throw new ApiError("404", `User Not Enrolled in courseId ${courseId} Course`);
  }

  console.log("TrackPlaylistIndex - Success, returning progress:", isEnrollment.progress);

  return res.status(200).json(new ApiResponse(200, { 
    trackCompletedVideosIndex: isEnrollment.trackCompletedVideosIndex
  }));

})

export {
  GetAllCoursesController,
  GetCurrentPlayListController,
  EnrollCurrentCourseController,
  ChangeCourseProgressController,
  GetCurrentCourseProgressController,
  TrackPlaylistIndexController
};
