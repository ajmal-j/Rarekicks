const mongoose=require('mongoose')

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      contact: {
        type: Number,
        required: true,
        unique: true
      },
      isBlocked :{
        type : Boolean,
        default : false
      },
      validated:{
        type : Boolean,
        default : false
      },
      otp:{
        type : String,
        default : ''
      },
      wishlist:
      [{ type: mongoose.Schema.Types.ObjectId,
         ref: 'product' }],
      cart: {
        items: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price:{
                type:Number
            },
            size:{
                type:Number
            },

        }],
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    },
    {
      timestamps: true,
    }
  );


  userSchema.pre('save', function(next) {
    let cart = this.cart;
    cart.totalPrice = 0;

    cart.items.forEach(item => {
        cart.totalPrice += item.quantity * item.price;
    });

    next();
});





const userModel=mongoose.model("user",userSchema)
module.exports=userModel