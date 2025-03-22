const { default: mongoose } = require("mongoose");
const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const upload = require("../utils/multer");
const ShortUniqueId=require("short-unique-id")
const fs=require("fs");
const { uploadFiles, deleteFiles } = require("../utils/uploadFiles");

const { randomUUID } = new ShortUniqueId({ length: 10 });

async function createBlog(req, res) {
    try {
        const creator=req.user;
        // console.log(creator)
        // console.log(req.user)
        // if(!req.body.token){
        //     return res.status(400).json({
        //         message: "Please signin first"
        //     })
        // }
        // let isValid=await verifyJWT(req.body.token);
        // if(!isValid){
        //     return res.status(400).json({
        //         message: "invalid token"
        //     })
        // }
        const { title, description, draft ,likes} = req.body;
        const image=req.file;
        console.log(image)
        // console.log(req.body,image)
        if (!title || !description) {
            return res.status(400).json({
                message: "Please fill all fields"
            })
        }
        const findUser=await User.findById(creator);
        
        if(!findUser){
            return res.status(400).json({
                message:"Please sign up first to create a blog"
            })
        }

        //cloudinary

        const {secure_url,public_id}=await uploadFiles(image.path);
        console.log(secure_url);
        fs.unlinkSync(image.path);
        // const blogId=title.toLowerCase().replace(/ +/g,"-");
        let blogId=title.toLowerCase().split(" ").join("-");
        blogId=blogId+"-"+randomUUID();
        const blog = await Blog.create({
            description,
            title,
            draft,
            likes,
            creator,
            image:secure_url,
            imageId:public_id,
            blogId
        })

        const userId=await User.findByIdAndUpdate(creator,{$push:{blogs:blog._id,new:true}});
        // console.log(userId);
        return res.status(200).json({
            message: "Blog created successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

async function getBlogs(req, res) {

    try {
        // const allBlogs = await Blog.find({draft:false}).populate("creator");

        const allBlogs = await Blog.find({draft:false}).populate({
            path:"creator",
            select:"name",
            // select:"-password",
        }).populate({
            path:"likes",
            select:"email name"
        });
        return res.status(200).json({
            message: "Fetched all blogs successfully",
            allBlogs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getBlog(req, res) {
    const { blogId } = req.params;
    const creator=req.user;
    try {

        const blog = await Blog.findOne({blogId}).populate({
            path:"comments",
           
            populate:{
                path:"user",
                select:"name email",
            }

        }).populate({
            path:"creator",
            select:"name email", 

        })
        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found"
            })
        }
        if(blog.draft==false){
            return res.status(200).json({
                success:true,
                message:"blog fetched successfully",
                blog
            })
        }
        else{
            return res.status(400).json({
                message:"You cann't access private blog."
            })
        }
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

async function UpdateBlog(req, res) {

    const {id}=req.params;
    const creator=req.user;
    // console.log(id)
    const image=req.file;
    try {
        
        const {title,description,draft}=req.body;
        // console.log(title,description,draft,image)
        
        const blog=await Blog.findOne({blogId:id});
        if(!blog){
            return res.status(400).json({
                success:false,
                message:"This blog does not exist",
            })
        }
        if(!(creator==blog.creator)){
            return res.status(401).json({
                success:false,
                message:"You are not authorized for this action",
            })
        }

        // const user=await User.findById(creator).select("-password");
        // console.log(user.blogs.find());
        // if(!(user.blogs.find(id))){
        //     return res.status(401).json({
        //         success:false,
        //         message:"You are not authorized for this action",
        //     })
        // }


        // const blog=await Blog.findByIdAndUpdate(id,{title,description,draft},{new:true});
        // console.log(blog);
        // OR 
        if(image){
            await deleteFiles(blog.imageId);
            const {secure_url,public_id}=await uploadFiles(image.path);
            blog.image =secure_url;
            blog.imageId=public_id;
        }

        blog.title=title || blog.title;
        blog.description =description || blog.description;
        blog.draft=draft? true :false;
        // console.log(blog.draft)
        await blog.save();
        return res.status(200).json({
            message:"Blog updated successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

async function deleteBlog(req, res) {
    const {id}=req.params;
    const creator=req.user;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }


        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(400).json({
                success:false,
                message:"This blog does not exist",
            })
        }
        if(!(creator==blog.creator)){
            return res.status(401).json({
                success:false,
                message:"You are not authorized for this action",
            })
        }
        await deleteFiles(blog.imageId);

        const deleteBlog=await Blog.findByIdAndDelete({_id: new mongoose.Types.ObjectId(id)});
        console.log("hello")
        await User.findByIdAndUpdate(creator,{$pull:{blogs:id}});
        return res.status(200).json({
            message:"Blog deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

async function likeBlog(req, res) {
    
    const {id}=req.params;
    console.log(id)
    const creator=req.user;
    console.log(creator)
    try {

        const blog=await Blog.findOne({blogId:id});

        if(!blog){
            return res.status(400).json({
                success:false,
                message:"This blog does not exist",
            })
        }

        if(!(blog.likes.includes(creator))){
 
            await Blog.findOneAndUpdate({blogId:id},{$push:{likes:creator}});

            return res.status(200).json({
                success:true,
                message:"Blog liked successfully",
                isLike:true
            })
        }
        else{
            await Blog.findOneAndUpdate({blogId:id},{$pull:{likes:creator}});
            return res.status(200).json({
                success:true,
                message:"Blog disliked successfully",
                isLike:false,
            })
        }

        // return res.status(200).json({
        //     message:"Blog liked successfully"
        // })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}



module.exports = {
    createBlog,
    getBlog,
    getBlogs,
    UpdateBlog,
    deleteBlog,
    likeBlog,
}