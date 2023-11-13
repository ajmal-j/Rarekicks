const jwt=require("jsonwebtoken");
const userModel=require("../models/userModel")
const checkJwt=async (req,res,next)=>{
    const token=await req.cookies.userToken;
    const id=req.session._id
    const user=undefined;
    if(id){
        user=await userModel.findById(id);
    }
    try {
        if(user&&user.isBlocked){
            res.clearCookie("userToken");
            res.render("userLogin",{email:"",message:"You'r Blocked By The Admin.!"});
        }
        else if(req.session._id){
            const user= jwt.verify(token,process.env.JWT_SECRET);
            req.user=user;
            next(); 
        }else{
            res.clearCookie("userToken");
            res.render("userLogin",{email:"",message:"Authorization Required!"});
        }
    } catch (error) {
        console.log(error)
        res.clearCookie("userToken");
        res.render("userLogin",{email:"",message:"Authorization Required!"});
    }
}

const checkJwtAdmin=async (req,res,next)=>{
    const token=await req.cookies.adminToken;
    try {
        const user= jwt.verify(token,process.env.JWT_SECRET);
        req.user=user;
        next();
    } catch (error) {
        res.clearCookie("adminToken");
        req.session.admin_id=false;
        res.render("adminLogin",{email:'',message:"Authorization Required!"});
    }
}


module.exports={checkJwt,checkJwtAdmin};