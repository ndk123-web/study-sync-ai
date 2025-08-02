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
    },
    completed: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
})

const Enrollment = mongoose.model('EnrollmentCourse',enrollmentSchema);
export default Enrollment;

/*
    Current course -> video length 
    User ID -> from cookies
    Progress Track using next button of that playlist -> which will be post req for next 

    api will look like
    1. api/v1/courses
    2. api/v1/enroll/:id (user info will get from cookies)
*/