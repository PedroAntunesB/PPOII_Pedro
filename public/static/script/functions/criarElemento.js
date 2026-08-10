export default function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.classList.add(classe);
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}
