  const express=require("express");
  const {userAuth,}=require("../middlewares/Auth");
  const {register,login,logout,adminRegister,deleteProfile,checkToken}=require("../controllers/Auth");
  const authRouter=express.Router();


  //Register

  authRouter.post("/register",register);
  authRouter.post("/login",login);
  authRouter.post("/logout",userAuth,logout);
 authRouter.get("/validate",checkToken);
  authRouter.post("/admin/register",adminRegister);
  authRouter.post("/deleteProfile",userAuth,deleteProfile);
  module.exports=authRouter;