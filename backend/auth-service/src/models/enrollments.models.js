import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';

const enrollmentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    progress: {
        type: String,
        default: 0
    }
})

const Enrollment = mongoose.model('EnrollmentCourse',enrollmentSchema);
export default Enrollment;