import mongoose from "mongoose";
import ApiError from "../utils/ApiError";

const progressSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        progress: {
            type: Number,
            default: 0
        },
        videoLinks: {
            type: [String],
            required: false
        },
        hoursSpent: {
            type: Number
        },
        progressPercent: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;