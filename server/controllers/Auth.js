const User=require("../models/User");
const Submission=require("../models/Submission");
const bcrypt=require("bcrypt");
const validate=require("../utils/validator");


const jwt=require("jsonwebtoken");
  require("dotenv").config();


const register= async(req,res)=>{
              try{
                    
                 validate(req.body);
                  
                     const {firstName,lastName,email,password}=req.body;
                       req.body.role='user';
                     const hashPassword=await bcrypt.hash(password,10);

                      const role=req.body.role;
                    

                     const user=await User.create({
                          firstName,
                          lastName,
                          email,
                          password:hashPassword,
                          role
                     });
                     
                     user.password=undefined;
                     return res.status(200).json({
                           success:true,
                           message:"User registered successfully",
                           data:user
                     });


              }
              catch(err){
                                   console.log(err);
                         return res.status(400).json({
                              success:false,
                              message:err
                         });
              }
}


const adminRegister= async(req,res)=>{
              try{
                     validate(req.body);
                     const {firstName,lastName,email,password}=req.body;
                       
                     const hashPassword=await bcrypt.hash(password,10);

                    
                     

                     const user=await User.create({
                          firstName,
                          lastName,
                          email,
                          password:hashPassword,
                          role:"admin"
                     });
                     
                     user.password=undefined;
                     return res.status(200).json({
                           success:true,
                           message:"User Admin registered successfully",
                           data:user
                     });


              }
              catch(err){
     console.log(err);
                         return res.status(400).json({
                              success:false,
                              message:err
                         });
              }
}


const login=async (req,res)=>{
        
    try{
             const {email,password}=req.body;

              if(!email || !password) throw new Error("Invalid credentials");
              const user=await User.findOne({email});
              const pass=await bcrypt.compare(password,user.password);
                  if(!pass)
                      { 
                        return res.status(400).json({
                              success:false,
                              message:"Password did not matched"
                         });
                      }
                  
                      const payload={
                        _id:user._id,
                        email:user.email,
                        role:user.role
                     };
                     const options={expiresIn:60*60};
                     const token= jwt.sign(payload,process.env.JWT_SECRET_KEY,options);

                     

                                                res.cookie("token", token, {
  httpOnly: true,
  secure: true,            // Required on HTTPS for cross-site cookies
  sameSite: "none",        // Required when frontend and backend are on different domains
  maxAge: 60 * 60 * 1000,
});

                      
                      user.password=undefined;
                return res.status(200).json({
                      success:true,
                      message:"Login successfully",
                      data:user,
                      token:token
                });
    }
    catch(err){
     console.log(err);
               return res.status(400).json({
                    success:false,
                    message:err
               });
    }
}


const logout=async (req,res)=>{
        try{
              
          const {token}=req.cookies;
         
            
          res.cookie("token",null,{expires:new Date(Date.now())});
            res.status(200).json({
                 success:true,
                 message:"Logged out successfully"
            });
        }
        catch(err){
              return res.status(400).json({
                success:false,
                message:err
              });
        }
}



const deleteProfile=async(req,res)=>{
      
     try{
            const userId=req.result._id;
              await User.findByIdAndDelete(userId);
              await Submission.deleteMany({userId});
              return res.status(200).json({
                  success:true,
                  message:"User deleted successfully",
                  data:userId
              });
     }
     catch(err){
            return res.status(400).json({
                  success:false,
                  message:err
            });
     }
}

const checkToken = async (req, res) => {
  try {
    const token = req.cookies.token; // Correct: cookies, not cookie
    

    if (!token) {
      return res.status(200).json({
        success: false,
        data: null,
        message: "Token not present",
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      success: true,
      data: token,
      message: "Token is valid",
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      data: null,
      message: "Token invalid or expired",
    });
  }
};
            
      


module.exports={register,login,logout,adminRegister,deleteProfile,checkToken};