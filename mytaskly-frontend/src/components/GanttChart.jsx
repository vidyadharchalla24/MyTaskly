import { Chart } from "react-google-charts";
import { useLocation } from "react-router-dom";

const columns = [
  { type: "string", label: "Sprint ID" },
  { type: "string", label: "Sprint Name" },
  { type: "string", label: "Resource" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

const transformData = (jsonData) => {
  if (!jsonData) return []; // Handle undefined data gracefully
  console.log(jsonData);
  return jsonData.map((sprint) => [
    sprint.sprintId,
    sprint.sprintName,
    "Development",
    new Date(sprint.startDate),
    new Date(sprint.endDate),
    null,
    0,
    null,
  ]);
};

function GanttChart() {
  const location = useLocation();
  const name = location.state?.projectName;
  const data = [columns, ...transformData(location.state?.sprints)];

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  };

  return (
    <>
      <p className="text-4xl text-center p-3">{name}</p>
      <div className="flex flex-col justify-center items-center py-5 w-full bg-gray-100">
        <div className="w-4/5 max-w-5xl p-6 shadow-lg bg-white rounded-lg">
          <Chart
            chartType="Gantt"
            width="100%"
            height="400px"
            data={data}
            options={options}
          />
        </div>
      </div>
    </>
  );
}

export default GanttChart;
