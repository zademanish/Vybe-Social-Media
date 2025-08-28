import uploadOncloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadLoop = async(req,res)=>{
    try {
        const {caption} = req.body;
        let media;
        if(req.file){
            media=await uploadOncloudinary(req.file.path)
        }else{
            return res.status(400).json({message:"media is required"})
        }

        const loop = await Loop.create({
            caption,media, author:req.userId
        })

        const user = await User.findById(req.userId)
        user.loops.push(loop._id);

        await user.save();

        const populatedLoop = await Loop.findById(loop._id).populate("author","name userName profileImage");

        return res.status(201).json(populatedLoop)

    } catch (error) {
        return res.status(500).json({message:"upload loop Error", error})
    }
}

export const like = async (req,res)=>{
    try {
        const loopId = req.params.loopId
        const loop =await Loop.findById(loopId)
        if(!loop){
            return res.status(400).json({message:"loop not found"})
        }

        const alreadyLiked = loop.likes.some(id=>id.toString() == req.userId.toString())

        if(alreadyLiked){
            loop.likes = loop.likes.filter(id=>id.toString() !=req.userId.toString())
        }else{
            loop.likes.push(req.userId)

                if(loop.author._id != req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:loop.author._id,
                    type:"like",
                    loop:loop._id,
                    message:"Liked your loop"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")

                const receiverSocketId = getSocketId(loop.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }

        await loop.save();
       await loop.populate("author","name userName profileImage")

        io.emit("likedLoop",{
            loopId:loop._id,
            likes:loop.likes
        })

        return res.status(200).json(loop);


    } catch (error) {
        return res.status(500).json({message:"Like loop Error", error})
    }
}


export const comment = async (req,res)=>{
    try {

        const {message} = req.body;
        const loopId = req.params.loopId

        const loop =await Loop.findById(loopId)
        if(!loop){
            return res.status(400).json({message:"loop not found"})
        }

        loop.comments.push({
            author:req.userId,
            message
        })

          if(loop.author._id != req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:loop.author._id,
                    type:"comment",
                    loop:loop._id,
                    message:"commented on your loop"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")

                const receiverSocketId = getSocketId(loop.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }

        await loop.save();
        await loop.populate("author","name userName profileImage")
        await loop.populate("comments.author")

         io.emit("commentedLoop",{
            loopId:loop._id,
            comments:loop.comments
        })

        return res.status(200).json(loop);


    } catch (error) {
        return res.status(500).json({message:"comment loop Error", error})
    }
}

export const getAllLoops = async (req,res)=>{
    try {
        const loops = await Loop.find({}).populate("author","name userName profileImage").populate("comments.author").sort({createdAt:-1})

        return res.status(200).json(loops);

    } catch (error) {
                return res.status(500).json({message:"getAllLoops Error", error})

    }
}