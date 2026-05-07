import data from "../../mock/data";

export const ModeloEmojis = () => {
  const qntdDados = data.labels.length;

  const calcularPontuacao = (pontuacao: number) => {
    const pont = Math.floor(pontuacao / 20); // * número mágico
    return pont;
  };

  const mostrarEmoji = (pontuacao: number) => {
    if (pontuacao < 20) {
      return <div className="text-2xl">😭</div>;
    } else if (pontuacao >= 20 && pontuacao < 40) {
      return <div className="text-2xl">😰</div>;
    } else if (pontuacao >= 40 && pontuacao < 60) {
      return <div className="text-2xl">🫠</div>;
    } else if (pontuacao >= 60 && pontuacao < 80) {
      return <div className="text-2xl">😁</div>;
    } else {
      return <div className="text-2xl">🤩</div>;
    }
  };

  const pontuacaoTotal =
    data.datasets[0].data
      .map((d) => calcularPontuacao(d))
      .reduce((a, b) => a + b, 0) / qntdDados;

  return (
    <div className="flex flex-col h-full justify-between text-white ">
      {data.labels.map((label, i) => (
        <div className="flex flex-row justify-between" key={label}>
          <span className="text-sm">{label}</span>
          <span className="">{mostrarEmoji(data.datasets[0].data[i])}</span>
        </div>
      ))}
      <span className="">
        {pontuacaoTotal.toFixed(1)} de média baseada em {qntdDados} tópicos
      </span>
    </div>
  );
};
