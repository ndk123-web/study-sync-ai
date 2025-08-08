import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const noteSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            // index: false because same user for multiple notes of different courses 
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: false
        },
        type: {
            type: String,
            enum: ['course', 'pdf', 'video'],
            required: true
        },
        videoLink: {
            type: String,
            required: false
        },
        pdfLink: {
            type: String,
            required: false
        },
        notes: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

noteSchema.pre("validate", function (next) {

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

const Note = mongoose.model("Note", noteSchema);
export default Note;