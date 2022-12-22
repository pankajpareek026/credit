import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

function PieChart({ chartData }) {
  // ChartJS.defaults.global.legend.display = false;

  console.log(chartData)
  return <Doughnut data={chartData} />;
}

export default PieChart;