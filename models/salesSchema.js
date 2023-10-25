const mongoose=require("mongoose")

const salesReportsSchema = new mongoose.Schema(
    {
    date: { 
        type: String,
        required: true },
    type: { 
        type: String,
        required: true },
    totalOrders: { 
        type: Number,
        required: true },
    totalSales: { 
        type: Number,
        required: true },
    totalRevenue: { 
        type: Number,
        required: true },
    paymentMethods: { 
        type: [{ _id: String, count: Number }],
        required: true },
    categories: {
        type: [{ _id: String, sales: Number, count: Number, revenue: Number }],
        required: true,
    },
    products: {
        type: [
            {
            _id: String,
            sales: Number,
            count: Number,
            revenue: Number,
            },
        ],
    required: true,
    },
    },
    { timestamps: true }
  );


  module.exports=mongoose.model('sales',salesReportsSchema)