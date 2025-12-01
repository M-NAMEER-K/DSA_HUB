import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleSubmissionApi } from "../../services/operations/problemAPI";

const ViewCode = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      const res = await getSingleSubmissionApi(submissionId);
      setSubmission(res.data.data);
    };
    fetchSubmission();
  }, [submissionId]);

  if (!submission) return <p>Loading...</p>;

  const changeColor = () => {
    return submission.status === "Accepted"
      ? "bg-green-500"
      : "bg-red-500";
  };

  return (
    <div className="w-full flex-col items-center mt-10  p-5">
      <div className="w-full flex justify-center gap-x-5 ">
        <h1 className={`px-4 py-1 text-white rounded ${changeColor()}`}>
          Status : {submission.status}
        </h1>
        <h2 className="px-4 py-1 border rounded">
          TestCases Passed : {submission.testCasesPassed}/{submission.totalTestCases}
        </h2>
      </div>

      <div className="w-full flex justify-center gap-x-5 mt-3">
        <div className="px-4 py-1 border rounded">Runtime : {submission.runtime}</div>
        <div className="px-4 py-1 border rounded">Memory : {submission.memory}</div>
      </div>

      {submission.errorMessage && (
        <div className="mt-6 w-[90%] mx-auto p-4 bg-red-100 rounded border text-red-500">
          <pre className="whitespace-pre-wrap">
          <code>
            {submission.errorMessage}
          </code>
        </pre>
        </div>
      )}

      <div className="mt-6 w-[90%] mx-auto p-4 bg-gray-100 rounded border">
        <pre className="whitespace-pre-wrap">
          <code>
            {submission.code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ViewCode;
