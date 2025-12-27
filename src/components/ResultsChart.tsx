"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartProps = {
  correctCount: number;
  totalQuestions: number;
};

export default function ResultsChart({ correctCount, totalQuestions }: ChartProps) {
  const incorrectCount = totalQuestions - correctCount;

  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Results",
        data: [correctCount, incorrectCount],
        backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Quiz Results" },
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return <Bar data={data} options={options} />;
}
