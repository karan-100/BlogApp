// users route
const express=require("express");
const {createUser,allUser,getUser,updateUser,deleteUser, login}= require("../controller/userController");
const route=express.Router();

route.post('/signup',createUser);

route.post("/signin",login);

route.get('/users',allUser);

route.get('/users/:id',getUser );

route.put('/users/:id',updateUser);

route.delete('/users/:id',deleteUser);

module.exports=route;