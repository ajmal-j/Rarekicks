const userModel=require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const productModel = require("../models/productModel");
const addressModel = require("../models/addressModel");
const bannerModel = require("../models/bannerModel");
const chatModel = require("../models/chatModel");
const mail=require('../public/jsFiles/mail');
const moment=require("moment")
const orderController=require('./orderController')
const { json } = require("express");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");

const register= async(req,res,next)=>{
    try {
      if(req.session.user){
        res.redirect("/user/home/")
      }else{
        const ref= await req.query.ref;
        if(ref){
          res.render("userRegister",{ref});
        }else{
          res.render("userRegister",{ref:null});
        }
      }
      } catch (error) {
        next(error)
      }
}

const login= async(req,res,next)=>{
    try {
      if(req.session.user){
        res.redirect("/user/home/")
      }else{
        res.render("userLogin",{email:""});
      }
      } catch (error) {
        next(error)
      }
}


const loginWithOtp=async(req,res,next)=>{
  try {
    const email=await req.query.email;
    res.render("otpLogin",{email:email||""});
  } catch (error) {
    next(error)
  }
}



const logout=async (req,res,next)=>{
  try {
    req.session.user=false;
    req.session._id=false;
    res.clearCookie("userToken");
    res.render("userLogin",{email:"",message:"Successfully logged out"});
  } catch (error) {
    next(error)
  }
}


const loginToken= async(req,res,next)=>{
    try {
        res.render("userLogin",{email:"",message:"Authorization Required!"});
      } catch (error) {
        next(error)
      }
}

const createUser=async (req,res,next)=>{
  try {
    const check=await userModel.findOne({email:req.body.email.trim()})
    const contact=await userModel.findOne({contact:req.body.contact.trim()})
    const ref=req.body.ref;
      if(!check){
        if(!contact){
          req.details=req.body
          const referredBy=await( ref?userModel.findOne({referralCode:ref}):undefined);
          let walletTotal=0;
          let walletBalance=0;
          if(referredBy&&referredBy.referralsApplied<=3){
            walletBalance=500;
            walletTotal=500;
            mail.sendReferralMessage(referredBy.email,req.body.name.trim())
          }
          wallet={
            total:walletTotal,
            balance:walletBalance
          }
          let passwordBcrypt=req.body.password.trim();
          const  salt= await bcrypt.genSalt(3)
          passwordBcrypt=await bcrypt.hash(passwordBcrypt,salt)
          const referralCode=orderController.generateShortID()
          const userDetails={
            name :req.body.name.trim(),
            email :req.body.email.trim(),
            password: passwordBcrypt,
            contact :req.body.contact.trim(),
            referralCode,
            referredBy:referredBy?referredBy:null,
            referralStatus:referredBy?true:false,
            wallet
          }
          await userModel.insertMany([userDetails]);
          const user=await userModel.findOne({email:req.body.email.trim()})
          req.user=user;
          next()
        }
        else{
          res.render("userRegister",{message:req.body.contact+' '+"Contact Already Exists!",ref})
        }
      }else{
        res.render("userLogin",{email:req.body.email.trim(),messageS:"Welcome Back"})
      }
  }catch(err){
    console.log(err)
    const ref=req.body.ref;
    res.render("userRegister",{message:"Something went wrong!",ref:ref||''})
  }
      
}

const loginValidation=async (req,res,next)=>{
  try{
    const email=req.body.email.trim()
    const user=await userModel.findOne({email:email})
    if(!user){
      return res.render("userLogin",{message:"Invalid User",email:req.body.email||" "})
    }
    if(user?.validated===false){
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
          expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
        })
        mail.sendEmail(req.body.email);
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

const loginValidationOtp=async (req,res,next)=>{
    try {
      const {otp,email}=await userModel.findOne({email:req.body.email})
      const enteredOtp=await req.body.otp.trim();
          if(req.body.counter){
                if(otp===enteredOtp){
                  const user=await userModel.findOne({email:req.body.email})
                  await userModel.findByIdAndUpdate(user._id,{otp:'',validated:true})
                  const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: "730d" });
                      req.session.user=user.email;
                      req.session._id=user._id;
                      res.cookie("userToken",token,{
                        httpOnly: true,
                        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
                      })
                      mail.sendEmail(req.body.email);
                      res.redirect("/user/home")
                }else{
                  res.render('verifyOtpLogin',{email:req.body.email,message:"Invalid Otp!"});
                }
            }else {
              res.render('verifyOtpLogin',{email:email,message:"Otp Expired!!"});
            }
    } catch (error) {
      next(error)
    }
  }
