const express = require('express');
const mongoose = require('mongoose');
const chatRouter = express();
const userModel = require('../models/userModel'); 
const chatModel = require('../models/chatModel'); 
const adminModel = require('../models/adminModel'); 
const moment = require('moment');
chatRouter.set("view engine","ejs")
chatRouter.set("views","./views/chat")
const JWT=require("../middlewares/jwtToken")
const ObjectId = mongoose.Types.ObjectId;


chatRouter.get('/chat',JWT.checkJwt,async (req, res, next) => {
    // console.log(req.url)
    try {
        const id=req.session._id;
        const user=await userModel.findById(id)
        const userId=new mongoose.Types.ObjectId(id) 
        const chats =await chatModel.find({ userId:userId }).sort({ createdAt: -1 }).limit(10).exec();
        res.render('chat', { userId: user._id ,chats:chats.reverse() , moment});
    } catch (error) {
        console.log(error);
        next(error)
    }
});


chatRouter.get('/chatAdmin',JWT.checkJwtAdmin, async (req, res, next) => {
    try {
        const cursor =await chatModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    count:{$sum: 1}
                },
            },
        ]);
        const id = req.session.admin_id;
        let clients=[];
        for(const user of cursor){
            const id=new ObjectId(user._id)
            const u=await userModel.findOne({_id:id});
            clients.push({name:u?.name,userId:user._id,count:user.count})
        }
        const adminData =await adminModel.findById(id);
        res.render('adminChat', { adminData, clients ,moment});
    } catch (error) {
        console.log(error);
        next(error)
    }
});

chatRouter.get('/openUserChat',JWT.checkJwtAdmin,async (req,res, next)=>{
    try {
        const userId=req.query.id;
        const id = req.session.admin_id;
        const adminData =await adminModel.findById(id);
        const chats =await  chatModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(10);
        const {name}=await userModel.findById(userId)
        res.render('individualChat',{chats:chats.reverse(),userId:userId,adminData,name,moment})
    } catch (error) {
        console.log(error);
        next(error)
    }
})

module.exports=chatRouter