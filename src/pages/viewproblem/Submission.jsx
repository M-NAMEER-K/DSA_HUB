import { problemStatusApi } from "../../services/operations/problemAPI";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {Link } from "react-router-dom"
import { FaExternalLinkAlt } from "react-icons/fa";

const Submission = () => {
  const [status, setStatus] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProblemStatus = async () => {
      try {
        const response = await problemStatusApi(id);
      
        // Extract and sort by createdAt (descending)
        const data = response?.data?.data || [];
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setStatus(sortedData);
      } catch (error) {
        console.error("Error fetching problem status:", error);
      }
    };

    fetchProblemStatus();
  }, [id]);
   

   const BgColor=(color)=>{
         if(color=="Accepted") return "text-green-500"
         else return "text-red-500"
   }

  return (
    <div className="w-full p-4">
      {status.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        status.map((item, index) => (
          <div
            key={item._id || index}
            className="p-1 mb-1 border rounded bg-gray-50"
          >    
              
           <p className={`font-semibold flex items-center justify-between ${BgColor(item.status)}`}>Status: {item.status} <Link to={`/problems/fetchProblem/${id}/viewcode/${item._id}`} ><FaExternalLinkAlt/></Link></p>
            <p className="text-sm text-gray-600">
              Submitted at: {new Date(item.createdAt).toLocaleString()}
            </p>
            
          </div>
        ))
      )}
    </div>
  );
};

export default Submission;
