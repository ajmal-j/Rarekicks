const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    images: {
        type: [String],
    }
},{timestamps:true})



module.exports = mongoose.model('banner',bannerSchema)