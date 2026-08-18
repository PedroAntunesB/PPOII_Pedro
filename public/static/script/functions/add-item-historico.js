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
  botaoDeletar.classList.add("botao-deletar");
  botaoDeletar.addEventListener("click", async (e) => {
    await fetch("/delete-redacao", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id }),
    });
    item.remove();
    if (historicoDiv.children.length === 0) {
      historicoDiv.innerHTML = `
        <div class="login-message">
          <h3>Aqui é o historico de suas redações</h3>
          <p>Envie uma redação para ela aparecer aqui.</p>
        </div>
      `;
    }

    if (historicoDiv.children.length < 4) {
      document.querySelector(".historico-link").style.display = "none";
    }
  });

  botoes.appendChild(botaoAbrir);
  botoes.appendChild(botaoDeletar);

  item.appendChild(tema);
  item.appendChild(nome);
  item.appendChild(botoes);
  item.id = redacao[2];

  historicoDiv.appendChild(item);
}
