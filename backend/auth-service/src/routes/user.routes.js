import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { signUpController , signInController , logOutController } from '../controllers/user.controllers.js'

const userRouter = Router();

userRouter.post("/create-user" , verifyJWT , signUpController);
userRouter.post('/login-user', verifyJWT, signInController);
userRouter.post('/logout-user', verifyJWT, logOutController);


export default userRouter;
