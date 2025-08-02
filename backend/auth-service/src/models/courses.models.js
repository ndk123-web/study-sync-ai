import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true }, // instead of topicName
    courseId: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: String, default: "0" },
    thumbnail: { type: String },
    duration: { type: Number, required: true }, // instead of estimatedHours
    category: { type: String },
    rating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    lessons: { type: Number, default: 0 },
    lastUpdated: { type: String },
    availableLanguages: { type: [String], required: true },
    likes: { type: Number, default: 0 },
    videoLinks: {
      type: [
        {
          title: { type: String, required: true },
          url: { type: String, required: true },
          duration: { type: Number, required: true },
          description: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
