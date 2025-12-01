import { PieChart, Pie, Cell } from "recharts";

const COLORS = {
  easy: "#22c55e",   // green
  medium: "#eab308", // yellow
  hard: "#ef4444",   // red
};

const LeetCodePieChart = ({ easy, medium, hard ,total }) => {
  let totalp = total;

  const data = [
    { name: "Easy", value: easy, color: COLORS.easy },
    { name: "Medium", value: medium, color: COLORS.medium },
    { name: "Hard", value: hard, color: COLORS.hard },
  ];
    
  const percent = total === 0 ? 0 : Math.round((easy + medium + hard) / totalp * 100);
 
  return (
    <div className="relative flex items-center justify-center">
      <PieChart width={220} height={220}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      <div className="absolute text-center">
        <p className="text-2xl font-bold">{percent}%</p>
        <p className="text-gray-500 text-sm">Solved</p>
      </div>
    </div>
  );
};

export default LeetCodePieChart;
