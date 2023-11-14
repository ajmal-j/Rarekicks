const express=require("express")
const app=express()
require('dotenv').config();
const bodyparser=require('body-parser');
const {connect}=require("./config/dbConnect")
const PORT=process.env.PORT||5000
const path=require('path')
const userRoutes=require('./routes/userRoutes')
const onConnection=require('./socket/chat')
const adminRoutes=require('./routes/adminRoutes')
const downloads=require('./routes/downloads')
const chatRouter=require('./routes/socketRoutes')
const cookieparser=require('cookie-parser')
const MongoStore = require('connect-mongo');
const session=require("express-session");
const mongoose=require("mongoose")
const ejs = require('ejs');
const cron = require('node-cron');
const cors=require('cors')
const adminController=require('./controller/adminController');
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use(cookieparser());
app.set('view engine','ejs');
app.use('/public',express.static("public"));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
  
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

const servers=app.listen(PORT,()=>{console.log(`Server running :http://localhost:${PORT}`)})

app.use("/user",userRoutes)
app.use("/admin",adminRoutes)
app.use("/downloads",downloads)
app.use("/chatBot",chatRouter)

const io=require('socket.io')(servers);
io.on('connection',onConnection)

connect()

app.get("/",(req,res)=>{
    res.redirect("/user/home")
})
app.get("/user",(req,res)=>{
    res.redirect("/user/login")
})
app.get("/admin",(req,res)=>{
    res.redirect("/admin/dashBoard")
})

cron.schedule('0 0 * * 0', adminController.weeklySales);
cron.schedule('0 0 1 * *', adminController.monthlySales);

app.get("*",(req,res)=>{
    res.status(404).render('user/404',{url:req.url})
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500)
    try {
        res.sendFile(path.join(__dirname, '/views/user/errorPage.html'));
    } catch (error) {
        res.redirect('back');
    }
});
