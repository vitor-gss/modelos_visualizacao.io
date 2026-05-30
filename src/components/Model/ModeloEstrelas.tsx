import { Estrela } from "./Estrela";
import data from "../../mock/data";

export const ModeloEstrelas = () => {
  const qntdDados = data.labels.length;

  const calcularPontuacao = (pontuacao: number) => {
    const qntdEstrelas = Math.floor(pontuacao / 20); // * número mágico
    return qntdEstrelas;
  };

  const mostrarEstrelas = (pontuacao: number) => {
    const qntdEstrelas = calcularPontuacao(pontuacao);

    // const estrelas = [
    //   <Estrela disabled={true} />,
    //   <Estrela disabled={true} />,
    //   <Estrela disabled={true} />,
    //   <Estrela disabled={true} />,
    //   <Estrela disabled={true} />,
    // ];

    // for (let i = 0; i < pontuacao; i++) {
    //   estrelas.unshift(<Estrela/>);
    //   estrelas.pop();
    // }

    const estrelas = Array.from({ length: 5 }, (_, i) => (
      <Estrela key={i} disabled={i >= qntdEstrelas} />
    ));

    return <div className="flex flex-row">{estrelas}</div>;
  };

  const pontuacaoTotal =
    data.datasets[0].data
      .map((d) => calcularPontuacao(d))
      .reduce((a, b) => a + b, 0) / qntdDados;

  return (
    <div className="flex flex-col h-full w-full justify-between text-white ">
      {data.labels.map((label, i) => (
        <div className="flex flex-row justify-between" key={label}>
          <span className="text-sm">{label}</span>
          <span className="">{mostrarEstrelas(data.datasets[0].data[i])}</span>
        </div>
      ))}
      <span className="">
        {pontuacaoTotal.toFixed(1)} de média baseada em {qntdDados} tópicos
      </span>
    </div>
  );
};
