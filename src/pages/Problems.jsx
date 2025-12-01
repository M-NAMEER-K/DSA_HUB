import { useEffect, useState } from "react";
import { getAllProblemApi } from "../services/operations/problemAPI";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(1);

  const PER_PAGE = 20;
  const totalPages = Math.ceil(problems.length / PER_PAGE);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const result = await getAllProblemApi();
        setProblems(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
  }, []);

  const bgColor = (diff) => {
    if (diff === "Easy") return "text-green-600";
    else if (diff === "Medium") return "text-yellow-500";
    else return "text-red-600";
  };

  // Slice problems for the current page
  const currentProblems = problems.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <div className="w-full">
      <div className="w-full flex justify-between p-2 text-gray-500">
        <span className="w-[5%]">Index</span>
        <span className="w-[80%]">Name</span>
        <span className="w-[10%]">Difficulty</span>
      </div>

      {currentProblems.map((p, index) => (
        <div key={p._id} className="w-full">
          <Link
            to={`fetchProblem/${p._id}`}
            className="w-full flex justify-between p-2 border border-x-0 border-gray-100 text-sm"
          >
            <span className="w-[5%]">
              {(page - 1) * PER_PAGE + index + 1}
            </span>
            <span className="w-[80%]">{p.title}</span>
            <span className={`w-[10%] ${bgColor(p.difficulty)}`}>
              {p.difficulty}
            </span>
          </Link>
        </div>
      ))}

      {/* Pagination Buttons */}
      <div className="flex justify-center items-center gap-4 mt-4 p-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded border ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded border ${
            page === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Problems;
