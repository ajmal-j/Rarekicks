const mongoose = require('mongoose');
const user = require("./userModel");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
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
    default: {
        type:Boolean,
        default : false
    }
});

module.exports = mongoose.model('address', addressSchema);
