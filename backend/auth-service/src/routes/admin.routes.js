import { Router } from "express";
import {
  GetAdminSpecificController,
  GetAdminStatsController,
  GetAdminGraphController
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/get-admin-stats", GetAdminStatsController);
adminRouter.get("/get-admin-specific", GetAdminSpecificController);
adminRouter.get("/get-admin-graph", GetAdminGraphController);

export default adminRouter;