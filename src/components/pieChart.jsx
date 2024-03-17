import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

function PieChart({ chartData, options }) {
  // ChartJS.defaults.global.legend.display = false;

  return <Doughnut data={chartData} options={options} />;

}

export default PieChart;