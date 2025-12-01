const express=require("express");
const problemRouter=express.Router();
require("dotenv").config();
const {userAuth,adminAuth}=require("../middlewares/Auth");
const {createProblem,updateProblem,deleteProblem,fetchProblem,getAllProblem,solvedProblem,submittedProblem,singleSubmission}=require("../controllers/Problem");

problemRouter.post("/create",adminAuth,createProblem);
problemRouter.put("/update/:id",adminAuth,updateProblem);
problemRouter.delete("/delete",adminAuth,deleteProblem);



problemRouter.get("/fetchProblem/:id",userAuth,fetchProblem);
problemRouter.get("/getAllProblem",getAllProblem);
problemRouter.get("/solvedProblem",userAuth,solvedProblem);
problemRouter.get("/submittedProblem/:id",userAuth,submittedProblem);
problemRouter.get("/singlesubmission/:id",userAuth,singleSubmission);

module.exports=problemRouter;