
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthForm from './pages/AuthForm'
import Navbar from './components/Navbar'
import Home from './pages/Home'

import BlogPage from './pages/BlogPage'
import AddBlog from './pages/AddBlog'

function App() {
  
  // console.log()

  return (
    // <div className='bg-[#E7E7E8] w-screen h-screen'>

      <Routes>
        <Route path='/' element={<Navbar/> }>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<AuthForm  type="signin"/> } />
          <Route path="/signup" element={<AuthForm type="signup"/>}  />
          <Route path="/addBlog" element={<AddBlog/>} />
          <Route path="/blogs/:blogId" element={<BlogPage/>} />
          <Route path="/edit/:id" element={<AddBlog />}  />
        </Route>
      </Routes>
    // </div>
 )
}

export default App
