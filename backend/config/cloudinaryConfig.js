const cloudinary=require('cloudinary').v2;
require("dotenv").config();

async function cloudinaryConfig(){
    try {
        await cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: CLOUDINARY_API_KEY, 
            api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
        });
        console.log('Cloudinary Configured');
    } catch (error) {
        console.log(error.message);

    }
}

module.exports=cloudinaryConfig;