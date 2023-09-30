const express=require("express");
const adminRouter=express();
const adminController= require("../controller/adminController")
const productController= require("../controller/productController")

adminRouter.set("view engine","ejs")
adminRouter.set("views","./views/admin")



adminRouter.get('/home',productController.getProduct,adminController.home)
adminRouter.get('/adminLogin',adminController.login)
adminRouter.post('/adminLogin',adminController.loginValidation)
adminRouter.get('/addProduct',productController.addProduct)
adminRouter.post('/addProduct',productController.upload.array('images', 5),productController.insertProduct)
adminRouter.get('/editProduct',productController.editProductShow)
adminRouter.post('/editProduct',productController.upload.array('images', 5),productController.editProduct)
adminRouter.get('/deleteProduct',productController.deleteProduct)


module.exports=adminRouter