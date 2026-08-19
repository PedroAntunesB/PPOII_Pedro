import { cancelarEdicao } from "./cancelar-edicao.js";
import { chatArea } from "./corrigir-redacao.js";

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

    inputNome.value = data["redacao"].nome_redacao;
    textarea.value = data["redacao"].user_text;
    console.log();
    chatArea(data["redacao"].correcao, data["redacao"]);

    selectTema.value = data["redacao"].tema;

    if (
      document.querySelector(".button-submit").style.display === "none" ||
      document.querySelector(".botao") != undefined
    ) {
      return;
    }

    const botoesEdicao = document.createElement("div");
    botoesEdicao.classList.add("botoes-edicao");

    const botaoSalvar = document.createElement("button");
    botaoSalvar.textContent = "Salvar alterações";
    botaoSalvar.classList.add("botao-salvar");
    botaoSalvar.addEventListener("click", async () => {
      const chatArea = document.querySelector(".chat-area");
      const nota = chatArea.querySelector(".nota-geral h1").textContent;
      const competencias = chatArea.querySelectorAll(".competencia p");
      const competencia1 = parseInt(competencias[0].textContent);
      const competencia2 = parseInt(competencias[1].textContent);
      const competencia3 = parseInt(competencias[2].textContent);
      const competencia4 = parseInt(competencias[3].textContent);
      const competencia5 = parseInt(competencias[4].textContent);

      const comentario = chatArea.querySelector(".comentario p").textContent;
      const textoCorrigido =
        chatArea.querySelector(".texto-corrigido p").textContent;
      const dados = {
        id: id,
        user_text: textarea.value,
        tema: selectTema.value,
        nome_redacao: inputNome.value,
        correcao: {
          texto_corrigido: textoCorrigido,
          nota: nota,
          competencia_1: competencia1,
          competencia_2: competencia2,
          competencia_3: competencia3,
          competencia_4: competencia4,
          competencia_5: competencia5,
          comentario: comentario,
        },
      };

      const response = await fetch("/editar-redacao", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
    });

    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("botao-cancelar");
    botaoCancelar.addEventListener("click", () => {
      cancelarEdicao();
    });

    botoesEdicao.appendChild(botaoSalvar);
    botoesEdicao.appendChild(botaoCancelar);

    userArea.appendChild(botoesEdicao);
    document.querySelector(".button-submit").style.display = "none";
    const buttonRefazer = document.createElement("button");
    buttonRefazer.classList.add("button-refazer");
    buttonRefazer.textContent = "Refazer Analise";
    botoesEdicao.appendChild(buttonRefazer);
  } catch (error) {
    console.error("Erro ao carregar redação:", error);
  }
}
