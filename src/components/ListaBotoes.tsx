import type { ReactNode } from "react"

export const ListaBotoes = ({children}: { children: ReactNode }) => {
  return (
    <section className="border rounded-md border-gray-500/40 bg-black 
    flex justify-center flex-wrap gap-4 
    p-2 md:p-4 md:px-8">
    {children}
    </section>
  )
}
