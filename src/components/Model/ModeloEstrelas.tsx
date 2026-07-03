import { Estrela } from "./Estrela";
import data from "../../mock/data";
import CalcularPontuacao from "../../utils/CalcularPontuacao";

export const ModeloEstrelas = () => {
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
