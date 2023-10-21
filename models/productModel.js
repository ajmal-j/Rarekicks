const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    postedOn: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    review: {
        type: String,
    },
    rating: {
        type: Number,
    },
});
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
        
    },
    salesCount:{
        type:Number,
        default:0
    },
    brand:{
        type: String,
        required: true 
     },
    sizes:{
        type: [String],
        required: true 
     },
    price : {
        type: Number,
        required: true
        
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
    },
    quantity: {
        type: Number,
        required:true
    },
    deleted:{
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    reviews: [reviewSchema],
    overallRating:{
        type:Number,
        default:0
    },

},{timestamps:true})





module.exports = mongoose.model('product',productSchema)