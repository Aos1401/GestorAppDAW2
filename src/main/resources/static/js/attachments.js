console.log("--> CARGANDO ATTACHMENTS.JS (TEMP + PREVIEW REAL, SIN HEAD)");

const fileInput = document.getElementById("fileInput");

let tempTokenIngreso = null;
let tempTokenGasto = null;
let currentCtx = null;

function setTempToken(ctx, token) {
  if (ctx === "ingreso") tempTokenIngreso = token;
  if (ctx === "gasto") tempTokenGasto = token;
}
function getTempToken(ctx) {
  return ctx === "ingreso" ? tempTokenIngreso : tempTokenGasto;
}
function clearTempToken(ctx) {
  setTempToken(ctx, null);
}
function capitalized(ctx) {
  return ctx.charAt(0).toUpperCase() + ctx.slice(1);
}

function alternarBotones(ctx, tieneArchivo) {
  const cap = capitalized(ctx);
  const btnAdd = document.getElementById(`btnAdjuntar${cap}`);
  const btnVer = document.getElementById(`btnVerAdjunto${cap}`);
  if (!btnAdd || !btnVer) return;

  if (tieneArchivo) {
    btnAdd.classList.add("is-hidden");
    btnVer.classList.remove("is-hidden");
  } else {
    btnAdd.classList.remove("is-hidden");
    btnVer.classList.add("is-hidden");
  }
}

// modal
const attachmentModal = document.getElementById("attachmentModal");
const attachmentPreview = document.getElementById("attachmentPreview");

function abrirModal() {
  attachmentModal?.classList.remove("is-hidden");
}
function cerrarModal() {
  attachmentModal?.classList.add("is-hidden");
}

function esImagenPorNombre(name = "") {
  const n = name.toLowerCase();
  return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".gif") || n.endsWith(".webp");
}

function renderPreview({ title, url, isTemp, tipo, id, token, fileName }) {
  if (!attachmentPreview) return;

  const tsUrl = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
  const isImg = esImagenPorNombre(fileName || url);

  const previewBlock = isImg
    ? `<img src="${tsUrl}" style="max-width:100%; max-height:300px; border-radius:8px;" />`
    : `
      <iframe src="${tsUrl}" style="width:100%; height:320px; border:1px solid #e5e7eb; border-radius:8px;"></iframe>
      <p style="margin:10px 0 0; text-align:center; color:#64748b; font-size:0.9rem;">
        Si no se previsualiza, ábrelo en una pestaña nueva.
      </p>
    `;

  const acciones = isTemp
    ? `
      <div style="display:flex; justify-content:center; gap:10px;">
        <a href="${tsUrl}" target="_blank" class="btn btn-outline">Abrir</a>
        <button class="btn btn-danger" onclick="eliminarTempActual('${token}')">Eliminar</button>
      </div>
    `
    : `
      <div style="display:flex; justify-content:center; gap:10px;">
        <a href="${tsUrl}" target="_blank" class="btn btn-outline">Abrir / Descargar</a>
        <button class="btn btn-danger" onclick="eliminarAdjunto('${tipo}', ${id})">Eliminar</button>
      </div>
    `;

  attachmentPreview.innerHTML = `
    <h4 style="margin-top:0; margin-bottom:15px; text-align:center;">${title}</h4>
    <div style="text-align:center; margin-bottom:15px;">
      ${previewBlock}
    </div>
    ${acciones}
  `;

  abrirModal();
}

window.addEventListener("DOMContentLoaded", () => {
  ["ingreso", "gasto"].forEach((ctx) => {
    const cap = capitalized(ctx);

    const btnAdd = document.getElementById(`btnAdjuntar${cap}`);
    const btnVer = document.getElementById(`btnVerAdjunto${cap}`);

    btnAdd?.addEventListener("click", () => {
      currentCtx = ctx;
      fileInput?.click();
    });

    btnVer?.addEventListener("click", () => {
      const id = document.getElementById(`${ctx}Id`)?.value;
      const token = getTempToken(ctx);

      if (id) return abrirModalAdjunto(`${ctx}s`, id);
      if (token) return abrirModalAdjuntoTemp(token);

      alert("No hay adjunto para mostrar.");
    });

    alternarBotones(ctx, false);
  });

  document.getElementById("closeAttachmentModal")?.addEventListener("click", cerrarModal);
});

