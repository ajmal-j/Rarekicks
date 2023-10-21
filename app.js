const express=require("express")
const app=express()
require('dotenv').config();
const bodyparser=require('body-parser');
const connect=require("./config/dbConnect")
const PORT=process.env.PORT||5000
const userRoutes=require('./routes/userRoutes')
const adminRoutes=require('./routes/adminRoutes')
const nodemailer = require('nodemailer');
const cookieparser=require('cookie-parser')
const MongoStore = require('connect-mongo');
const session=require("express-session");
const  mongoose=require("mongoose")
const fs = require('fs');
const moment = require('moment');
const orderModel=require("./models/orderModel")
const easyinvoice = require('easyinvoice');
const { path } = require("pdfkit");


connect()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use(cookieparser());
const secretKey=process.env.SESSION_SECRET;
const server=process.env.CONNECT;
app.use(session({
    secret:"secretKey",
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({ 
        mongoUrl: server,
        mongooseConnection: mongoose.connection, 
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
}));


app.use(function(req, res,next) {
    res.set('Cache-Control', 'no-cache,  no-store ,private , must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
});
app.set('view engine','ejs');
app.use('/public',express.static("public"));


app.use("/user",userRoutes)
app.use("/admin",adminRoutes)


app.get("/",(req,res)=>{
    res.redirect("/user/home")
})
app.get("/user",(req,res)=>{
    res.redirect("/user/login")
})
app.get("/admin",(req,res)=>{
    res.redirect("/admin/home")
})






function getData (order){

  let products = [];
  const off=parseInt(order.offer)
  const wallet=parseInt(order.usedFromWallet)
  const total=parseInt(order.products.totalPrice)
  const offer=isNaN(off)?0:(total*off/100);
  order.products.items.forEach(product => {
      products.push({
          "description":product.product.name,
            "quantity": product.quantity,
            "tax-rate":0,
          "price": product.price
      });
  });
  
    if (wallet > 0) {
        products.push({
            "description": "Used From Wallet",
            "tax-rate":0,
            "quantity": 1,
            "price": -wallet
        });
    }
    if (wallet > 0) {
        products.push({
            "description": "Coupon Discount ",
            "tax-rate":0,
            "quantity": 1,
            "price": -offer 
        });
    }

  const formattedDate = moment(order.createdAt).format('YYYY-MM-DD')
  var data =  {
    "customize": {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
    },
    "images": {
        // The logo on top of your invoice
        "logo": fs.readFileSync('public/images/kn (1).png', 'base64'),
    },
    // Your own data
    "sender": {
        "company": "Rare Kick's",
        "address": "rarekicks0 , pathanamthitta, kerala",
        "zip": "1234AA",
        "city": "Pathanamthitta",
        "country": "India"
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
    },
    // Your recipient
    "client": {
        "company": order.address.name,
        "address":  order.address.address,
        "zip": order.address.pinCode,
        "city": order.address.city,
        "country": order.address.country,
        "state": order.address.state,
        "landmark":order.address.landmark,
    },
    "information": {
        "number": order.orderId,
        "date":formattedDate ,
        "due-date":order.payment.method,
    },
    "products": products,
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Thank You For Purchasing From Rare Kick's",
    // Settings to customize your invoice
    "settings": {
        "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
        // "margin-top": 25, // Defaults to '25'
        // "margin-right": 25, // Defaults to '25'
        // "margin-left": 25, // Defaults to '25'
        // "margin-bottom": 25, // Defaults to '25'
        // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
        // "height": "1000px", // allowed units: mm, cm, in, px
        // "width": "500px", // allowed units: mm, cm, in, px
        // "orientation": "landscape", // portrait or landscape, defaults to portrait
    },
    // Translate your invoice to your preferred language
    "translate": {
        // "invoice": "",  // Default to 'INVOICE'
        "number": "Order Number", // Defaults to 'Number'
        "date": "Ordered Date", // Default to 'Date'
        "due-date": "Payment Method", // Defaults to 'Due Date'
        // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
        // "products": "Producten", // Defaults to 'Products'
        // "quantity": "Aantal", // Default to 'Quantity'
        // "price": "Prijs", // Defaults to 'Price'
        // "product-total": "Totaal", // Defaults to 'Total'
        // "total": "Totaal", // Defaults to 'Total'
    },
  };
  return data
} 


app.get('/downloadInvoice', async (req, res) => {
    try {
        const id=req.query.orderId;
        const order=await orderModel.findById(id).populate('products.items.product')
        const data= getData(order);
        const result = await easyinvoice.createInvoice(data);
        const filePath = 'invoice.pdf';
        await fs.writeFileSync(filePath, result.pdf, 'base64');
        res.download(filePath, 'invoice.pdf', (err) => {
        fs.unlinkSync(filePath);
        if (err) {
            console.error(err);
            return res.status(500).send('Error downloading file');
        }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }

});



app.get("*",(req,res)=>{
    res.status(404).render('user/404',{url:req.url})
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    try {
        console.log("back");
        res.status(500).redirect('back');        
    } catch (error) {
        console.log("home");
        res.status(500).redirect('/user/home/');
    }
});

app.listen(PORT,()=>{console.log(`Server running :http://localhost:${PORT}`)})