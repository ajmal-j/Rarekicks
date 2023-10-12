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

app.get("*",(req,res)=>{
    res.status(404).render('user/404',{url:req.url})
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500\tSomething went wrong!');
});

app.listen(PORT,()=>{console.log(`Server running :http://localhost:${PORT}`)})