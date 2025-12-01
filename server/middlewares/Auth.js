const jwt=require("jsonwebtoken");

const User =require("../models/User");
const userAuth= async (req,res,next)=>{
      try{
               const {token}=req.cookies;
                 
            if(!token)
                  return res.status(400).json({
                    success:false,
                  message:"token is not present"});
            
            const decode=jwt.verify(token,process.env.JWT_SECRET_KEY);
            const {_id}=decode;
              
              
            if(!_id){
                 return res.status(400).json({
                    success:false,
                  message:"token is invalid"});
            }
                    
            const result=await User.findById(_id);
          
            if(!result){
                  
                  throw new Error("User does not exist");
            }
           

            
           
           
            req.result=result;
           
            next();

      }
      catch(err){
              return res.status(400).json({
                    success:"false",
                    message:err
               });
      }
          
}

const adminAuth=async(req,res,next)=>{

        try{
               const {token}=req.cookies;
                 
            if(!token)
                return res.status(400).json({
                    success:false,
                  message:"token is not present"});
            
            const decode=jwt.verify(token,process.env.JWT_SECRET_KEY);
            const {_id}=decode;
                 
            if(!_id){
                return res.status(400).json({
                    success:false,
                  message:"token is invalid"});
            }
                 
            const result=await User.findById(_id);
            
            if(decode.role!="admin"){
                    
                      return res.status(400).json({
                         success:false,
                         message:"Invalid Token1"
                      });
            } 

            if(!result){
                 return res.status(400).json({
                         success:false,
                         message:"user does not exist"
                      });
            }
            

           
           
            req.result=result;
              
            next();

      }
      catch(err){
            console.log(err);
                  return res.status(400).json({
                    success:"false",
                    message:err
               }); 
      }
          
          
}


module.exports={userAuth,adminAuth};