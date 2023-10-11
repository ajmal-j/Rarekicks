const Product=require("../models/productModel")
const multer=require("multer");
const path=require("path")
const fs = require('fs');
const category=require("../models/categoryModel");
const mongoose=require("mongoose");
const { log } = require("console");
const productModel = require("../models/productModel");
const product = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const { json } = require("express");
const { type } = require("os");


function deleteImage(filename) {
    try{
        const v=__dirname
        const parentDir = path.dirname(v);
        const imagePath = path.join(parentDir,'public','productImages', filename);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Image ${filename} deleted successfully.`);
        } else {
            console.log(`Image ${filename} not found.`);
        }
    }catch(err){
        res.send(err)
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

const addProduct= async (req,res)=>{
    try{
        if(req.query.message){
            const categories = await category.find({deleted:false})
            res.render("addProduct",{categories:categories,message:req.query.message})
        }else if(req.query.messageS){
            const categories = await category.find({deleted:false})
            res.render("addProduct",{categories:categories,messageS:req.query.messageS})
        }else{
            const categories = await category.find({deleted:false})
            res.render("addProduct",{categories:categories,message:''})
        }
    }catch(err){
        res.send("error")
    }
}

const insertProduct =async (req,res)=>{
    const images =await req.files.map(file => file.filename);
    try {
        const productData= new Product({
            name:req.body.name.trim(),
            price:req.body.price.trim(),
            sizes:req.body.sizes,
            quantity:req.body.quantity.trim(),
            category:req.body.category.trim(),
            description:req.body.description.trim(),
            brand:req.body.brand.trim(),
            images:images,
        })
        await productData.save();
        res.redirect("/admin/addProduct?messageS=Product Added")
    }catch(err){
        deleteImages(images)
        console.log(err)
        res.redirect("/admin/addProduct?message=Product Already Found")
    }
}

const getProductAdmin=async(req,res,next)=>{
    try {
        const products=await Product.find().populate("category");
        // console.log(products)
        req.products=products;
        // console.log(products)
        next()
        }   
    catch(err){
        res.json(err)
    }
}
const getProduct=async(req,res,next)=>{
    try {
        const products=await Product.find({deleted:false}).populate("category");
        // console.log(products)
        req.products=products;
        // console.log(products)
        next()
        }   
    catch(err){
        res.json(err)
    }
}
const getBrand=async(req,res,next)=>{
    try {
        const branded=await req.query.brand;
        const products = await Product.find({
            $and: [
              { brand: branded },
              { deleted: false }
            ]
          });
          
        // console.log(products)
        req.products=products;
        req.brand=branded
        // console.log(products)
        next()
        }   
    catch(err){
        res.json(err)
    }
}

const editProductShow=async (req,res)=>{
    try{
        const id=await req.query.id.trim();
        const product=await Product.findOne({_id:id}).populate("category")
        const categories=await category.find({ name: { $ne:product?.category?.name  } })
        res.render("editProduct",{product,categories})
    }catch(err){
        console.log(err)
    }
}

const editProduct=async (req,res)=>{
    const id=await req.query.id
    const product=await Product.findById(id)
    const imagesFull = product.images;
    const imageD = Array.isArray(req.body.selectedImages) ? req.body.selectedImages : [];
    const images = req.files ? req.files.map(file => file.filename) : [];
    const lastImage = imagesFull.filter(value => !imageD.includes(value));
    const combinedArray = images.concat(lastImage);
            try {
                if(imageD){
                    deleteImages(imageD)
                }
                if(images){
                    const details={
                    name:req.body.name.trim(),
                    price:req.body.price.trim(),
                    quantity:req.body.quantity.trim(),
                    category:req.body.category,
                    description:req.body.description.trim(),
                    brand:req.body.brand,
                    sizes:req.body.sizes,
                    images:combinedArray,
                    }
                    await Product.findByIdAndUpdate(id,details)
                    res.redirect("/admin/home")
                }else{
                    const details={
                        name:req.body.name.trim(),
                        price:req.body.price.trim(),
                        quantity:req.body.quantity.trim(),
                        category:req.body.category,
                        description:req.body.description.trim(),
                        brand:req.body.brand,
                        images:lastImage,
                        }
                    await Product.findByIdAndUpdate(id,details)
                    res.redirect("/admin/home")
                }
            }
            catch(err){
                const id=await req.query.id.trim();
                const product=await Product.findOne({_id:id}).populate("category")
                const categories=await category.find({ name: { $ne:product?.category?.name  } })
                res.render("editProduct",{product,categories,message:"Product Already Exist!"})
            }

}



const deleteProduct=async (req,res)=>{
    try{
    const id=req.query.id;
    const {deleted}=await Product.findById(id);
    if(deleted===false){
        await Product.findByIdAndUpdate(id,{deleted:true})
        // res.redirect("/admin/viewUsers")
      }else if(deleted===true){
        await Product.findByIdAndUpdate(id,{deleted:false})
        // res.redirect("/admin/viewUsers")
      }
    }
    catch(err){
        res.send(err)
    }
}

const deleteProductCompletely = async (req, res) => {
    try {
        const productId = req.query.id;

        // Find the product
        const product = await Product.findOne({ _id: productId });

        // Check if the product exists
        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Find users with the product in their cart or wishlist
        const users = await userModel.find({
            $or: [
                { 'cart.items.product': productId },
                { wishlist: productId },
            ],
        });

        // Remove the product from each user's cart and wishlist
        await Promise.all(users.map(async (user) => {
            user.cart.items = user.cart.items.filter(item => !item.product.equals(productId));
            user.wishlist = user.wishlist.filter(wishlistProductId => !wishlistProductId.equals(productId));
            await user.save();
        }));

        // Delete the product
        const images = product.images;
        deleteImages(images);
        await Product.findByIdAndDelete(productId);

        // Redirect to admin home
        res.redirect("/admin/home/");
    } catch (err) {
        res.status(500).send(err.message || "Internal Server Error");
    }
};



const searchProduct=async (req,res)=>{
    const search=await req.query.search||"";
    try{
      const products=await Product.find({name:new RegExp(search.trim(),"i")}).exec();
      products?res.render("adminHome",{products:products,search}):res.redirect("admin/home");
      }
      catch(err){
      res.send("Error occurred")
      }
}

const searchProductUser=async (req,res)=>{
    const search=await req.query.search||"";
    try{
        const products=await Product.find({$and:[{name:new RegExp(search.trim(),"i")},{deleted:false}]}).exec();
        res.render("allProducts",{products,search})
    }
    catch(err){
        res.send("Error occurred")
        }
    }


  const  createCategory = async (req, res) => {
    try {
        const checkName= req.body.name.toLowerCase().trim();
        const check=await categoryModel.findOne({name:checkName})
        if(check){
            const categories=await category.find()
            res.render("category",{message:"Category Aldready exist!",categories})
        }else{
            const newcategory = new category({
                name:req.body.name.toLowerCase(),
                description:req.body.description});
            await newcategory.save();
            // console.log(newcategory)
        }
    } catch (err) {
      if (err.code === 11000) {
        res.send("not added");
      } else {
        // If some other error occurred
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
  




  
const checkCategory=async (req,res)=>{
    const id=req.query.id;
    const check=await categoryModel.findOne({name:id})
    if(check){
        return res.json({exists:true})
    }else{
        return res.json({exists:false})
    }
}



const createCategoryShow = async (req, res) => {
    const categories=await category.find()
      res.render('category',{categories});
};


const editCategoryShow = async (req, res) => {
    const id= await req.query.id
    const categories=await category.findOne({_id:id})
      res.render('editCategory',{categories});
};

const editCategory= async (req, res) => {
    const id= await req.query.id
    const name=req.body.name.toLowerCase().trim()
    console.log(name)
    const check= await categoryModel.findOne({name:name});
    const self= await categoryModel.findById(id);
    if(!check){
        const data={
            name:req.body.name.trim(),
            description:req.body.description.trim()
        }
        await category.findByIdAndUpdate(id,data)
        res.redirect("/admin/createCategory")
    }else if(self.name===name&&name!==check.name){
        const data={
            name:req.body.name.trim(),
            description:req.body.description.trim()
        }
        await category.findByIdAndUpdate(id,data)
        res.redirect("/admin/createCategory")
    } else {
        const categories=await category.findOne({_id:id})
        res.render('editCategory',{categories,message:"Category Already Exist!"});
    }
    };


const deleteCategory= async (req, res) => {
    const id= await req.query.id
    const {deleted}=await categoryModel.findById(id)
    if(deleted===false){
        await categoryModel.findByIdAndUpdate(id,{deleted:true})
        // res.redirect("/admin/viewUsers")
      }else if(deleted===true){
        await categoryModel.findByIdAndUpdate(id,{deleted:false})
        // res.redirect("/admin/viewUsers")
      }
    // await category.findByIdAndUpdate()
    // const categories=await categoryModel.find()
    // res.render('category',{categories});
};

const deleteCategoryCompletly= async (req, res) => {
    const id= await req.query.id
    await category.findByIdAndDelete(id)
    // const categories=await categoryModel.find()
    // res.render('category',{categories});
    res.redirect("/admin/createCategory/")
};



const brandBased=async (req,res)=>{
    try {
        const aggregate = await productModel.aggregate([
            {
              $group: {
                _id: '$brand',
                products: {
                  $push: {
                    _id: '$_id',
                    name: '$name',
                    price: '$price',
                    images: '$images'
                  }
                }
              }
            }
          ]);
        //   res.json(aggregate)
        res.render("brandBased",{datas:aggregate});
    } catch (error) {
        console.log(error,+ " " + "aggregate")
        res.end(error+"While Aggregate")
    }
}

const brandBasedAdmin=async (req,res)=>{
    try {
        const aggregate = await productModel.aggregate([
            {
                $group: {
                    _id: '$brand',
                    products: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            price: '$price',
                            images: '$images',
                            quantity: '$quantity',
                            sizes: '$sizes',
                            description: '$description',
                            category: '$category',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'categories', 
                    localField: 'products.category',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            {
                $unwind: '$products',
            },
            {
                $addFields: {
                    "products.category": {
                        $arrayElemAt: [
                            "$categoryData",
                            { $indexOfArray: [ "$categoryData._id", "$products.category" ] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    products: {
                        $addToSet: { 
                            _id: '$products._id',
                            name: '$products.name',
                            price: '$products.price',
                            images: '$products.images',
                            quantity: '$products.quantity',
                            sizes: '$products.sizes',
                            description: '$products.description',
                            category: '$products.category',
                        },
                    },
                },
            },
        ]);
        //   res.json(aggregate)
        res.render("brandBasedAdmin",{brandsData :aggregate });
    } catch (error) {
        console.log(error,+ " " + "aggregate")
        res.end(error+"While Aggregate")
    }
}


const wishlist=async(req,res)=>{
    try {
        const userId=await req.session._id;
        const productId=req.query.id;
        console.log(productId);
        const user=await userModel.findById(userId);
        const userWishlist=user.wishlist
        if(user){
            const product=userWishlist.includes(productId)
            if(product){
                await userModel.findByIdAndUpdate(userId, {
                    $pull: { wishlist: productId }
                });
                return res.json({added:false})
            }else{
                await userModel.findByIdAndUpdate(userId, {
                    $push: { wishlist: productId }
                });
                return res.json({added:true})
            }
        }else{
            return res.json({added:false,message:true})
        }
    } catch (error) {
        res.send(error)
    }
}

const wishlistShow=async(req,res)=>{
    try {
        const id=await req.session._id;
        const user=await userModel.findOne({_id:id}).populate({
                        path: 'wishlist',
                        populate: {
                            path: 'category',
                            model: 'category'
                        }
                    });
        if(user){
            const products=user.wishlist;
            console.log(products);
            res.render("wishlist",{products})
        }else{
            res.render("wishlist",{products:false,message:"Error while Loading wishlist!"})
        }
    } catch (error) {
        res.send(error)
    }
}



const cartShow = async (req, res) => {
    try {
        const id = await req.session._id;
        const user = await userModel
            .findOne({ _id: id })
            .populate({
                path: 'cart.items.product',
                model: 'product',
                populate: {
                    path: 'category',
                    model: 'category',
                },
            });

        // Use map with Promise.all to handle asynchronous operations
        const updatePromises = user.cart.items.map(async (item) => {
            if (item.product.quantity === 0) {
                await userModel.findByIdAndUpdate(id, {
                    $pull: {
                        'cart.items': { product: item.product._id },
                    },
                }, { new: true });
            }
        });

        // Wait for all promises to complete
        await Promise.all(updatePromises);

        // Fetch the user again to get the updated cart
        const updatedUser = await userModel
            .findOne({ _id: id })
            .populate({
                path: 'cart.items.product',
                model: 'product',
                populate: {
                    path: 'category',
                    model: 'category',
                },
            });

            await updatedUser.save();

        res.render("cart", { products: updatedUser.cart.items, total: updatedUser.cart.totalPrice });
    } catch (error) {
        console.error(error);
        res.send(error);
    }
};


const removeFromCart=async(req,res)=>{
    try {
        const userId = await req.session._id;
        const productId=await req.query.id;
        let updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $pull: {
                    'cart.items': {
                        _id: productId
                    }
                }
            },
            { new: true } // Return the modified document
        );
        
        // Call save to trigger pre save middleware
        updatedUser = await updatedUser.save();

        console.log(updatedUser)
        return res.json({removed:false,total:updatedUser.cart.totalPrice})
        // res.render("cart",{products:updatedUser.cart.items})
    } catch (error) {
        res.send(error)
    }
}

const decreaseQuantity=async (req,res)=>{
    try {
        const userId = await req.session._id;
        const productId=await req.query.id;
        const user=await userModel.findOne({_id:userId})
        const updatedQuantity = user.cart.items.find(item => item._id.equals(productId)).quantity;
        if(updatedQuantity===1){
            return res.json({updated:"minimum"})
        }
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId, 'cart.items._id': productId },
            {
                $inc: {
                    'cart.items.$.quantity': -1 
                }
            },
            { new: true } 
        );
        await updatedUser.save(); // Save the changes
        const product = updatedUser.cart.items.find(item => item._id.toString() === productId);
        return res.json({updated:false,price:product.price,total:updatedUser.cart.totalPrice})
    } catch (error) {
        res.send(error)
    }
}

const increaseQuantity=async (req,res)=>{
    try {
        const userId = await req.session._id;
        const productId=await req.query.id;
        const user=await userModel.findOne({_id:userId})
        const updatedQuantity = user.cart.items.find(item => item._id.equals(productId));
        const {quantity}= await productModel.findById(updatedQuantity.product)
        if(quantity===updatedQuantity.quantity||quantity>=updatedQuantity.quantity){
            return res.json({updated:"stock"})
        }
        if(updatedQuantity.quantity===5){
            return res.json({updated:"maximum"})
        }
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId, 'cart.items._id': productId },
            {
                $inc: {
                    'cart.items.$.quantity': 1 
                }
            },
            { new: true }
        );
        await updatedUser.save(); // Save the changes
        const product = updatedUser.cart.items.find(item => item._id.toString() === productId);
        return res.json({updated:false,price:product.price,total:updatedUser.cart.totalPrice})
    } catch (error) {
        res.send(error)
    }
}

const cart = async (req, res) => {
    try {
        const userId = await req.session._id;
        const productId = req.query.id;
        const newSize = req.query.size;
        const addSize = Number(newSize);

        if (isNaN(addSize)) {
            return res.json({ added: 'size' });
        } else {
            const user = await userModel.findById(userId);

            if (user) {
                const isProductInCart = user.cart.items.some(item => 
                    item.product.toString() === productId && item.size === addSize
                );
                if (isProductInCart) {
                    // const updatedUser = await userModel.findOneAndUpdate(
                    //     { _id: userId },
                    //     {
                    //         $pull: {
                    //             'cart.items': {
                    //                 product: productId
                    //             }
                    //         }
                    //     },
                    //     { new: true } // Return the modified document
                    // );
                    return res.json({ added:"already" });
                } else {
                    // Add a new item to the cart
                    const product = await productModel.findById(productId);

                    if (!product) {
                        return res.status(404).json({ added: false, message: 'Product not found' });
                    }

                    const { price } = product;

                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        {
                            $push: {
                                'cart.items': {
                                    product: productId,
                                    size: newSize,
                                    quantity: 1,
                                    price: price
                                }
                            }
                        },
                        { new: true } // Return the modified document
                    );
                    await updatedUser.save();
                    return res.json({ added: true,total:updatedUser.cart.totalPrice });
                }
            } else {
                return res.json({ added: false, message });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

const getCount=async(req,res)=>{
    try {
      const user=await userModel.findOne({_id:req.session._id})
      const wishCount=user.wishlist.length
      const cartCount=user.cart.items.length
      return res.json({wishCount,cartCount})
    } catch (error) {
      console.log(error);
    }
  }


module.exports=
    {addProduct,
    insertProduct,
    upload,
    getProduct,
    editProductShow,
    editProduct,
    deleteProduct,
    searchProduct,
    createCategory,
    createCategoryShow,
    editCategoryShow,
    editCategory,
    deleteCategory,
    searchProductUser,
    getBrand,
    brandBased,
    brandBasedAdmin,
    deleteCategoryCompletly,
    deleteProductCompletely,
    getProductAdmin,
    checkCategory,
    wishlist,
    wishlistShow,
    cartShow,
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    getCount
}  