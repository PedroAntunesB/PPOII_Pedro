export default async function getHistorico() {
  const response = await fetch("/get-redacoes");

  if (response.success) {
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
    const tema = document.createElement("p");
    tema.textContent = `Redação tema: ${redacao[0]}`;
    const data = document.createElement("span");
    data.textContent = redacao[1];
    item.appendChild(tema);
    item.appendChild(data);
    historicoDiv.appendChild(item);
    const botoes = document.createElement("div");
    botoes.classList.add("historico-botoes");

    const botaoAbrir = document.createElement("button");
    botaoAbrir.classList.add("botao-abrir");
    botaoAbrir.textContent = "Abrir";

    const botaoDeletar = document.createElement("button");
    botaoDeletar.classList.add("botao-deletar");
    botaoDeletar.textContent = "Excluir";

    botoes.appendChild(botaoAbrir);
    botoes.appendChild(botaoDeletar);

    item.appendChild(tema);
    item.appendChild(data);
    item.appendChild(botoes);

    historicoDiv.appendChild(item);
  });

  if (historico.length >= 4) {
    document.querySelector("aside").style.height = "fit-content";
    document.querySelector(".historico-link").style.display = "block";
  }
}
