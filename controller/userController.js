const userModel=require("../models/userModel")
const bcrypt = require('bcrypt');

const register= async(req,res)=>{
    try {
        res.render("userRegister");
      } catch (error) {
        console.log(error.message);
      }
}

const login= async(req,res)=>{
    try {
        res.render("userLogin");
      } catch (error) {
        console.log(error.message);
      }
}

const createUser=async (req,res)=>{
  try {
    const check=await userModel.findOne({email:req.body.email})
      if(!check){
      let passwordBcrypt=req.body.password;
      const  salt= await bcrypt.genSalt(3)
      passwordBcrypt=await bcrypt.hash(passwordBcrypt,salt)
      const userDetails={
          name :req.body.name,
          email :req.body.email,
          password: passwordBcrypt,
          contact :req.body.contact
      }
      await userModel.insertMany([userDetails]);
      res.send("Home")
      }else{
        res.render("userRegister",{message:req.body.email+' '+"Aldready Excist!"})
      }
  }catch(err){
    res.render("userRegister",{message:"Something went wrong!"})
  }
      
}

const loginValidation=async (req,res)=>{
  try{
    const check=await userModel.findOne({email:req.body.email})
    const passwordMatch = await bcrypt.compare(req.body.password,check.password);
    if(passwordMatch){
        res.send("home")
    }else{
        res.render("userLogin",{message:"Incorrect Password"})
    }
}
catch(err){
  res.render("userLogin",{message:"Invalid User"})
}
}

module.exports={createUser,register,login,loginValidation}