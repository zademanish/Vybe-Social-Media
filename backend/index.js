import express from "express"
import authRouter from "./routes/auth.route.js"
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.route.js";
import storyRouter from "./routes/story.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket.js";

dotenv.config()



const port =process.env.PORT || 5000
app.use(cors({
    origin:"http://localhost:5173",
   credentials:true
}))

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);


server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
    connectDb();
})