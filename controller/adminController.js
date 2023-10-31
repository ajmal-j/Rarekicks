const adminModel=require("../models/adminModel")
const bannerModel=require("../models/bannerModel")
const productModel=require("../models/productModel")
const userModel=require("../models/userModel")
const couponModel=require("../models/couponModel")
const orderModel=require("../models/orderModel")
const salesModel=require("../models/salesModel")
const category=require("../models/categoryModel")
const jwt=require("jsonwebtoken");
const moment=require("moment")
const categoryModel = require("../models/categoryModel")

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
        req.session.admin_id=check._id;
        res.redirect("/admin/dashBoard")
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
    req.session.admin_id=false;
    res.render("adminLogin",{email:"",message:"Successfully logged out"});
  } catch (error) {
    res.end("Error While LogIn",error)
  }
}

const bannerManagement=async(req,res)=>{
  try {
    const {images}=await bannerModel.findOne()
    // console.log(images);
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
    const {code,discount,date,min,max}=req.query;
    const cod=code.toUpperCase().trim()
    const disc=discount.toUpperCase().trim()
    
    const exist = await couponModel.findOne({ $or: [{ code:cod }, {discountPercentage:disc }] });
    if(exist){
      return res.json({added:"exist"})
    }
    const minimumAmount=parseInt(min)
    const maximumAmount=parseInt(max)
    const data={
      code:code,
      discountPercentage:discount,
      validUpTo: new Date(date),
      minimumAmount,
      maximumAmount
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
      const {code,discountPercentage,validUpTo,minimumAmount,maximumAmount}=await couponModel.findOne({_id:id})
      res.render('editCoupon',{code,discountPercentage,id,validUpTo,minimumAmount,maximumAmount})
    }
  } catch (error) {
    console.log(error);
  }
}
                

const editCoupon = async (req, res) => {
  try {
    const { code, discount, id ,date,min,max} = req.query;
    const cod=code.toUpperCase().trim()
    const disc=discount.toUpperCase().trim()
    const existingCoupon = await couponModel.findOne({
      $and: [{ _id: { $ne: id } }, { $or: [{ code:cod }, { discountPercentage: disc }] }],
    });
    if (existingCoupon) {
      return res.json({ added: "exist" });
    }
    const minimumAmount=parseInt(min)
    const maximumAmount=parseInt(max)
    // console.log(minimumAmount,maximumAmount)

    await couponModel.findByIdAndUpdate(id, { code, discountPercentage: discount,validUpTo: new Date(date),minimumAmount,maximumAmount});
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
    let xValues=[];
    let yValues=[];
    let description=[];
    try {
      const result = await orderModel.aggregate([
        {
          $group: {
            _id: {
              method: "$payment.method",
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.method",
            description: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
      ]);
      
      
      result.map(item => {
        xValues.push(item._id);
        let count=0;
        const descriptions = item.description.map(desc => {
          count+=desc.count;
          return `${desc.status}: ${desc.count}`;
        });
        description.push([descriptions.join(' , ')]);
        const total=(()=>{
          return count.toString()
        })()
        yValues.push(total)
      });
      // console.log(xValues,description,yValues);
      
  } catch (error) {
      console.error("Error in aggregation:", error);
  }
  const topProducts = await productModel.find({}).sort({ salesCount: -1 }).limit(4);
  const salesWeekly = await salesModel
  .find({type:'Weekly'}, { _id: 1, date: 1 })
  .sort({ _id: -1 })
  const salesMonthly = await salesModel
  .find({type:'Monthly'}, { _id: 1, date: 1 })
  .sort({ _id: -1 })
  res.render("dashBoard",{totalOrders,orderPending,totalUsers,orderCompleted,totalSales,total,xValues,yValues,topProducts,data:description,salesWeekly,salesMonthly})
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
      
      // console.log(result);
    
      
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
          $match: {
            status: "Delivered"
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
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
          },
        },
        {
          $sort: { year: 1, month: 1  },
        },
      ]);
      
      // console.log(result)
      for (const data of result) {
        if(data.year===Number(year)){
          x.push(data.month);
          y.push(data.totalOrders);
        }
      }
      // console.log(x,y);
    } catch (error) {
      console.error(error);
    }
    
    res.send({get:true,x,y})
  } catch (error) {
    console.log(error);
  }
}




const getByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let x=[];
    let y=[];
    try {
      result = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: "$status",
            totalOrders: { $sum: 1 },
          },
        },
      ]);

    } catch (error) {
      console.error(error);
    }
    for (const data of result) {
        x.push(data._id)
        y.push(data.totalOrders)
    }
    
    res.send({ get: true, x,y });
  } catch (error) {
    console.log(error);
  }
};





