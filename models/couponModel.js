const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        trim: true,
    },
    type: {
        type:String,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 1,
        max: 80,
    },
    discountAmount: {
        type: Number,
        default:0
    },
    validUpTo:{
        type:Date
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    minimumAmount:{
        type:Number,
        default:0
    },
    maximumAmount:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('coupon', couponSchema);


