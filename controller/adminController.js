const adminModel=require("../models/adminModel")


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
          res.send("Admin Home")
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
  }