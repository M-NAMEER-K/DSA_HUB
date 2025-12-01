import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import React from "react"
const HeatMap = ({ solved }) => {

  // -----------------------------
  // STEP 1: Count how many problems
  //        were solved on each date
  // -----------------------------
   
  const dailySolved = {}; // Example: { "2025-01-02": 3 }

  solved.forEach((item) => {
    
    if (!item.createdAt) return;

    const dateObj = new Date(item.createdAt);
    if (isNaN(dateObj)) return;

    const dateString = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"

    if (!dailySolved[dateString]) {
      dailySolved[dateString] = 1;
    } else {
      dailySolved[dateString] += 1;
    }
  });


 
  // Convert the object into an array for the heatmap
  const heatmapValues = Object.entries(dailySolved).map(([date, count]) => ({
    date,
    count,
  }));

  // -----------------------------------------------
  // STEP 2: Create a list of colors based on difficulty
  // 0 : No solve => Light Gray (bg-gray-100)
  // 1-9 : Tailwind green shades 100 → 900
  // -----------------------------------------------

  const colors = [
    "#f3f4f6", // 0   => gray-100
    "#dcfce7", // 1   => green-100
    "#bbf7d0", // 2   => green-200
    "#86efac", // 3   => green-300
    "#4ade80", // 4   => green-400
    "#22c55e", // 5   => green-500
    "#16a34a", // 6   => green-600
    "#15803d", // 7   => green-700
    "#166534", // 8   => green-800
    "#14532d", // 9+  => green-900
  ];

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-2">Activity</h2>

      {/* -------------- HEATMAP --------------- */}
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)}
        endDate={new Date()}
        values={heatmapValues}
        showWeekdayLabels
        tooltipDataAttrs={(value) => ({
          "data-tooltip-id": "heat-tooltip",
          "data-tooltip-content": `${value?.date || ""} — ${
            value?.count || 0
          } solved`,
        })}

        // This function changes the color of each date box
        transformDayElement={(element, value) => {
          // If there's no data, use color index 0 (gray)
          const count = value?.count || 0;

          // If count exceeds 9, use index 9 (green-900)
          const colorIndex = Math.min(count, 9);

          // Add color by overriding the SVG fill
          return React.cloneElement(element, {
            style: { fill: colors[colorIndex] },
          });
        }}
      />

      <ReactTooltip id="heat-tooltip" />
    </div>
  );
};

export default HeatMap;
