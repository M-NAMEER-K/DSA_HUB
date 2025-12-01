const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
      firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
      },
       lastName:{
        type:String,
        minLength:3,
        maxLength:20
      },
      email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
      },
      password:{
         type:String,
         required:true
      },
      gender:{
        type:String,
        enum:["Male","Female","Others"],
      },
      age:{
        type:Number,
        min:10,
      },
      role:{
        type:String,
        enum:["user","admin"],
       default:"user"  
    },
     problemSolved:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Problem"
        }]
     },
     photo:{
        type:String,
        default:"Default Image"
     }
    },
     {timestamps:true}

);

const User=mongoose.model("user",userSchema);

module.exports=User;