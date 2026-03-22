import "chart.js/auto";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import data from "../../mock/data";

const datas = {
  ...data,
  options: {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 50,
        suggestedMax: 100,
      },
    },
  },

};

export const GraficoRadar = () => {
  return (
    <>
      <Radar data={datas} plugins={[ChartDataLabels]} />
    </>
  );
};
