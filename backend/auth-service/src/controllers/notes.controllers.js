import wrapper from "../utils/Wrapper.js";
import Course from "../models/courses.models.js";
import User from "../models/user.models.js";
import Note from "../models/notes.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const SaveCurrentNotesController = wrapper(async (req, res) => {
  const { courseId, notes, type } = req.body;
  const currentUser = req.user;

  const getSignInUserInstance = await User.findOne({ uid: currentUser.uid });
  if (!getSignInUserInstance) {
    throw new ApiError("User not found", 404);
  }

  if (type === "course") {
    const getCourseInstance = await Course.findOne({ courseId: courseId });

    if (!getCourseInstance) {
      throw new ApiError("Course not found", 404);
    }

    const isExistNote = await Note.findOne({
      userId: getSignInUserInstance._id,
      courseId: getCourseInstance._id,
    });

    if (isExistNote) {
      isExistNote.notes = notes;
      await isExistNote.save();
      return res
        .status(200)
        .json(new ApiResponse(200, isExistNote, "Note Updated Successfully"));
    }

    // Create a note for current user and that user's course
    const newNote = new Note({
      userId: getSignInUserInstance._id,
      courseId: getCourseInstance._id,
      notes: notes || "",
      type: "course",
    });

    const savedNote = await newNote.save();
    if (!savedNote) {
      throw new ApiError("Failed to create note", 500);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, savedNote, "Note Created Successfully"));
  } else if (type === "video") {
    const isExistNote = await Note.findOne({
      userId: getSignInUserInstance._id,
      videoLink: courseId,
    });
    if (isExistNote) {
      isExistNote.notes = notes;
      await isExistNote.save();
      return res
        .status(200)
        .json(
          new ApiResponse(200, isExistNote, "Video Note Updated Successfully")
        );
    }

    const newNote = new Note({
      userId: getSignInUserInstance._id,
      videoLink: courseId, // Here courseId is actually videoLink
      notes: notes || "",
      type: "video",
    });

    const savedNote = await newNote.save();
    if (!savedNote) {
      throw new ApiError("Failed to create note", 500);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, savedNote, "Video Note Created Successfully"));
  } else if (type === "pdf") {
    const pdfLink = courseId; // Here courseId is actually pdfLink
    const isExistNote = await Note.findOne({
      userId: getSignInUserInstance._id,
      pdfLink: pdfLink,
    });
    if (isExistNote) {
      isExistNote.notes = notes;
      await isExistNote.save();
      return res
        .status(200)
        .json(
          new ApiResponse(200, isExistNote, "PDF Note Updated Successfully")
        );
    }
    const newNote = new Note({
      userId: getSignInUserInstance._id,
      pdfLink: pdfLink, // Here courseId is actually pdfLink
      notes: notes || "",
      type: "pdf",
    });
    const savedNote = await newNote.save();
    if (!savedNote) {
      throw new ApiError("Failed to create note", 500);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, savedNote, "PDF Note Created Successfully"));
  } else {
    throw new ApiError("Invalid note type", 400);
  }
});

const GetCurrentNotesController = wrapper(async (req, res) => {
  const { courseId: rawCourseId } = req.params;
  const { type } = req.query; // Get type from query params

  // Decode the URL-encoded courseId to handle special characters in encrypted URLs
  const courseId = decodeURIComponent(rawCourseId);

  console.log("Course ID for GetCurrentNotesController:", courseId);
  console.log("Type for GetCurrentNotesController:", type);
  const currentUser = req.user;

  if (!courseId) {
    console.log("Course ID is required");
    throw new ApiError("Course ID is required", 400);
  }

  const getSignInUserInstance = await User.findOne({ uid: currentUser.uid });
  if (!getSignInUserInstance) {
    console.log("User not found");
    throw new ApiError("User not found", 404);
  }

  if (type === "video") {
    // Handle video notes
    const getCurrentNotes = await Note.findOne({
      userId: getSignInUserInstance._id,
      videoLink: courseId, // For video, courseId is actually the videoLink
      type: "video",
    });

    if (!getCurrentNotes) {
      console.log("No video notes found, returning empty notes");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { notes: "" },
            "No video notes found, returning empty notes"
          )
        );
    }

    console.log("Current Video Notes Retrieved Successfully");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getCurrentNotes,
          "Current Video Notes Retrieved Successfully"
        )
      );
  } else if (type === "pdf") {
    // Handle PDF notes
    const getCurrentNotes = await Note.findOne({
      userId: getSignInUserInstance._id,
      pdfLink: courseId, // For PDF, courseId is actually the pdfLink
      type: "pdf",
    });

    if (!getCurrentNotes) {
      console.log("No PDF notes found, returning empty notes");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { notes: "" },
            "No PDF notes found, returning empty notes"
          )
        );
    }

    console.log("Current PDF Notes Retrieved Successfully");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getCurrentNotes,
          "Current PDF Notes Retrieved Successfully"
        )
      );
  } else {
    // Handle course notes (existing logic)
    const getCourseInstance = await Course.findOne({ courseId: courseId });
    if (!getCourseInstance) {
      console.log("Course not found");
      throw new ApiError("Course not found", 404);
    }

    const getCurrentNotes = await Note.findOne({
      userId: getSignInUserInstance._id,
      courseId: getCourseInstance._id,
    });

    if (!getCurrentNotes) {
      console.log("No notes found, returning empty notes");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { notes: "" },
            "No notes found, returning empty notes"
          )
        );
    }

    console.log("Current Notes Retrieved Successfully");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getCurrentNotes,
          "Current Notes Retrieved Successfully"
        )
      );
  }
});

export { SaveCurrentNotesController, GetCurrentNotesController };
