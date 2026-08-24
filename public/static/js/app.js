/* =========================================================
   RedaChat — redachat-main.html
   ========================================================= */

const COMP_META = {
  competencia_1: { nome: "Competência 1", desc: "Norma culta" },
  competencia_2: { nome: "Competência 2", desc: "Compreensão do tema" },
  competencia_3: { nome: "Competência 3", desc: "Argumentação" },
  competencia_4: { nome: "Competência 4", desc: "Coesão textual" },
  competencia_5: { nome: "Competência 5", desc: "Proposta de intervenção" },
};

const state = {
  history: [],          // [[tema, nome_redacao, id], ...]
  editingExistingId: null,
  lastCorrecao: null,    // resposta crua de /corrigir-redacao
  currentDetalhe: null,  // resposta crua de /get-redacao (campo "redacao")
};

/* ---------------- helpers de view ---------------- */
function showView(name) {
  document.querySelectorAll(".view").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.viewPanel === name);
  });
  document.querySelectorAll(".side-nav-item[data-view]").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.view === name);
  });
  if (name !== "detalhe") {
    document.querySelectorAll(".history-item").forEach((el) => el.classList.remove("is-active"));
  }
  closeSidebarMobile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeSidebarMobile() {
  document.getElementById("sidebar").classList.remove("is-open");
  document.getElementById("sidebar-backdrop").classList.remove("is-open");
}

function formatData(raw) {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/* ---------------- usuário (sem endpoint /me no backend) ---------------- */
function initUserBadge() {
  const display = localStorage.getItem("redachat_user_display") || "Sua conta";
  document.getElementById("user-name").textContent = display;
  document.getElementById("hello-name").textContent = display.split(" ")[0] || display;
  document.getElementById("user-avatar").textContent = display.trim().charAt(0).toUpperCase() || "R";
}

/* ---------------- ficha de correção (template reaproveitável) ---------------- */
function renderFicha(container, essay) {
  const tpl = document.getElementById("ficha-template");
  const node = tpl.content.cloneNode(true);

  node.querySelector('[data-slot="nome"]').textContent = essay.nome_redacao || "Sem título";
  node.querySelector('[data-slot="tema"]').textContent = essay.tema || "";

  const dataEl = node.querySelector('[data-slot="data"]');
  if (essay.data_criacao) {
    dataEl.textContent = `Enviada em ${formatData(essay.data_criacao)}`;
    dataEl.style.display = "";
  }

  node.querySelector('[data-slot="nota"]').textContent = essay.correcao?.nota ?? "—";
  node.querySelector('[data-slot="comentario"]').textContent = essay.correcao?.comentario || "";
  node.querySelector('[data-slot="texto-original"]').textContent = essay.user_text || "";
  node.querySelector('[data-slot="texto-corrigido"]').textContent = essay.correcao?.texto_corrigido || "";

  const compList = node.querySelector('[data-slot="competencias"]');
  const compTpl = document.getElementById("comp-item-template");
  Object.keys(COMP_META).forEach((key) => {
    const value = essay.correcao?.[key] ?? 0;
    const compNode = compTpl.content.cloneNode(true);
    compNode.querySelector('[data-slot="nome"]').textContent = COMP_META[key].nome;
    compNode.querySelector('[data-slot="valor"]').textContent = `${value}/200`;
    const meter = compNode.querySelector('[data-slot="meter"]');
    const filled = Math.round(value / 40);
    for (let i = 0; i < 5; i++) {
      const seg = document.createElement("i");
      if (i < filled) seg.classList.add("filled");
      meter.appendChild(seg);
    }
    compList.appendChild(compNode);
  });

  container.innerHTML = "";
  container.appendChild(node);
}

/* delega clique nas abas "Seu texto" / "Texto corrigido" dentro de qualquer ficha renderizada */
document.addEventListener("click", (evt) => {
  const tab = evt.target.closest(".texto-tab");
  if (!tab) return;
  const wrap = tab.closest(".ficha-card");
  wrap.querySelectorAll(".texto-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
  wrap.querySelectorAll(".texto-pane").forEach((p) => p.classList.toggle("is-active", p.dataset.pane === tab.dataset.tab));
});

/* ---------------- histórico (sidebar) ---------------- */
async function loadHistory() {
  const listEl = document.getElementById("history-list");
  try {
    const data = await apiGet("/get-all");
    state.history = data.success ? data.historico : [];
  } catch (err) {
    listEl.innerHTML = '<div class="history-empty">Não foi possível carregar o histórico.</div>';
    return;
  }

  if (!state.history.length) {
    listEl.innerHTML = '<div class="history-empty">Você ainda não enviou nenhuma redação.</div>';
    return;
  }

  const tpl = document.getElementById("history-item-template");
  listEl.innerHTML = "";
  state.history.forEach(([tema, nome, id]) => {
    const node = tpl.content.cloneNode(true);
    const btn = node.querySelector(".history-item");
    btn.dataset.id = id;
    node.querySelector('[data-slot="nome"]').textContent = nome;
    node.querySelector('[data-slot="tema"]').textContent = tema;
    btn.addEventListener("click", () => abrirDetalhe(id, btn));
    listEl.appendChild(node);
  });
}

/* ---------------- início: redações recentes ---------------- */
async function loadRecent() {
  const wrap = document.getElementById("recent-wrap");
  let recentes = [];
  try {
    const data = await apiGet("/get-redacoes");
    recentes = data.success ? data.historico : [];
  } catch (err) {
    wrap.innerHTML = `<div class="card empty-state"><p>Não foi possível carregar suas redações recentes.</p></div>`;
    return;
  }

  if (!recentes.length) {
    wrap.innerHTML = `
      <div class="card empty-state">
        <div class="glyph">📝</div>
        <h3>Nenhuma redação por aqui ainda</h3>
        <p>Escreva sua primeira redação e receba nota, competências e comentários em minutos.</p>
        <button type="button" class="btn btn-primary" id="btn-empty-cta">Escrever primeira redação</button>
      </div>`;
    document.getElementById("btn-empty-cta").addEventListener("click", resetEditorParaNovaRedacao);
    return;
  }

  const tpl = document.getElementById("recent-card-template");
  const grid = document.createElement("div");
  grid.className = "recent-grid";
  recentes.forEach(([tema, nome, id]) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".recent-card");
    card.dataset.id = id;
    node.querySelector('[data-slot="nome"]').textContent = nome;
    node.querySelector('[data-slot="tema"]').textContent = tema;
    card.addEventListener("click", () => abrirDetalhe(id));
    grid.appendChild(node);
  });
  wrap.innerHTML = "";
  wrap.appendChild(grid);
}

