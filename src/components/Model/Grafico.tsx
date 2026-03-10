import type { ReactNode } from "react";

export const Grafico = ({ children }: { children: ReactNode }) => {
  return <div className="chart-container w-full h-75">{children}</div>;
};
