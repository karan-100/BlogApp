const mongoose=require("mongoose")

require("dotenv").config();
//Database connection

async function connDB(){
    console.log('Connecting to DB');
    try {
        console.log('Trying to connect');
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to DB');
    } catch (error) {
        return console.log(error.message);
    }
}

module.exports=connDB;