const salesByCategory=async (req,res)=>{
  try {
    let x=[];
    let y=[];
    const result = await orderModel.aggregate([
      { $unwind: "$products.items" },
      {
        $lookup: {
          from: 'products',  // Assuming your product model is named 'products'
          localField: 'products.items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {$group:{_id:"$productDetails.category",total:{$sum:1}}}
    ]);
    for (const item of result){
      const {name}=await category.findById(item._id[0])
      x.push(name);
      y.push(item.total)
    }
    res.json({get:true,x,y})
  } catch (error) {
    console.log(error);
  }
}


const weeklySales = async () => {
  try {
    const currentDate = moment();
    const startOfThisWeek = currentDate.clone().subtract(1, 'week').startOf('week');
    const endOfThisWeek = currentDate.clone().subtract(1, 'week').endOf('week');
    const formattedStartDate = moment(startOfThisWeek).format('YYYY-MM-DD');
    const formattedEndDate = moment(endOfThisWeek).format('YYYY-MM-DD');

    const dateRange = `${formattedStartDate}-${formattedEndDate}`;

    const orders = await orderModel.find({
      createdAt: {
        $gte: startOfThisWeek,
        $lt: endOfThisWeek
      }
    }).populate('products.items.product');
    
    const sales = await orderModel.find({
      createdAt: {
        $gte: startOfThisWeek,
        $lt: endOfThisWeek
      },
      status: "Delivered"
    }).populate('products.items.product');
    

  // orders.forEach(order=>{
  //   order.products.items.forEach(product=>{
  //   // console.log(product);
  //   })
  // })
  const totalOrders=orders.length;
  const successfulOrders=sales.length;
  let totalSales=0;
  let totalRevenue=0;
  let paymentMethods=[];
  let categories=[];
  let products=[];

  for (const order of sales) {
    const amount = parseFloat(order.payment.amount);
    const usedFromWallet = parseFloat(order.usedFromWallet);
    totalRevenue += (amount + usedFromWallet);
    
    const existingPaymentMethod = paymentMethods.find(method => method.method === order.payment.method);
    if (existingPaymentMethod) {
      existingPaymentMethod.count += 1;
    } else {
      paymentMethods.push({ method: order.payment.method, count: 1 });
    }
  
    for (const product of order.products.items) {
      const { name } = await categoryModel.findById(product.product.category);
      totalSales += product.quantity;
      const existingCategory = categories.find(category => category.id === product.product.category._id);
      if (existingCategory) {
        existingCategory.count += 1;
        existingCategory.sales += product.quantity;
      } else {
        categories.push({
          id: product.product.category._id,
          category: name,
          count: 1,
          sales: product.quantity
        });
      }
      const id=product.product._id
      const existingProduct = products.find(product => product.id === id );
      if(existingProduct){
        existingProduct.sales+=product.quantity;
        existingProduct.count+=1;
        existingProduct.revenue+=product.price;
      }else{
        products.push({
          id: product.product._id,
          sales: product.quantity,
          count: 1,
          revenue: product.price,
          })
      }
    }
  }
  const data={
    date:dateRange,
    type:"Weekly",
    totalOrders,
    totalSales,
    totalRevenue,
    paymentMethods,
    categories,
    products,
    successfulOrders,
  }
  const newSales= await salesModel.create(data)
  newSales.save()
  // console.log(newSales)

  } catch (error) {
    console.log(error);
  }
};

const monthlySales = async () => {
  try {
    const startOfThisMonth = moment().startOf('month').toDate();
    const endOfThisMonth = moment().endOf('month').toDate();
    const formattedStartDate = moment(startOfThisMonth).format('YYYY-MM-DD');
    const formattedEndDate = moment(endOfThisMonth).format('YYYY-MM-DD');

    const dateRange = `${formattedStartDate}-${formattedEndDate}`;

    const orders = await orderModel.find({
      createdAt: {
        $gte: startOfThisMonth,
        $lt: endOfThisMonth
      }
    }).populate('products.items.product');
    
    const sales = await orderModel.find({
      createdAt: {
        $gte: startOfThisMonth,
        $lt: endOfThisMonth
      },
      status: "Delivered"
    }).populate('products.items.product');
    

  // orders.forEach(order=>{
  //   order.products.items.forEach(product=>{
  //   // console.log(product);
  //   })
  // })
  const totalOrders=orders.length;
  const successfulOrders=sales.length;
  let totalSales=0;
  let totalRevenue=0;
  let paymentMethods=[];
  let categories=[];
  let products=[];

  for (const order of sales) {
    const amount = parseFloat(order.payment.amount);
    const usedFromWallet = parseFloat(order.usedFromWallet);
    totalRevenue += (amount + usedFromWallet);
    
    const existingPaymentMethod = paymentMethods.find(method => method.method === order.payment.method);
    if (existingPaymentMethod) {
      existingPaymentMethod.count += 1;
    } else {
      paymentMethods.push({ method: order.payment.method, count: 1 });
    }
  
    for (const product of order.products.items) {
      const { name } = await categoryModel.findById(product.product.category);
      totalSales += product.quantity;
      const existingCategory = categories.find(category => category.id === product.product.category._id);
      if (existingCategory) {
        existingCategory.count += 1;
        existingCategory.sales += product.quantity;
      } else {
        categories.push({
          id: product.product.category._id,
          category: name,
          count: 1,
          sales: product.quantity
        });
      }
      const id=product.product._id
      const existingProduct = products.find(product => product.id === id );
      if(existingProduct){
        existingProduct.sales+=product.quantity;
        existingProduct.count+=1;
        existingProduct.revenue+=product.price;
      }else{
        products.push({
          id: product.product._id,
          sales: product.quantity,
          count: 1,
          revenue: product.price,
          })
      }
    }
  }
  const data={
    date:dateRange,
    type:"Monthly",
    totalOrders,
    totalSales,
    totalRevenue,
    paymentMethods,
    categories,
    products,
    successfulOrders,
  }
  const newSales= await salesModel.create(data)
  newSales.save()
  // console.log(newSales)

  } catch (error) {
    console.log(error);
  }
};


const customDates = async (req,res) => {
  try {
    const inputDates=await req.body
    function convertToISOString(dateString) {
        const date = new Date(dateString);
        return date;
    }
    const start = convertToISOString(inputDates.startDate);
    const end = convertToISOString(inputDates.endDate);
    const formattedStartDate = moment(start).format('YYYY-MM-DD');
    const formattedEndDate = moment(end).format('YYYY-MM-DD');

    const dateRange = `${formattedStartDate}-${formattedEndDate}`;

    const orders = await orderModel.find({
      createdAt: {
        $gte: start,
        $lt: end
      }
    }).populate('products.items.product');
    
    const sales = await orderModel.find({
      createdAt: {
        $gte: start,
        $lt: end
      },
      status: "Delivered"
    }).populate('products.items.product');
    

  // orders.forEach(order=>{
  //   order.products.items.forEach(product=>{
  //   // console.log(product);
  //   })
  // })
  const totalOrders=orders.length;
  const successfulOrders=sales.length;
  let totalSales=0;
  let totalRevenue=0;
  let paymentMethods=[];
  let categories=[];
  let products=[];

  for (const order of sales) {
    const amount = parseFloat(order.payment.amount);
    const usedFromWallet = parseFloat(order.usedFromWallet);
    totalRevenue += (amount + usedFromWallet);
    
    const existingPaymentMethod = paymentMethods.find(method => method.method === order.payment.method);
    if (existingPaymentMethod) {
      existingPaymentMethod.count += 1;
    } else {
      paymentMethods.push({ method: order.payment.method, count: 1 });
    }
  
    for (const product of order.products.items) {
      const { name } = await categoryModel.findById(product.product.category);
      totalSales += product.quantity;
      const existingCategory = categories.find(category => category.id === product.product.category._id);
      if (existingCategory) {
        existingCategory.count += 1;
        existingCategory.sales += product.quantity;
      } else {
        categories.push({
          id: product.product.category._id,
          category: name,
          count: 1,
          sales: product.quantity
        });
      }
      const id=product.product._id
      const existingProduct = products.find(product => product.id === id );
      if(existingProduct){
        existingProduct.sales+=product.quantity;
        existingProduct.count+=1;
        existingProduct.revenue+=product.price;
      }else{
        products.push({
          id: product.product._id,
          product:product,
          sales: product.quantity,
          count: 1,
          revenue: product.price,
          })
      }
    }
  }
  const data={
    date:dateRange,
    type:"Selected-Period",
    totalOrders,
    totalSales,
    totalRevenue,
    paymentMethods,
    categories,
    products,
    successfulOrders,
  }
  const newSales= await salesModel.create(data)
  await newSales.populate('products.id')
  newSales.save()

  res.render("salesData",{data:newSales})
  } catch (error) {
    console.log(error);
  }
};

const renderPage=async (req,res)=>{
  try {
    const id=await req.query.id;
    const data=await salesModel.findById(id).populate("products.id")
    res.render('salesData',{data})
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
  getByYear,
  salesByCategory,
  weeklySales,
  monthlySales,
  customDates,
  renderPage,
  getByDateRange
}