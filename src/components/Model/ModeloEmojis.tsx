import CalcularPontuacao from "../../utils/CalcularPontuacao";
import { Cabecalho } from "../Cabecalho";
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


export const ModeloEmojis = () => {

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
                backgroundColor: "#2563eba0",
                borderColor: "#2563eb"
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

  const mostrarEmoji = (pontuacao: number) => {
    const ponto = CalcularPontuacao(pontuacao)
    switch (ponto) {
      case 0:
        return <div className="text-4xl">☠️</div>;
      case 1:
        return <div className="text-4xl">😭</div>;
      case 2:
        return <div className="text-4xl">🤔</div>;
      case 3:
        return <div className="text-4xl">😁</div>;
      case 4:
        return <div className="text-4xl">🤩</div>;
      case 5:
        return <div className="text-4xl">🧠</div>;
    }
  };
  return (
    <div className="flex flex-col h-full w-full justify-between">
      <Cabecalho />
      {data.labels.map((label, i) => (
        <div
          className="grid grid-cols-4 sm:grid-cols-5 justify-between items-center"
          key={label}
        >
          <span className="text-md text-left col-span-2 sm:col-span-3">
            {label}
          </span>
          <span className="text-right">
            {mostrarEmoji(data.datasets[0].data[i])}
          </span>
          <span className="text-right">
            {mostrarEmoji(data.datasets[1].data[i])}
          </span>
        </div>
      ))}
    </div>
  );
};
