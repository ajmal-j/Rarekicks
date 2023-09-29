const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const bodyparser=require('body-parser');
const connect=require("./config/dbConnect")
const PORT=process.env.PORT||5000
const userRoutes=require('./routes/userRoutes')
const adminRoutes=require('./routes/adminRoutes')
connect()
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))

app.set('view engine','ejs');
app.use('/public',express.static("public"));

app.use("/user",userRoutes)
app.use("/admin",adminRoutes)


app.get("/",(req,res)=>{
    res.send("hello")
})



































app.listen(PORT,()=>{console.log(`Server running :http://localhost:${PORT}`)})