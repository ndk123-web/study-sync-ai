import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  GetAllCoursesController,
  GetCurrentPlayListController,
  EnrollCurrentCourseController,
  ChangeCourseProgressController,
  GetCurrentCourseProgressController,
} from "../controllers/course.controllers.js";
// import { GetCurrentPlayListController } from '../controllers/course.controllers.js';

const coursesRouter = Router();

coursesRouter.get("/", verifyJWT, GetAllCoursesController);
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

export default coursesRouter;
