import { Estrela } from "./Estrela";
import CalcularPontuacao from "../../utils/CalcularPontuacao";
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

export const ModeloEstrelas = () => {
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
    return <div style={{ color: "#e5e7eb" }}>Carregando dados do gráfico...</div>;
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return <div style={{ color: "#e5e7eb" }}>Nenhum dado disponível</div>;
  }

  const mostrarEstrelas = (pontuacao: number) => {
    const qntdEstrelas = CalcularPontuacao(pontuacao)

    const estrelas = Array.from({ length: 5 }, (_, i) => (
      <Estrela key={i} disabled={i >= qntdEstrelas} />
    ));

    return <div className="flex flex-row">{estrelas}</div>;
  };

  return (
    <div className="flex flex-col h-full w-full justify-between text-white">
      <div className="grid grid-cols-3 justify-between text-lg">
        <span className="text-left">Tópico</span>
        <span className="text-right">Aluno</span>
        <span className="text-right">Sistema</span>
      </div>
      <hr className="text-(--primary)" />
      {data.labels.map((label, i) => (
        <div className="grid grid-cols-4 sm:grid-cols-3" key={label}>
          <span className="text-md text-left col-span-2 sm:col-span-1">{label}</span>
          <span className="justify-self-end">
            {mostrarEstrelas(data.datasets[0].data[i])}
          </span>
          <span className="justify-self-end">
            {mostrarEstrelas(data.datasets[1].data[i])}
          </span>
        </div>
      ))}
      {/* <span className="">
        {pontuacaoTotal.toFixed(1)} de média baseada em {qntdDados} tópicos
      </span> */}
    </div>
  );
};
