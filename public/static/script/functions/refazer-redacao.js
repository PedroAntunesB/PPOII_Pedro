import { chatArea } from "./corrigir-redacao.js";

export default async function refazerRedacao() {
  const userArea = document.querySelector(".user-area");
  const tema = userArea.querySelector("select").value;
  const texto = userArea.querySelector("textarea").value;
  const nome = userArea.querySelector("input").value;

  if (!nome.trim()) {
  }

  if (tema === "0") {
    const modal = document.getElementById("modal");
    modal.querySelector("p").textContent = data.message;
    modal.showModal();
    return;
  }

  if (!texto.trim() || !nome.trim()) {
    const modal = document.getElementById("modal");
    modal.querySelector("p").textContent = data.message;
    modal.showModal();
    return;
  }

  try {
    const response = await fetch(
      `/corrigir-redacao?redacao=${encodeURIComponent(texto)}&tema=${encodeURIComponent(tema)}&nome=${encodeURIComponent(nome)}`,
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      const modal = document.getElementById("modal");
      modal.querySelector("p").textContent = data.message;
      modal.showModal();
      return;
    }

    chatArea(data.correcao, data);

    console.log("feito");
  } catch (error) {
    console.error("Erro ao refazer análise:", error);
  }
}
