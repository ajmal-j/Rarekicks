const userModel=require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const productModel = require("../models/productModel");
const mail=require('../public/jsFiles/mail');
const storage=require("../public/jsFiles/storage")

const { json } = require("express");

const register= async(req,res)=>{
    try {
      if(req.session.user){
        res.redirect("/user/home/")
      }else{
        res.render("userRegister");
      }
      } catch (error) {
        console.log(error.message);
      }
}

const login= async(req,res)=>{
    try {
      if(req.session.user){
        res.redirect("/user/home/")
      }else{
        res.render("userLogin",{email:""});
      }
      } catch (error) {
        res.end("Error While LogIn",error)
      }
}


const loginWithOtp=async(req,res)=>{
  try {
    const email=await req.query.email;
    res.render("otpLogin",{email:email||""});
  } catch (error) {
    res.end("Error While LogIn",error)
  }
}



const logout=async (req,res)=>{
  try {
    req.session.user=false;
    res.clearCookie("userToken");
    res.render("userLogin",{email:"",message:"Successfully logged out"});
  } catch (error) {
    res.end("Error While LogIn",error)
  }
}


const loginToken= async(req,res)=>{
    try {
        res.render("userLogin",{email:"",message:"Authorization Required!"});
      } catch (error) {
        console.log(error.message);
      }
}

const createUser=async (req,res,next)=>{
  try {
    const check=await userModel.findOne({email:req.body.email.trim()})
    const contact=await userModel.findOne({contact:req.body.contact.trim()})
      if(!check){
        if(!contact){
          req.details=req.body
          let passwordBcrypt=req.body.password.trim();
          const  salt= await bcrypt.genSalt(3)
          passwordBcrypt=await bcrypt.hash(passwordBcrypt,salt)
          const userDetails={
            name :req.body.name.trim(),
            email :req.body.email.trim(),
            password: passwordBcrypt,
            contact :req.body.contact.trim()
          }
          await userModel.insertMany([userDetails]);
          const user=await userModel.findOne({email:req.body.email.trim()})
          req.user=user;
          next()
        }
        else{
          res.render("userRegister",{message:req.body.contact+' '+"Contact Already Exists!"})
        }
      }else{
        res.render("userLogin",{email:req.body.email.trim(),message:req.body.email+' '+"Already Exist!"})
      }
  }catch(err){
    res.render("userRegister",{message:"Something went wrong!"})
  }
      
}

const loginValidation=async (req,res)=>{
  try{
    const email=req.body.email.trim()
    const user=await userModel.findOne({email:email})
    if(user.validated===false){
      res.redirect("/user/loginWithOtp?email="+user.email)
      return;
    }
    const pass=req.body.password.trim()
    const passwordMatch = await bcrypt.compare(pass,user?.password);
    if(passwordMatch){
      if(user.isBlocked){
        res.render("userLogin",{message:"You Are Blocked By The Admin!",email:req.body.email.trim()||" "})
      }else{
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
        req.session.user=user.email;
        res.cookie("userToken",token,{
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 60 * 1000), 
        })
        res.redirect("/user/home/")
      }
    }else{
        res.render("userLogin",{message:"Incorrect Password",email:req.body.email||" "})
    }
}
catch(err){
  console.log(err)
  res.render("userLogin",{message:"Invalid User",email:req.body.email||" "})
}
}

const loginValidationOtp=async (req,res)=>{
    const {otp,email}=await userModel.findOne({email:req.body.email})
    console.log(otp)
    const enteredOtp=await req.body.otp.trim();
    console.log(enteredOtp)
        if(req.body.counter){
              if(otp===enteredOtp){
                const user=await userModel.findOne({email:req.body.email})
                await userModel.findByIdAndUpdate(user._id,{otp:'',validated:true})
                const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
                    req.session.user=user.email;
                    res.cookie("userToken",token,{
                      httpOnly: true,
                      expires: new Date(Date.now() + 10 * 60 * 60 * 1000), 
                    })
                    res.redirect("/user/home/")
              }else{
                res.render('verifyOtpLogin',{email:req.body.email,message:"Invalid Otp!!"});
              }
          }else {
            res.render('verifyOtpLogin',{email:email,message:"Otp Expired!!"});
          }
  }

const allUsers=async (req,res)=>{
  try{
    const users= await userModel.find();
    res.render("adminUserManagement",{users,search:false})
  }catch(err){
    res.end("oooooooops"+err)
  }
}

const deleteUser=async (req,res)=>{
  try{
    const id=req.query.id.trim();
    await userModel.findByIdAndDelete(id);
    // res.redirect("/admin/viewUsers")
    }
    catch(err){
        res.end(err)
    }
}


const editUserShow=async (req,res)=>{
  const id=await req.query.id.trim();
  const user=await userModel.findOne({_id:id})
  res.render("adminEditUser",{user}) 
}

const editUser=async (req,res)=>{
  try{
    const id=await req.query.id.trim();
    await userModel.findByIdAndUpdate(id,req.body)
    res.redirect('/admin/viewUsers')
  }catch(err){
    res.end(err)
  }
}

const createUserByAdminShow=async (req,res)=>{
  try{
    res.render("createUserByAdmin")
  }catch(err){
    res.end("error")
  }
}

