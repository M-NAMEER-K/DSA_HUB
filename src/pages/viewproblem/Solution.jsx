import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProblemApi } from "../../services/operations/problemAPI";
import { toast } from "react-hot-toast";

const Solution = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState({});

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetchProblemApi(id);
        if (res.data.success) {
          setProblem(res.data.data);
          
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch problem data");
      }
    };

    if (id) fetchProblem();
  }, [id]);

  return (
    <div className="w-full p-1  ">
      <pre className=" p-1 rounded-lg text-[13px] whitespace-pre-wrap border">
        <code >{problem?.referenceCode?.[0]?.completeCode || "Loading..."}</code>
      </pre>
    </div>
  );
};

export default Solution;
