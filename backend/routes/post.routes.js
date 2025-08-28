import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import { comment, getAllPosts, like, saved, uploadPost } from "../controllers/post.controller.js";


const postRouter = express.Router();

postRouter.post("/upload",isAuth,upload.single("media"), uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/like/:postId",isAuth,like)
postRouter.get("/saved/:postId",isAuth,saved)
postRouter.post("/comment/:postId",isAuth,comment)


export default postRouter;