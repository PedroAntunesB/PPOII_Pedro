import corrigirRedacao from "./functions/corrigir-redacao.js";
import getHistorico from "./functions/get-historico.js";
await getHistorico();
const texto = document.querySelector("textarea");
texto.value = "";
const select = document.querySelector("select");
const nome = document.querySelector(".nome-redacao");

document.querySelector(".button-submit").addEventListener("click", () => {
  const tema = select.options[select.selectedIndex];
  corrigirRedacao(texto.value, tema.value, nome.value);
});

const aside = document.querySelector("aside");

const toggleBtn = document.createElement("button");
toggleBtn.className = "toggle-historico-btn closed";
toggleBtn.type = "button";
toggleBtn.innerText = "Histórico de Redações";

aside.insertBefore(toggleBtn, aside.firstChild);

if (window.innerWidth <= 1024) {
  aside.classList.add("closed");
}

toggleBtn.addEventListener("click", () => {
  aside.classList.toggle("closed");
  toggleBtn.classList.toggle("closed");
});
