import Course  from '../models/courses.models.js';
import Enrollment from '../models/enrollments.models.js';
import User from '../models/user.models.js';
import wrapper from '../utils/Wrapper.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import coursesRouter from '../routes/course.routes.js';

const GetAllCoursesController = wrapper(async (req , res) => {
    const courses = await Course.find();
    return res.status(200).json(new ApiResponse(200, courses));

} )

const GetCurrentPlayListController = wrapper(async (req , res) => {
    const { courseId } = req.params; 
    console.log("Course ID:", courseId);

    const playlist = await Course.find({ courseId: courseId });
    console.log("Playlist:", playlist);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(200, playlist));

})

const EnrollCurrentCourseController = wrapper(async (req , res) => {
    const { courseId } = req.body;
    const currentUser = req.user; 
    console.log("CourseId: ", courseId);

    
    const getCurrentUser = await User.findOne({ uid: currentUser.uid });
    if (!getCurrentUser){
        throw new ApiError('404','User Not Found in DB');
    }
    
    const getCurrentCourse = await Course.findOne({ courseId: courseId });
    if (!getCurrentCourse){
        throw new ApiError('404','Course Not Found in DB');
    }
    // console.log("Current Course: ", getCurrentCourse);

    const isAlreadyEnrolled = await Enrollment.findOne({ userId: getCurrentUser._id, courseId: getCurrentCourse._id });
    if (isAlreadyEnrolled) {
        throw new ApiError('400','User is already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
        userId: getCurrentUser._id,
        courseId: getCurrentCourse._id,
        progress: "0",
        completed: false  
    })

    return res.status(201).json(new ApiResponse(201, {}, `Successfully enrolled in course ${getCurrentCourse.title}`));

})

export { GetAllCoursesController, GetCurrentPlayListController, EnrollCurrentCourseController }