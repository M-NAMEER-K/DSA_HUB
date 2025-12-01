
const express=require("express");
const submitRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
const {submitCode,runCode}=require("../controllers/Submission");


submitRouter.post("/submit/:id",userAuth,submitCode);
submitRouter.post("/run/:id",userAuth,runCode);







module.exports=submitRouter;

