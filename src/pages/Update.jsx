import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchProblemApi, updateProblemApi } from "../services/operations/problemAPI"; 
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const TAGS = [
  "Array", "Stack", "Linked List", "String", "Hash Table",
  "Heap", "Tree", "Backtracking", "Graph"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const safeParse = (value, fieldName) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new Error(`Invalid JSON in ${fieldName}: ${err.message}`);
  }
};

const Update= () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetchProblemApi(id);
        const data = response?.data?.data;
        if (data) {
          setProblem(data);
          // Populate form with existing data
          reset({
            title: data.title,
            description: data.description,
            tags: data.tags,
            difficulty: data.difficulty,
            problemCreator: data.problemCreator,
            startCode: JSON.stringify(data.startCode, null, 2),
            referenceCode: JSON.stringify(data.referenceCode, null, 2),
            visibleTestCases: JSON.stringify(data.visibleTestCases, null, 2),
            hiddenTestCases: JSON.stringify(data.hiddenTestCases, null, 2)
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch problem data");
      }
    };
    fetchProblem();
  }, [id, reset]);

  const onSubmit = async (rawData) => {
    try {
      const startCode = safeParse(rawData.startCode, "Start Code");
      const referenceCode = safeParse(rawData.referenceCode, "Reference Code");
      const visibleTestCases = safeParse(rawData.visibleTestCases, "Visible Test Cases");
      const hiddenTestCases = safeParse(rawData.hiddenTestCases, "Hidden Test Cases");

      const payload = {
        title: rawData.title,
        description: rawData.description,
        tags: rawData.tags,
        difficulty: rawData.difficulty,
        problemCreator: rawData.problemCreator,
        startCode,
        referenceCode,
        visibleTestCases,
        hiddenTestCases
      };

      await updateProblemApi(id, payload);
     
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid JSON or server error.");
    }
  };

  if (!problem) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center text-xl font-medium my-5">Update Problem</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[60%] flex flex-col items-center"
      >
        {/* BASIC FIELDS */}
        {["title", "description", "tags", "difficulty", "problemCreator"].map((field) => (
          <div key={field} className="w-full flex p-2 gap-x-5">
            <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
              {field}
            </label>
            {field === "description" ? (
              <textarea
                {...register(field, { required: true })}
                className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[120px]"
              />
            ) : field === "tags" ? (
              <select
                {...register(field, { required: true })}
                className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]"
              >
                <option value="">Select tag</option>
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            ) : field === "difficulty" ? (
              <select
                {...register(field, { required: true })}
                className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]"
              >
                <option value="">Select difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ) : (
              <input
                {...register(field, { required: true })}
                className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]"
              />
            )}
          </div>
        ))}

        {/* JSON FIELDS */}
        {[
          { label: "Start Code", name: "startCode", height: 120 },
          { label: "Reference Code", name: "referenceCode", height: 120 },
          { label: "Visible Test Cases", name: "visibleTestCases", height: 150 },
          { label: "Hidden Test Cases", name: "hiddenTestCases", height: 150 }
        ].map(({ label, name, height }) => (
          <div key={name} className="w-full flex p-2 gap-x-5">
            <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
              {label} (JSON)
            </label>
            <textarea
              {...register(name, { required: true })}
              className={`bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[${height}px]`}
            />
          </div>
        ))}

        <button type="submit" className="bg-yellow-300 p-2 rounded-lg w-[10%] mt-4">
          Update
        </button>
      </form>
    </div>
  );
};

export default Update;
