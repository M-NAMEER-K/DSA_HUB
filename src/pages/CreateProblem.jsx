
import { useForm } from "react-hook-form";
import { createProblemApi } from "../services/operations/problemAPI"; 
import { toast } from "react-hot-toast";

const TAGS = [
  "Array",
  "Stack",
  "Linked List",
  "String",
  "Hash Table",
  "Heap",
  "Tree",
  "Backtracking",
  "Graph"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const safeParse = (value, fieldName) => {
  // If already an object/array, return as-is
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new Error(`Invalid JSON in ${fieldName}: ${err.message}`);
  }
};

const CreateProblem = () => {
  const {register, handleSubmit,formState: { errors }} = useForm();

  const submitData = async (rawData) => {
    try {
      // Parse JSON-only fields. If parse fails, safeParse throws and we show toast.
 
      const startCode = safeParse(rawData.startCode, "Start Code");
      const referenceCode = safeParse(rawData.referenceCode, "Reference Code");
      const visibleTestCases = safeParse(rawData.visibleTestCases, "Visible Test Cases");
      const hiddenTestCases = safeParse(rawData.hiddenTestCases, "Hidden Test Cases");

      // Basic validation
      if (!Array.isArray(startCode) || !Array.isArray(referenceCode)) {
        toast.error("startCode and referenceCode must be JSON arrays.");
        return;
      }
      if (!Array.isArray(visibleTestCases) || !Array.isArray(hiddenTestCases)) {
        toast.error("visibleTestCases and hiddenTestCases must be JSON arrays.");
        return;
      }

      // Build final payload: keep everything as JS objects/arrays so backend receives proper types
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

      await createProblemApi(payload); // shows toast on success in API wrapper
    } catch (err) {
      toast.error(err.message || "Invalid JSON or missing fields.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center text-xl font-medium my-5">Create Problem</h1>

      <form
        onSubmit={handleSubmit(submitData)}
        className="w-[60%] flex flex-col items-center"
      >
        {/* BASIC FIELDS */}
        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Title
          </label>
          <input {...register("title", { required: true })} placeholder="Problem title" className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]" />
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Description
          </label>
          <textarea {...register("description", { required: true })} placeholder="Problem description" className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[140px]" />
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Tags
          </label>
          <select {...register("tags", { required: true })} className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]">
            <option value="">Select tag</option>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Difficulty
          </label>
          <select {...register("difficulty", { required: true })} className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]">
            <option value="">Select difficulty</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Problem Creator (userId)
          </label>
          <input {...register("problemCreator", { required: true })} placeholder="user ObjectId" className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%]" />
        </div>

        {/* JSON TEXTAREAS */}
        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Start Code (JSON array)
          </label>
          <textarea
            {...register("startCode", { required: true })}
            placeholder='[{"language":"javascript","initialCode":"function x(){}"}]'
            className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[120px]"
          />
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Reference Code (JSON array)
          </label>
          <textarea
            {...register("referenceCode", { required: true })}
            placeholder='[{"language":"javascript","completeCode":"function x(){}"}]'
            className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[120px]"
          />
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Visible Test Cases (JSON array)
          </label>
          <textarea
            {...register("visibleTestCases", { required: true })}
            placeholder='[{"input":{"nums":[1,2]}, "output":[3], "explanation":"sum"}]'
            className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[150px]"
          />
        </div>

        <div className="w-full flex p-2 gap-x-5">
          <label className="w-[30%] border border-orange-500 text-orange-500 p-2 rounded-lg text-center">
            Hidden Test Cases (JSON array)
          </label>
          <textarea
            {...register("hiddenTestCases", { required: true })}
            placeholder='[{"input":{"nums":[2,3]}, "output":[5]}]'
            className="bg-orange-300 text-white rounded-lg outline-0 p-2 w-[50%] h-[150px]"
          />
        </div>

        <button type="submit" className="bg-yellow-300 p-2 rounded-lg w-[10%] mt-4">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProblem;
