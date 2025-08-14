import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  GetAllCoursesController,
  GetCurrentPlayListController,
  EnrollCurrentCourseController,
  ChangeCourseProgressController,
  GetCurrentCourseProgressController,
  TrackPlaylistIndexController,
  GetEnrollCoursesController
} from "../controllers/course.controllers.js";
// import { GetCurrentPlayListController } from '../controllers/course.controllers.js';

const coursesRouter = Router();

coursesRouter.get("/", verifyJWT, GetAllCoursesController);
// Place specific/static routes BEFORE dynamic parameterized routes to avoid collisions
coursesRouter.get('/get-enrolled-courses' , verifyJWT, GetEnrollCoursesController);
coursesRouter.get("/:courseId", verifyJWT, GetCurrentPlayListController);
coursesRouter.post("/enroll-course", verifyJWT, EnrollCurrentCourseController);
coursesRouter.post(
  "/change-course-progress",
  verifyJWT,
  ChangeCourseProgressController
);
coursesRouter.post(
  "/get-current-course-progress",
  verifyJWT,
  GetCurrentCourseProgressController
);

coursesRouter.post(
  "/track-playlist-index",
  verifyJWT,
  TrackPlaylistIndexController
);

export default coursesRouter;
