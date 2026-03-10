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
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  plugins: {
    legend: { display: true },
    datalabels: {
      anchor: "end",
      align: "top",
      color: "#000",
      font: { weight: "bold", size: 14 },
    },
  },
  layout: {
    padding: {
      top: 30,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "#e5e5e5",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const GraficoBarraLateral = () => {
  return (
    <>
      <Bar options={options} data={data} plugins={[ChartDataLabels]} />
    </>
  );
};
