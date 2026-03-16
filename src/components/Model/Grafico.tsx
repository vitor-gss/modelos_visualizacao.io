import type { ReactNode } from "react";

/**
 * Serve de container para os modelos de visualização.
 * @param children - Modelo de visualização (Gráfico, Estrela, Gauge, ...) .
 * @returns Componente TSX.
 */
export const Grafico = ({ children }: { children: ReactNode }) => {
  return <div className="chart-container w-full h-100">{children}</div>;
};
