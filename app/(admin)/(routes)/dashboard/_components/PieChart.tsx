import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  projectData: any;
}

const PieChart: React.FC<PieChartProps> = ({ projectData }) => {
  // console.log("projectData", projectData);

  const labels = projectData.map(
    (dataItem: any) => `${dataItem.key}: ${dataItem.value}`
  );
  const dataValues = projectData.map((dataItem: any) => dataItem.value);
  const backgroundColors = [
    "#bfdbfe",
    "#ddd6fe",
    "#fef08a",
    "#bbf7d0",
    "#e5e7eb",
    "#fecaca",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng",
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const getColorLabelByProjectStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-blue-900";
      case 1:
        return "text-violet-900";
      case 2:
        return "text-yellow-900";
      case 3:
        return "text-green-900";
      case 4:
        return "text-gray-900";
      case 5:
        return "text-red-900";
    }
  };

  return (
    <div className="flex flex-row justify-center gap-4">
      <div className="flex flex-col justify-center">
        <ul style={{ listStyle: "none", padding: 0 }}>
          {labels.map((label: any, index: number) => (
            <li
              key={index}
              style={{
                marginBottom: "0.5rem",
                fontWeight: "bold",
                fontSize: "15px"
              }}
              className={`${getColorLabelByProjectStatus(index)}`}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  backgroundColor: backgroundColors[index],
                  marginRight: "0.5rem",
                  borderRadius: "50%",
                }}
              ></span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-80 h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
