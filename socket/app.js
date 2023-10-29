const express=require("express")
const app=express()
const port=process.env.PORT||5000;
const path = require('path')
const cors = require('cors'); 
const userController=require('../controller/userController')
const chatModel=require("../models/chatModel")
const { connect, mongoose } = require('../config/dbConnect');
const adminModel = require("../models/adminModel");
// Example: Define the chat collection
const chat = mongoose.connection.collection('chats');
const server=app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})
const io=require('socket.io')(server);
connect()
app.use(express.static(path.join(__dirname,'public')))
const corsOptions = {
    origin: 'http://localhost:3000', // Update with the origin of your main application
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies and other credentials to be sent
    optionsSuccessStatus: 204, // Return a successful status for OPTIONS requests
  };
  
  app.use(cors(corsOptions));

let sockets = [];
let admin=[];
io.on('connection',onConnection)

async function onConnection(socket) {
    console.log('Socket Connected', socket.id);
    socket.on('getId',async (data)=>{
        const check=await adminModel.findOne({_id:data.id})
        if(check){
            console.log("ADMIN");
            admin.push({socketId:socket.id,id:data.id,user:data.user})
        }else{
            console.log("USER");
            sockets.push({socketId:socket.id,id:data.id});
        }
    })


    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        const index = sockets.findIndex((item) => item.socketId === socket.id);
            if (index !== -1) {
                sockets.splice(index, 1);
            }
            const admins = admin.findIndex((item) => item.socketId === socket.id);
            if (admins !== -1) {
                admin.splice(index, 1);
            }
        io.emit('totalChat', sockets.length);
    });

    socket.on('message', async (data) => {
        // console.log(data);
        try {
            const isAdmin = admin.some(adminObj => adminObj.id === data.userId);
            // console.log(isAdmin)
            if(isAdmin){
                await chat.insertOne({userId:data.user,message:data.message,createdAt:new Date(),admin:true})
                const users = sockets.find((user) => user.id === data.user);
                if(users){
                    socket.to(users.socketId).emit('chatMessage', data);
                }
            }else{
                await chat.insertOne({userId:data.userId,message:data.message,createdAt:new Date(),admin:false})
                const admins = admin.find((admin) => admin.user === data.userId);
                // console.log(admins+"yayaya")
                if(admins){
                    socket.to(admins.socketId).emit('chatMessage', data);
                }
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    });
}

