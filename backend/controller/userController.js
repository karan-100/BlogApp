const { default: mongoose } = require("mongoose");
const User = require("../models/userSchema");
const bcrypt=require("bcrypt");
const Blog = require("../models/blogSchema");
const generateJWT = require("../utils/generateToken");
async function  createUser(req, res) {
    
    try {
        const {name,email,password}=req.body;
        if(req.body.length === 0){
            return res.status(400).json({success:false,message: 'Body is required'});   
        }
        if(!name){
            return res.status(400).json({success:false,message: 'Name is required'});
        }
        if(!email){
            return res.status(400).json({success:false,message: 'Email is required'});
        }
        if(!password){
            return res.status(400).json({success:false,message: 'Password is required'});
        }
        const isUserExist =await User.findOne({email: email});

        if(isUserExist){
            return res.status(400).json({
                success:false,
                message: 'User already exist'
            });
        }
        // const newUser = new User(req.body);

        // Password security / Authorization 
        // let salt=await bcrypt.genSalt(10)
        
        const hashPass=await bcrypt.hash(password,10);
        // console.log(hashPass);

        const newUser =await User.create({
            name,
            email,
            password:hashPass
        })
        
        let token=await generateJWT.generateJWT({email:newUser.email,id:newUser._id});
        console.log('hello');
        return res.status(200).json({
            success:true,
            message: 'User created successfully',
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                token:token
            },
            
        });

    } catch (error) {
        return res.status(500).json({success:false,message: error.message});
    }
}

async function login(req,res) {
    try {
        const {email,password}=req.body;
        if(req.body.length === 0){
            return res.status(400).json({success:false,message: 'Body is required'});   
        }
        if(!email){
            return res.status(400).json({success:false,message: 'Email is required'});
        }
        if(!password){
            return res.status(400).json({success:false,message: 'Password is required'});
        }
        const isUserExist =await User.findOne({email: email});

        if(!isUserExist){
            return res.status(400).json({
                success:false,
                message: 'Please regirtered your account first'
            });
        }
        // if(!(isUserExist.password===password)){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Invalid Password"
        //     })
        // }

        let checkForPass=await bcrypt.compare(password,isUserExist.password);
        
        if(!checkForPass){
            return res.status(400).json({
                success:false,
                message:"Invalid password",
            })
        }
        let token=await generateJWT.generateJWT({email:isUserExist.email,id:isUserExist._id});
        // console.log(checkForPass); 
        return res.status(201).json({
            success:true,
            message: 'Login successfully',
            user: {
                id:isUserExist._id,
                name:isUserExist.name,
                email:isUserExist.email,
                token:token
            },
        });

    } catch (error) {
        return res.status(500).json({success:false,message: error.message});
    }
}

async function allUser(req, res) {
    try {
        const users =await User.find();
        
        if(users.length==0){
            return res.status(404).json({
                success:false,
                message: 'No user found'
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message: 'Users fetched successfully',
                data: users
            })
        }
    } catch (error) {
        return res.status(500).json({success:false,message: error.message});        
    }
}

async function getUser(req, res) {
    try {
        const id = req.params.id;

        // Convert id to ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (user) {
            return res.status(200).json({
                success: true,
                message: "Fetched successfully",
                data: user
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateUser(req, res){
    try {
        const id = req.params.id;
        const {name,email,password}=req.body;
        // Convert id to ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const updateUser=await User.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)},{name,email,password},{new:true});
         
        if(!updateUser){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        return res.status(200).json({
            success:true,
            message: 'User updated successfully',
            data:updateUser
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

async function deleteUser(req, res){
    try { 

        const id = req.params.id;
        const {name,email,password}=req.body;
        // Convert id to ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const deleteUser=await User.findByIdAndDelete({_id: new mongoose.Types.ObjectId(id)});
         
        if(!deleteUser){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        return res.status(200).json({
            success:true,
            message: 'User deleted successfully',
            data:deleteUser
        });
        // const {id} = req.params;
        // const filteredUsers = users.filter((item) => item.id != id);
        // users = filteredUsers;
        // return res.status(200).json({success:true,message: 'User deleted successfully'});
    } catch (error) {
        return res.status(500).json({success:false,message: error.message});
    }
}
module.exports={createUser,allUser,getUser,updateUser,deleteUser,login};