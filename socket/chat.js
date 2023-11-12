const chatModel=require("../models/chatModel")
const adminModel = require("../models/adminModel");

let sockets = [];
let admin=[];

async function onConnection(socket) {
    try {
        // console.log('Socket Connected', socket.id);
    socket.on('getId',async (data)=>{
        try {
        const check=await adminModel.findOne({_id:data.adminId})
        if(check){
            // console.log("ADMIN");
            admin.push({socketId:socket.id,id:data.adminId,user:data.id})
        }else{
            // console.log("USER");
            sockets.push({socketId:socket.id,id:data.id});
        }
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('disconnect', () => {
        // console.log('Socket disconnected', socket.id);
        const index = sockets.findIndex((item) => item.socketId === socket.id);
            if (index !== -1) {
                sockets.splice(index, 1);
            }
            const admins = admin.findIndex((item) => item.socketId === socket.id);
            if (admins !== -1) {
                admin.splice(index, 1);
            }
    });

    socket.on('message', async (data) => {
        try {
            const isAdmin = admin.some(adminObj => adminObj.id === data.adminId);
            // console.log(isAdmin)
            if(isAdmin){
                let chat = new chatModel ({userId:data.userId,message:data.message,createdAt:new Date(),admin:true}); 
                chat.save();
                const users = sockets.find((user) => user.id === data.userId);
                if(users){
                    socket.to(users.socketId).emit('chatMessage', data);
                }
            }else{
                let chat = new chatModel ({userId:data.userId,message:data.message,createdAt:new Date(),admin:false}); 
                chat.save();
                const admins = admin.find((admin) => admin.user === data.userId);
                if(admins){
                    socket.to(admins.socketId).emit('chatMessage', data);
                }
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    });
    } catch (error) {
       console.log(error)
       res.send("Chat Feature Is Not Accessible Right Now..!") 
    }
}

module.exports=onConnection;