/* ---------------- abrir detalhe de uma redação salva ---------------- */
async function abrirDetalhe(id, historyBtnEl) {
  try {
    const data = await apiGet(`/get-redacao?id=${encodeURIComponent(id)}`);
    if (!data.success) {
      showToast(data.message || "Redação não encontrada.", "error");
      return;
    }
    state.currentDetalhe = data.redacao;

    renderFicha(document.getElementById("detalhe-ficha"), data.redacao);
    document.getElementById("detalhe-data-badge").textContent = data.redacao.data_criacao
      ? `Enviada em ${formatData(data.redacao.data_criacao)}`
      : "Redação salva";

    document.querySelectorAll(".history-item").forEach((el) => {
      el.classList.toggle("is-active", String(el.dataset.id) === String(id));
    });

    showView("detalhe");
  } catch (err) {
    showToast(err.message || "Não foi possível abrir a redação.", "error");
  }
}

/* ---------------- editor: helpers ---------------- */
function ensureTemaOption(selectEl, temaText) {
  if (!temaText) return;
  const exists = Array.from(selectEl.options).some((opt) => opt.value === temaText);
  if (!exists) {
    const opt = document.createElement("option");
    opt.value = temaText;
    opt.textContent = temaText;
    selectEl.appendChild(opt);
  }
  selectEl.value = temaText;
}

function resetEditorParaNovaRedacao() {
  const form = document.getElementById("editor-form");
  form.reset();
  document.getElementById("char-count").textContent = "0 caracteres";
  state.editingExistingId = null;
  document.getElementById("edit-banner").style.display = "none";
  document.getElementById("editor-title").textContent = "Nova redação";
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
  showView("editor");
  document.getElementById("nome_redacao").focus();
}

function preencherEditorParaEdicao(essay, id) {
  const form = document.getElementById("editor-form");
  form.nome_redacao.value = essay.nome_redacao || "";
  ensureTemaOption(form.tema, essay.tema || "");
  form.redacao.value = essay.user_text || "";
  document.getElementById("char-count").textContent = `${(essay.user_text || "").length} caracteres`;

  state.editingExistingId = id;
  document.getElementById("edit-banner").style.display = "flex";
  document.getElementById("edit-banner-nome").textContent = essay.nome_redacao || "esta redação";
  document.getElementById("editor-title").textContent = "Editar redação";

  showView("editor");
}

