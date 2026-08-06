import corrigirRedacao from "./functions/corrgir-redacao.js";
const texto = document.querySelector("textarea");
texto.value = "";
const select = document.querySelector("select");

document.querySelector(".button-submit").addEventListener("click", () => {
  const tema = select.options[select.selectedIndex];
  corrigirRedacao(texto.value, tema.value);
});
