const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    payment:{
      method:{
        type:String,
        required:true
      },
      amount:{
        type:Number,
        required:true
      }
    },
    address:{
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        pinCode: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
      },
      
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    products:{
        items:[{
            product:{
                type:mongoose.Types.ObjectId,
                ref:'product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            size:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
            }
        }],
        totalPrice:{
            type:Number,
            default:0
        }
    },
    status:{
        type:String,
        default:"Processing"
    },
    offer:{
        type:String,
        default:"None"
    },
    paymentDetails: {
      receipt: {
        type: String,
      },
      status: {
        type: String,
      },
      createdAt: {
        type: Date,
      }
  
    }

    
})
module.exports = mongoose.model("orders",orderSchema)