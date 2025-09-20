import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  GetTrendAnalysisYearController,
  GetTrendAnalysisController,
  GetTopicsWiseProgressController,
  GetQuizPerformanceController,
  GetPerformanceDataController,
  GetUserActivitiesController,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get(
  "/get-trend-analysis-year",
  verifyJWT,
  GetTrendAnalysisYearController
);

dashboardRouter.get(
  "/get-trend-analysis/",
  verifyJWT,
  GetTrendAnalysisController
);

dashboardRouter.get(
  "/get-topics-wise-progress/",
  verifyJWT,
  GetTopicsWiseProgressController
);

dashboardRouter.get(
  "/get-quiz-performance",
  verifyJWT,
  GetQuizPerformanceController
);

dashboardRouter.get(
  "/get-performance-data",
  verifyJWT,
  GetPerformanceDataController
);

dashboardRouter.get(
  "/get-user-activities",
  verifyJWT,
  GetUserActivitiesController
);

export default dashboardRouter;
