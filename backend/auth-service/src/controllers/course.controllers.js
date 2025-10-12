import Course from "../models/courses.models.js";
import Enrollment from "../models/enrollments.models.js";
import User from "../models/user.models.js";
import wrapper from "../utils/Wrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import coursesRouter from "../routes/course.routes.js";
import Activity from "../models/activity.models.js";
import kafka from '../../kafka/client.js'

const GetAllCoursesController = wrapper(async (req, res) => {
  const courses = await Course.find();
  const user = req.user;
  console.log("User:", user);
  return res.status(200).json(new ApiResponse(200, courses));
});

const GetCurrentPlayListController = wrapper(async (req, res) => {
  const { courseId } = req.params;
  console.log("Course ID:", courseId);

  const playlist = await Course.find({ courseId: courseId });
  console.log("Playlist:", playlist);

  if (!playlist || playlist.length === 0) {
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
    uid: currentUser.uid,
    progress: "0",
    completed: false,
    type: "course",
  });

  const userEnrollment = await enrollment.save();
  if (!userEnrollment) {
    console.log("Enrollment Creation Failed");
    throw new ApiError("500", "Enrollment Creation Failed");
  }

  // New Activity for Enrollment
  const newActivity = new Activity({
    userId: getCurrentUser._id,
    type: "enrollment",
    description: `Enrolled in course: ${getCurrentCourse.title}`,
    metadata: {
      courseId: getCurrentCourse.courseId,
      courseTitle: getCurrentCourse.title,
    },
  });

  await newActivity.save();

  // for enroll add +3 skill points
  getCurrentUser.skillPoints = (getCurrentUser.skillPoints || 0) + 3;
  await getCurrentUser.save();

  console.log("Enrollment Created");

  // Kafka producer produce the event to the topic
  const producer = kafka.producer();

  await producer.connect();
  console.log("Producer connected to Kafka");

  const event = {
    event: "student_enrolled",
    userId: getCurrentUser.uid,
    courseId: getCurrentCourse.courseId,
    message: `You have successfully enrolled in the course: ${getCurrentCourse.title}`
  };

  await producer.send({
    topic: "enrolled-events", // topic name
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("✅ Event sent:", event);

  await producer.disconnect();

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

  console.log("Actual Index: ", actualIndex + 1);
  console.log("Current Index: ", currentIndex + 2);

  if (actualIndex + 1 > currentIndex + 2) {
    return res.status(200).json(
      new ApiResponse(200, {
        message: "User already completed this video",
        progress: isEnrollment.progress,
      })
    );
  }

  if (actualIndex + 1 < currentIndex + 2) {
    return res.status(200).json(
      new ApiResponse(200, {
        message: "U cant go ahead before completing video",
        progress: isEnrollment.progress,
      })
    );
  }

  if (currentIndex - 1 === totalVideos) {
    progressCalculation = 100;
    lastVideo = true;
    console.log("Last Video Completed");
    console.log("Adding Skill Points for Course Completion +10");

    if (isEnrollment.addedCompletedPoints) {
      // add +10 skill points on course completion only once
      getCurrentUser.skillPoints = (getCurrentUser.skillPoints || 0) + 10;
      await getCurrentUser.save();
      console.log("Skill Points Added");
      console.log("New Skill Points: ", getCurrentUser.skillPoints);
    }
    isEnrollment.addedCompletedPoints = true;
    await isEnrollment.save();
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
    currentIndex + 2,
    totalVideos
  );

  if (lastVideo || progressCalculation === 100) {
    const updateUserEnrollmentCourseProgress =
      await Enrollment.findOneAndUpdate(
        { userId: getCurrentUser._id, courseId: getCurrentCourse._id },
        {
          progress: progressCalculation,
          completed: true,
          trackCompletedVideosIndex: currentIndex + 2,
        },
        { new: true }
      );

      if (!updateUserEnrollmentCourseProgress) {
        throw new ApiError("404", "Enrollment not found");
      }
      
      // if lastVideo and it means user completed the course now we need to generate certificate 

  }

  const updateUserEnrollmentCourseProgress = await Enrollment.findOneAndUpdate(
    { userId: getCurrentUser._id, courseId: getCurrentCourse._id },
    {
      progress: progressCalculation,
      trackCompletedVideosIndex: currentIndex + 2,
    },
    { new: true }
  );
  if (!updateUserEnrollmentCourseProgress) {
    throw new ApiError("404", "Enrollment not found");
  }

  const isExistingActivity = await Activity.findOne({
    userId: getCurrentUser._id,
    type: "course-progress",
    "metadata.courseId": getCurrentCourse.courseId,
  });

  if (isExistingActivity) {
    console.log("Existing Activity Found, updating it");
    isExistingActivity.description = `Made progress in course: ${getCurrentCourse.title} - ${progressCalculation}% completed`;
    isExistingActivity.metadata.progress = progressCalculation;
    isExistingActivity.metadata.videoIndex = currentIndex + 2;

    // important to mark modified for nested objects
    isExistingActivity.markModified("metadata");

    await isExistingActivity.save();
  } else {
    console.log("No Existing Activity Found, creating new one");
    // New Activity for Course Progress
    const newActivity = new Activity({
      userId: getCurrentUser._id,
      type: "course-progress",
      description: `Made progress in course: ${getCurrentCourse.title} - ${progressCalculation}% completed`,
      metadata: {
        courseId: getCurrentCourse.courseId,
        progress: progressCalculation,
        courseTitle: getCurrentCourse.title,
        videoIndex: currentIndex + 2,
      },
    });
    await newActivity.save();
  }

  return res.status(200).json(
    new ApiResponse(200, {
      progress: progressCalculation,
      currentIndex: currentIndex + 2,
    })
  );
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
    currentIndex = Math.max(
      0,
      Math.floor((progressPercent / 100) * totalVideos) - 1
    );
  }

  console.log(
    "Success From Here - Progress:",
    isEnrollment.progress,
    "CurrentIndex:",
    currentIndex
  );
  return res.status(200).json(
    new ApiResponse(200, {
      progress: isEnrollment.progress,
      currentIndex: currentIndex,
      totalVideos: totalVideos,
    })
  );
});

