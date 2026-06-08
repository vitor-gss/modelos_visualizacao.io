import "chart.js/auto";
import { Radar } from "react-chartjs-2";
import data from "../../mock/data";

export const GraficoRadar = () => {
  return (
    <>
      <Radar
        data={data}
        options={{
          scales: {
            r: {
              angleLines: {
                display: false,
              },
              suggestedMin: 50,
              suggestedMax: 100,
              ticks: {
                backdropColor: "transparent",

                color: "white",

                font: {
                  size: 12,
                  weight: "bold",
                },
              },
            },
          },
          plugins: {
            datalabels: {
              display: false,
            },
          },
        }}
      />
    </>
  );
};
