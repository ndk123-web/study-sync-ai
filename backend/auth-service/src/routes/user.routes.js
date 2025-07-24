import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { signUpController , signInController } from '../controllers/user.controllers.js'

const userRouter = Router();

userRouter.post("/create-user" , verifyJWT , signUpController);
userRouter.post('/login-user', verifyJWT, signInController)

export default userRouter;
