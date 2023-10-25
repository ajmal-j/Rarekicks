const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderId:{
        type:String,
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    payment:{
      method:{
        type:String,
        required:true
      },
      amount:{
        type:Number,
        required:true,
        set: function(value) {
            return parseFloat(value).toFixed(2);
        }
      }
    },
    usedFromWallet:{
        type:Number,
        default:0,
        get: (v) => v.toFixed(2),
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
                set: function(value) {
                    return parseFloat(value).toFixed(2);
                }
            }
        }],
        totalPrice:{
            type:Number,
            default:0,
            set: function(value) {
                return parseFloat(value).toFixed(2);
            }
        }
    },
    status:{
        type:String,
        default:"Processing"
    },
    deliveredDate:{
        type:Date,
    },
    returnedDate:{
        type:Date,
    },
    cancelledDate:{
        type:Date,
    },
    reasonForCancellation:{
        type:String
    },
    reasonForReturn:{
        type:String
    },
    offer:{
        type:String,
        default:"none"
    },
    couponApplied:{
        type:String,
        default:"none"
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
      },
      paymentId: {
        type: String,
      },
      orderId: {
        type:String
      }
  
    }

    
})
module.exports = mongoose.model("orders",orderSchema)