import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import { getAllMessages, getPrevUserChats, sendMessage } from "../controllers/message.controllers.js";



const messageRouter = express.Router();

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"), sendMessage)
messageRouter.get("/getAll/:receiverId",isAuth,getAllMessages)
messageRouter.get("/prevChats",isAuth,getPrevUserChats)


export default messageRouter;