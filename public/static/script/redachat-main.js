import corrigirRedacao from "./functions/corrigir-redacao.js";
import getHistorico from "./functions/get-historico.js";
await getHistorico();
const texto = document.querySelector("textarea");
texto.value = "";
const select = document.querySelector("select");

document.querySelector(".button-submit").addEventListener("click", () => {
  const tema = select.options[select.selectedIndex];
  corrigirRedacao(texto.value, tema.value);
});

console.log("funca");
const aside = document.querySelector("aside");

// Cria o botão de toggle dinamicamente
const toggleBtn = document.createElement("button");
toggleBtn.className = "toggle-historico-btn closed";
toggleBtn.type = "button";
toggleBtn.innerText = "Histórico de Redações";

// Insere o botão como primeiro elemento do aside
aside.insertBefore(toggleBtn, aside.firstChild);

// Inicia colapsado por padrão em telas menores
if (window.innerWidth <= 1024) {
  aside.classList.add("closed");
}

// Evento de clique para alternar o estado (abrir/fechar)
toggleBtn.addEventListener("click", () => {
  aside.classList.toggle("closed");
  toggleBtn.classList.toggle("closed");
});
