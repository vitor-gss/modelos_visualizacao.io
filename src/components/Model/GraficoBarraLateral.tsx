import { useState, useEffect } from "react"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData, 
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getNetworkData } from "../../services/api";

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
      align: "right", // Alterado para "right" porque o eixo está em 'y' (barra horizontal)
      color: "#oklch(21% 0.034 264.665)",
      font: { weight: "bold"},
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const GraficoBarraLateral = () => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const tutor_model = await getNetworkData(0);
        const student_model = await getNetworkData(1);
        setChartData({
          labels: tutor_model.names, 
          datasets: [
    {
      label: "Aluno",
      data: student_model.probabilities,
      backgroundColor: "#2563eba0",
      borderColor: "#2563eb"
    },
    {
      label: "Sistema",
      data: tutor_model.probabilities,
      backgroundColor: "#0d9488a0",
      borderColor: "#0d9488"
    },],
        });
      } catch (erro) {
        console.error("Erro ao buscar dados de rede:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []); 

  if (loading) {
    return <div >Carregando dados do gráfico...</div>;
  }

  if (!chartData) {
    return <div className="text-red-500">Erro ao carregar dados.</div>;
  }

  return (
    <div style={{ height: "300px", width: "100%" }}> {/* Container para respeitar o maintainAspectRatio: false */}
      <Bar options={options} data={chartData} plugins={[ChartDataLabels]} />
    </div>
  );
};
