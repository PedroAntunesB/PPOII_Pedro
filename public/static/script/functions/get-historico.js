export default async function getHistorico() {
  const response = await fetch("/get-redacoes");

  if (!response.success) {
    return;
  }

  const historico = (await response.json()).historico;
  const historicoDiv = document.querySelector(".historico");

  if (!historicoDiv) {
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
    const item = document.createElement("div");
    item.classList.add("historico-item");

    const titulo = document.createElement("h3");
    titulo.textContent = redacao.titulo || "Redação sem título";

    const tema = document.createElement("p");
    tema.textContent = `Tema: ${redacao.tema}`;

    const data = document.createElement("span");
    data.textContent = redacao.data_criacao;

    item.appendChild(titulo);
    item.appendChild(tema);
    item.appendChild(data);

    historicoDiv.appendChild(item);
  });
}
