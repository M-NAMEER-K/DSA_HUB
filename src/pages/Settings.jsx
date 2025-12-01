import Card from "./Card"
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import {Link} from "react-router-dom"


const Settings=()=>{
        

       return (
        <div className="w-full  mt-10">
                  
                      <h1 className="text-center text-xl font-medium">Admin Panel</h1>
                      <h4 className="text-center">Manage your coding problems on your platform</h4>

                  <div className="w-full flex justify-center gap-x-10 mt-10">
                <Link to="/create" className="w-[25%] "><Card title="Create Problem" para="Add a new Coding Problem to the platform" btnColor="bg-green-300" icon={<IoIosAddCircle size={30} className="text-green-300"/>}/></Link>
                 <Link to="/update" className="w-[25%] "><Card title="Update Problem" para="Edit existing problems and their details" btnColor="bg-yellow-300" icon={<FaEdit size={30} className="text-yellow-300" />} /> </Link> 
                  <Link to="/delete"  className="w-[25%] "><Card title="Delete Problem" para="Remove Problems from the platform" btnColor="bg-pink-300" icon={<RiDeleteBin6Fill size={30} className="text-pink-300" />}/></Link>
                  </div>
                  
        </div>
       )
}


export default Settings;