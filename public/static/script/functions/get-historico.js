import addItemDiv from "./add-item-historico.js";

export default async function getHistorico() {
  const response = await fetch("/get-redacoes");
  if (response.success) {
    return;
  }

  const historico = (await response.json()).historico;
  const historicoDiv = document.querySelector(".historico");
  if (!historicoDiv || historico === undefined) {
    return;
  }

  historicoDiv.innerHTML = "";

  if (historico.length === 0) {
    const mensagem = document.createElement("div");
    mensagem.classList.add("login-message");

    const titulo = document.createElement("h3");
    titulo.textContent = "Aqui é o histórico de suas redações";

    const texto = document.createElement("p");
    texto.textContent = "Envie uma redação para ela aparecer aqui.";

    mensagem.appendChild(titulo);
    mensagem.appendChild(texto);

    historicoDiv.appendChild(mensagem);

    return;
  }

  historico.forEach((redacao) => {
    addItemDiv(redacao, historicoDiv);
  });

  if (historico.length >= 4) {
    document.querySelector("aside").style.height = "fit-content";
    document.querySelector(".historico-link").style.display = "block";
  }
}
