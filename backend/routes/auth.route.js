import express from "express";
import { resetPassword, sendOtp, SignIn, signOut, Signup, verifyOtp } from "../controllers/auth.controllers.js";

const authRouter= express.Router();

authRouter.post("/signup",Signup)
authRouter.post("/signin",SignIn)
authRouter.post("/sendOtp",sendOtp)
authRouter.post("/verifyOtp",verifyOtp)
authRouter.post("/resetPassword",resetPassword)
authRouter.get("/signout",signOut)


export default authRouter;