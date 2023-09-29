const mongoose=require('mongoose')
const dotenv=require("dotenv").config()

const connect=async ()=>{
    const connect=await mongoose.connect(process.env.CONNECT).then(()=>{
    console.log("connected")
    }).catch((err)=>{
        console.log("not connected")
    });
}

module.exports=connect