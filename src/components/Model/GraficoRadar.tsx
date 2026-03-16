import "chart.js/auto";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import data from "../../mock/data";

const datas = {
  ...data,
  options: {
    layout: {
      padding: 30,
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