const allUsers=async (req,res,next)=>{
  try{
    const users= await userModel.find();
    res.render("adminUserManagement",{users,search:false,moment})
  }catch(error){
    next(error)
  }
}

const detailedUser=async (req,res,next)=>{
  try{
    const id=req.query.id;
    const user= await userModel.findById(id);
    const orders=await orderModel.find({userId:id})
    let ordersSuccess=0;
    for (const order of orders){
      if(order.status==="Delivered"){
        ordersSuccess+=1;
      }
    }
    const address=await addressModel.findOne({userId:id,default:true})
    res.render("detailedUser",{user,search:false,moment,orders:orders.reverse(),address,ordersSuccess})
  }catch(error){
    next(error)
  }
}

const deleteUser=async (req,res,next)=>{
  try{
    const id=req.query.id.trim();
    await userModel.findByIdAndDelete(id);
    // res.redirect("/admin/viewUsers")
    }
    catch(err){
      next(err)
    }
}


const editUserShow=async (req,res,next)=>{
 try {
  const id=await req.query.id.trim();
  const user=await userModel.findOne({_id:id})
  res.render("adminEditUser",{user}) 
 } catch (error) {
  next(error)
 }
}

const editUser=async (req,res,next)=>{
  try{
    const id=await req.query.id.trim();
    await userModel.findByIdAndUpdate(id,req.body)
    res.redirect('/admin/viewUsers')
  }catch(err){
    next(err)
  }
}

const createUserByAdminShow=async (req,res,next)=>{
  try{
    res.render("createUserByAdmin")
  }catch(err){
    next(err)
  }
}

const createUserByAdmin=async (req,res,next)=>{
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
        next(err)
      }
}

const blockUser=async (req,res,next)=>{
    try {
      const id=await req.query.id.trim();
      const {isBlocked}=await userModel.findOne({_id:id});
      if(isBlocked===false){
        await userModel.findByIdAndUpdate(id,{isBlocked:true})
        // res.redirect("/admin/viewUsers")
      }else if(isBlocked===true){
        await userModel.findByIdAndUpdate(id,{isBlocked:false})
        // res.redirect("/admin/viewUsers")
      }
    } catch (error) {
      next(error)
    }
}

const searchUser=async(req,res,next)=>{
  const search=await req.query.search||"";
  try{
    let users=await userModel.find({name:new RegExp(search.trim(),"i")}).exec();
    if(users.length===0){
      users=await userModel.find({_id:search});
    }
    users?res.render("adminUserManagement",{users,search,moment}):res.redirect("admin/viewUsers");
    }
    catch(error){
      next(error)
    }
}


const sendOtp=async (req,res,next)=>{
    const email = req.user.email.trim();
    const generatedOTP = mail.generateOTP();
    await mail.sendOTPByEmail(email, generatedOTP);
    await userModel.findByIdAndUpdate(req.user._id,{otp:generatedOTP});
    req.user=req.user;
    next()
}
const resentOtp=async (req,res,next)=>{
    try {
      const email=req.query.email;
      const user=await userModel.findOne({email:email})
      const generatedOTP = mail.generateOTP();
      await mail.sendOTPByEmail(email, generatedOTP);
      await userModel.findByIdAndUpdate(user._id,{otp:generatedOTP});
      res.json({sended:"true"})
    } catch (error) {
      console.log(error);
      res.json({sended:false})
    }
    
}

const sendOtpAgain=async (req,res,next)=>{
  try {
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
  } catch (error) {
    next(error)
  }
}

const sendOtpForLogIn=async (req,res,next)=>{
  try {
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
  } catch (error) {
    next(error)
  }
}
  
const verifyEmailShow=async (req, res) => {
  res.render('verifyOtp',{email:req.user.email});
};
const verifyEmailShowAgain=async (req, res) => {
  res.render('verifyOtp',{email:req.user.email,messageS:"Verify Your Email!"});
};

