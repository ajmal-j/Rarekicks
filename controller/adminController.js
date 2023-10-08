const adminModel=require("../models/adminModel")
const getProduct=require("../models/productModel")
const jwt=require("jsonwebtoken");

const home= async(req,res)=>{
    try {
      const products=await req.products;
        res.render("adminHome",{products:products,search:false});
      } catch (error) {
        console.log(error.message);
      }
}
const login= async(req,res)=>{
    try {
        res.render("adminLogin",{email:""});
      } catch (error) {
        console.log(error.message);
      }
}

const loginValidation=async (req,res)=>{
    try{
      const check=await adminModel.findOne({email:req.body.email.trim()})
      const password = await check.password;
      if(password===req.body.password.trim()){
        const token = jwt.sign({ name: check.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("adminToken",token,{
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
        })
        res.redirect("/admin/home")
      }else{
          res.render("adminLogin",{email:req.body.email.trim(),message:"Incorrect Password"})
      }
      }
      catch(err){
        res.render("adminLogin",{email:req.body.email.trim(),message:"Invalid Admin"})
      }
  }

  const loginToken= async(req,res)=>{
    try {
        res.render("adminLogin",{email:"",message:"Authorization Required!"});
      } catch (error) {
        console.log(error.message);
      }
}



const logout=async (req,res)=>{
  try {
    res.clearCookie("adminToken");
    res.render("adminLogin",{email:"",message:"Successfully logged out"});
  } catch (error) {
    res.end("Error While LogIn",error)
  }
}

  module.exports={
    login,
    loginValidation,
    home,
    loginToken,
    logout,
  }