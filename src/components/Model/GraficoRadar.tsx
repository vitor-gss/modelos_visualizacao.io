import "chart.js/auto";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import data from "../../mock/data";

const datas = {
  labels: data.labels,
  datasets: [
    {
      label: "Aluno",
      data: [65, 59, 100, 81, 56, 55, 40],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "Turma",
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgb(54, 162, 235)",
      pointBackgroundColor: "rgb(54, 162, 235)",
    },
  ],
  options: {
  layout: {
    padding: 30,
  }
}
};

export const GraficoRadar = () => {
  return (
    <>
      <Radar data={datas} plugins={[ChartDataLabels]} />
    </>
  );
};
