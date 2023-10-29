const jwt=require("jsonwebtoken");

const checkJwt=async (req,res,next)=>{
    const token=await req.cookies.userToken;
    try {
        if(req.session._id){
            const user= jwt.verify(token,process.env.JWT_SECRET);
        req.user=user;
        next(); 
        }else{
            res.clearCookie("userToken");
            res.render("userLogin",{email:"",message:"Authorization Required!"});
        }
    } catch (error) {
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

const checkBlocked=async (req,res)=>{
    
}

module.exports={checkJwt,checkJwtAdmin};