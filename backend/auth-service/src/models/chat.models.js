import mongoose from "mongoose";
import ApiError from '../utils/ApiError.js'

const chatSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: false,
            index: true
        },
        type: {
            type: String,
            enum: ['pdf', 'course', 'video'],
            required: true
        },
        pdfLink: {
            type: String,
            required: false,
            index: true
        },
        videoLink: {
            type: String,
            required: false,
            index: true
        },
        prompt: {
            type: String,
            required: true
        },
        response: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

chatSchema.pre("validate", function (next) {

    if (this.type === 'pdf' && !this.pdfLink) {
        return next(new ApiError(404, "Error: Type is pdf but no pdfLink provided"));
    } else if (this.type === 'video' && !this.videoLink) {
        return next(new ApiError(404, "Error: Type is video but no videoLink provided"));
    } else if (this.type === 'course' && !this.courseId) {
        return next(new ApiError(404, "Error: Type is course but no courseId provided"));
    }

    // If All Good then proceed next step 
    next();
});


const Chat = mongoose.model("Chat", chatSchema);
export default Chat;