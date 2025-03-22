const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentSchema");
const Blog = require("../models/blogSchema");

async function addComment(req, res) {
    const {id}=req.params;
    const creator=req.user;
    const {comment}=req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }
        if(!comment){
            return res.status(400).json({
                messsage:"Please enter the comment",
            })
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(400).json({
                success:false,
                message:"This blog does not exist",
            }) 
        }

        //create comment
        const createComment=await Comment.create({
            comment:comment,
            blog:id,
            user:creator,
        }).then((comment)=>{
            return comment.populate({
                path:"user",
                select:"name email"
            })
        })        
        console.log(createComment)
        await Blog.findByIdAndUpdate(id,{$push:{comments:createComment._id}});
        return res.status(200).json({
            success:true,
            message:"comment added successfully",
            newComment:createComment
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

async function deleteComment(req, res) {
    const {id}=req.params;
    const userId=req.user;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const comment=await Comment.findById(id).populate({
            path:"blog",
            select:"creator",
        });
        if(!comment){
            return res.status(400).json({
                messsage:"comment not found",
            })
        }
        console.log(userId,comment,comment.user,comment.blog.creator);

        if(comment.user!=userId && comment.blog.creator!=userId){
            return res.status(401).json({
                success:false,
                message:"You are not authorized to delete this comment"
            })
        }
        await Blog.findByIdAndUpdate(comment.blog._id,{$pull:{comments:id}});
        await Comment.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"comment deleted successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

async function editComment(req,res) {
    const {id}=req.params;
    const userId=req.user;
    const updateComment=req.body.comment;

    console.log(updateComment)
    console.log(userId)
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const comment=await Comment.findById(id);
        if(!comment){
            return res.status(400).json({
                messsage:"Comment is not found",
            })
        }

        if(comment.user!=userId){
            return res.status(400).json({
                messsage:"You are not authorized to edit this comment",
            })         
        }
        comment.comment=updateComment || comment.comment;
       
        await comment.save();
        console.log(comment)
        return res.status(200).json({
            messsage:"comment edit successfully",
        })
        
    } catch (error) {
        return res.status(200).json({
            messsage:error.message
        })
    }
}

async function likeComment(req, res) {
    const {id}=req.params;
    const creator=req.user;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }

        const comment=await Comment.findById(id);
        if(!comment){
            return res.status(400).json({
                success:false,
                message:"This comment does not exist",
            })
        }
        // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoia2FyYW5AZ21haWwuY29tIiwiaWQiOiI2N2M1ZjE3OTdkOTI1YTJjNGYzNTY1MjAifSwiaWF0IjoxNzQxMDI1NjU3fQ.88T8ZtwX7Oa7XX43oJ73aahqKfaC6BlU1p2qq652aA8"
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoidmFuc2hAZ2FtaWwuY29tIiwiaWQiOiI2N2M1ZjI1NjdkOTI1YTJjNGYzNTY1MzMifSwiaWF0IjoxNzQxMDI1ODc4fQ.Mb3FFO9fJdUQPVDvSti1nNMJ_pKLSOYy9mnpTNW7H1Y

        if(!(comment.likes.includes(creator))){
            await Comment.findByIdAndUpdate(id,{$push:{likes:creator}});
            return res.status(200).json({
                message:"comment liked successfully"
            })
        }
        else{
            await Comment.findByIdAndUpdate(id,{$pull:{likes:creator}});
            return res.status(200).json({
                message:"comment disliked successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {
    addComment,
    deleteComment,
    editComment,
    likeComment
}