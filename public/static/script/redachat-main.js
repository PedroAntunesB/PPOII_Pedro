import corrigirRedacao from "./functions/corrgir-redacao.js";
const texto = document.querySelector("textarea").value;

document
  .querySelector(".button-submit")
  .addEventListener("click", () => corrigirRedacao(texto));
