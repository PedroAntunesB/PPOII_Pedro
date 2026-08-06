export default async function corrigirRedacao(texto, tema) {
  const response = await fetch(
    `/corrigir-redacao?redacao=${encodeURIComponent(texto)}&tema=${encodeURIComponent(tema)}`,
  );

  const data = await response.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  const correcao = data.correcao;

  document.querySelector(".chat-area").style.display = "flex";
  document.querySelector(".chat-resposta").innerHTML = `
        <div class="resultado">

            <div class="nota-geral">
            
            <span>Nota Final</span>
            
            <h1>${correcao.nota}</h1>
            
            <h2>Tema: ${data.tema}</h2>

            </div>

            <div class="competencias">

                <div class="competencia">
                    <h3>Competência 1</h3>
                    <p>${correcao.competencia_1}/200</p>
                </div>

                <div class="competencia">
                    <h3>Competência 2</h3>
                    <p>${correcao.competencia_2}/200</p>
                </div>

                <div class="competencia">
                    <h3>Competência 3</h3>
                    <p>${correcao.competencia_3}/200</p>
                </div>

                <div class="competencia">
                    <h3>Competência 4</h3>
                    <p>${correcao.competencia_4}/200</p>
                </div>

                <div class="competencia">
                    <h3>Competência 5</h3>
                    <p>${correcao.competencia_5}/200</p>
                </div>

            </div>

            <div class="comentario">

                <h3>Comentários</h3>

                <p>${correcao.comentario}</p>

            </div>

            <div class="texto-corrigido">

                <h3>Texto corrigido</h3>

                <p>${correcao.texto_corrigido}</p>

            </div>

        </div>

    `;
  document.querySelector(".chat-area").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
