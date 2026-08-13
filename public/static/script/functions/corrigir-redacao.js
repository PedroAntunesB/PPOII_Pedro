import addItemDiv from "./add-item-historico.js";
import { postRedacao } from "./add-redacao.js";
import criarElemento from "./criarElemento.js";
import getHistorico from "./get-historico.js";
export default async function corrigirRedacao(texto, tema, nome) {
  const response = await fetch(
    `/corrigir-redacao?redacao=${encodeURIComponent(texto)}&tema=${encodeURIComponent(tema)}&nome=${encodeURIComponent(nome)}`,
  );

  const data = await response.json();

  if (!data.success) {
    const modal = document.getElementById("modal");
    modal.querySelector("p").textContent = data.message;
    modal.showModal();
    return;
  }

  const correcao = data.correcao;

  postRedacao(data);

  document.querySelector(".chat-area").style.display = "flex";

  const chatResposta = document.querySelector(".chat-resposta");
  chatResposta.innerHTML = "";

  const resultado = criarElemento("div", "nota-geral");
  const notaFinal = criarElemento("span", null, "Nota Final");
  const nota = criarElemento("h1", null, correcao.nota);
  const tema_div = criarElemento("h2", null, `Tema: ${data.tema}`);
  resultado.appendChild(notaFinal);
  resultado.appendChild(nota);
  resultado.appendChild(tema_div);
  chatResposta.appendChild(resultado);

  const competencias = criarElemento("div", "competencias");

  const notasCompetencias = [
    correcao.competencia_1,
    correcao.competencia_2,
    correcao.competencia_3,
    correcao.competencia_4,
    correcao.competencia_5,
  ];

  notasCompetencias.forEach((nota, index) => {
    const competencia = criarElemento("div", "competencia");
    const titulo = criarElemento("h3", null, `Competência ${index + 1}`);
    const pontuacao = criarElemento("p", null, `${nota}/200`);
    competencia.appendChild(titulo);
    competencia.appendChild(pontuacao);
    competencias.appendChild(competencia);
  });
  const comentario = criarElemento("div", "comentario");

  const tituloComentario = criarElemento("h3", null, "Comentários");

  const textoComentario = criarElemento("p", null, correcao.comentario);

  comentario.appendChild(tituloComentario);
  comentario.appendChild(textoComentario);

  const textoCorrigido = criarElemento("div", "texto-corrigido");

  const tituloTexto = criarElemento("h3", null, "Texto corrigido");

  const ElTexto = criarElemento("p", null, correcao.texto_corrigido);

  textoCorrigido.appendChild(tituloTexto);
  textoCorrigido.appendChild(ElTexto);

  chatResposta.appendChild(resultado);
  chatResposta.appendChild(competencias);
  chatResposta.appendChild(comentario);
  chatResposta.appendChild(textoCorrigido);

  document.querySelector(".button-submit").style.display = "none";
  document.querySelector(".button-refazer").style.display = "block";

  await getHistorico();
}
