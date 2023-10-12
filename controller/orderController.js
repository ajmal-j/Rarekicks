const userModel=require('../models/userModel')
const productModel=require('../models/productModel')
const addressModel=require('../models/addressModel');
const orderModel = require('../models/orderModel');

const testData = async (req, res) => {
    try {
        console.log("yes");
        const orderId = req.query.id;
        const order = await orderModel.findById(orderId)
            .populate({
                path: 'products.items.product',
            });
            console.log(order.products.items[0]);

        // const items = order.products.items.map(item => {
        //     const product = item.product;
        //     return {
        //         product: {
        //             "$oid": product._id.toString(),
        //             name: product.name, // Replace with the actual field name in your product schema
        //             images: product.images, // Replace with the actual field name in your product schema
        //         },
        //         quantity: item.quantity,
        //         size: item.size,
        //         price: item.price,
        //         _id: {
        //             "$oid": item._id.toString(),
        //         },
        //     };
        // });

        res.json({ products:order.products.items });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};



const placeOrderCOD=async (req,res)=>{
    try {
        const userId=req.session._id;
        req.session.checkOut=false;
        const {cart,email}=await userModel.findById(userId);
        const total=cart.totalPrice;
        if(cart.totalPrice===0){
            return res.redirect('/user/home')
        }
        let grandTotal;
        let checkOutOffer;
        if (total >= 20000) {
        checkOutOffer='20%'
        grandTotal = total * 0.8; 
        } else if (total >= 15000) {
        checkOutOffer='15%'
        grandTotal = total * 0.85; 
        } else {
        checkOutOffer='None'
        grandTotal = total;
        }
        const currentAddress=await addressModel.findOne({userId:userId,default:true})
        if(!currentAddress){
            return res.redirect('/user/checkOut?message=Please Add A Address')
        }
        const payment={
            method:'cash on delivery',
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

        const offer=checkOutOffer;

        const newOrder = new orderModel({
            userId: userId,
            payment: payment,
            address: address,
            products: product,
            offer: offer,
        });
        newOrder.save()
            .then(async savedOrder => {
                console.log('Order saved successfully:', savedOrder);
                for (const item of savedOrder.products.items) {
                    const productId = item.product._id;
                    const orderedQuantity = item.quantity;
                    await productModel.findByIdAndUpdate(productId, {
                        $inc: { quantity: -orderedQuantity } 
                    });
                }

                const order = await orderModel.findById(savedOrder._id)
                .populate({
                    path: 'products.items.product',
                });

                await userModel.findByIdAndUpdate(userId, { $unset: { cart: 1 } });
                req.session.orderConfirmed=true;
                res.render('orderConfirmation',{products:order.products.items,total:grandTotal.toFixed(2)})
            })
            .catch(error => {
                console.error('Error saving order:', error);
                res.redirect('/user/home?message=Order Not Placed')
        });

    } catch (error) {
        console.log(error);
    }
}


const orderShow = async (req, res) => {
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
        res.render("orders", { orders: allOrders });
    } catch (error) {
        console.log(error);
    }
};

const orderDetailed = async (req, res) => {
    try {
        const id = req.session._id;
        const orderId=req.query.id;
        const order=await orderModel.findById(orderId).populate({
            path: 'products.items.product',
        });
        res.render("orderDetailed", { order });
    } catch (error) {
        console.log(error);
    }
};

const allOrders = async (req, res) => {
    try {
        const allOrders = await orderModel.find();
        const orders = await Promise.all(
            allOrders.map(async (item) => {
                return await orderModel.findById(item._id).populate({
                    path: 'products.items.product',
                });
            })
        );

        console.log(orders.length);
        // res.json({ orders });
        const completeOrders=orders.reverse();
        res.render("allOrders",{allOrders:completeOrders})
    } catch (error) {
        res.json({ error });
        console.log(error);
    }
};

const orderDetailedAdmin = async (req, res) => {
    try {
        const orderId=req.query.id;
        const order=await orderModel.findById(orderId).populate({
            path: 'products.items.product',
        });
        const user=await userModel.findById(order.userId)
        const total=await orderModel.find({userId:user._id})
        res.render("orderDetailed", { order,user,total:total.length });
    } catch (error) {
        console.log(error);
    }
};


const cancelOrder=async (req,res)=>{
    try {
        const orderId=await req.query.id;
        const {isCancelled,status}=await orderModel.findById({_id:orderId});
        if(status==="shipped"){
           return res.json({cancelled:"shipped"})
        }else if(isCancelled===true){
            return res.json({cancelled:"already"})
        }else{
            await orderModel.findByIdAndUpdate({_id:orderId},{isCancelled:true,status:"cancelled"});
            return res.json({cancelled:true})
        }
    } catch (error) {
        console.log(error);
        return res.json({cancelled:false})
    }
}


module.exports={
    placeOrderCOD,
    testData,
    orderShow,
    orderDetailed,
    allOrders,
    orderDetailedAdmin,
    cancelOrder
}