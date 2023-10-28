const mongoose=require('mongoose');
const productModel = require('./productModel');

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      wallet: {
        total: {
          type: Number,
          default: 0,
          get: (v) => v.toFixed(2),
        },
        balance: {
            type: Number,
            default: 0,
            get: (v) => v.toFixed(2),
        },
        used: {
            type: Number,
            default: 0,
            get: (v) => v.toFixed(2),
        }
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      referralCode: {
        type: String,
        unique: true,
      },
      referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      orderedByReferral:{
        type:Boolean,
        default:false
      },
      referralsApplied: {
        type: Number,
        default: 0,
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
                type:Number,
                set: function(value) {
                  return parseFloat(value).toFixed(2);
              }
            },
            size:{
                type:Number
            },

        }],
        totalPrice: {
            type: Number,
            default: 0,
            set: function(value) {
              return parseFloat(value).toFixed(2);
          }
        }
    },
    },
    {
      timestamps: true,
    }
  );


  userSchema.pre('save', async function (next) {
    let cart = this.cart;
    cart.totalPrice = 0;

    for (const item of cart.items) {
        try {
            const product = await productModel.findById(item.product);
            if (product) {
                const { discountPercentage} = product;
                if(discountPercentage>0){
                  const discount=((product.price*product.discountPercentage)/100)
                  if (item.quantity !== 0) {
                    item.price=product.price-discount
                    cart.totalPrice += item.quantity * (product.price-discount);
                }
                }else{
                  if (item.quantity !== 0) {
                    item.price=product.price
                    cart.totalPrice += item.quantity * product.price;
                }
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    next();
});


userSchema.methods.updateCartPrices = async function () {
  let cart = this.cart;
  cart.totalPrice = 0;

  cart.items = cart.items.filter((item) => item.quantity > 0);
  for (const item of cart.items) {
    const product = await mongoose.model('product').findById(item.product);
    // console.log(product)
    if (product) {
      if(item.quantity>=product.quantity){
        item.quantity=product.quantity
      }
      if(item.quantity===0&&product.quantity>0){
        item.quantity=1;
      }
      if(item.quantity!==0){
          if(product.discountPercentage>0){
            const discount=((product.price*product.discountPercentage)/100)
            item.price=product.price-discount
            cart.totalPrice += item.quantity * (product.price-discount);
          }else{
            item.price=product.price
            cart.totalPrice += item.quantity * item.price;
          }
      }
    }
  }
  await this.save();
};

const userModel=mongoose.model("user",userSchema)
module.exports=userModel