import {useState,useEffect} from "react"
import Editor from "@monaco-editor/react";
import { FaPlay } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchProblemApi, runProblemApi, submitProblemApi } from "../../services/operations/problemAPI";
import { toast } from "react-hot-toast";

import Description from "./Description";
import Solution from "./Solution";
import Submission from "./Submission";
import Status from "./Status";

// Helper to safely parse JSON fields
const safeParse = (value, fieldName) => {
  if (!value) return null;
  if (typeof value !== "string") return value; // already parsed
  try {
    return JSON.parse(value);
  } catch (err) {
    console.warn(`Failed to parse ${fieldName}:`, err);
    return null;
  }
};

const ViewProblem = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [statusData, setStatusData] = useState(null);
  const [submitFor, setSubmitFor] = useState("");
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const [code, setCode] = useState(""); // store code typed by user
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const res = await fetchProblemApi(id);
        if (res.data.success && res.data.data) {
          const data = res.data.data;

          // Safely parse JSON fields
          const startCode = safeParse(data.startCode, "startCode");
          const referenceCode = safeParse(data.referenceCode, "referenceCode");
          const visibleTestCases = safeParse(data.visibleTestCases, "visibleTestCases");
          const hiddenTestCases = safeParse(data.hiddenTestCases, "hiddenTestCases");

          setProblem({
            ...data,
            startCode,
            referenceCode,
            visibleTestCases,
            hiddenTestCases,
          });

          // initialize editor with startCode
          setCode(startCode?.[0]?.initialCode || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch problem data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id]);

  // handle change in editor
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // function to run code
  const handleRun = async (userCode) => {
    try {
      const language = problem.startCode?.[0]?.language || "javascript";
      const data = { language, code: userCode };
      const res = await runProblemApi(id, data);
      setStatusData(res.data);
      setActiveTab("status");
      setSubmitFor("run");
    
    } catch (err) {
      console.error("Run error:", err);
      toast.error("Failed to run code");
    }
  };

  // function to submit code
  const handleSubmit = async () => {
    try {
      const language = problem.startCode?.[0]?.language || "javascript";
      const data = { language, code };
      const res = await submitProblemApi(id, data);
      setStatusData(res.data);
      setActiveTab("status");
      setSubmitFor("submit");
     
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit code");
    }
  };

  if (loading) return <div className="p-4">Loading problem...</div>;

  return (
    <div className="w-full flex h-screen">
      <div className="w-[45%] h-screen flex flex-col">
        {/* --- TAB BUTTONS --- */}
        <div className="flex justify-evenly gap-4 p-1 w-full">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-2 py-1 rounded ${activeTab === "description" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("solution")}
            className={`px-2 py-1 rounded ${activeTab === "solution" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Solution
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-2 py-1 rounded ${activeTab === "status" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab("submission")}
            className={`px-2 py-1 rounded ${activeTab === "submission" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Submission
          </button>
        </div>

        {/* --- COMPONENT CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === "description" && <Description problem={problem} />}
          {activeTab === "solution" && <Solution problem={problem} />}
          {activeTab === "submission" && <Submission problemId={id} />}
          {activeTab === "status" && <Status data={statusData} message={submitFor} />}
        </div>
      </div>

      {/* --- EDITOR SECTION --- */}
      <div className="w-[60%]">
        <div className="w-full flex justify-center gap-x-2 p-1 mb-2">
          <div className="w-[10%] text-center border-gray-300 font-medium border rounded-lg p-1 ml-14">
            {problem.startCode?.[0]?.language || "language"}
          </div>

          <div className="w-[90%] flex justify-center gap-x-2">
            <button
              onClick={() => handleRun(code)}
              className="text-green-500 border rounded-lg w-[5%] p-1 flex justify-center items-center"
              title="Run"
            >
              <FaPlay />
            </button>

            <button
              onClick={handleSubmit}
              className="w-[13%] text-center border-green-500 font-medium border rounded-lg p-1"
            >
              Submit
            </button>
          </div>
        </div>

        {/* --- MONACO EDITOR --- */}
        <Editor
          height="90%"
          language={problem.startCode?.[0]?.language || "javascript"}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
          }}
        />
      </div>
    </div>
  );
};

export default ViewProblem;
