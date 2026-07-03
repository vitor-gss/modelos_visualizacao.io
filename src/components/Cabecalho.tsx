export const Cabecalho = () => {
  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-5 justify-between text-lg">
        <span className="col-span-2 sm:col-span-3 text-left">Tópico</span>
        <span className="text-right">Aluno</span>
        <span className="text-right">Sistema</span>
      </div>
      <hr className="text-(--primary)" />
    </>
  );
};
