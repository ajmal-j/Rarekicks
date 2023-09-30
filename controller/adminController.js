const adminModel=require("../models/adminModel")
const getProduct=require("../models/productModel")



const home= async(req,res)=>{
    try {
      const products=await req.products;
        res.render("adminHome",{products:products});
      } catch (error) {
        console.log(error.message);
      }
}
const login= async(req,res)=>{
    try {
        res.render("adminLogin");
      } catch (error) {
        console.log(error.message);
      }
}

const loginValidation=async (req,res)=>{
    try{
      const check=await adminModel.findOne({email:req.body.email})
      const password = await check.password;
      if(password===req.body.password){
          res.redirect("/admin/home")
      }else{
          res.render("adminLogin",{message:"Incorrect Password"})
      }
      }
      catch(err){
        res.render("adminLogin",{message:"Invalid Admin"})
      }
  }



  module.exports={
    login,
    loginValidation,
    home
  }