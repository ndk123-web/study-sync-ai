import Course  from '../models/courses.models.js';
import wrapper from '../utils/Wrapper.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

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

export { GetAllCoursesController, GetCurrentPlayListController }