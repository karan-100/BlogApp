// Purpose: To upload and delete files from cloudinary.
const cloudinary = require('cloudinary').v2;

async function uploadFiles(imagePath){
    try {

        const result=await cloudinary.uploader.upload(imagePath,{
            folder:"blog_app",
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET,
        });

        return result;

        // console.log(url);
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteFiles(publicId){
    try {
        const result=await cloudinary.uploader.destroy(publicId);
        console.log(result)
        return result;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={uploadFiles,deleteFiles};