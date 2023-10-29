const mongoose=require("mongoose")

const chatSchema= mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
    },
    message:{
        type:String
    },
    createdAt:{
        type:Date,
        default:()=>Date.now()
    },
    admin:{
        type:Boolean,
        default:false
    }
},{ timestamps: true })

const chatModel=new mongoose.model("chat",chatSchema)
module.exports=chatModel