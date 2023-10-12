const express=require("express");
const adminRouter=express();
const adminController= require("../controller/adminController")
const productController= require("../controller/productController")
const userController= require("../controller/userController")
const orderController= require("../controller/orderController")
const JWT=require("../middlewares/jwtToken")
adminRouter.set("view engine","ejs")
adminRouter.set("views","./views/admin")


adminRouter.get('/home',JWT.checkJwtAdmin,productController.getProductAdmin,adminController.home)
adminRouter.get('/adminLogin',adminController.login)
adminRouter.get('/logout',adminController.logout)
adminRouter.get("/loginToken",adminController.loginToken);
adminRouter.post('/adminLogin',adminController.loginValidation)


adminRouter.get('/addProduct',JWT.checkJwtAdmin,productController.addProduct)
adminRouter.post('/addProduct',JWT.checkJwtAdmin,productController.upload.array('images', 5),productController.insertProduct)
adminRouter.get('/editProduct',JWT.checkJwtAdmin,productController.editProductShow)
adminRouter.post('/editProduct',JWT.checkJwtAdmin,productController.upload.array('images', 5),productController.editProduct)
adminRouter.get('/deleteProduct',JWT.checkJwtAdmin,productController.deleteProduct)
adminRouter.get('/deleteProductCompletely',JWT.checkJwtAdmin,productController.deleteProductCompletely)
adminRouter.get('/searchProduct',JWT.checkJwtAdmin,productController.searchProduct)
adminRouter.get('/brandBased',JWT.checkJwtAdmin,productController.brandBasedAdmin);


adminRouter.get('/viewUsers',JWT.checkJwtAdmin,JWT.checkJwtAdmin,userController.allUsers)
adminRouter.get('/deleteUser',JWT.checkJwtAdmin,userController.deleteUser)
adminRouter.get('/editUser',JWT.checkJwtAdmin,userController.editUserShow)
adminRouter.post('/editUser',JWT.checkJwtAdmin,userController.editUser)
adminRouter.get('/blockUser',JWT.checkJwtAdmin,userController.blockUser)
adminRouter.get('/createUser',JWT.checkJwtAdmin,userController.createUserByAdminShow)
adminRouter.post('/createUser',JWT.checkJwtAdmin,userController.createUserByAdmin)
adminRouter.get('/searchUser',JWT.checkJwtAdmin,userController.searchUser)


adminRouter.get('/checkCategory',JWT.checkJwtAdmin,productController.checkCategory)
adminRouter.get('/createCategory',JWT.checkJwtAdmin,productController.createCategoryShow)
adminRouter.post('/createCategory',JWT.checkJwtAdmin,productController.createCategory)
adminRouter.get('/editCategory',JWT.checkJwtAdmin,productController.editCategoryShow)
adminRouter.post('/editCategory',JWT.checkJwtAdmin,productController.editCategory)
adminRouter.get('/deleteCategory',JWT.checkJwtAdmin,productController.deleteCategory)
adminRouter.get('/deleteCategoryCompletly',JWT.checkJwtAdmin,productController.deleteCategoryCompletly)
adminRouter.get('/allOrders',orderController.allOrders)
adminRouter.get('/orderDetailed',orderController.orderDetailedAdmin)
adminRouter.get('/cancelOrder',orderController.cancelOrder)


module.exports=adminRouter