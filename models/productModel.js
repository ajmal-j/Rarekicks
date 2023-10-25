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
    discountPercentage:{
        type:Number,
        default:0
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
    rating: {
        totalRating: {
            type: Number,
            default: 0
        },
    }
}, { timestamps: true });

productSchema.virtual('rating.averageRating').get(function () {
    const totalRating = this.rating.totalRating;
    const numberOfRating = this.reviews.length;
    if (numberOfRating === 0) {
        return 0;
    }
    const rawAverage = totalRating / numberOfRating;
    return Math.max(1, Math.min(5, Math.round(rawAverage)));
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('product',productSchema)