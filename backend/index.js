const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connDB = require('./config/dbConnect');
const User = require('./models/userSchema');
const userRoute=require("./routes/userRoutes");
const blogRoutes=require("./routes/blogsRoutes");
const cloudinaryConfig = require('./config/cloudinaryConfig');
// const dotenv=require("dotenv")
// dotenv.config();
// or
require("dotenv").config();

const PORT=process.env.PORT||4000;
// console.log(process.env)
app.use(express.json());
app.use(cors());

// app.use(userRoute);
// app.use(blogRoutes)

//Versioning
app.use("/api/v1", userRoute);
app.use("/api/v1",blogRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
    connDB();
    cloudinaryConfig();
})



