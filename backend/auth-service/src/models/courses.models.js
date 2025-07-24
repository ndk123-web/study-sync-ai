import mongoose from "mongoose";
import ApiError from "../utils/ApiError";

const courseSchema = mongoose.Schema(
    {
        topicName: {
            type: String,
            required: true
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
        }
    },
    {
        timestamps: true
    }
)

const Course = mongoose.model('Course',courseSchema);
export default Course;