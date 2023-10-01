const productModel=require("../models/productModel")
const multer=require("multer");
const path=require("path")
const fs = require('fs');



function deleteImage(filename) {
    const v=__dirname
      const parentDir = path.dirname(v);
    const imagePath = path.join(parentDir,'public','productImages', filename);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Image ${filename} deleted successfully.`);
    } else {
        console.log(`Image ${filename} not found.`);
    }
}

function deleteImages(deleteImg) {
    deleteImg.forEach((image) => {
      deleteImage(image);
    });
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/productImages');
    },
    filename: function (req, file, cb) {
        console.log(file)
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage: storage });

const addProduct=(req,res)=>{
    try{
        res.render("addProduct")
    }catch(err){
        res.send("error")
    }
}

const insertProduct =async (req,res)=>{
    try {
        const images =await req.files.map(file => file.filename);
        const product={
        name:req.body.name,
        price:req.body.price,
        quantity:req.body.quantity,
        category:req.body.category,
        description:req.body.description,
        brand:req.body.brand,
        images:images,
    }
    await productModel.insertMany([product]);
    res.render("addProduct")}
    catch(err){
        res.send("Error while uploading product to the database!!")
    }
}

const getProduct=async(req,res,next)=>{
    try {const products=await productModel.find();
        req.products=products;
        // console.log(products)
        next()
        }   
    catch(err){
        res.json(err)
    }
}

const editProductShow=async (req,res)=>{
    try{
        const id=await req.query.id;
        const product=await productModel.findOne({_id:id})
        res.render("editProduct",{product})
    }catch(err){
        console.log(err)
    }
}

const editProduct=async (req,res)=>{
    const id=await req.query.id
    const product=await productModel.findById(id)
    const imagesFull=product.images
    const imageD=await req.body.selectedImages
    const images =await req.files.map(file => file.filename);

    console.log(imagesFull);

    if((imageD===undefined)&&((images.length)>=1)){
        const deleteImg=imagesFull.filter(value => !images.includes(value));
        deleteImages(deleteImg)
    }
    let combinedArray;
    // console.log(images)
            try {
                if(imageD){
                    const deleteImg=imagesFull.filter(value => !imageD.includes(value));
                    deleteImg?deleteImages(deleteImg):console.log("no");
                    combinedArray= images.concat(imageD);
                }
                if(images){
                    const value=combinedArray?combinedArray:images;
                    const details={
                    name:req.body.name,
                    price:req.body.price,
                    quantity:req.body.quantity,
                    category:req.body.category,
                    description:req.body.description,
                    brand:req.body.brand,
                    images:value==''?imagesFull:value
                    }
                    await productModel.findByIdAndUpdate(id,details)
                    res.redirect("/admin/home")
                }else{
                    const details={
                        name:req.body.name,
                        price:req.body.price,
                        quantity:req.body.quantity,
                        category:req.body.category,
                        description:req.body.description,
                        brand:req.body.brand,
                        images:imagesFull
                        }
                    await productModel.findByIdAndUpdate(id,details)
                    res.redirect("/admin/home")
                }
            }
                
            catch(err){
                res.send("error")
            }

}



const deleteProduct=async (req,res)=>{
    try{
    const id=req.query.id;
    const product=await productModel.findOne({_id:id});
    const images=product.images;
    deleteImages(images);
    await productModel.findByIdAndDelete(id);
    // res.redirect("/admin/home")
    }
    catch(err){
        res.end(err)
    }
}


module.exports=
    {addProduct,
    insertProduct,
    upload,
    getProduct,
    editProductShow,
    editProduct,
    deleteProduct
}  