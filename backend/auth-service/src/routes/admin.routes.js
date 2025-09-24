import { Router } from "express";
import {
  GetAdminSpecificController,
  GetAdminStatsController,
  GetAdminGraphController,
  GetUserActivitiesController,
  GetAdminCourseDataController,
  GetCategoryWiseCourseDataController
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/get-admin-stats", GetAdminStatsController);
adminRouter.get("/get-admin-specific", GetAdminSpecificController);
adminRouter.get("/get-admin-graph", GetAdminGraphController);
adminRouter.get("/get-user-activities", GetUserActivitiesController);
adminRouter.get('/get-course-data', GetAdminCourseDataController);
adminRouter.get('/get-category-wise-course-data', GetCategoryWiseCourseDataController);

export default adminRouter;