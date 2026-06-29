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

  if (response.redirected) {
    window.location.href = response.url;
  } else {
    const data = await response.json();
    alert(data.message);
  }
});
