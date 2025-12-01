import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { solvedProblemApi, getAllProblemApi } from "../services/operations/problemAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import LeetCodePieChart from "./LeetCodePieChart";
import HeatMap from "./HeatMap";

const Profile = () => {
  const { signupData, token } = useSelector((state) => state.auth);

  const [solved, setSolved] = useState([]);
  const [totalProblems, setTotalProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setLoading(true);

        const solvedRes = await solvedProblemApi();
        const allRes = await getAllProblemApi();
       

        setSolved(solvedRes || []);
        setTotalProblems(allRes || []);

        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!signupData) {
    return <p className="text-red-500">Loading Profile...</p>;
  }

  if (loading) {
    return <p className="text-blue-500">Loading problems...</p>;
  }

  // Deduplicate solved problems by problemId (only Accepted submissions)
  const uniqueSolved = Array.from(
    new Map(
      solved
        .filter((s) => s.status === "Accepted")
        .map((s) => [s.problemId?._id || s.problemId, s])
    ).values()
  );
 
  // Total problems by difficulty
  const totalEasy = totalProblems.filter((p) => p.difficulty === "Easy").length;
  const totalMedium = totalProblems.filter((p) => p.difficulty === "Medium").length;
  const totalHard = totalProblems.filter((p) => p.difficulty === "Hard").length;

  // Solved by difficulty (unique only)
  const solvedEasy = uniqueSolved.filter((p) => p.problemId?.difficulty === "Easy").length;
  const solvedMedium = uniqueSolved.filter((p) => p.problemId?.difficulty === "Medium").length;
  const solvedHard = uniqueSolved.filter((p) => p.problemId?.difficulty === "Hard").length;



  return (
    <div className="w-full px-2">
      <h1 className="font-medium text-lg underline text-green-600 m-2">
        {signupData.firstName + " " + signupData.lastName}
      </h1>

      <div className="border rounded-lg p-3 mt-3">
        {/* HORIZONTAL SECTION: PIE + PROGRESS BARS */}
        <div className="flex gap-6 items-center">
          {/* LEFT PIECHART */}
          <LeetCodePieChart easy={solvedEasy} medium={solvedMedium} hard={solvedHard}  total={totalEasy +totalMedium +totalHard}/>

          {/* RIGHT STATS */}
          <div className="flex-1 space-y-4">
            {/* TOTAL */}
            <p className="font-semibold text-lg">
              Total Solved: {solvedEasy+solvedMedium+solvedHard} / {totalProblems.length}
            </p>

            <ProgressBar
              completed={((uniqueSolved.length / totalProblems.length) * 100).toFixed(0)}
              bgColor="blue"
              height="12px"
              labelSize="10px"
            />

            {/* EASY */}
            <div>
              <p className="font-medium">
                Easy: {solvedEasy} / {totalEasy}
              </p>
              <ProgressBar
                completed={totalEasy === 0 ? 0 : ((solvedEasy / totalEasy) * 100).toFixed(0)}
                bgColor="green"
                height="10px"
                labelSize="10px"
              />
            </div>

            {/* MEDIUM */}
            <div>
              <p className="font-medium">
                Medium: {solvedMedium} / {totalMedium}
              </p>
              <ProgressBar
                completed={totalMedium === 0 ? 0 : ((solvedMedium / totalMedium) * 100).toFixed(0)}
                bgColor="yellow"
                height="10px"
                labelSize="10px"
              />
            </div>

            {/* HARD */}
            <div>
              <p className="font-medium">
                Hard: {solvedHard} / {totalHard}
              </p>
              <ProgressBar
                completed={totalHard === 0 ? 0 : ((solvedHard / totalHard) * 100).toFixed(0)}
                bgColor="red"
                height="10px"
                labelSize="10px"
              />
            </div>
          </div>
        </div>

        {/* ---- HEATMAP BELOW ---- */}
        <HeatMap solved={uniqueSolved} />
      </div>
    </div>
  );
};

export default Profile;
