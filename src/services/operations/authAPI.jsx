

import {endpoints} from "../apis"
import {apiConnector} from "../apiConnector"
import {toast} from "react-hot-toast"
import {setSignupData} from "../../slices/authSlice"
import {setToken} from "../../slices/authSlice"





export const registerApi=async(data,navigate)=>{
             

        const  res=await apiConnector("POST",endpoints.REGISTER,data);
        
                              
                               if(res.data.success)
                               {toast.success(res.data.message);
                                  navigate("/login");
                               } 
                            else
                            toast.error(res.data.message);



}
export const adminRegisterApi=async(data,navigate)=>{
      

        const  res=await apiConnector("POST",endpoints.ADMIN_REGISTER,data);
        
         
                               if(res.data.success)
                               {toast.success(res.data.message);
                                  navigate("/login");
                               } 
                            else
                            toast.error(res.data.message);



}

export const loginApi=async(data,navigate,dispatch)=>{
               
        const  res=await apiConnector("POST",endpoints.LOGIN,data);
                      
                          if(res.data.success)
                               {toast.success(res.data.message);
                                   dispatch(setToken(res.data.token)); 
                                   dispatch(setSignupData(res.data.data));
                                    localStorage.setItem("token", res.data.token);
                                    localStorage.setItem("signupData", JSON.stringify(res.data.data));
                                    navigate("/problems");
                               } 
                            else
                            toast.error(res.data.message); 



}

export const logoutApi = async (navigate, dispatch) => {
  const res = await apiConnector("POST", endpoints.LOGOUT);

  if (res.data.success) {
    localStorage.removeItem("token");
    localStorage.removeItem("signupData");

    dispatch(setToken(null));
    dispatch(setSignupData(null));

    toast.success(res.data.message);
    navigate("/login");
  }
};



export const checkToken=async (dispatch)=>{
       const res = await apiConnector("GET", endpoints.CHECK_TOKEN);
       return res;
}