const verifyEmail=async (req,res,next)=>{
    try{
        const {_id,otp,email}=await userModel.findOne({email:req.body.email});
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
    }catch(error){
      next(error)
    }
  } 


const homePage=async (req,res,next)=>{
  try{
    req.session.checkOut=false;
    req.session.orderConfirmed=false;
    const products=await productModel.find({deleted:false}).limit(9);
    const products2 = await productModel
                          .find({ deleted: false })
                          .sort({ salesCount: -1 }) 
                          .limit(2);

    const {images}=await bannerModel.findOne()
    const message=req.query.message;
    if(message){
      res.render('homePage',{products,products2,messageS:message,banners:images})
    }else{
      res.render('homePage',{products,products2,banners:images})
    }
  }catch(err){
    next(err)
  }
}



const allProducts=async (req,res,next)=>{
  try {
    const brand=await req.brand;
    const page=await req.page;
    const name=await req.name;
    const totalDocuments=await req.totalDocuments;
    const products=await req.products;
    const categories=await categoryModel.find({deleted:false})
    res.render("allProducts",{products,brand,categories,page,totalDocuments,name:name?name:false})
  } catch (error) {
    next(error)
  }
}


const productDetailed = async (req, res,next) => {
  try {
    const id = req.query.id;
    const userId=req.session._id;
    const user = await userModel.findOne({ _id:userId });
    const wish = user?.wishlist.includes(id);
    const product = await productModel.findOne({
      $and: [
        { _id: id },
      ]
    }).populate("category");
    let averageRating = null;
    if(product){
      averageRating = product.rating.averageRating;
    }
    if (product) {
      res.render("detailedProduct", { products: req.products, product, wishlist: wish ,moment,averageRating});
    } else {
      res.render("detailedProduct", { products: req.products, product: null, wishlist: wish ,moment,averageRating});
    }
  } catch (error) {
    next(error)
  }
};


const profile=async(req,res,next)=>{
  try {
    req.session.checkOut=false;
    const id=req.session._id
    const addresses=await addressModel.find({userId:id})
    const user=await userModel.findOne({_id:id})
    res.render('profile',{user,addresses})
  } catch (error) {
    next(error)
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

const editProfileShow=async(req,res,next)=>{
  try {
    const id=req.session._id
    const user=await userModel.findOne({_id:id})
    res.render('editProfile',{user})
  } catch (error) {
    next(error)
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
    next(error)
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


const changePasswordShow=async(req,res,next)=>{
  try {
    res.render("changePassword")
  } catch (error) {
    console.log(error);
    next(error)
  }
}
const checkPasswordNewPassword=async(req,res,next)=>{
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
    console.log(error);
    res.send("Error while changing password"+error)
  }
}

const addAddressShow=async(req,res,next)=>{
  try {
    res.render('addAddress');
  } catch (error) {
    next(error)
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


const updateDefaultAddress=async (req,res,next)=>{
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

const editAddressShow = async (req, res,next) => {
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
    next(error)
  }
};



const editAddress = async (req, res) => {
  try {
    const contactNew = req.query.contact;
    const addressNew = req.query.address;
    const addressId = req.query.addressId;
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


const deleteAddress=async (req,res,next)=>{
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
    next(error)
  }
}


const checkOutShow = async (req, res,next) => {
  try {
    if (req.session.orderConfirmed) {
      return res.redirect('/user/cart/');
    }
    const id = req.session._id;
    req.session.checkOut = id;
    const address = await addressModel.findOne({ userId: id, default: true });
    const user = await userModel.findOne({ _id: id });
    const email=user.email;
    await user.updateCartPrices();
    await user.populate('cart.items.product');
    const total = user.cart.totalPrice;
    const message = req.query.message;
    if (message) {
      res.render('checkOut', { address, email, products: user.cart.items, total, grandTotal: total, message, user });
    } else {
      res.render('checkOut', { address, email, products: user.cart.items, total, grandTotal: total, user });
    }
  } catch (error) {
    next(error)
  }
};

const insertMessage = async (data) => {
  try {
    await chatModel.create({ message: data.message });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
  checkOutShow,
  insertMessage,
  detailedUser,
  resentOtp
}