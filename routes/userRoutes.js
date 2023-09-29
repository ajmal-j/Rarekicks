const express=require("express");
const userRouter=express();
const userController= require("../controller/userController")

userRouter.set("view engine","ejs")
userRouter.set("views","./views/user")

userRouter.get("/register",userController.register);
userRouter.get("/login",userController.login);
userRouter.post("/register",userController.createUser);
userRouter.post("/login",userController.loginValidation);




module.exports=userRouter