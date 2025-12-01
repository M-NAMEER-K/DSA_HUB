  import {Link} from "react-router-dom"
   import {useSelector} from "react-redux"
import { MdArrowDropDownCircle } from "react-icons/md";
import {logoutApi} from "../services/operations/authAPI"
import {useState} from "react"

import {useDispatch} from "react-redux"
import{useNavigate} from "react-router-dom"

const Navbar=()=>{
    const token=useSelector(state=>state.auth.token);
    const data=useSelector(state=>state.auth.signupData);
    const navigate=useNavigate();
   const dispatch=useDispatch();
    const [toggle,setToggle]=useState(false);
   
    const toggleButton=()=>{
           if(toggle===true)
              setToggle(false);
        else 
             setToggle(true);
    }
    
  const logoutHandler = async () => {
    
                  await logoutApi(navigate,dispatch); // no params
       
   
};



       return (
        <div className="w-full  p-4 flex  items-center bg-orange-100  ">
              <h1 className="w-[10%] text-xl text-center font-medium text-orange-600  ">DSA_HUB</h1>
              <div className="w-[80%] flex items-center justify-center  ">
                <Link to="/problems" className="border p-2 rounded-lg bg-white border-orange-500 text-orange-500">Problems</Link>
              </div>
                   { 
                    !token && 
                   
                 <div className="w-[15%]  flex gap-x-3 justify-end ">
                
                      <Link to="/signup" className="border p-2 rounded-lg bg-white border-orange-500 text-orange-500">SignUp</Link>
                      <Link to="/login" className="border p-2 rounded-lg bg-white border-orange-500 text-orange-500">Login</Link>
                
                      </div>
                    }
                     {  token &&   <div className="w-[10%]   flex gap-x-3 justify-end relative "><MdArrowDropDownCircle className="text-orange-500" onClick={toggleButton} />
                            {
                          toggle===true &&
                          <div className=" absolute w-[80%] bg-white top-[-50%] left-[9%] border  border-orange-500 rounded-lg  ">
                               <div className="w-full hover:bg-orange-300  rounded-lg   p-1"><Link to="/profile">Profile</Link>
                                 </div>
                                 {   data?.role=="admin"   && ( <div className="w-full hover:bg-orange-300  rounded-lg   p-1"><Link to="/settings">Settings</Link></div>)
                                      
                                 }
                                
                               <div className="w-full hover:bg-orange-300 rounded-lg    p-1"  onClick={logoutHandler}>Logout</div>
                          </div>
                    
                       }
                    </div>

                     }
                  
                       
                
               
        </div>
       )
}

export default Navbar;