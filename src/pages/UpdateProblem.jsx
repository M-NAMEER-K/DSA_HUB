import { useEffect, useState } from "react";
import { getAllProblemApi } from "../services/operations/problemAPI";
import {Link} from "react-router-dom"

const UpdateProblem = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
        
                const result = await getAllProblemApi();
                console.log(result);
                 setProblems(result);
                
        
        };
        fetchProblems();
    }, []);
     
      const bgColor = (diff) => {
        if (diff === "Easy") return "text-green-600";
        else if (diff === "Medium") return "text-yellow-500 ";
        else return "text-red-600 ";
    };
    return (
        <div className="w-full">
               <div className="w-full flex justify-between p-2 text-gray-500">
                <span className="w-[5%]">Index</span>
                <span className="w-[80%]">Name</span>
               
               </div>
              
            {problems.map((p,index) => (
                <div key={p._id} className="w-full flex justify-between p-2 border border-x-0 border-gray-100 text-sm">
                    <span className="w-[5%]">{index+1}</span>
                    <span className="w-[80%]">{p.title}</span>
                    <Link to={`/update/${p._id}`} className={`w-[10%] rounded-lg p-2 border border-orange-500 text-orange-500 text-center `}>Update</Link>
                    
                </div>
            ))}
            
        </div>
    );
}

export default UpdateProblem;
