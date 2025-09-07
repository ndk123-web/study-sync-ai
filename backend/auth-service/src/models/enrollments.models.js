import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const enrollmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["course", "video", "pdf"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    progress: {
      type: String,
      default: "0",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    trackCompletedVideosIndex: {
      type: Number,
      default: 1,
    },
    uid: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: false,
    },
    videoTitle: {
      type: String,
      required: false,
    },
    videoCreator: {
      type: String,
      required: false,
    },
    videoDuration: {
      type: String,
      required: false,
    },
    pdfLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index to prevent duplicate enrollments for same user-course combination
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model("EnrollmentCourse", enrollmentSchema);
export default Enrollment;

/*
    Current course -> video length 
    User ID -> from cookies
    Progress Track using next button of that playlist -> which will be post req for next 

    api will look like
    1. api/v1/courses
    2. api/v1/enroll/:id (user info will get from cookies)
*/
