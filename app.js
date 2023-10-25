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
const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');



connect()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use(cookieparser());
const secretKey=process.env.SESSION_SECRET;
const server=process.env.CONNECT;
app.use(session({
    secret:secretKey,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ 
        mongoUrl: server,
        mongooseConnection: mongoose.connection, 
    }),
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000
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
    res.redirect("/admin/productList")
})

app.get('/downloadInvoice', async (req, res) => {
    try {
        const id = req.query.orderId;
        const order = await orderModel.findById(id).populate('products.items.product');
        const templatePath = path.resolve(__dirname, './public/template/invoice.ejs');
        const template = fs.readFileSync(templatePath).toString();
        const ejsData = ejs.render(template, {order,moment});
      

        const pdfOptions = {
            format: 'A3',
            border: '10mm',
        };
        const invoiceDirectory = path.resolve(__dirname, '/invoice/');
            if (!fs.existsSync(invoiceDirectory)) {
                fs.mkdirSync(invoiceDirectory);
            }
            const pdfFilePath = path.resolve(invoiceDirectory, `${order.payment.method}.pdf`);
            console.log(pdfFilePath);
            console.log(invoiceDirectory);
        pdf.create(ejsData, pdfOptions).toFile(pdfFilePath, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`PDF generation failed: ${error.message}`);
            }
            console.log('PDF created successfully:', result);
            res.download(pdfFilePath, 'invoice.pdf', (downloadError) => {
                if (downloadError) {
                    console.error(downloadError);
                    return res.status(500).send(`Download failed: ${downloadError.message}`);
                }

                fs.unlinkSync(pdfFilePath);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error: ${error.message}`);
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