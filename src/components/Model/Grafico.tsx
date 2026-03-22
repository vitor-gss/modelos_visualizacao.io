import type { ReactNode } from "react";

/**
 * Serve de container para os modelos de visualização.
 * @param children - Modelo de visualização (Gráfico, Estrela, Gauge, ...) .
 * @returns Componente TSX.
 */
export const Grafico = ({ children }: { children: ReactNode }) => {
  return <div className="chart-container border border-gray-500/40  h-100 w-full lg:w-100 flex flex-col justify-center place-items-center">{children}</div>;
};
