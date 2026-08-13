export default function addItemDiv(redacao, historicoDiv) {
  const item = document.createElement("div");
  item.classList.add("historico-item");
  const tema = document.createElement("span");
  tema.textContent = `Redação tema: ${redacao[0]}`;

  const nome = document.createElement("p");
  nome.textContent = redacao[1];

  item.appendChild(nome);

  item.appendChild(tema);
  historicoDiv.appendChild(item);

  const botoes = document.createElement("div");
  botoes.classList.add("historico-botoes");

  const botaoAbrir = document.createElement("button");
  botaoAbrir.classList.add("botao-abrir");
  botaoAbrir.textContent = "Abrir";

  const botaoDeletar = document.createElement("button");
  botaoDeletar.appendChild(document.createElement("img"));
  botaoDeletar.querySelector("img").src = "/static/img/delete-icon.png";

  botoes.appendChild(botaoAbrir);
  botoes.appendChild(botaoDeletar);

  item.appendChild(tema);
  item.appendChild(nome);
  item.appendChild(botoes);

  historicoDiv.appendChild(item);
}
