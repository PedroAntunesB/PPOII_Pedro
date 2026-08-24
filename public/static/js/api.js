/* =========================================================
   RedaChat — utilitários compartilhados (toasts + chamadas API)
   ========================================================= */

/* ---------- toasts ---------- */
function ensureToastRegion() {
  let region = document.getElementById("toast-region");
  if (!region) {
    region = document.createElement("div");
    region.id = "toast-region";
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  return region;
}

function showToast(message, type = "info", timeout = 4200) {
  const region = ensureToastRegion();
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .2s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 200);
  }, timeout);
}

/* ---------- fetch JSON com tratamento de erros/sessão ---------- */
async function apiFetch(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      credentials: "same-origin",
      headers: options.body
        ? { "Content-Type": "application/json", ...(options.headers || {}) }
        : (options.headers || {}),
      ...options,
    });
  } catch (networkError) {
    throw { networkError: true, message: "Não foi possível conectar ao servidor." };
  }

  if (response.status === 401) {
    // sessão expirada / não autenticado
    window.location.href = "/login-page";
    throw { unauthorized: true, message: "Sessão expirada." };
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      `Ocorreu um erro inesperado (${response.status}).`;
    throw { status: response.status, message, data };
  }

  return data;
}

function apiGet(url) {
  return apiFetch(url, { method: "GET" });
}

function apiPost(url, body) {
  return apiFetch(url, { method: "POST", body: JSON.stringify(body) });
}

function apiPut(url, body) {
  return apiFetch(url, { method: "PUT", body: JSON.stringify(body) });
}

function apiDelete(url, body) {
  return apiFetch(url, { method: "DELETE", body: JSON.stringify(body) });
}

function setLoading(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
