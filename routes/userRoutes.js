const express=require("express");
const userRouter=express();
const userController= require("../controller/userController")
const productController= require("../controller/productController")
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

module.exports=userRouter