/* ---------------- submissão do editor (chama IA) ---------------- */
function initEditorForm() {
  const form = document.getElementById("editor-form");
  const textarea = document.getElementById("redacao");
  const corrigirBtn = document.getElementById("btn-corrigir");

  textarea.addEventListener("input", () => {
    document.getElementById("char-count").textContent = `${textarea.value.length} caracteres`;
  });

  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const nome = form.nome_redacao.value.trim();
    const tema = form.tema.value;
    const redacao = form.redacao.value.trim();

    const nomeField = form.querySelector('[data-field="nome"]');
    const temaField = form.querySelector('[data-field="tema"]');
    const redacaoField = form.querySelector('[data-field="redacao"]');
    [nomeField, temaField, redacaoField].forEach((f) => f.classList.remove("has-error"));

    let hasError = false;
    if (!nome) {
      nomeField.classList.add("has-error");
      nomeField.querySelector(".error-text").textContent = "Dê um nome para a redação.";
      hasError = true;
    }
    if (!tema || tema === "0") {
      temaField.classList.add("has-error");
      temaField.querySelector(".error-text").textContent = "Selecione um tema.";
      hasError = true;
    }
    if (!redacao) {
      redacaoField.classList.add("has-error");
      redacaoField.querySelector(".error-text").textContent = "Escreva sua redação antes de enviar.";
      hasError = true;
    }
    if (hasError) return;

    setLoading(corrigirBtn, true);
    showView("corrigindo");

    try {
      const query = new URLSearchParams({ redacao, tema, nome });
      const data = await apiGet(`/corrigir-redacao?${query.toString()}`);

      state.lastCorrecao = data;
      renderFicha(document.getElementById("resultado-ficha"), data);

      const isEdicao = !!state.editingExistingId;
      document.getElementById("resultado-status-badge").textContent = isEdicao
        ? "Alterações ainda não salvas"
        : "Ainda não salva no histórico";
      document.getElementById("btn-salvar-resultado-label").textContent = isEdicao
        ? "Salvar alterações"
        : "Salvar no histórico";

      showView("resultado");
    } catch (err) {
      showToast(err.message || "Não foi possível corrigir a redação.", "error");
      showView("editor");
    } finally {
      setLoading(corrigirBtn, false);
    }
  });

  document.getElementById("btn-limpar-editor").addEventListener("click", () => {
    resetEditorParaNovaRedacao();
  });
}

/* ---------------- salvar / descartar resultado ---------------- */
function initResultadoActions() {
  const salvarBtn = document.getElementById("btn-salvar-resultado");

  salvarBtn.addEventListener("click", async () => {
    if (!state.lastCorrecao) return;
    const payload = {
      user_text: state.lastCorrecao.user_text,
      correcao: state.lastCorrecao.correcao,
      tema: state.lastCorrecao.tema,
      nome_redacao: state.lastCorrecao.nome_redacao,
    };

    setLoading(salvarBtn, true);
    try {
      if (state.editingExistingId) {
        await apiPut("/editar-redacao", { ...payload, id: state.editingExistingId });
        showToast("Alterações salvas com sucesso.", "success");
        const savedId = state.editingExistingId;
        state.editingExistingId = null;
        await loadHistory();
        await loadRecent();
        await abrirDetalhe(savedId);
      } else {
        await apiPost("/post-redacao", payload);
        showToast("Redação salva no histórico.", "success");
        state.lastCorrecao = null;
        await loadHistory();
        await loadRecent();
        showView("inicio");
      }
    } catch (err) {
      showToast(err.message || "Não foi possível salvar a redação.", "error");
    } finally {
      setLoading(salvarBtn, false);
    }
  });

  document.getElementById("btn-descartar-resultado").addEventListener("click", () => {
    if (state.editingExistingId && state.currentDetalhe) {
      renderFicha(document.getElementById("detalhe-ficha"), state.currentDetalhe);
      showView("detalhe");
    } else {
      showView("editor");
    }
  });
}

/* ---------------- ações da view "detalhe" ---------------- */
function initDetalheActions() {
  document.getElementById("btn-editar-detalhe").addEventListener("click", () => {
    if (!state.currentDetalhe) return;
    preencherEditorParaEdicao(state.currentDetalhe, state.currentDetalhe.id);
  });

  document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
    state.editingExistingId = null;
    document.getElementById("edit-banner").style.display = "none";
    if (state.currentDetalhe) {
      showView("detalhe");
    } else {
      showView("inicio");
    }
  });

  document.getElementById("btn-excluir-detalhe").addEventListener("click", async () => {
    if (!state.currentDetalhe) return;
    const ok = window.confirm(`Excluir "${state.currentDetalhe.nome_redacao}"? Essa ação não pode ser desfeita.`);
    if (!ok) return;

    const btn = document.getElementById("btn-excluir-detalhe");
    setLoading(btn, true);
    try {
      await apiDelete("/delete-redacao", { id: state.currentDetalhe.id });
      showToast("Redação excluída com sucesso.", "success");
      state.currentDetalhe = null;
      await loadHistory();
      await loadRecent();
      showView("inicio");
    } catch (err) {
      showToast(err.message || "Não foi possível excluir a redação.", "error");
    } finally {
      setLoading(btn, false);
    }
  });
}

/* ---------------- navegação lateral ---------------- */
function initSidebarNav() {
  document.getElementById("btn-nova-redacao").addEventListener("click", resetEditorParaNovaRedacao);
  document.getElementById("nav-inicio").addEventListener("click", () => {
    showView("inicio");
    loadRecent();
  });

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggleBtn = document.getElementById("btn-toggle-sidebar");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    backdrop.classList.toggle("is-open");
  });
  backdrop.addEventListener("click", closeSidebarMobile);
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initUserBadge();
  initEditorForm();
  initResultadoActions();
  initDetalheActions();
  initSidebarNav();
  loadHistory();
  loadRecent();
});
