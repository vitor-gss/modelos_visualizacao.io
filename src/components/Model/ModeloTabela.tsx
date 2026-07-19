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

export const ModeloTabela = () => {
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

  return (
    <div className="overflow-x-auto rounded-sm border border-gray-400 w-full">
      <table className="text-white">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Péssimo</th>
            <th scope="col">Ruim</th>
            <th scope="col">Neutro</th>
            <th scope="col">Bom</th>
            <th scope="col">Muito Bom</th>
            <th scope="col">Excelente</th>
          </tr>
        </thead>
        <tbody>
          {data.labels.map((label, i) => {
            const alunoPontuacao = CalcularPontuacao(data.datasets[0].data[i]);
            const sistemaPontuacao = CalcularPontuacao(data.datasets[1].data[i]);
            
            return (
              <tr key={i}>
                <th scope="row" className="font-normal">
                  {label}
                </th>
                <td className="text-lg">
                  {alunoPontuacao === 0 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 0 && "🤖"}
                  {alunoPontuacao !== 0 && sistemaPontuacao !== 0 && "-"}
                </td>
                <td className="text-lg">
                  {alunoPontuacao === 1 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 1 && "🤖"}
                  {alunoPontuacao !== 1 && sistemaPontuacao !== 1 && "-"}
                </td>
                <td className="text-lg">
                  {alunoPontuacao === 2 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 2 && "🤖"}
                  {alunoPontuacao !== 2 && sistemaPontuacao !== 2 && "-"}
                </td>
                <td className="text-lg">
                  {alunoPontuacao === 3 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 3 && "🤖"}
                  {alunoPontuacao !== 3 && sistemaPontuacao !== 3 && "-"}
                </td>
                <td className="text-lg">
                  {alunoPontuacao === 4 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 4 && "🤖"}
                  {alunoPontuacao !== 4 && sistemaPontuacao !== 4 && "-"}
                </td>
                <td className="text-lg">
                  {alunoPontuacao === 5 && "🧑🏻‍🎓"}
                  {sistemaPontuacao === 5 && "🤖"}
                  {alunoPontuacao !== 5 && sistemaPontuacao !== 5 && "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};