document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
    }),
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = data.redirect;
  } else {
    alert(data.message);
  }
});
