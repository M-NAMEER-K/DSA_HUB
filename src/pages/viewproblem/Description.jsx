import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProblemApi } from "../../services/operations/problemAPI";
import { toast } from "react-hot-toast";





const Description=()=>{
      const { id } = useParams();
      const [problem, setProblem] = useState({});

      

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetchProblemApi(id);
        setProblem(res.data.data);
       
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch problem data");
      }
    };
    fetchProblem();
  }, [id]);

  const textColor = () => {
    if (problem.difficulty === "Easy") return "text-green-600";
    else if (problem.difficulty === "Medium") return "text-yellow-500";
    else return "text-red-600";
  };


      return( 
            <div className="w-full  flex flex-col gap-y-2 p-2   ">
        <h1 className="text-xl p-2 font-medium underline">{problem.title}</h1>
        <div className="w-full">
          <span className={`${textColor()} rounded-lg p-2`}>
            {problem.difficulty}
          </span>
        </div>
        <p>
          <span className="underline font-medium">Description</span> :{" "}
          {problem.description}
        </p>
        {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
        <div className="   w-full ">
          <h2 className=" font-medium underline my-2">
            Visible Test Cases
          </h2>
          <div className="w-full flex flex-col gap-4">
            {problem.visibleTestCases.map((test, index) => (
              <div
                key={test._id || index}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <p>
                  <span className="font-medium">Input:</span>{" "}
                  <code>{JSON.stringify(test.input)}</code>
                </p>
                <p>
                  <span className="font-medium">Output:</span>{" "}
                  <code>{JSON.stringify(test.output)}</code>
                </p>
               
              </div>
            ))}
          </div>
          
        </div>
      )}
      </div>
      )
}

export default Description;