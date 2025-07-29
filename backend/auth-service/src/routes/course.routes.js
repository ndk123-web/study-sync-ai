import { Router } from "express";
// import { verifyJWT } from "../middleware/verifyJWT.js";
import { GetAllCoursesController } from '../controllers/course.controllers.js'; 

const coursesRouter = Router();

coursesRouter.get('/' , GetAllCoursesController)

export default coursesRouter;