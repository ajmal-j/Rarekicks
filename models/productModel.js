const mongoose = require('mongoose')

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
},{timestamps:true})



module.exports = mongoose.model('product',productSchema)