/*const historico = document.getElementById("historico");

async function carregarHistorico() {
  const response = await fetch("/historico");

  if (!response.ok) return;

  const chats = await response.json();

  historico.innerHTML = "";

  chats.forEach((chat) => {
    const item = document.createElement("div");
    item.classList.add("historico-item");

    item.innerHTML = `
        <h4>${chat.titulo || "Sem título"}</h4>
        <p>${chat.data}</p>
    `;

    item.addEventListener("click", () => carregarChat(chat.id));

    historico.appendChild(item);
  });

  const antigo = document.createElement("button");
  antigo.textContent = "Ver chats antigos";

  antigo.onclick = () => {
    window.location.href = "/historico";
  };

  historico.appendChild(antigo);
}

async function carregarChat(id) {
  const response = await fetch(`/chat/${id}`);

  if (!response.ok) return;

  const chat = await response.json();

  document.querySelector("input").value = chat.titulo;

  document.querySelector("textarea").value = chat.texto_user;

  document.querySelector(".chat-resposta").innerHTML = `
        <p>${chat.texto_llm}</p>
    `;
}

window.addEventListener("load", carregarHistorico);
*/
