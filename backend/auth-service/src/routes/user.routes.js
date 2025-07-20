import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { signUpController } from '../controllers/user.controllers.js'

const userRouter = Router();

userRouter.post("/create-user" , verifyJWT , signUpController);

export default userRouter;
