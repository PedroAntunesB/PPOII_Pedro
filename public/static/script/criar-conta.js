document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
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
      alert(data.message);
    }
  });
