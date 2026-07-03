import data from "../../mock/data";
import CalcularPontuacao from "../../utils/CalcularPontuacao";

export const ModeloTabela = () => {
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
          {data.labels.map((label, i) => (
            <tr key={i}>
              <th scope="row" className="font-normal">
                {label}
              </th>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 0 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 0 && "🤖"}
              </td>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 1 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 1 && "🤖"}
              </td>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 2 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 2 && "🤖"}
              </td>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 3 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 3 && "🤖"}
              </td>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 4 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 4 && "🤖"}
              </td>
              <td className="text-lg">
                {CalcularPontuacao(data.datasets[0].data[i]) == 5 && "🧑🏻‍🎓"}
                {CalcularPontuacao(data.datasets[1].data[i]) == 5 && "🤖"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
