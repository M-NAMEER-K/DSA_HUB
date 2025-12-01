
   const validator=require("validator");

const validate=(data)=>{
      const mandatoryFeild=["firstName","lastName","email","password"];
      const isAllowed=mandatoryFeild.every((k)=> Object.keys(data).includes(k));

      if(!isAllowed){
            console.log("caught1");
          throw new Error("Some Feilds are missing");
      }
        if(!validator.isEmail(data.email)){
             console.log("caught2");
              throw new Error("Invalid Email");
        }
             

        if(data.password.length<8){
            console.log("caught3");
             throw new Error("Weak Password");
        }
             
}
module.exports=validate;