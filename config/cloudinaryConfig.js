require('dotenv').config();
const multer=require("multer");
const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

const deleteImagesFromCloudinary = async (imageUrls) => {
    try {
        if(imageUrls.length===0){
            return
        }
        const publicIds = imageUrls.map(getImagePublicId);
        await cloudinary.api.delete_resources(publicIds, 
            { type: 'upload', resource_type: 'image' });
        console.log('Images deleted successfully');
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        throw error; 
    }
};

const getImagePublicId = (imageUrl) => {
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0]; 
    return publicId;
};



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});


const upload = multer({ storage: storage });


module.exports={
    upload,
    deleteImagesFromCloudinary
}