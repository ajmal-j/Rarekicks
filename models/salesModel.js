const mongoose=require("mongoose")

const salesReportsSchema = new mongoose.Schema(
    {
    date: { 
        type: String,
        required: true 
    },
    type: { 
        type: String,
        required: true 
    },
    totalOrders: { 
        type: Number,
        required: true 
    },
    successfulOrders: { 
        type: Number,
        required: true 
    },
    totalSales: { 
        type: Number,
        required: true 
    },
    totalRevenue: { 
        type: Number,
        required: true 
    },
    paymentMethods: { 
        type: [{ method: String, count: Number }],
        required: true 
    },
    categories: {
            type: [
              {
                id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'category'
                },
                category: String,
                sales: Number,
                count: Number,
              }
            ],
            required: true
          },
    products: {
        type: [
            {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
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