import { Router } from "express";

const userRouter = Router();

// User Router Testing 
userRouter.get("/", (req, res, next) => {
    console.log("This is Middleware Bro");
    next();
}, (req, res) => {
    res.json({
        valule: "This is Home user"
    })
})

// User Router Testing 
userRouter.get("/create-user", (req, res, next) => {
    console.log("This is Middleware Bro")
    next();
}, (req, res) => {
    res.json({
        valule: "This is Create user"
    })
})

export default userRouter;