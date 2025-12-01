const express=require("express");
const connectDB=require("./config/database");
const cookieParser=require("cookie-parser");

const app=express();
const cors=require("cors");
require("dotenv").config();
const PORT=process.env.PORT

const userRoute=require("./routes/Auth");
const problemRoute=require("./routes/Problem");
const submitRoute=require("./routes/Submission");

app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",userRoute);
app.use("/api/v1",problemRoute);
app.use("/api/v1",submitRoute);





  app.listen(PORT,(req,res)=>{
       console.log(`App is listening on PORT : ${PORT} `);
       connectDB();
      

  });