const mongoose=require("mongoose");
   require("dotenv").config();

 const connectDB= async (req,res)=>{
          mongoose.connect(process.env.MONGODB_URL)
          .then(()=>{
               console.log("DB connected successfully");
          })
          .catch((err)=>{
            console.log("DB not connected successfully");
             console.log(err);

          });
 };

 module.exports=connectDB;