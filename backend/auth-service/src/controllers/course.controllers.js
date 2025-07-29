import Course  from '../models/courses.models.js';
import wrapper from '../utils/Wrapper.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const GetAllCoursesController = wrapper(async (req , res) => {
    const courses = await Course.find();
    return res.status(200).json(new ApiResponse(200, courses));

} )

export { GetAllCoursesController }