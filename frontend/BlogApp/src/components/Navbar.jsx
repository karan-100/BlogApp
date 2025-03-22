import React from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
        <div className=' flex items-center flex-col  h-full w-screen '>
            <div className='flex justify-between items-center w-full bg-[#211C84] h-[50px] px-[50px] text-white text-3xl max-lg:px=[0px]  max-lg:p-4 '>
              <div className='text-xl p-2'><Link to={"/"}>neonNoteBook</Link></div>
              <div className='relative p-4 flex items-center  w-2xl ml-[6.5rem]  max-lg:ml-0 max-lg:w-xl max-sm:hidden'>
                <label className='mt-2 absolute p-2 ml-4 mb-1' htmlFor="search"><i className="text-white text-2xl fi fi-sr-category"></i></label>
                <input placeholder='Search' type="text" id='search' className='w-full placeholder-white placeholder:text-2xl text-white-500 border-2  text-xl h-[35px] rounded-3xl  pl-[65px] focus:outline-none focus:border-none focus:bg-[#B5A8D5]'/>
              </div>
              <div className='flex gap-[1rem] justify-center items-center ml-[2rem] p-2 '>
                <div className='flex gap-2 justify-center items-center max-sm:hidden'>
                  <i className="text-xl mt-1 fi fi-br-edit"></i>
                  <p className='text-xl  '>Write</p>
                </div>
                <div className='flex justify-center items-center gap-4 w-[80%] max-lg:hidden'>
                  <button className='bg-blue-500  px-6 py-1 rounded-xl text-xl hover:bg-[#4D55CC]'  ><Link to="signin">Signin</Link></button>
                  <button className='bg-orange-600  px-6 py-1 rounded-xl text-xl hover:bg-[#4D55CC]'><Link to="signup">Signup</Link></button>
                </div>
                <div className='mt-2 lg:hidden'>
                  <i className="mt-4 fi fi-br-menu-burger"></i>
                </div>
              </div>
            </div>
            <Outlet/>
        </div>
  )
}

export default Navbar