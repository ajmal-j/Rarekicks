const express=require("express");
const userRouter=express();
const userController= require("../controller/userController")
const productController= require("../controller/productController")
const orderController= require("../controller/orderController")
const JWT=require("../middlewares/jwtToken")

userRouter.set("view engine","ejs")
userRouter.set("views","./views/user")


userRouter.get('/home',JWT.checkJwt,userController.homePage);
userRouter.get('/allProducts',JWT.checkJwt,productController.getProduct,userController.allProducts);
userRouter.get('/brand',JWT.checkJwt,productController.getBrand,userController.allProducts);
userRouter.get('/searchProduct',JWT.checkJwt,productController.searchProductUser);
userRouter.get('/brandBased',JWT.checkJwt,productController.brandBased);
userRouter.get("/login",userController.login);


userRouter.get("/loginWithOtp",userController.loginWithOtp);
userRouter.post("/loginWithOtp",userController.sendOtpForLogIn);
userRouter.get("/sendOtpAgain",userController.sendOtpAgain);
userRouter.post("/verifyOtp",userController.loginValidationOtp);


userRouter.get("/logout",userController.logout);
userRouter.get("/loginToken",userController.loginToken);
userRouter.post("/login",userController.loginValidation);
userRouter.get("/register",userController.register);
userRouter.post("/register",userController.createUser,userController.sendOtp,userController.verifyEmailShow);
userRouter.post("/verifyEmail",userController.verifyEmail);
userRouter.get("/resendOtp",userController.sendOtp,userController.verifyEmailShowAgain);
userRouter.get('/productDetailed',JWT.checkJwt,productController.getProduct,userController.productDetailed)


userRouter.get('/wishlist',JWT.checkJwt,productController.wishlistShow)
userRouter.get('/getCount',JWT.checkJwt,productController.getCount)
userRouter.get('/addToWishlist',JWT.checkJwt,productController.wishlist)
userRouter.get('/cart',JWT.checkJwt,productController.cartShow)
userRouter.get('/addToCart',JWT.checkJwt,productController.cart)
userRouter.get('/removeFromCart',JWT.checkJwt,productController.removeFromCart)
userRouter.get('/increaseQuantity',JWT.checkJwt,productController.increaseQuantity)
userRouter.get('/decreaseQuantity',JWT.checkJwt,productController.decreaseQuantity)


userRouter.get('/redirect',JWT.checkJwt,userController.redirect)
userRouter.get('/profile',JWT.checkJwt,userController.profile)
userRouter.get('/editProfile',JWT.checkJwt,userController.editProfileShow)
userRouter.get('/checkPassword',JWT.checkJwt,userController.checkPassword)
userRouter.get('/changePassword',JWT.checkJwt,userController.changePasswordShow)
userRouter.get('/checkPasswordNewPassword',JWT.checkJwt,userController.checkPasswordNewPassword)
userRouter.post('/editProfile',JWT.checkJwt,userController.editProfile)


userRouter.get('/addAddress',JWT.checkJwt,userController.addAddressShow)
userRouter.get('/editAddressShow',JWT.checkJwt,userController.editAddressShow)
userRouter.get('/editAddress',JWT.checkJwt,userController.editAddress)
userRouter.get('/deleteAddress',JWT.checkJwt,userController.deleteAddress)
userRouter.get('/insertAddress',JWT.checkJwt,userController.addAddress)
userRouter.get('/updateDefaultAddress',JWT.checkJwt,userController.updateDefaultAddress)


userRouter.get('/checkOut',JWT.checkJwt,userController.checkOutShow)
userRouter.get('/placeOrderCOD',JWT.checkJwt,orderController.placeOrderCOD)
userRouter.post('/placeOrderOnline',JWT.checkJwt,orderController.placeOrderOnline)
userRouter.post('/confirmOrderOnline',JWT.checkJwt,orderController.confirmOrderOnline)
userRouter.get('/showConfirmOrder',JWT.checkJwt,orderController.showConfirmOrder)
userRouter.get('/placeOrder',JWT.checkJwt,orderController.testData)
userRouter.get('/orders',JWT.checkJwt,orderController.orderShow)
userRouter.get('/orderDetailed',JWT.checkJwt,orderController.orderDetailed)
userRouter.get('/cancelOrder',JWT.checkJwt,orderController.cancelOrder)






























module.exports=userRouter