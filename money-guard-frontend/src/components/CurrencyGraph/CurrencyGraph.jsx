import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

const CurrencyGraph = ({ graphData, graphLabels }) => {
  const data = {
    labels: graphLabels,
    datasets: [
      {
        fill: true,
        label: "Fiyat",
        data: graphData,
        borderColor: "rgb(236, 112, 99)",
        backgroundColor: "rgba(88, 45, 128, 0.5)",
        pointBackgroundColor: "rgb(236, 112, 99)",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default CurrencyGraph;
