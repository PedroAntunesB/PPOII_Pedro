/* =========================================================
   RedaChat — login.html & criar-conta.html
   ========================================================= */

function clearFieldError(field) {
  field.classList.remove("has-error");
}

function setFieldError(field, message) {
  field.classList.add("has-error");
  const errorEl = field.querySelector(".error-text");
  if (errorEl) errorEl.textContent = message;
}

/* ---------- login ---------- */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value;

    let hasError = false;
    const emailField = form.querySelector("[data-field='email']");
    const senhaField = form.querySelector("[data-field='senha']");
    clearFieldError(emailField);
    clearFieldError(senhaField);

    if (!email) {
      setFieldError(emailField, "Informe seu e-mail.");
      hasError = true;
    }
    if (!senha) {
      setFieldError(senhaField, "Informe sua senha.");
      hasError = true;
    }
    if (hasError) return;

    setLoading(submitBtn, true);
    try {
      const data = await apiPost("/login", { email, senha });
      localStorage.setItem("redachat_user_display", email);
      showToast("Login realizado com sucesso.", "success");
      window.location.href = data.redirect || "/";
    } catch (err) {
      showToast(err.message || "Não foi possível entrar.", "error");
      setFieldError(senhaField, "Usuário ou senha incorretos.");
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

/* ---------- criar conta ---------- */
function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmarSenha = form.confirmarSenha.value;

    const nomeField = form.querySelector("[data-field='nome']");
    const emailField = form.querySelector("[data-field='email']");
    const senhaField = form.querySelector("[data-field='senha']");
    const confirmField = form.querySelector("[data-field='confirmarSenha']");
    [nomeField, emailField, senhaField, confirmField].forEach(clearFieldError);

    let hasError = false;
    if (!nome) {
      setFieldError(nomeField, "Informe seu nome.");
      hasError = true;
    }
    if (!email) {
      setFieldError(emailField, "Informe um e-mail válido.");
      hasError = true;
    }
    if (!senha || senha.length < 6) {
      setFieldError(senhaField, "A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }
    if (confirmarSenha !== senha) {
      setFieldError(confirmField, "As senhas não coincidem.");
      hasError = true;
    }
    if (hasError) return;

    setLoading(submitBtn, true);
    try {
      const data = await apiPost("/criar", { nome, email, senha });
      localStorage.setItem("redachat_user_display", nome);
      showToast("Conta criada com sucesso.", "success");
      window.location.href = data.redirect || "/";
    } catch (err) {
      showToast(err.message || "Não foi possível criar a conta.", "error");
      if (err.status === 409) {
        setFieldError(emailField, "Este e-mail já está cadastrado.");
      }
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initSignupForm();
});
