const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    postedOn:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    review:{
        type:String
    },
    rating:{
        type:Number
    }
},{timestamps:true})



module.exports = mongoose.model('review',reviewSchema)