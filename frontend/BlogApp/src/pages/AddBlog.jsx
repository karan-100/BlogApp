import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { removeSelectedBlog } from '../utils/selectedBlogSlice';

const AddBlog = () => {

    // const token = localStorage.getItem('token');
    const {token}=useSelector((slice=>slice.user))
    console.log(token);
    const {id}=useParams();
    console.log(id)
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        image: null
    });
    console.log(typeof(blogData.image))
    const navigate = useNavigate()
    const {title,description,image}=useSelector((slice)=>slice.currentBlog)
    const dispatch=useDispatch();
    
    async function handleUpdateBlog(e){
        e.preventDefault();

        try {
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blogs/`+id, blogData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            // console.log(res.data);
            toast.success(res.data.message);
            navigate('/');
        } catch (error) {
            // console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }
    }

    async function handleBlogData(e) {
        e.preventDefault();
        
        try {

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs`, blogData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            // console.log(res.data);
            toast.success(res.data.message);
            navigate('/');
        } catch (error) {
            // console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }

    };

    async function fetchBlogById() {
            // try {
            //     let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
            //     setBlogData({
            //         title:res.data.blog.title,
            //         description:res.data.blog.description,
            //         image:res.data.blog.image
            //     })
                
                
            // }
            // catch (error) {
            //     toast.error(error.response.data.message);
            //     console.log(error.response.data.message)
            // }


            setBlogData({
                        title:title,
                        description:description,
                        image:image
                    })

        }
        useEffect(() => {
            fetchBlogById();
            if(!id){
                return ()=>{
                    dispatch(removeSelectedBlog());
                }
            }
        }, [id])
    

    return token == null ? (
        <Navigate to="/signup" />
    ) : (
        <div className='w-[60%] h-[100%] m-2 flex flex-col mx-auto border-2 p-6'>
            <label htmlFor="title">Title</label>
            <br /><br />
            <input
            className='p-5'
                type="text"
                name="title"
                placeholder="Blog Title"
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                value={blogData.title}
            />
            <br /><br />
            <label htmlFor="description">Description</label>
            <br /><br />
            <input
               className='p-5'
                type="text"
                name="description"
                placeholder="Blog Description"
                onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                value={blogData.description}
            />
            <br /><br />
            <div className='w-[50%] h-[40%]'>
                <label htmlFor="image">
                   {
                    blogData.image? <img src={typeof(blogData.image)=="string"?blogData.image: URL.createObjectURL(blogData.image)} alt="image" />:
                    <div className='bg-slate-400 aspect-video flex items-center justify-center rounded-xl w-[100%] h-[100%]'>
                    <h1 className='text-white bg-gray-700 p-1 rounded-xl'>Upload Image</h1>
                </div>
                   }
                </label>
                <input
                    className="hidden"
                    id='image'
                    type="file" name="image"
                    accept='.png,.jpeg,.jpg'
                    onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })}
                />
            </div>
            <br /><br />
            <button onClick={id ? handleUpdateBlog:handleBlogData} className='bg-[#4D55CC] p-3 w-[20%] rounded-xl text-white'>{id ? "Update Blog":"Publish"}</button>
        </div>
    );
};

export default AddBlog;
