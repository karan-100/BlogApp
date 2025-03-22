import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import formatDate from '../utils/formetDate'

const Home = () => {

    const [blogs, setBlogs] = useState([])

    async function fetchBlogs() {
        let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)
        console.log("data:", res.data);
        setBlogs(res.data.allBlogs)
    }
    useEffect(() => {
        fetchBlogs()
    }, [])


    return (
        <div className=' w-[80%]  px-12 max-sm:px-6 max-sm:w-[100%]'>
            {
                
                blogs.map((blog) => (
                    <Link key={blog.blogId} to={"blogs/" + blog.blogId}>
                        <div className='hidden sm:flex border-2 h-60 p-2 w-[70%] mx-auto max-sm:w-[100%] rounded-xl mt-4 max-sm:h-50 '>
                            <div className='w-[100%] h-[100%] p-3 flex flex-col gap-5'>
                                <div>
                                    {/* <img src="" alt="" /> */}
                                    <p>{blog.creator.name}</p>
                                </div>
                                <div className='flex flex-col gap-1 h-[100%]'>
                                    <h2 className='font-bold text-3xl'>{blog.title}</h2>
                                    <p className='line-clamp-2'>{blog.description}</p>
                                </div>
                                <div className='flex gap-4 max-sm:hidden'>
                                    <p>{formatDate(blog.createdAt)}</p>
                                    <p>{blog.likes.length}</p>
                                    <p>{blog.comments.length}</p>
                                </div>
                            </div>
                            <div className='w-[60%]  h-[100%] overflow-hidden rounded-xl border-2 max-sm:w-[100%] '>
                                <img className='h-[100%] w-full' src={blog.image} alt="" />
                            </div>
                        </div>
                        <div className='hidden max-sm:block flex-col border p-4 mt-3 rounded-xl'>
                            <div className='w-[60%]  h-[100%] overflow-hidden rounded-xl border-2 max-sm:w-[100%] '>
                                <img className='h-[100%] w-full' src={blog.image} alt="" />
                            </div>
                            <div className='w-[100%] h-[100%] p-2 flex flex-col'>
                                <div>
                                    {/* <img src="" alt="" /> */}
                                    <p>{blog.creator.name}</p>
                                </div>
                                <div className='flex flex-col gap-1 h-[100%]'>
                                    <h2 className='font-bold text-3xl'>{blog.title}</h2>
                                    <p className='line-clamp-2'>{blog.description}</p>
                                </div>
                                <div className='flex gap-4 mt-2'>
                                    <p>{formatDate(blog.createdAt)}</p>
                                    <p>{blog.likes.length}</p>
                                    <p>{blog.comments.length}</p>
                                </div>
                            </div>
                            
                        </div>
                    </Link>
                ))
            }
            
        </div>
    )
}

export default Home


// {
//     blogs.map((blog) =>
//     (
//        <Link key={blog.blogId} to={"blogs/"+blog.blogId}>
//          <div className='my-5 flex w-[100%]  p-2 h-[28%] shadow-xl rounded-2xl bg-[#EFEFEF]' >
// <div className='w-[180%] h-[100%] p-3 flex flex-col gap-5'>
//     <div>
//         {/* <img src="" alt="" /> */}
//         <p>{blog.creator.name}</p>
//     </div>
//     <div className='flex flex-col gap-1'>
//         <h2 className='font-bold text-3xl'>{blog.title}</h2>
//         <p className='line-clamp-2'>{blog.description}</p>
//     </div>
//     <div className='flex gap-4'>
//         <p>{blog.createdAt}</p>
//         <p>{blog.likes.length}</p>
//         <p>200</p>
//     </div>
// </div>
// <div className='w-[150%]  h-[100%] overflow-hidden rounded-2xl '>
//     <img  className='' src={blog.image} alt="robo-image" />
// </div>
//         </div>
//        </Link>
//     )
//     )
// }