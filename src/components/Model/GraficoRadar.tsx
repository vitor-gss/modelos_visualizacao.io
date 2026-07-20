import "chart.js/auto";
import { Radar } from "react-chartjs-2";
import { useState, useEffect } from "react"; 
import { getNetworkData } from "../../services/api";

interface Data {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}


export const GraficoRadar = () => {
  const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
      async function carregarDados() {
        try {
          setLoading(true);
          const tutor = await getNetworkData(0);
          const student = await getNetworkData(1);
          
          setData({
            labels: tutor.names,
            datasets: [
              {
                label: "Aluno",
                data: student.probabilities,
                backgroundColor: "#2563eba0",
                borderColor: "#2563eb"
              },
              {
                label: "Sistema",
                data: tutor.probabilities,
                backgroundColor: "#0d9488a0",
                borderColor: "#0d9488"
              }
            ]
          });
        } catch (err) {
          console.error("Erro ao carregar dados:", err);
        } finally {
          setLoading(false);
        }
      }
      
      carregarDados();
    }, []);

      if (loading) {
    return <div>Carregando dados do gráfico...</div>;
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return <div>Nenhum dado disponível</div>;
  }


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
