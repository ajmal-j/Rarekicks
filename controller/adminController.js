const adminModel=require("../models/adminModel")
const bannerModel=require("../models/bannerModel")
const productModel=require("../models/productModel")
const userModel=require("../models/userModel")
const couponModel=require("../models/couponModel")
const orderModel=require("../models/orderModel")
const category=require("../models/categoryModel")
const jwt=require("jsonwebtoken");
const moment=require("moment")

const home= async(req,res)=>{
    try {
      const products=await req.products;
      const messageS=req.query.messageS
        res.render("adminHome",{products:products,search:false,messageS});
      } catch (error) {
        console.log(error.message);
      }
}
const homeList= async(req,res)=>{
    try {
      const products=await req.products;
      const messageS=req.query.messageS
        res.render("productList",{products:products,search:false,messageS});
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
        res.redirect("/admin/productList")
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

const bannerManagement=async(req,res)=>{
  try {
    const {images}=await bannerModel.findOne()
    console.log(images);
    res.render('bannerManagement',{images:images})
  } catch (error) {
    console.log(error);
    res.send("banner")
  }
}


const couponManagement=async(req,res)=>{
  try {
    const coupons=await couponModel.find()
    res.render('coupon',{coupons})
  } catch (error) {
    console.log(error);
    res.send("Error")
  }
}

const addCoupon=async(req,res)=>{
  try {
    const {code,discount,date}=req.query;
    const cod=code.toUpperCase().trim()
    const disc=discount.toUpperCase().trim()
    
    const exist = await couponModel.findOne({ $or: [{ code:cod }, {discountPercentage:disc }] });
    if(exist){
      return res.json({added:"exist"})
    }
    const data={
      code:code,
      discountPercentage:discount,
      validUpTo: new Date(date)
    }
    const newCoupon = await couponModel.create(data);
    // console.log(newCoupon);
    res.json({added:true})
  } catch (error) {
    console.log(error);
    res.json({added:false})
  }
}


const deleteCoupon=async(req,res)=>{
  try {
    const id=req.query.id;
    await couponModel.findByIdAndDelete(id)
    res.redirect("/admin/couponManagement/")
  } catch (error) {
    console.log(error);
    res.send("Error")
  }
}


const hideCoupon=async (req,res)=>{
  try {
    const id=req.query.id;
    const {isActive}=await couponModel.findById(id)
    if(isActive){
      await couponModel.findByIdAndUpdate(id,{isActive:false})
    }else{
      await couponModel.findByIdAndUpdate(id,{isActive:true})
    }
    res.redirect("/admin/couponManagement/")
  } catch (error) {
    console.log(error);
    res.send("error")
  }
}


const editCouponShow=async (req,res)=>{
  try {
    const id=req.query.id;
    const check=await couponModel.findById(id)
    if(!check){
      return res.redirect("/admin/couponManagement")
    }else{
      const {code,discountPercentage,validUpTo}=await couponModel.findOne({_id:id})
      res.render('editCoupon',{code,discountPercentage,id,validUpTo})
    }
  } catch (error) {
    console.log(error);
  }
}


const editCoupon = async (req, res) => {
  try {
    const { code, discount, id ,date} = req.query;
    const cod=code.toUpperCase().trim()
    const disc=discount.toUpperCase().trim()
    const existingCoupon = await couponModel.findOne({
      $and: [{ _id: { $ne: id } }, { $or: [{ code:cod }, { discountPercentage: disc }] }],
    });
    if (existingCoupon) {
      return res.json({ added: "exist" });
    }
    await couponModel.findByIdAndUpdate(id, { code, discountPercentage: discount,validUpTo: new Date(date)});
    res.json({ added: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ added: false });
  }
};


const dashBoard=async(req,res)=>{
  try {
    const orders=await orderModel.find({status:"Delivered"})
    const totalUsers=await userModel.countDocuments({})
    const total=await orderModel.countDocuments({})
    const orderCompleted=await orderModel.countDocuments({status:"Delivered"})
    const orderPending = await orderModel.countDocuments({
      status: { $nin: ["Delivered", "Returned", "Cancelled"] }
    });
    const totalSalesForEachOrder = orders.map(order => {
      const amount = parseFloat(order.payment.amount);
      const usedFromWallet = parseFloat(order.usedFromWallet);
      return amount + usedFromWallet;
    });
    const totalSales = totalSalesForEachOrder.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    const totalOrders=orders.length;
    let xValues ;
    let yValues ;

    try {
      const result = await orderModel.aggregate([
          { $group: {_id: "$payment.method" , total : {$sum:1}} }
      ]);
      xValues = result.map(item => item._id);
      yValues = result.map(item => {
        const total=item.total
        return total.toString()
      });
      // console.log(xValues,yValues);
  } catch (error) {
      console.error("Error in aggregation:", error);
  }
  const topProducts = await productModel.find({}).sort({ salesCount: -1 }).limit(4);
  // console.log(topProducts);
  res.render("dashBoard",{totalOrders,orderPending,totalUsers,orderCompleted,totalSales,total,xValues,yValues,topProducts})
  } catch (error) {
    console.log(error);
  }
}


const productDetailed=async(req,res)=>{
  try {
    const  id=req.query.id;
    const product=await productModel.findOne({_id:id}).populate("category")
    res.render("productDetailed",{product,moment})
  } catch (error) {
    console.log(error);
  }
}


const getByMonth=async(req,res)=>{
  try {
    const {month}=req.body;
    let x=[];
    let y=[];
    try {
      const result = await orderModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
              status: "$status"
            },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $let: {
                vars: {
                  monthsInString: [, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                },
                in: {
                  $arrayElemAt: ['$$monthsInString', '$_id.month'],
                },
              },
            },
            status: "$_id.status",
            totalOrders: 1,
          },
        },
        {
          $sort: {month: 1 },
        },
      ]);
      
      console.log(result);
    
      
      for (const data of result) {
        if(data.month===month){
          x.push(data.status)
          y.push(data.totalOrders)
        }
      }
    } catch (error) {
      console.error(error);
    }
    res.send({get:true,x,y})
  } catch (error) {
    console.log(error);
  }
}
const getByYear=async(req,res)=>{
  try {
    const {year}=req.body;
    let x=[];
    let y=[];
    try {
      const result = await orderModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
              status: "$status"
            },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $let: {
                vars: {
                  monthsInString: [, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                },
                in: {
                  $arrayElemAt: ['$$monthsInString', '$_id.month'],
                },
              },
            },
            year: '$_id.year',
            totalOrders: 1,
            status: "$_id.status"
          },
        },
        {
          $sort: { year: 1, month: 1  },
        },
      ]);
      
      console.log(result)
      for (const data of result) {
        if(data.year===Number(year)){
          x.push(data.status);
          y.push(data.totalOrders);
        }
      }
      console.log(x,y);
    } catch (error) {
      console.error(error);
    }
    
    res.send({get:true,x,y})
  } catch (error) {
    console.log(error);
  }
}

module.exports={
  login,
  loginValidation,
  home,
  loginToken,
  logout,
  bannerManagement,
  couponManagement,
  addCoupon,
  deleteCoupon,
  hideCoupon,
  editCouponShow,
  editCoupon,
  homeList,
  dashBoard,
  productDetailed,
  getByMonth,
  getByYear
}