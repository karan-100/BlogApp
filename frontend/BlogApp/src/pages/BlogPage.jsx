import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom'
import { addSelectedBlog, changeLikes, removeSelectedBlog } from '../utils/selectedBlogSlice';
import Comments from '../components/Comments';
import { setIsOpen } from '../utils/commentSlice';
// import jwt from "jsonwebtoken"

const BlogPage = () => {
    const { blogId: id } = useParams();

    // const user=JSON.parse(localStorage.getItem("user"));
    // const token=JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();

    const { token, email, id: userId } = useSelector((state) => state.user);
    const { likes,comments } = useSelector((state) => state.currentBlog);
    const { isOpen } = useSelector((state) => state.commentShow);

    const [blogData, setBlogData] = useState(null);
    const [isLike, setLike] = useState(false);
    // const [likes,setLikes]=useState();

    // const location = useLocation();

    async function fetchBlogById() {
        try {
            let { data: { blog } } = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
            setBlogData(blog);
            // setLikes(blog.likes.length)
            console.log(blog)

            // like 
            if (blog.likes.includes(userId)) {
                setLike(true);
            }

            dispatch(addSelectedBlog(blog));
        }
        catch (error) {
            // toast.error(error?.response?.data?.message || "Something went wrong!");
            console.log(error)
        }
    }
    useEffect(() => {
        fetchBlogById()
        return () => {
            // console.log("Hello:",window.location.pathname);  //current route
            // console.log(location.pathname);// Previous route
            dispatch(setIsOpen(false))
            if (window.location.pathname != `/edit/${id}`) {
                dispatch(removeSelectedBlog());
            }
        }
    }, [id])

    async function handleLike() {
        if (token) {
            setLike(prev => !prev);
            // /blogs/like/:id
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData.blogId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            // console.log(res);

            dispatch(changeLikes(userId));

            // if(res.data.isLike){
            //     setLikes(prev=>prev+1)
            // }
            // else{
            //     setLikes(prev=>prev-1)
            // }
            toast.success(res.data.message);
        }
        else {
            toast.error("Please login/signup first");
        }
    }
    return (
        <div className='flex flex-col p-6 max-w-[75%]'>

            {
                blogData ?
                    <div className='border-2 p-10 w-[70%] h-screen mx-auto flex flex-col gap-2'>
                        <h1 className='mt-2 font-bold text-3xl'>{blogData.title}</h1>
                        <h2 className='font-semibold'>{blogData.creator.name}</h2>
                        <img src={blogData.image} alt="" />
                        <div>
                            <p>{blogData.description}</p>
                        </div>
                        {
                            token && email === blogData.creator.email &&
                            <Link to={"/edit/" + id}>
                                <button className='bg-[#4D55CC] p-3 w-[20%] rounded-xl text-white mt-[2rem]'>
                                    Edit</button>
                            </Link>
                        }

                        <div className='flex gap-4'>
                            <div >
                                {
                                    isLike ? <i onClick={handleLike} className="fi fi-ss-heart text-3xl text-pink-500"></i> :
                                        <i onClick={handleLike} className="fi fi-rs-heart text-3xl"></i>
                                }
                                <p className='ml-2.5 text-xl'>{likes.length}</p>
                            </div>
                            <div>
                                <i onClick={()=>dispatch(setIsOpen())} className="fi fi-sr-comment-smile text-3xl"></i>
                                <p className='ml-2.5 text-xl'>{comments.length}</p>
                            </div>
                        </div>

                        {isOpen && <div className='fixed bg-white shadow-2xl top-0 right-0 w-[25rem] drop-shadow-2xl' >
                            <Comments />
                        </div>}
                    </div> : <div><h1>Loading...</h1></div>
            }

        </div>

    )
}

export default BlogPage