import { Router } from "express";
import {
  GetAdminSpecificController,
  GetAdminStatsController,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/get-admin-stats", GetAdminStatsController);
adminRouter.get("/get-admin-specific", GetAdminSpecificController);

export default adminRouter;