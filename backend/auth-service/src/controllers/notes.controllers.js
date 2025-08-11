import wrapper  from '../utils/Wrapper.js';
import Course from '../models/courses.models.js';
import User from '../models/user.models.js';  
import Note from '../models/notes.models.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const SaveCurrentNotesController = wrapper( async (req , res) => {
    const { courseId , notes } = req.body;
    const currentUser = req.user;

    const getCourseInstance = await Course.findOne({ courseId: courseId });
    if (!getCourseInstance){
        throw new ApiError('Course not found', 404);
    }

    const getSignInUserInstance = await User.findOne({ uid: currentUser.uid });
    if (!getSignInUserInstance) {
        throw new ApiError('User not found', 404);
    }

    const isExistNote = await Note.findOne({ userId: getSignInUserInstance._id, courseId: getCourseInstance._id });
    if (isExistNote) {
        isExistNote.notes = notes; 
        await isExistNote.save();
        return res.status(200).json(new ApiResponse(200, isExistNote, 'Note Updated Successfully'));
    }

    // Create a note for current user and that user's course
    const newNote = new Note({
        userId: getSignInUserInstance._id,
        courseId: getCourseInstance._id,
        notes: notes || "",
        type: 'course'
    })

    const savedNote = await newNote.save();
    if (!savedNote) {
        throw new ApiError('Failed to create note', 500);
    }

    return res.status(200).json(new ApiResponse(200, savedNote, 'Note Created Successfully'))

} )

const GetCurrentNotesController = wrapper( async (req , res) => {
    const { courseId } = req.params;  // Changed from req.query to req.params
    console.log("Course ID for GetCurrentNotesController:", courseId);
    const currentUser = req.user;

    if (!courseId){
        console.log("Course ID is required");
        throw new ApiError('Course ID is required', 400);
    }

    const getCourseInstance = await Course.findOne({ courseId: courseId });
    if (!getCourseInstance){
        console.log("Course not found");
        throw new ApiError('Course not found', 404);
    }

    const getSignInUserInstance = await User.findOne({ uid: currentUser.uid });
    if (!getSignInUserInstance) {
        console.log("User not found");
        throw new ApiError('User not found', 404);
    }

    const getCurrentNotes = await Note.findOne({ userId: getSignInUserInstance._id, courseId: getCourseInstance._id });
    if (!getCurrentNotes) {
        console.log("No notes found, returning empty notes");
        return res.status(200).json(new ApiResponse(200, { notes: "" }, 'No notes found, returning empty notes'));
    }

    console.log("Current Notes Retrieved Successfully");
    return res.status(200).json(new ApiResponse(200, getCurrentNotes, 'Current Notes Retrieved Successfully'))
})

export { SaveCurrentNotesController, GetCurrentNotesController }