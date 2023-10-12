const userModel=require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const productModel = require("../models/productModel");
const addressModel = require("../models/addressModel");
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
    req.session._id=false;
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
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: "730d" });
        req.session.user=user.email;
        req.session._id=user._id;
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
    req.session.checkOut=false;
    req.session.orderConfirmed=false;
    const products=await productModel.find({deleted:false}).limit(9);
    const products2=await productModel.find({deleted:false}).skip(17);
    const message=req.query.message;
    if(message){
      res.render('homePage',{products,products2,messageS:message})
    }else{
      res.render('homePage',{products,products2})
    }
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


const productDetailed = async (req, res) => {
  try {
    const id = req.query.id;
    const userId=req.session._id;
    const user = await userModel.findOne({ _id:userId });
    const wish = user?.wishlist.includes(id);
    console.log(wish);
    const product = await productModel.findOne({
      $and: [
        { _id: id },
        { deleted: false }
      ]
    }).populate("category");

    if (product) {
      res.render("detailedProduct", { products: req.products, product, wishlist: wish });
    } else {
      res.render("detailedProduct", { products: req.products, product: null, wishlist: wish });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


const profile=async(req,res)=>{
  try {
    req.session.checkOut=false;
    const id=req.session._id
    const addresses=await addressModel.find({userId:id})
    const user=await userModel.findOne({_id:id})
    res.render('profile',{user,addresses})
  } catch (error) {
    
  }
}

const redirect=async(req,res)=>{
  req.session.checkOut=false;
  const message=req.query.message;
  if(message){
  res.redirect(`/user/home`)
  }
  res.redirect("/user/profile")
}

const editProfileShow=async(req,res)=>{
  try {
    const id=req.session._id
    const user=await userModel.findOne({_id:id})
    res.render('editProfile',{user})
  } catch (error) {
    
  }
}
const editProfile=async (req,res,next)=>{
  try {
    const body=await req.body;
    const id=await req.session._id;
    const details={
      name:body.name,
      contact:body.contact,
      email:body.email
    }
    await userModel.findByIdAndUpdate(id,details)
    res.redirect('/user/profile')
  } catch (error) {
    console.log(error);
  }
      
}


const checkPassword = async (req, res) => {
  try {
      const passwordNew = req.query.password;
      const contactNew = req.query.contact;
      const emailNew = req.query.email;

      const { email, contact, password } = await userModel.findOne({ _id: req.session._id });

      const anyUserByEmail = await userModel.findOne({ email: emailNew });
      const anyUserByContact = await userModel.findOne({ contact: contactNew });

      if (anyUserByEmail && anyUserByEmail.email !== email) {
          return res.json({ valid: "email" });
      }

      if (anyUserByContact && anyUserByContact.contact !== contact) {
          return res.json({ valid: "contact" });
      }

      const passwordMatch = await bcrypt.compare(passwordNew, password);

      if (!passwordMatch) {
          return res.json({ valid: "not" });
      }

      return res.json({ valid: false });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ valid: "error", error: "Internal Server Error" });
  }
};


const changePasswordShow=async(req,res)=>{
  try {
    res.render("changePassword")
  } catch (error) {
    
  }
}
const checkPasswordNewPassword=async(req,res)=>{
  try {
    const currentPassword=await req.query.currentPassword
    const id=req.session._id;
    const {password}=await userModel.findOne({_id:id})
    const passwordMatch = await bcrypt.compare(currentPassword, password);
    if(!passwordMatch){
      return res.json({valid:"not"})
    }
    const newPassword=await req.query.newPassword
    const confirmPassword=await req.query.confirmPassword
    if(newPassword===confirmPassword&&passwordMatch){
          const  salt= await bcrypt.genSalt(3)
          passwordBcrypt=await bcrypt.hash(newPassword,salt)
          await userModel.findByIdAndUpdate(id,{password:passwordBcrypt})
          return res.json({valid:false})
    }else{
        return res.json({valid:"new"})
    }
  } catch (error) {
    
  }
}

const addAddressShow=async(req,res)=>{
  try {
    res.render('addAddress');
  } catch (error) {
    
  }
}


const addAddress = async (req, res) => {
  try {
    const contactNew = req.query.contact;
    const id = req.session._id;
    const user = await userModel.findOne({ _id: id });
    const anyUserByContact = await userModel.findOne({ contact: contactNew });
    
    if (anyUserByContact && anyUserByContact.contact !== user.contact) {
        return res.json({ added: "contact" });
    }

    const userDetails = {
      userId: req.session._id,
      country: req.query.country,
      state: req.query.state,
      name: req.query.name,
      contact: req.query.contact,
      pinCode: req.query.pinCode,
      address: req.query.address,
      landmark: req.query.landmark,
      city: req.query.city,
    };
    await addressModel.create(userDetails);
    const address=await addressModel.find({userId:id})
    if(address.length===1){
      const addId=address[0]._id;
      await addressModel.findByIdAndUpdate(addId,{default:true})
    }
    const checkOut=req.session.checkOut;
    if(checkOut){
      const addressCheck = await addressModel.find({ userId: id })
      const length=addressCheck.length;
      const addId=addressCheck[length-1]._id;
      await addressModel.updateMany({ userId:id }, { $set: { default: false } });
      await addressModel.updateOne({_id:addId}, { $set: { default: true } })
      return res.json({ added: "checkOut" });
    }else{
      return res.json({ added: "added" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ added: "not" });
  }
};


const updateDefaultAddress=async (req,res)=>{
  try {
    const id=req.query.id;
    const  userId=await req.session._id;
    await addressModel.updateMany({ userId }, { $set: { default: false } });
    await addressModel.updateOne({ _id: id }, { $set: { default: true } });
    return res.json({success:true})
  } catch (error) {
    console.log(error);
    return res.json({success:false})
  }
}

const editAddressShow = async (req, res) => {
  try {
    const id = req.query.id; 
    const countryToStates = {
      'india': ['Kerala', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Tamil Nadu'],
      'usa': ['New York', 'California', 'Texas', 'Florida', 'Illinois'],
      'canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
      'uk': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
      'australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia']
  };
    const address = await addressModel.findOne({ _id: id });
    res.render('editAddress', { address ,countryToStates});
  } catch (error) {
    console.log(error);
  }
};



const editAddress = async (req, res) => {
  try {
    const contactNew = req.query.contact;
    const addressNew = req.query.address;
    const addressId = req.query.addressId;
    console.log(req.query.country);
    const id = req.session._id;
    const user = await userModel.findOne({ _id: id });
    const anyUserByContact = await userModel.findOne({ contact: contactNew });
    const anyUserByAddress = await addressModel.findOne({ address: addressNew });
    const currentAddress = await addressModel.findOne({ _id : addressId });
    
    if (anyUserByContact && anyUserByContact.contact !== user.contact) {
        return res.json({ added: "contact" });
    }
    if (anyUserByAddress && anyUserByAddress.address !== currentAddress.address) {
        return res.json({ added: "address" });
    }

    const userDetails = {
      country: req.query.country,
      state: req.query.state,
      name: req.query.name,
      contact: req.query.contact,
      pinCode: req.query.pinCode,
      address: req.query.address,
      landmark: req.query.landmark,
      city: req.query.city,
    };

    await addressModel.findByIdAndUpdate(addressId,userDetails);
    const checkOut=req.session.checkOut;
    if(checkOut){
      return res.json({ added: "checkOut" });
    }else{
      return res.json({ added: "added" });
    }
    
  } catch (error) {
    console.error(error);
    return res.json({ added: "not" });
  }
};


const deleteAddress=async (req,res)=>{
  try {
    const id=req.query.id;
    const userId=req.session._id;
    await addressModel.findByIdAndDelete(id);
    const address=await addressModel.find({userId:userId})
    if(address.length===1){
      const addId=address[0]._id;
      await addressModel.findByIdAndUpdate(addId,{default:true})
    }
    res.redirect('/user/redirect');
  } catch (error) {
    console.log(error);
    res.send("Error While Deleting Address!")
  }
}


const checkOutShow=async(req,res)=>{
  try {
    if(req.session.orderConfirmed){
      return res.redirect('/user/cart/')
    }
    const id=req.session._id;
    req.session.checkOut=id;
    const address=await addressModel.findOne({userId:id,default:true})
    const user = await userModel
                .findOne({ _id: id })
                .populate({
                    path: 'cart.items.product',
                    model: 'product',
                });
    const total=user.cart.totalPrice;
    let grandTotal;

    if (total >= 20000) {
      grandTotal = total * 0.8; 
    } else if (total >= 15000) {
      grandTotal = total * 0.85; 
    } else {
      grandTotal = total;
    }
    const grand=grandTotal.toFixed(2);
    const message=req.query.message;
    if(message){
      res.render("checkOut",{address,products:user.cart.items,total:total,grandTotal:grand,message})
    }else{
      res.render("checkOut",{address,products:user.cart.items,total:total,grandTotal:grand})
    }
  } catch (error) {
    console.log(error);
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
  sendOtpAgain,
  profile,
  editProfile,
  editProfileShow,
  checkPassword,
  changePasswordShow,
  checkPasswordNewPassword,
  redirect,
  addAddressShow,
  addAddress,
  updateDefaultAddress,
  editAddressShow,
  editAddress,
  deleteAddress,
  checkOutShow
}