const TrackPlaylistIndexController = wrapper(async (req, res) => {
  const { courseId } = req.body; // Fix: properly destructure courseId
  const currentUser = req.user;

  console.log("TrackPlaylistIndex - CourseId:", courseId);
  console.log("TrackPlaylistIndex - User:", currentUser.uid);

  // get the courseId
  const getCurrentCourse = await Course.findOne({ courseId: courseId });
  if (!getCurrentCourse) {
    throw new ApiError("404", "Course Not Found");
  }

  // get the sign in user
  const getCurrentUser = await User.findOne({ uid: currentUser.uid });
  if (!getCurrentUser) {
    throw new ApiError("404", "User Not Found");
  }

  // if both user and course found
  const isEnrollment = await Enrollment.findOne({
    userId: getCurrentUser._id,
    courseId: getCurrentCourse._id,
  });
  if (!isEnrollment) {
    throw new ApiError(
      "404",
      `User Not Enrolled in courseId ${courseId} Course`
    );
  }

  console.log(
    "TrackPlaylistIndex - Success, returning progress:",
    isEnrollment.progress
  );

  if (isEnrollment.progress === "100") {
    // add +10 skill points on course completion
    getCurrentUser.skillPoints = (getCurrentUser.skillPoints || 0) + 10;
    await getCurrentUser.save();
    console.log("Skill Points Added");
    console.log("New Skill Points: ", getCurrentUser.skillPoints);
  }

  return res.status(200).json(
    new ApiResponse(200, {
      trackCompletedVideosIndex: isEnrollment.trackCompletedVideosIndex,
    })
  );
});

const GetEnrollCoursesController = wrapper(async (req, res) => {
  const currentUser = req.user;
  const getCurrentUser = await User.findOne({ uid: currentUser.uid });

  console.log("Current User in GetEnrollCoursesController: ", currentUser);

  if (!getCurrentUser) {
    throw new ApiError(
      400,
      "User Not Found in DB to get Enroll Course Details"
    );
  }

  const getEnrollUserCourses = await Enrollment.find({
    uid: currentUser.uid,
    // type: "course"
  }).populate({
    path: "courseId",
    select:
      "courseId title description instructor price thumbnail duration category rating featured lessons createdAt availableLanguages likes",
  });

  console.log("Enrolled User Courses: ", getEnrollUserCourses);

  if (getEnrollUserCourses.length === 0) {
    console.log("Enrolled didn't find");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "User hasn't enrolled in any course"));
  }

  console.log("Enrolled User Courses Found: ", getEnrollUserCourses);

  // Return a single array as the `data` payload for consistency
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getEnrollUserCourses,
        "Successfully fetched user enrolled courses"
      )
    );

  // return res.status(200).json(new ApiResponse(200,{ data: "Testing GetEnrollCoursesController" } , "Successfully fetched user enrolled courses"));
});

export {
  GetAllCoursesController,
  GetCurrentPlayListController,
  EnrollCurrentCourseController,
  ChangeCourseProgressController,
  GetCurrentCourseProgressController,
  TrackPlaylistIndexController,
  GetEnrollCoursesController,
};
