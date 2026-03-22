import { Check } from "lucide-react";
import data from "../../mock/data";

export const ModeloTabela = () => {
  return (
    <div className="overflow-x-auto rounded-sm border border-gray-400 w-full">
      <table className="text-white text-sm">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Péssimo</th>
            <th scope="col">Ruim</th>
            <th scope="col">Neutro</th>
            <th scope="col">Bom</th>
            <th scope="col">Muito Bom</th>
          </tr>
        </thead>
        <tbody>
          {data.labels.map((label, i) => (
            <tr>
              <th scope="row" className="font-normal">{label}</th>
              <td className="">{data.datasets[0].data[i] <= 20 && <Check />}</td>
              <td className="">
                {data.datasets[0].data[i] > 20 && data.datasets[0].data[i] <= 40
                  && <Check />
                }
              </td>
              <td className="">
                {data.datasets[0].data[i] > 40 && data.datasets[0].data[i] <= 60
                  && <Check />
                }
              </td>
              <td className="">
                {data.datasets[0].data[i] > 60 && data.datasets[0].data[i] <= 80
                  && <Check />
                }
              </td>
              <td className="">
                {data.datasets[0].data[i] > 80 && data.datasets[0].data[i] <= 100
                  && <Check />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
