import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOpen } from '../utils/commentSlice';
import axios from 'axios';
import { setComments } from '../utils/selectedBlogSlice';



const Comments = () => {
  const dispatch = useDispatch();
  const [comment,setComment]=useState("");
  const {_id:blogId,comments}=useSelector((state)=>state.currentBlog)
  const {token}=useSelector((state)=>state.user)
  async function handleComment(){
    try {
      let res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
        {
          comment
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log(res.data.newComment);
        dispatch(setComments(res.data.newComment))
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className=' h-screen p-5 overflow-y-scroll'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-medium'>Comments({comments.length})</h1>
        {/* <i onClick={dispatch(setIsOpen(false))} className="text-xl mt-1 fi fi-rr-cross-circle cursor-pointer"></i> */}
        <i onClick={() => dispatch(setIsOpen(false))} className="text-xl mt-1 fi fi-rr-cross-circle cursor-pointer"></i>

      </div>

      <div className='my-4 '>
        <input 
          type="text" 
          placeholder='Comment...' 
          className='drop-shadow-lg w-full p-3 text-lg focus:outline-none'
          onChange={(e)=>setComment(e.target.value)}
        />
      </div >
      <button onClick={handleComment} className='bg-blue-500 p-3 w-[4rem] text-white rounded-xl ml-4'>Add</button>

      <div className='m-4'>
        {
          comments.map(
            (c)=>(
              <div className='flex flex-col p-2 shadow-xl rounded-xl gap-2 mt-2'>
                <div className='flex w-[100%] justify-between'>
                  <div className='flex w-[60%] gap-2 items-center'>
                    <div className='w-[20%]'><img className='rounded-[50%] w-full h-full ' src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.user.name}`} alt="" /></div>
                    <div className='mt-[0%] p-0'>
                      <h2 className='text-[0.9rem]'>{c.user.name}</h2>
                      <p className='text-[0.9rem]'>2 days ago</p>
                    </div>
                  </div>
                  <div className='p-2'>
                    <i class="fi fi-bs-menu-dots"></i>
                  </div>
                </div>
                <div>
                  <p>{c.comment}</p>
                </div>
                <div className='flex justify-between p-2'>
                  <div className='flex justify-between w-[18%]'>
                    <div><i class="fi fi-ss-social-network"></i></div>
                    <div><i class="fi fi-tr-comment-dots"></i></div>
                  </div>
                  <div>
                    <p>reply</p>
                  </div>
                  {/* <div >
                    {
                      true ? 
                      <i 
                        // onClick={handleLike} 
                        className="fi fi-ss-heart text-3xl text-pink-500">
                      </i> :
                      <i 
                        // onClick={handleLike} 
                        className="fi fi-rs-heart text-3xl"></i>
                    }
                    <p className='ml-2.5 text-xl'>{12}</p>
                  </div>
                  <div>
                    <i onClick={()=>dispatch(setIsOpen())} className="fi fi-sr-comment-smile text-3xl"></i>
                    <p className='ml-2.5 text-xl'>{234}</p>
                  </div> */}
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  )
}

export default Comments