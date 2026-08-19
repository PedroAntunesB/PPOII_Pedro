export default function cancelarEdicao() {
  const userArea = document.querySelector(".user-area");

  if (!userArea) {
    return;
  }

  const selectTema = userArea.querySelector("select");
  const inputNome = userArea.querySelector(".nome-redacao");
  const textarea = userArea.querySelector("textarea");

  const botaoSubmit = userArea.querySelector(".button-submit");
  const chatArea = document.querySelector(".chat-area");

  selectTema.value = "0";
  inputNome.value = "";
  textarea.value = "";

  if (chatArea) {
    chatArea.style.display = "none";
  }

  userArea.querySelector(".botoes-edicao")?.remove();

  userArea.querySelectorAll("button").forEach((button) => {
    if (button !== botaoSubmit) {
      button.remove();
    }
  });

  if (botaoSubmit) {
    botaoSubmit.style.display = "block";
    botaoSubmit.textContent = "Corrigir Redação";
  }
}
