const express=require("express");
const userRouter=express();
const userController= require("../controller/userController")

userRouter.set("view engine","ejs")
userRouter.set("views","./views/user")

userRouter.get("/login",userController.login);
userRouter.post("/login",userController.loginValidation);
userRouter.get("/register",userController.register);
userRouter.post("/register",userController.createUser);




module.exports=userRouter