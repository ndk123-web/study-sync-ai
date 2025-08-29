import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { LoadVideoController } from '../controllers/video.controller.js';

const videoRouter = Router();

videoRouter.post("/enroll-video" , verifyJWT , LoadVideoController )

export default videoRouter;