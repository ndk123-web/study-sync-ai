import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const courseSchema = mongoose.Schema(
    {
        topicName: {
            type: String,
            required: true
        },
        courseId: {
            type: String 
        },
        description: {
            type: String,
            required: true
        },
        videoLinks: {
            type: [String],
            required: false
        },
        estimatedHours: {
            type: Number,
            required: true
        },
        availableLanguages: {
            type: [String],
            required: true
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Course = mongoose.model('Course',courseSchema);
export default Course;