const userModel=require('../models/userModel')
const { ObjectId } = require('mongodb');
const productModel=require('../models/productModel')
const addressModel=require('../models/addressModel');
const couponModel=require('../models/couponModel');
const orderModel = require('../models/orderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mail =require('../public/jsFiles/mail')
const moment = require('moment');
const { error } = require('console');
require('dotenv').config();  
  

async function sendCoupon(email){
   const randomDoc = await couponModel.aggregate([{ $sample: { size: 1 } }]);
   if(randomDoc.length>0){
    const couponCode=randomDoc[0].code;
    mail.sendCoupon(email,couponCode)
   }
}


function generateShortID() {
    const objectId = new ObjectId(); 
    const timestamp = new Date().getTime().toString(); 
    const objectIdSuffix = objectId.toString().slice(-3);
    const timestampSuffix = timestamp.slice(-3);
    const shortID = objectIdSuffix + timestampSuffix;
    return shortID;
}
const placeOrderCOD=async (req,res,next)=>{
    try {
        const userId=req.session._id;
        req.session.checkOut=false;
        req.session.orderConfirmed=false
        const {cart,email,wallet}=await userModel.findById(userId);
        const total=cart.totalPrice;
        if(cart.totalPrice===0){
            return res.redirect('/user/home')
        }
        const couponCode=req.query.code;
        let discount=1;
        let grandTotal=total;
        let discountedPercentage="none";
        let couponApplied="none"
        if(couponCode){
            const coupon=await couponModel.findOne({ code: couponCode, isActive: true })
            if(coupon!==null){
            couponApplied=coupon.code;
            discountedPercentage=coupon.discountPercentage;
            discount=coupon.discountPercentage/100;
            grandTotal=total-(total*discount).toFixed(2)
            }
        }
        let usedFromWallet=0;
        const walletUsed=req.query.wallet;
        if (walletUsed === "true") {
            const balance = parseInt(wallet.balance);
            const deductionAmount = grandTotal > balance ? balance : grandTotal;
            const remainingWalletBalance = balance - deductionAmount;
            grandTotal -= deductionAmount;
            usedFromWallet=deductionAmount;
            await userModel.findByIdAndUpdate(userId, {
                $inc: {
                    'wallet.balance': -deductionAmount,
                    'wallet.used': deductionAmount
                }
            });
        }
        const orderId= generateShortID();
        const currentAddress=await addressModel.findOne({userId:userId,default:true})
        if(!currentAddress){
            return res.redirect('/user/checkOut?message=Please Add A Address')
        }
        const payment={
            method:'cash on delivery',
            amount:grandTotal,
        }
        
        const address={
            name:currentAddress.name,
            country:currentAddress.country,
            state:currentAddress.state,
            contact:currentAddress.contact,
            pinCode:currentAddress.pinCode,
            address:currentAddress.address,
            landmark:currentAddress.landmark,
            city:currentAddress.city,
            email:email
        }

        const product={
            items:cart.items,
            totalPrice:total
        }

        const offer=discountedPercentage;

        const newOrder = new orderModel({
            userId: userId,
            payment: payment,
            address: address,
            offer:offer,
            products: product,
            usedFromWallet:usedFromWallet,
            couponApplied:couponApplied,
            orderId:orderId,
        });
        newOrder.save()
            .then(async savedOrder => {
                // console.log('Order saved successfully:', savedOrder);
                
                for (const item of savedOrder.products.items) {
                    const productId = item.product._id;
                    const orderedQuantity = item.quantity;
                    await productModel.findByIdAndUpdate(productId, {
                        $inc: { quantity: -orderedQuantity ,salesCount:orderedQuantity} 
                    });
                }
                await userModel.findByIdAndUpdate(userId, {
                    $unset: { cart: 1 }
                  });
                req.session.orderConfirmed=true;
                sendCoupon(email)
                res.json({data:true,orderId:savedOrder._id})
                // res.render('orderConfirmation',{products:order.products.items,total:total.toFixed(2)})
            })
            .catch(error => {
                console.error('Error saving order:', error);
                res.redirect('/user/home?message=Order Not Placed')
        });

    } catch (error) {
        next(error)
    }
}



const showConfirmOrder=async (req,res,next)=>{
    try {
        const id=req.query.id;
        const order = await orderModel.findById(id)
                .populate({
                    path: 'products.items.product',
                });
                if(order){
                    const grandTotal=order.payment.amount
                    res.render('orderConfirmation',{products:order.products.items,total:grandTotal.toFixed(2),id:order._id})   
                }else{
                    throw new Error("Order not found");
                }
    } catch (error) {
        next(error)
    }
}




const placeOrderOnline=async (req,res,next)=>{
    try { 
        req.session.orderConfirmed=false
        const userId=req.session._id;
        const {cart,email,wallet}=await userModel.findById(userId);
        const total=cart.totalPrice;
        if(cart.totalPrice===0){
            return res.redirect('/user/home')
        }
        const couponCode=req.query.code;
        let discount=1;
        let grandTotal=total;
        let discountedPercentage="none";
        let couponApplied="none"
        if(couponCode){
            const coupon=await couponModel.findOne({ code: couponCode, isActive: true })
            if(coupon!==null){
            couponApplied=coupon.code;
            discountedPercentage=coupon.discountPercentage;
            discount=coupon.discountPercentage/100;
            grandTotal=total-(total*discount).toFixed(2)
            }
        }
        const currentAddress=await addressModel.findOne({userId:userId,default:true})
        if(!currentAddress){
            return res.json({address:true})
        }

        const walletUsed=req.query.wallet;
        if (walletUsed === "true") {
            const balance = parseInt(wallet.balance);
            const deductionAmount = grandTotal > balance ? balance : grandTotal;
            const remainingWalletBalance = balance - deductionAmount;
            grandTotal -= deductionAmount;
        }
       
        const payment={
            method:'online payment',
            amount:grandTotal.toFixed(2),
        }
   
        var razorpay = new Razorpay({
            key_id: process.env.RAZOR_ID,
            key_secret: process.env.RAZOR_KEY_SECRET
        })
            console
            const razorpayorder = await razorpay.orders.create({
                amount: payment.amount * 100,
                currency: 'INR',
                receipt: userId.toString()
            })

            res.json({
                orderId: razorpayorder.id,
                keyId: process.env.RAZOR_ID,
                razorpayorder:JSON.stringify(razorpayorder),
                userId:userId
            });

    } catch (error) {
        console.log(error);
        res.json({error})
    }
}




const confirmOrderOnline=async (req,res,next)=>{
    try {
        if(req.session.orderConfirmed){
            return res.redirect('/user/cart/')
        }
        const {paymentId,orderId,signature,razorpayorder,code,response}=req.body
        const razorKeySecret = process.env.RAZOR_KEY_SECRET;
        const dataToHash = `${orderId}|${paymentId}`;
        const generated_signature  = crypto.createHmac('sha256', razorKeySecret).update(dataToHash).digest('hex');
        if (generated_signature == signature) {
            const userId=req.session._id;
            req.session.checkOut=false;
            const {name,cart,email,wallet,orderedByReferral,referredBy}=await userModel.findById(userId);
            const total=cart.totalPrice;
            if(cart.totalPrice===0){
                return res.redirect('/user/home')
            }
            let discount=1;
            let grandTotal=total;
            let discountedPercentage="none";
            let couponApplied="none";
            if(code){
                const coupon=await couponModel.findOne({ code: code, isActive: true })
                if(coupon!==null){
                couponApplied=coupon.code;
                discountedPercentage=coupon.discountPercentage;
                discount=coupon.discountPercentage/100;
                grandTotal=total-(total*discount).toFixed(2)
                }
            }
            let usedFromWallet=0;
            const walletUsed=req.body.wallet;
            if (walletUsed === true) {
                const balance = parseInt(wallet.balance);
                const deductionAmount = grandTotal > balance ? balance : grandTotal;
                const remainingWalletBalance = balance - deductionAmount;
                grandTotal -= deductionAmount;
                usedFromWallet=deductionAmount;
                await userModel.findByIdAndUpdate(userId, {
                    $inc: {
                        'wallet.balance': -deductionAmount,
                        'wallet.used': deductionAmount
                    }
                });
            }
            const uniqueID= generateShortID();
            const currentAddress=await addressModel.findOne({userId:userId,default:true})
            const payment={
                method:'online payment',
                amount:grandTotal.toFixed(2),
            }
            const address={
                name:currentAddress.name,
                country:currentAddress.country,
                state:currentAddress.state,
                contact:currentAddress.contact,
                pinCode:currentAddress.pinCode,
                address:currentAddress.address,
                landmark:currentAddress.landmark,
                city:currentAddress.city,
                email:email
            }

            const product={
                items:cart.items,
                totalPrice:total
            }
            
            const parsedRazorpayOrder = JSON.parse(
                razorpayorder.replace(/&quot;/g, '"').replace(/&#34;/g, '"')
            );
            
            const paymentDetails = {
                receipt: parsedRazorpayOrder.receipt,
                status: parsedRazorpayOrder.status,
                createdAt: parsedRazorpayOrder.created_at,
                paymentId:paymentId,
                orderId:orderId,
            };

            const onlineOrder = new orderModel({
                userId: userId,
                payment: payment,
                address: address,
                products: product,
                offer:discountedPercentage,
                paymentDetails:paymentDetails,
                isPaid:true,
                usedFromWallet:usedFromWallet,
                couponApplied:couponApplied,
                orderId:uniqueID,
            });

            onlineOrder.save()
            .then(async savedOrder => {

                if(orderedByReferral===false){
                    const userReferred=await userModel.findById(referredBy);
                    if(userReferred){
                        if(referralsApplied&&referralsApplied<=3){
                            const {email}=await userModel.findById(referredBy)
                            await userModel.findByIdAndUpdate(referredBy,
                                {$inc:{'wallet.balance':500,'wallet.total':500,referralsApplied:1}}
                                )
                            mail.sendReferralReward(email,name)
                        }
                    }
                }

                for (const item of savedOrder.products.items) {
                    const productId = item.product._id;
                    const orderedQuantity = item.quantity;
                    await productModel.findByIdAndUpdate(productId, {
                        $inc: { quantity: -orderedQuantity ,salesCount:orderedQuantity } 
                    });
                }

                await userModel.findByIdAndUpdate(userId, {
                    $unset: { cart: 1 },
                    $set: { orderedByReferral: true }
                  });
                req.session.orderConfirmed=true;
                sendCoupon(email)
                return res.json({backendResponse:true,orderId:savedOrder._id})
            })
            .catch(error => {
                console.error('Error saving order:', error);
                res.json({response:false})
        });
        }else{
            res.json({backendResponse:false})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({backendResponse:false})
    }
}



const orderShow = async (req, res,next) => {
    try {
        const id = req.session._id;
        const orders = await orderModel.find({ userId: id });

        // Use Promise.all to wait for all the promises to resolve
        const populatedOrders = await Promise.all(
            orders.map(async (order) => {
                const populatedOrder = await orderModel.findById(order._id).populate({
                    path: 'products.items.product',
                });
                return populatedOrder;
            })
        );
        const allOrders=populatedOrders.reverse()
        res.render("orders", { orders: allOrders ,moment});
    } catch (error) {
        next(error)
    }
};

const orderDetailed = async (req, res,next) => {
    try {
        const id = req.session._id;
        const orderId=req.query.id;
        const order=await orderModel.findById(orderId).populate({
            path: 'products.items.product',
        });
        res.render("orderDetailed", { order,moment });
    } catch (error) {
        next(error)
    }
};

const allOrders = async (req, res,next) => {
    try {
        const allOrders = await orderModel.find();
        const orders = await Promise.all(
            allOrders.map(async (item) => {
                return await orderModel.findById(item._id).populate({
                    path: 'products.items.product',
                });
            })
        );
        const completeOrders=orders.reverse();
        res.render("allOrders",{allOrders:completeOrders ,moment})
    } catch (error) {
        res.json({ error });
        next(error)
    }
};

const orderDetailedAdmin = async (req, res,next) => {
    try {
        const orderId=req.query.id;
        const order=await orderModel.findById(orderId).populate({
            path: 'products.items.product',
        });
        const user=await userModel.findById(order.userId)
        if(user){
            const total=await orderModel.find({userId:user._id})
            res.render("orderDetailed", { order,user,total:total.length ,moment});
        }else{
            res.render("orderDetailed", { order,user:false,total:0 ,moment});
        }

    } catch (error) {
        next(error)
    }
};


const cancelOrder=async (req,res,next)=>{
    try {
        const orderId=await req.query.id;
        const id=req.session._id;
        const option=await req.query.option;
        const {isCancelled,status}=await orderModel.findById({_id:orderId});
        const order=await orderModel.findById({_id:orderId});
        if(status==="Shipped"){
           return res.json({cancelled:"shipped"})
        }else if(status==="Out of Delivery"){
            return res.json({cancelled:"Out of Delivery"})
        }
        else if(isCancelled===true){
            return res.json({cancelled:"already"})
        }
        else{
            for (const item of order.products.items) {
                const productId = item.product._id;
                const orderedQuantity = item.quantity;
                await productModel.findByIdAndUpdate(productId, {
                  $inc: { quantity: orderedQuantity ,salesCount:-orderedQuantity },
                });
              }
            await orderModel.findByIdAndUpdate({_id:orderId},{isCancelled:true,status:"Cancelled",reasonForCancellation:option,cancelledDate:new Date()});

            const balanceToReturn=parseInt(order.usedFromWallet)

            if(order.payment.method==="online payment"){
                await userModel.findByIdAndUpdate(id,{$inc:{'wallet.balance':order.payment.amount+balanceToReturn,'wallet.total':order.payment.amount+balanceToReturn}})
            }else{
                await userModel.findByIdAndUpdate(id,{$inc:{'wallet.balance':balanceToReturn,'wallet.total':balanceToReturn}})
            }
            return res.json({cancelled:true})
        }
    } catch (error) {
        console.log(error);
        return res.json({cancelled:false})
    }
}



const returnOrder = async (req, res,next) => {
    try {
    const orderId = await req.query.id;
    const order = await orderModel.findById({ _id: orderId });
    const reason=await req.query.reason;

      if (order.status === "Delivered") {
        if(reason!=="Defective Product"){
            for (const item of order.products.items) {
                const productId = item.product._id;
                const orderedQuantity = item.quantity;
        
                await productModel.findByIdAndUpdate(productId, {
                  $inc: { quantity: orderedQuantity ,salesCount:-orderedQuantity },
                });
              }
        }
        const balanceToReturn=parseInt(order.usedFromWallet)
        await userModel.findByIdAndUpdate(
            { _id: order.userId },
            { $inc: { 'wallet.total': order.payment.amount+balanceToReturn, 'wallet.balance': order.payment.amount+balanceToReturn} }
        );
          
        await orderModel.findByIdAndUpdate({ _id: orderId }, { status: "Returned",returnedDate: new Date(),reasonForReturn:reason});
  
        return res.json({ returned: "yes" });
      }else{
        return res.json({returned:"not"})
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  




const changeStatus=async (req,res,next)=>{
    try {
        const id=req.query.id;
        const status=req.query.status;
        if(status==="Delivered"){
            await orderModel.findByIdAndUpdate(id, {
                status: status,
                deliveredDate: new Date()
              });
        }
        if(status==='Cancelled'){
            await orderModel.findByIdAndUpdate(id,{status:status,isCancelled:true})
            return res.json({changed:true})
        }else{
            await orderModel.findByIdAndUpdate(id,{status:status,isCancelled:false})
            return res.json({changed:true})
        }
    } catch (error) {
        console.log(error);
        return res.json({changed:false})
    }
}

const deleteOrder=async (req,res,next)=>{
    try {
        const id=req.query.id;
        await orderModel.findByIdAndDelete(id);
        return res.json({deleted:true})
    } catch (error) {
        console.log(error);
       return res.json({deleted:false})
    }
}


const editOrdersShow=async (req,res,next)=>{
    try {
        const orderId=req.query.id;
        const order=await orderModel.findOne({_id:orderId})
        res.render("editOrders",{order})
    } catch (error) {
        next(error)
    }
}

const editOrders=async(req,res,next)=>{
    try {
        const orderId=req.query.orderId;
        const address = {
            country: req.query.country,
            state: req.query.state,
            name: req.query.name,
            contact: req.query.contact,
            pinCode: req.query.pinCode,
            address: req.query.address,
            landmark: req.query.landmark,
            city: req.query.city,
            email: req.query.email,
        };
        const payment = {
            method: req.query.paymentMethod,
            amount: req.query.paidAmount,
        };
        const details={
            address:address,
            offer:req.query.offer,
            payment:payment
        }
        if(!orderId||!details||!payment||!address){
            return res.json({updated:false})
        }
        await orderModel.findByIdAndUpdate(orderId,details)
        res.json({updated:true})
    } catch (error) {
        console.log(error);
        res.json({updated:false})
    }
}

const addCoupon=async (req,res,next)=>{
    try {
        const code=req.query.code
        const id=req.session._id;
        const coupon=await couponModel.findOne({code})
        const user=await userModel.findById(id)
        const total=user.cart.totalPrice;
        if(!coupon){
            res.json({added:"not"})
        }else if(coupon.isActive===false){
            res.json({added:"expired"})
        }else if(!isCouponValid(coupon)){
            res.json({added:"expired"})
        }else if((coupon.minimumAmount>0)&&(total<coupon.minimumAmount)){
            res.json({added:"minimum",min:coupon.minimumAmount})
        }else if((coupon.maximumAmount>0)&&(total>coupon.maximumAmount)){
            res.json({added:"maximum",max:coupon.maximumAmount,min:coupon.minimumAmount})
        }else{
            let total=user.cart.totalPrice;
            const discount=total*(coupon.discountPercentage/100);
            const grandTotal=total-(total*(coupon.discountPercentage/100)).toFixed(2)
            return res.json({added:"added",grandTotal,discount,discountPercentage:coupon.discountPercentage})
        }
    } catch (error) {
        console.log(error);
        res.json({added:"not"})
    }
}



function isCouponValid(coupon) {
    const currentDate = new Date();
    const validUpToDate = new Date(coupon.validUpTo);
    return currentDate <= validUpToDate;
}


module.exports={
    placeOrderCOD,
    orderShow,
    orderDetailed,
    allOrders,
    orderDetailedAdmin,
    cancelOrder,
    changeStatus,
    deleteOrder,
    editOrdersShow,
    editOrders,
    placeOrderOnline,
    showConfirmOrder,
    confirmOrderOnline,
    addCoupon,
    returnOrder,
    generateShortID
}