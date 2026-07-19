import { getNetworkData } from "../services/api";

export default async function get_data() {
  try {
    const tutor_model = await getNetworkData(0);
    const student_model = await getNetworkData(1);
    console.log(tutor_model, student_model);
    const data = {
    labels: tutor_model.names,
    datasets: [
    {
      label: "Aluno",
      data: student_model.probabilities,
      backgroundColor: "#2563eba0",
      borderColor: "#2563eb",
      pointBackgroundColor: "#2563eb",
    },
    {
      label: "Sistema",
      data: tutor_model.probabilities,
      backgroundColor: "#0d9488a0",
      borderColor: "#0d9488",
      pointBackgroundColor: "#0d9488",
    },
  ],
  
};

  return data
  } catch (err) {
    console.error("Erro ao processar os dados", err);
    
  }
}
