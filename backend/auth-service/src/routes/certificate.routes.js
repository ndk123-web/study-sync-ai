import { Router } from "express";
import { GetUserCertificateController } from "../controllers/certificate.controller.js";
import { verifyJWT } from '../middleware/verifyJWT.js';

const certificateRouter = Router();

certificateRouter.get("/get-user-certificates", verifyJWT, GetUserCertificateController);

export default certificateRouter;