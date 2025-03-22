const mongoose=require("mongoose");
const User = require("./userSchema");

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required : true,
    },
    description:String,
    draft:{
        type: Boolean,
        default:false,
    },
    image:{
        type:String,
        required:true
    },
    blogId:{
        type:String,
        required:true,
        unique:true,
    },
    imageId:{
        type:String,
        required:true
    },
    creator:{
        // user
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }]
},{timestamps:true});


const Blog=new mongoose.model("Blog",blogSchema);

module.exports=Blog;