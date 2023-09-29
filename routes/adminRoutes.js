const express=require("express");
const adminRouter=express();
const adminController= require("../controller/adminController")

adminRouter.set("view engine","ejs")
adminRouter.set("views","./views/admin")

adminRouter.get('/adminLogin',adminController.login)
adminRouter.post('/adminLogin',adminController.loginValidation)


module.exports=adminRouter