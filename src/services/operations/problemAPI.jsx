import {problemEndpoints} from "../apis"
import {apiConnector} from "../apiConnector"
import {toast} from "react-hot-toast"

export const createProblemApi=async(data)=>{
                         
           const res=await apiConnector("POST",problemEndpoints.CREATE_PROBLEM,data);
           
             if(res.data.success)
                   toast.success(res.data.message);
                 
}
export const getAllProblemApi=async(data)=>{
      
       const res=await apiConnector("GET",problemEndpoints.GET_ALL_PROBLEMS);
         
        return res.data.data;
}
export const updateProblemApi=async(id,data)=>{
          
          const res=await apiConnector("PUT",`${problemEndpoints.UPDATE_PROBLEM}/${id}`,data);
          
             if(res.data.success)
                   toast.success(res.data.message);
}
export const fetchProblemApi=async(id)=>{
  const res = await apiConnector("GET", `${problemEndpoints.FETCH_PROBLEM}/${id}`);
             
     return res;
                  
}

export const deleteProblemApi=async(id)=>{
         
     const res=await apiConnector("DELETE",problemEndpoints.DELETE_PROBLEM,{id});
    
     if(res.data.success)
           toast.success(res.data.message);
          return res;
}

export const runProblemApi=async(id,data)=>{
         const res=await apiConnector("POST",`${problemEndpoints.RUN_PROBLEM}/${id}`,data);
            if(res.data.success)
             toast.success(res.data.message);
            return res;
}

export const submitProblemApi=async(id,data)=>{
      
         const res=await apiConnector("POST",`${problemEndpoints.SUBMIT_PROBLEM}/${id}`,data);
            if(res.data.success)
             toast.success(res.data.message);
           
            return res;
}

export const problemStatusApi=async(id)=>{
          const res=await apiConnector("GET",`${problemEndpoints.STATUS_PROBLEM}/${id}`);
          
            if(res.data.success)
             toast.success(res.data.message);

            return res;
}

export const solvedProblemApi=async()=>{
    const res=await apiConnector("GET",problemEndpoints.SOLVED_PROBLEM);
    
    return res.data.data;
}

export const getSingleSubmissionApi = async (id) => {
  const res = await apiConnector(
    "GET",
    `${problemEndpoints.SINGLE_SUBMISSION}/${id}`
  );
  return res;
};