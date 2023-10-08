const mongoose=require('mongoose')

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      contact: {
        type: Number,
        required: true,
        unique: true
      },
      isBlocked :{
        type : Boolean,
        default : false
      },
      validated:{
        type : Boolean,
        default : false
      },
      otp:{
        type : String,
        default : ''
      }
    },
    {
      timestamps: true,
    }
  );

const userModel=mongoose.model("user",userSchema)
module.exports=userModel