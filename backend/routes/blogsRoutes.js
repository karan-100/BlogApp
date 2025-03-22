const express=require("express");
const { createBlog, getBlog, UpdateBlog, deleteBlog,getBlogs,likeBlog } = require("../controller/blogController");
const verifyUser = require("../Middleware/auth");
const { addComment, deleteComment, editComment, likeComment } = require("../controller/commentController");
const upload = require("../utils/multer");
const route=express.Router();

// Blogs route

route.post('/blogs',verifyUser,upload.single("image"),createBlog);

route.get('/blogs/:blogId', getBlog);

route.get('/blogs', getBlogs);

route.put('/blogs/:id',verifyUser,upload.single("image"), UpdateBlog);

route.delete('/blogs/:id',verifyUser, deleteBlog);

route.post('/blogs/like/:id',verifyUser, likeBlog);



route.post('/blogs/comment/:id',verifyUser,addComment);

route.delete('/blogs/comment/:id',verifyUser, deleteComment);

route.put('/blogs/comment/:id',verifyUser, editComment);

route.post('/blogs/likeComment/:id',verifyUser,likeComment);

module.exports=route;