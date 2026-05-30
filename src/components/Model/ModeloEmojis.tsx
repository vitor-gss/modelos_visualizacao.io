import data from "../../mock/data";

export const ModeloEmojis = () => {
  const mostrarEmoji = (pontuacao: number) => {
    if (pontuacao < 25) {
      return <div className="text-2xl">☠️</div>;
    } else if (pontuacao >= 25 && pontuacao < 50) {
      return <div className="text-2xl">😰</div>;
    } else if (pontuacao >= 50 && pontuacao < 75) {
      return <div className="text-2xl">🫠</div>;
    } else if (pontuacao >= 75 && pontuacao < 99) {
      return <div className="text-2xl">😁</div>;
    } else {
      return <div className="text-2xl">🤩</div>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-between text-white">
      {data.labels.map((label, i) => (
        <div className="flex flex-row justify-between" key={label}>
          <span className="text-sm">{label}</span>
          <span className="">{mostrarEmoji(data.datasets[0].data[i])}</span>
        </div>
      ))}
    </div>
  );
};
