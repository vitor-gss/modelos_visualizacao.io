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
      className="border rounded-xl 
      px-4 py-2 flex gap-4 cursor-pointer
      border-gray-500 text-gray-400 select-none
      has-checked:bg-gray-800 has-checked:text-white has-checked:border-violet-400
      hover:bg-gray-800 hover:text-white hover:border-violet-400
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