const createUserByAdmin=async (req,res)=>{
  try {
    const check=await userModel.findOne({email:req.body.email.trim()})
    const contact=await userModel.findOne({contact:req.body.contact.trim()})
      if(!check){
        if(!contact){
          let passwordBcrypt=req.body.password.trim();
          const  salt= await bcrypt.genSalt(3)
          passwordBcrypt=await bcrypt.hash(passwordBcrypt,salt)
          const userDetails={
              name :req.body.name.trim(),
              email :req.body.email.trim(),
              password: passwordBcrypt,
              contact :req.body.contact.trim()
          }
          await userModel.insertMany([userDetails]);
          res.redirect("/admin/viewUsers")
        }else{
          res.render("createUserByAdmin",{message:req.body.contact+' '+"Contact Already Exists!"})
        }
      }else{
        res.render("createUserByAdmin",{message:req.body.email+' '+"Already Exist!"})
      }
      }catch(err){
        console.log(err)
        res.render("createUserByAdmin",{message:"Something went wrong!"})
      }
}

const blockUser=async (req,res)=>{
    const id=await req.query.id.trim();
    const {isBlocked}=await userModel.findOne({_id:id});
    if(isBlocked===false){
      await userModel.findByIdAndUpdate(id,{isBlocked:true})
      // res.redirect("/admin/viewUsers")
    }else if(isBlocked===true){
      await userModel.findByIdAndUpdate(id,{isBlocked:false})
      // res.redirect("/admin/viewUsers")
    }
}

const searchUser=async(req,res)=>{
  const search=await req.query.search||"";
  try{
    const users=await userModel.find({name:new RegExp(search.trim(),"i")}).exec();
    users?res.render("adminUserManagement",{users,search}):res.redirect("admin/viewUsers");
    }
    catch(err){
    res.send("Error occurred")
    }
}


const sendOtp=async (req,res,next)=>{
    const email = req.user.email.trim();
    const generatedOTP = mail.generateOTP();
    await mail.sendOTPByEmail(email, generatedOTP);
    await userModel.findByIdAndUpdate(req.user._id,{otp:generatedOTP});
    console.log("Done");
    req.user=req.user;
    next()
    // res.render('verifyOtp',{email});
}

const sendOtpAgain=async (req,res,next)=>{
  const user=await userModel.findOne({email:req.query.email.trim()})
  if(user){
    if(user.isBlocked){
      res.render("otpLogin",{email:req.query.email,message:"You Are Blocked By The Admin!"});
    }else{
      const email = req.query.email.trim();
      const generatedOTP = mail.generateOTP();
      await mail.sendOTPByEmail(email, generatedOTP);
      await userModel.findByIdAndUpdate(user._id,{otp:generatedOTP})
      res.render('verifyOtpLogin',{email});
    }
  }else{
    res.render("otpLogin",{email:req.query.email,message:"Invalid User"});
  }
}

const sendOtpForLogIn=async (req,res,next)=>{
  const user=await userModel.findOne({email:req.body.email.trim()})
  if(user){
    if(user.isBlocked){
      res.render("otpLogin",{email:req.body.email,message:"You Are Blocked By The Admin!"});
    }else{
      const email = req.body.email.trim();
      const generatedOTP = mail.generateOTP();
      await mail.sendOTPByEmail(email, generatedOTP);
      await userModel.findByIdAndUpdate(user._id,{otp:generatedOTP})
      res.render('verifyOtpLogin',{email});
    }
  }else{
    res.render("otpLogin",{email:req.body.email,message:"Invalid User"});
  }
}
  
const verifyEmailShow=async (req, res) => {
  res.render('verifyOtp',{email:req.user.email});
};
const verifyEmailShowAgain=async (req, res) => {
  res.render('verifyOtp',{email:req.user.email,message:"Verify Your Email!"});
};



const verifyEmail=async (req,res)=>{
    try{
        const {_id,otp,email}=await userModel.findOne({email:req.body.email});
          console.log("reg")
          const enteredOtp=await req.body.otp.trim();
            if(req.body.counter){
              if(otp===enteredOtp){
                await userModel.findByIdAndUpdate(_id,{
                              otp:'',
                              validated:true
                       });
                res.render("userLogin",{message:"User Registered",email:email||''})
              }else{
                res.render('verifyOtp',{email:email,message:"Invalid Otp!"});
              }
            }else{
              await userModel.findByIdAndUpdate(_id,{ otp:'' });
              res.render('verifyOtp',{email:email,message:"Otp Expired"});
            }
    }catch(err){
          res.send(err+" "+"Error!! While Verifying Otp")
    }
  } 


const homePage=async (req,res)=>{
  try{
    // console.log(req.user)
    const products=await productModel.find({deleted:false}).limit(9);
    const products2=await productModel.find({deleted:false}).skip(17);
    res.render('homePage',{products,products2})
  }catch(err){
    res.end(err)
  }
}


const allProducts=async (req,res)=>{
  try {
    const brand=await req.brand;
    const products=await req.products;
    res.render("allProducts",{products,brand})
  } catch (error) {
    res.end("Error")
  }
}


const productDetailed=async (req,res)=>{
  try{
    const id=req.query.id.trim();
    const product = await productModel.findOne({
      $and: [
        { _id: id },
        { deleted: false }
      ]
    }).populate("category")
    // const product=await productModel.findOne({_id:id})
    if(product){
      res.render("detailedProduct",{products:req.products,product})
    }else{
      const product=await productModel.findOne({deleted:false}).populate("category");
      res.render("detailedProduct",{products:req.products,product})
    }
  }catch(err){
    
  }
}

module.exports={
  createUser,
  register,
  login,
  loginValidation,
  allUsers,
  deleteUser,
  editUser,
  editUserShow,
  createUserByAdminShow,
  createUserByAdmin,
  blockUser,
  searchUser,
  sendOtp,
  verifyEmail,
  verifyEmailShow,
  verifyEmailShowAgain,
  homePage,
  productDetailed,
  loginToken,
  logout,
  allProducts,
  loginWithOtp,
  loginValidationOtp,
  sendOtpForLogIn,
  sendOtpAgain
}