import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import data from "../../mock/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const options: ChartOptions<"bar"> = {
  indexAxis: 'x',
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  plugins: {
    legend: { display: true },
    datalabels: {
      anchor: "end",
      align: "top",
      color: "#e5e7eb",
      font: { weight: "bold" },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      ticks: {
      maxRotation: 45,
      minRotation: 0
    },
      grid: {
        display: false,
      },
    },
  },
};


export const GraficoBarraVertical = () => {
  return (
    <>
      <Bar options={options} data={data} plugins={[ChartDataLabels]} />
    </>
  );
};
