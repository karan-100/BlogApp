import { useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
const AuthForm = ({type}) => {

    const [userData,setUserData] =useState({
        name:'',
        email:'',
        password:''
    })
    
    // store

    const dispatch=useDispatch()


    async function handleAuthForm(e) {
        e.preventDefault()
        
        try {
            // const response = await fetch(`http://localhost:3000/api/v1/${type}`,{
            //     method:'POST',
            //     body:JSON.stringify(userData),
            //     headers:{
            //         'content-type':'application/json'
            //     },
            // });
            // const data=await response.json();

            // axios 
            const res=await axios.post(`http://localhost:3000/api/v1/${type}`,userData)
            console.log("data:",res);

            // localStorage.setItem('user',JSON.stringify(res.data.user));
            // localStorage.setItem('token',res.data.token);
            dispatch(login(res.data.user))
            if(type=="signin"){
                toast.success(res.data.message);
            }else{
                toast.success(res.data.message);
            }
            
        } catch (error) { 
            console.error("Error:", error); // Log the error for debugging
        
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "An error occurred");
            } else {
                toast.error(error?.message || "Something went wrong");
            }
        }
        
    }
  return (
    <div className='bg-[#211C84] border-2 w-[35%] h-[60%] flex flex-col items-center mt-[5rem] rounded-2xl p-10'>
        <h1 className='text-3xl font-bold  text-white'>{type=="signin"?"Sign in":"Sign up"}</h1>
        <form onSubmit={handleAuthForm} className=' w-[100%] flex flex-col items-center  gap-4 p-8 rounded-2xl'>
            {
                type=="signup" && <input 
                onChange={(e)=>setUserData(prev=>({...prev,name:e.target.value}))}
                type="text" 
                className='w-[60%] bg-gray-50 text-black focus:outline-none text-xl p-2 rounded-md' 
                placeholder='Name'
                />
            }
            <input 
            onChange={(e)=>setUserData(prev=>({...prev,email:e.target.value}))}
            type="email"
            className='w-[60%]  bg-gray-50 text-black focus:outline-none text-xl p-2 rounded-md'
            placeholder='Email'
            />
            <input 
            onChange={(e)=>setUserData(prev=>({...prev,password:e.target.value}))}
            type="password" 
            className='w-[60%] bg-gray-50 text-black focus:outline-none text-xl p-2 rounded-md' 
            placeholder='Password'
            />

            <button  className='w-[60%] bg-[#4D55CC] text-white focus:outline-none text-xl p-2 rounded-md'>{type=="signin"?"login":"register"}</button>
        </form>
        {type=="signin" ? <p> <NavLink to={"/signup"}  className={"text-white"}>Don't have an account please sign up</NavLink></p>:<p><NavLink to={"/signin"}  className={"text-white"}>Already have an accoynt sign in</NavLink></p>}
    </div>
  )
}

export default AuthForm