export default async function renderizarAreaEdicao(id) {
  const userArea = document.querySelector(".user-area");

  if (!userArea) {
    return;
  }

  try {
    const response = await fetch(`/get-redacao?id=${id}`);

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error(data.message);
      return;
    }

    const selectTema = userArea.querySelector("select");
    const inputNome = userArea.querySelector(".nome-redacao");
    const textarea = userArea.querySelector("textarea");

    // Preenche os campos
    inputNome.value = data["redacao"].nome_redacao;
    textarea.value = data["redacao"].user_text;

    // Seleciona o tema
    selectTema.value = data["redacao"].tema;

    // Container dos botões
    const botoesEdicao = document.createElement("div");
    botoesEdicao.classList.add("botoes-edicao");

    // Botão salvar
    const botaoSalvar = document.createElement("button");
    botaoSalvar.textContent = "Salvar alterações";
    botaoSalvar.classList.add("botao-salvar");

    // Botão cancelar
    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("botao-cancelar");

    botoesEdicao.appendChild(botaoSalvar);
    botoesEdicao.appendChild(botaoCancelar);

    userArea.appendChild(botoesEdicao);
    document.querySelector(".button-submit").style.display = "none";
    document.querySelector(".button-refazer").style.display = "block";
  } catch (error) {
    console.error("Erro ao carregar redação:", error);
  }
}