fileInput?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!currentCtx) {
    console.warn("No hay contexto (ingreso/gasto) para el upload.");
    fileInput.value = "";
    return;
  }

  const ctx = currentCtx;
  currentCtx = null;

  try {
    const prev = getTempToken(ctx);
    if (prev) {
      await fetch(`${API_FILES}/temp/${encodeURIComponent(prev)}`, { method: "DELETE" }).catch(() => {});
      clearTempToken(ctx);
    }

    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch(`${API_FILES}/temp`, { method: "POST", body: formData });
    if (!resp.ok) throw new Error("No se pudo subir el archivo temporal.");

    const token = (await resp.text()).trim();
    setTempToken(ctx, token);

    alternarBotones(ctx, true);

    console.log(`TEMP subido (${ctx}):`, token);

    abrirModalAdjuntoTemp(token, file.name);

  } catch (err) {
    console.error("Error subiendo TEMP:", err);
    alert("Error al subir el archivo.");
    alternarBotones(ctx, false);
    clearTempToken(ctx);
  } finally {
    fileInput.value = "";
  }
});

window.openAdjuntoDefinitivo = (tipoPlural, id) => abrirModalAdjunto(tipoPlural, id);

window.openAdjuntoTemp = (token) => abrirModalAdjuntoTemp(token);

// API: adjuntar TEMP al movimiento (se llama ingresos y gastos)
window.attachTempIfAny = async (ctx, finalId) => {
  const token = getTempToken(ctx);
  if (!token) return false;

  const tipoPlural = `${ctx}s`;
  const form = new FormData();
  form.append("token", token);

  const resp = await fetch(`${API_FILES}/${tipoPlural}/${finalId}/attach-temp`, {
    method: "POST",
    body: form,
  });

  if (!resp.ok) throw new Error("No se pudo asociar el archivo al movimiento.");

  clearTempToken(ctx);
  return true;
};

window.verificarAdjunto = async (tipoPlural, id, ctxSingular) => {
  alternarBotones(ctxSingular, false);

  try {
    const resp = await fetch(`${API_FILES}/${tipoPlural}/${id}?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (resp.ok) {
      alternarBotones(ctxSingular, true);
    }
  } catch (e) {
    console.error("Error verificando adjunto", e);
  }
};

function abrirModalAdjunto(tipo, id) {
  const url = `${API_FILES}/${tipo}/${id}`;
  renderPreview({
    title: "Archivo adjunto",
    url,
    isTemp: false,
    tipo,
    id,
    fileName: url,
  });
}

window.eliminarAdjunto = async (tipo, id) => {
  if (!confirm("¿Borrar archivo?")) return;

  try {
    await fetch(`${API_FILES}/${tipo}/${id}`, { method: "DELETE" });
    alert("Eliminado");
    cerrarModal();

    const ctx = tipo.slice(0, -1); // ingresos -> ingreso
    alternarBotones(ctx, false);
  } catch (e) {
    console.error(e);
    alert("No se pudo eliminar el archivo.");
  }
};

function abrirModalAdjuntoTemp(token, originalName = "") {
  const url = `${API_FILES}/temp/${encodeURIComponent(token)}`;
  renderPreview({
    title: "Adjunto temporal (antes de guardar)",
    url,
    isTemp: true,
    token,
    fileName: originalName || token,
  });
}

window.eliminarTempActual = async (token) => {
  if (!confirm("¿Borrar el adjunto temporal?")) return;

  try {
    await fetch(`${API_FILES}/temp/${encodeURIComponent(token)}`, { method: "DELETE" });
    alert("Adjunto temporal eliminado.");
    cerrarModal();

    if (tempTokenIngreso === token) {
      clearTempToken("ingreso");
      alternarBotones("ingreso", false);
    }
    if (tempTokenGasto === token) {
      clearTempToken("gasto");
      alternarBotones("gasto", false);
    }
  } catch (e) {
    console.error(e);
    alert("No se pudo eliminar el archivo temporal.");
  }
};
