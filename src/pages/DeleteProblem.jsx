
import { useEffect, useState } from "react";
import { deleteProblemApi,getAllProblemApi } from "../services/operations/problemAPI";






const DeleteProblem=()=>{

     const [problems, setProblems] = useState([]);
     
        useEffect(() => {
            const fetchProblems = async () => {
                
                    const result = await getAllProblemApi();
                    
                   setProblems(result);
                    
                
            };
            fetchProblems();
        }, []);
         
          const bgColor = (diff) => {
            if (diff === "Easy") return "text-green-600";
            else if (diff === "Medium") return "text-yellow-500 ";
            else return "text-red-600 ";
        };

        const deleteProblem=async(id)=>{
                 const res=await deleteProblemApi(id);
                  if (res.data.success) {
       
        setProblems((prev) => prev.filter((p) => p._id !== id));
      }

            
        }

  return (
        <div className="w-full">
               <div className="w-full flex justify-between p-2 text-gray-500">
                <span className="w-[5%]">Index</span>
                <span className="w-[80%]">Name</span>
               
               </div>
              
 {problems.map((p, index) => (
        <div
          key={p._id}
          className="w-full flex justify-between p-2 border border-x-0 border-gray-100 text-sm"
        >
          <span className="w-[5%]">{index + 1}</span>
          <span className="w-[80%]">{p.title}</span>

       
          <button
            className="w-[10%] rounded-lg p-2 border border-orange-500 text-orange-500 text-center"
            onClick={() => deleteProblem(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
            
        </div>
    );
}

export default DeleteProblem;