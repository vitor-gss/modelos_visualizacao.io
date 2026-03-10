import { ChartBarBig } from "lucide-react";
import "./App.css";
// import { Botao } from "./components/Botao";
import { BotaoCheck } from "./components/BotaoCheck";
import { Header } from "./components/Header";
import { ListaBotoes } from "./components/ListaBotoes";
import { GraficoBarraVertical } from "./components/Model/GraficoBarraVertical";
import { useState, type ElementType } from "react";
import { GraficoBarraLateral } from "./components/Model/GraficoBarraLateral";
import { GraficoRadar } from "./components/Model/GraficoRadar";
import { Grafico } from "./components/Model/Grafico";

function App() {
  interface modelosProps {
    label: string;
    ativo: boolean;
    componente: ElementType;
  }

  const [modelos, setModelos] = useState<modelosProps[]>([
    { label: "barras", ativo: false, componente: GraficoBarraVertical },
    { label: "barras laterais", ativo: false, componente: GraficoBarraLateral },
    { label: "radar", ativo: false, componente: GraficoRadar },
    // { label: "emojis", ativo: false },
    // { label: "velocímetros", ativo: false },
    // { label: "estrelas", ativo: false },
    // { label: "tabelas", ativo: false },
    // { label: "bolhas", ativo: false },
  ]);

  const lidarComCheckbox = (label: string) => {
    setModelos((preview) =>
      preview.map((item) =>
        item.label === label ? { ...item, ativo: !item.ativo } : item,
      ),
    );
  };

  //   setModelos((preview) =>
  //   preview.includes(label)
  //     ? preview.filter((item) => item != label)
  //     : [...preview, label],
  // );

  const ativarTodos = () => {
    const qtdFalse = modelos.filter((i) => i.ativo == false).length;
    setModelos((preview) =>
      preview.map((item) =>
        qtdFalse <= modelos.length && qtdFalse != 0
          ? { ...item, ativo: true }
          : { ...item, ativo: false },
      ),
    );
  };

  return (
    <main className="flex flex-col gap-8 items-center">
      <Header />
      <ListaBotoes>
        {modelos.map((item) => (
          <BotaoCheck
            label={item.label}
            key={item.label}
            onChange={() => lidarComCheckbox(item.label)}
            ativo={item.ativo}
          />
        ))}
      </ListaBotoes>
      <button
        onClick={ativarTodos}
        className="bg-violet-600 rounded-full p-4 px-8 w-full sm:max-w-fit
                    flex flex-row justify-center gap-4
                  hover:bg-violet-700 active:bg-violet-800 active:scale-95
                    ease-in-out duration-200"
      >
        <ChartBarBig /> Marcar todas as opções
      </button>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {modelos.map((c) => {
          if (!c.ativo) return null;
          const GraficoAtual = c.componente;
          return (
            <div className="min-w-0" key={c.label}>
              <Grafico>
                <GraficoAtual />
              </Grafico>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default App;
