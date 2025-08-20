import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { GetTrendAnalysisYearController , GetTrendAnalysisController } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get(
  "/get-trend-analysis-year",
  verifyJWT,
  GetTrendAnalysisYearController
);

dashboardRouter.get(
  '/get-trend-analysis/',
  verifyJWT,
  GetTrendAnalysisController
)

export default dashboardRouter;
