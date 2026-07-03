import data from "../../mock/data";
import CalcularPontuacao from "../../utils/CalcularPontuacao";
import { Cabecalho } from "../Cabecalho";

export const ModeloEmojis = () => {
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
    <div className="flex flex-col h-full w-full justify-between text-white">
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
