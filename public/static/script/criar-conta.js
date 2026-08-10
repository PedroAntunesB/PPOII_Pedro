document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      const modal = document.getElementById("modal");
      modal.querySelector("p").textContent = "As senhas não coincidem";
      modal.showModal();
      return;
    }

    const response = await fetch("/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
      }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirect;
    } else {
      const modal = document.getElementById("modal");
      modal.querySelector("p").textContent = data.message;
      modal.showModal();
      return;
    }
  });
