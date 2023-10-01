const userModel=require("../models/userModel")
const bcrypt = require('bcrypt');
const generateToken=require("../middlewares/jwtToken")

const register= async(req,res)=>{
    try {
        res.render("userRegister");
      } catch (error) {
        console.log(error.message);
      }
}

const login= async(req,res)=>{
    try {
        res.render("userLogin",{email:''});
      } catch (error) {
        console.log(error.message);
      }
}

const createUser=async (req,res)=>{
  try {
    const check=await userModel.findOne({email:req.body.email})
    const contact=await userModel.findOne({contact:req.body.contact})
      if(!check){
        if(!contact){
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
          res.render("userRegister",{message:req.body.contact+' '+"Contact Already Exists!"})
        }
      }else{
        res.render("userRegister",{message:req.body.email+' '+"Already Exist!"})
      }
  }catch(err){
    res.render("userRegister",{message:"Something went wrong!"})
  }
      
}

const loginValidation=async (req,res)=>{
  try{
    const user=await userModel.findOne({email:req.body.email})
    const passwordMatch = await bcrypt.compare(req.body.password,user.password);
    if(passwordMatch){
      if(user.isBlocked){
        res.render("userLogin",{message:"You Are Blocked By The Admin!",email:req.body.email||" "})
      }else{
        res.send("home")
      }
    }else{
        res.render("userLogin",{message:"Incorrect Password",email:req.body.email||" "})
    }
}
catch(err){
  res.render("userLogin",{message:"Invalid User",email:req.body.email||" "})
}
}



const allUsers=async (req,res)=>{
  try{
    const users= await userModel.find();
    res.render("adminUserManagement",{users})
  }catch(err){
    res.end("oooooooops"+err)
  }
}

const deleteUser=async (req,res)=>{
  try{
    const id=req.query.id;
    await userModel.findByIdAndDelete(id);
    // res.redirect("/admin/viewUsers")
    }
    catch(err){
        res.end(err)
    }
}


const editUserShow=async (req,res)=>{
  const id=await req.query.id;
  const user=await userModel.findOne({_id:id})
  res.render("adminEditUser",{user}) 
}

const editUser=async (req,res)=>{
  try{
    const id=await req.query.id;
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
    const check=await userModel.findOne({email:req.body.email})
    const contact=await userModel.findOne({contact:req.body.contact})
      if(!check){
        if(!contact){
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
          res.redirect("/admin/viewUsers")
        }else{
          res.render("createUserByAdmin",{message:req.body.contact+' '+"Contact Already Exists!"})
        }
      }else{
        res.render("createUserByAdmin",{message:req.body.email+' '+"Already Exist!"})
      }
      }catch(err){
        res.render("createUserByAdmin",{message:"Something went wrong!"})
      }
}



const blockUser=async (req,res)=>{
    const id=await req.query.id;
    const {isBlocked}=await userModel.findOne({_id:id});
    if(isBlocked===false){
      await userModel.findByIdAndUpdate(id,{isBlocked:true})
      // res.redirect("/admin/viewUsers")
    }else if(isBlocked===true){
      await userModel.findByIdAndUpdate(id,{isBlocked:false})
      // res.redirect("/admin/viewUsers")
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

}