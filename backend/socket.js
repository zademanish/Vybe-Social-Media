import http from "http"
import express from "express"
import { Server } from "socket.io"
import cors from "cors"

const app = express()

const server = http.createServer(app)

const allowedOrigins = [
  "http://localhost:5173",
  "https://vybe-frontend-x5it.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});


const userSocketMap = {}

export const getSocketId = (receiverId)=>{
    return userSocketMap[receiverId]
}

io.on("connection",(socket)=>{
    const  userId = socket.handshake.query.userId
    if(userId != undefined){
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        delete userSocketMap[userId]
         io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {app,io,server}