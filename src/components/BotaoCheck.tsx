interface BotaoCheckProps {
  label: string;
  ativo: boolean;
  onChange: () => void,
}

const primeiraLetraMaiuscula = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const BotaoCheck = ({ label, ativo, onChange }: BotaoCheckProps) => {
  return (
    <label
      htmlFor={`${label}`}
      className="border rounded-xl card
      px-4 py-2 flex gap-4 cursor-pointer
      border-gray-500/40 hover:bg-blue-100 has-checked:bg-blue-100 text-gray-700 select-none
      has-checked:border-(--primary)
      hover:border-(--primary)
      duration-300 ease-in-out"
    >
      <input
        type="checkbox"
        name={`${label}`}
        id={`${label}`}
        className="checkbox scale-150" // hidden appearance-none: botão selecionável, sem checkbox
        onChange={onChange}
        checked={ativo}
      />
      {primeiraLetraMaiuscula(label)}
    </label>
  );
};
