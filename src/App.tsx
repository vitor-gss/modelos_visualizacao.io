import { ChartBarBig } from "lucide-react";
import "./App.css";
import "./components/Model/css/Table.css"
import { BotaoCheck } from "./components/BotaoCheck";
import { Header } from "./components/Header";
import { ListaBotoes } from "./components/ListaBotoes";
import { GraficoBarraVertical } from "./components/Model/GraficoBarraVertical";
import { useState, type ElementType } from "react";
import { GraficoBarraLateral } from "./components/Model/GraficoBarraLateral";
import { GraficoRadar } from "./components/Model/GraficoRadar";
import { Grafico } from "./components/Model/Grafico";
import { ModeloEstrelas } from "./components/Model/ModeloEstrelas";
import { ModeloTabela } from "./components/Model/ModeloTabela";
import { ModeloTreemap } from "./components/Model/ModeloTreemap";

function App() {
  interface modelosProps {
    /**
     * Texto do botão.
     */
    label: string;
    /**
     * Situação do botão.
     */
    ativo: boolean;
    /**
     * O componente ao qual o botão está vinculado.
     */
    componente: ElementType;
  }
  
  const [modelos, setModelos] = useState<modelosProps[]>([
    { label: "barras", ativo: false, componente: GraficoBarraVertical },
    { label: "barras laterais", ativo: false, componente: GraficoBarraLateral },
    { label: "radar", ativo: false, componente: GraficoRadar },
    // { label: "emojis", ativo: false },
    // { label: "velocímetros", ativo: false },
    { label: "estrelas", ativo: false, componente: ModeloEstrelas },
    { label: "tabelas", ativo: false, componente: ModeloTabela },
    { label: "treemap", ativo: false, componente: ModeloTreemap },
  ]);

  /**
   * Função que define se o botão de checkbox está ativado ou desativado.
   * @param label - Texto do checkbox que foi selecionado.
   */
  const lidarComCheckbox = (label: string) => {
    setModelos((preview) =>
      preview.map((item) =>
        item.label === label ? { ...item, ativo: !item.ativo } : item,
      ),
    );
  };

  /**
   * Ativa ou desativa todos os botões de checkbox.
   */
  const ativarTodos = () => {
    // Calcula quantos botões estão desativados.
    const qtdFalse = modelos.filter((item) => item.ativo == false).length;
    setModelos((preview) =>
      preview.map((item) =>
        // Se a quantidade de botões desativados for menor que o total de botões, ativa todos os botões.
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
        className="bg-violet-600 rounded-full p-4 px-8 w-full md:max-w-fit
                    flex flex-row justify-center place-items-center gap-4
                  hover:bg-violet-700 active:bg-violet-800 active:scale-95
                    ease-in-out duration-200"
      >
        <ChartBarBig/> Marcar todas as opções
      </button>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {modelos.map((component) => {
          if (!component.ativo) return null;
          const GraficoAtual = component.componente;
          return (
            <div className="min-w-0" key={component.label}>
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
