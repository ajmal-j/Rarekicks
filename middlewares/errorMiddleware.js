//not found

const notFound=(req,res,next)=>{
    const error=new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
}

//error handler

const errorHandler=(err,req,res,next)=>{
    const statusCode=re.statusCode==200?500:res.statusCode;
    res.json({
        messege:err?.messege,
        stack:err?.stack,
    });
};

module.exports={errorHandler,notFound}