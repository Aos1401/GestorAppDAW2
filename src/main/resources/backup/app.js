const API_GASTOS = "http://localhost:8081/gastos";
const API_INGRESOS = "http://localhost:8081/ingresos";

const $ = (sel) => document.querySelector(sel);
const fmt = (num) => (Number(num) || 0).toFixed(2);

let grafico;

// ---------------- UPLOAD STATE ----------------
let uploadMeta = { tipo: null, id: null, origin: null };

// caches para "Últimos movimientos"
let ingresosCache = [];
let gastosCache = [];

// como o script está com "defer", o DOM já existe aqui
const fileInput = document.getElementById("fileInput");

// ---------------- FORMULÁRIOS + BOTÕES "+" ----------------
const ingresoForm = $("#ingresoForm");
const gastoForm = $("#gastoForm");
const openIngresoFormBtn = $("#openIngresoForm");
const openGastoFormBtn = $("#openGastoForm");

if (openIngresoFormBtn && ingresoForm) {
  openIngresoFormBtn.addEventListener("click", () => {
    ingresoForm.classList.toggle("is-hidden");
  });
}

if (openGastoFormBtn && gastoForm) {
  openGastoFormBtn.addEventListener("click", () => {
    gastoForm.classList.toggle("is-hidden");
  });
}

// ---------------- MODAL DE ADJUNTOS ----------------
const attachmentModal = $("#attachmentModal");
const closeAttachmentModal = $("#closeAttachmentModal");
const attachmentPreview = $("#attachmentPreview");
const btnEliminarAdjunto = $("#btnEliminarAdjunto");
const modalBackdrop = attachmentModal
  ? attachmentModal.querySelector(".modal__backdrop")
  : null;

// contexto atual do anexo aberto no modal
let currentAttachmentContext = null; // { tipo, id, origin }

function abrirModalAdjunto(tipo, id, origin) {
  if (!attachmentModal || !attachmentPreview) return;

  currentAttachmentContext = { tipo, id, origin };

  // URL para visualizar (ajusta se teu backend for outro)
  const url = `/api/files/${tipo}/${id}`;

  attachmentPreview.innerHTML = `
    <p>Haz clic en el enlace para ver el archivo adjunto:</p>
    <a href="${url}" target="_blank" rel="noopener noreferrer">Abrir adjunto</a>
  `;

  attachmentModal.classList.remove("is-hidden");
}

function cerrarModalAdjunto() {
  if (!attachmentModal) return;
  attachmentModal.classList.add("is-hidden");
  currentAttachmentContext = null;
}

if (closeAttachmentModal) {
  closeAttachmentModal.addEventListener("click", cerrarModalAdjunto);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", cerrarModalAdjunto);
}

// ---------------- BOTÕES DE ADJUNTOS NOS FORMULÁRIOS ----------------
const btnAdjuntarIngreso = $("#btnAdjuntarIngreso");
const btnVerAdjuntoIngreso = $("#btnVerAdjuntoIngreso");
const btnAdjuntarGasto = $("#btnAdjuntarGasto");
const btnVerAdjuntoGasto = $("#btnVerAdjuntoGasto");

// estado inicial: mostrar "Adjuntar", esconder "Ver"
if (btnAdjuntarIngreso && btnVerAdjuntoIngreso) {
  btnAdjuntarIngreso.classList.remove("is-hidden");
  btnVerAdjuntoIngreso.classList.add("is-hidden");
}
if (btnAdjuntarGasto && btnVerAdjuntoGasto) {
  btnAdjuntarGasto.classList.remove("is-hidden");
  btnVerAdjuntoGasto.classList.add("is-hidden");
}

if (btnAdjuntarIngreso) {
  btnAdjuntarIngreso.addEventListener("click", () => {
    const id = $("#ingresoId").value;
    if (!id) {
      alert("Primero guarda el ingreso antes de adjuntar un archivo.");
      return;
    }
    abrirUpload("ingresos", id, "formIngreso");
  });
}

if (btnVerAdjuntoIngreso) {
  btnVerAdjuntoIngreso.addEventListener("click", () => {
    const id = $("#ingresoId").value;
    if (!id) {
      alert("No hay ingreso seleccionado.");
      return;
    }
    abrirModalAdjunto("ingresos", id, "formIngreso");
  });
}

if (btnAdjuntarGasto) {
  btnAdjuntarGasto.addEventListener("click", () => {
    const id = $("#gastoId").value;
    if (!id) {
      alert("Primero guarda el gasto antes de adjuntar un archivo.");
      return;
    }
    abrirUpload("gastos", id, "formGasto");
  });
}

if (btnVerAdjuntoGasto) {
  btnVerAdjuntoGasto.addEventListener("click", () => {
    const id = $("#gastoId").value;
    if (!id) {
      alert("No hay gasto seleccionado.");
      return;
    }
    abrirModalAdjunto("gastos", id, "formGasto");
  });
}

// eliminar adjunto desde el modal
if (btnEliminarAdjunto) {
  btnEliminarAdjunto.addEventListener("click", async () => {
    if (!currentAttachmentContext) return;

    const confirmed = confirm(
      "¿Seguro que quieres eliminar el archivo adjunto?"
    );
    if (!confirmed) return;

    const { tipo, id, origin } = currentAttachmentContext;

    try {
      const resp = await fetch(`/api/files/${tipo}/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        throw new Error("Error al eliminar el archivo");
      }

      if (origin === "formIngreso") {
        if (btnVerAdjuntoIngreso) btnVerAdjuntoIngreso.classList.add("is-hidden");
        if (btnAdjuntarIngreso) btnAdjuntarIngreso.classList.remove("is-hidden");
        const hidden = $("#ingresoAttachment");
        if (hidden) hidden.value = "";
      } else if (origin === "formGasto") {
        if (btnVerAdjuntoGasto) btnVerAdjuntoGasto.classList.add("is-hidden");
        if (btnAdjuntarGasto) btnAdjuntarGasto.classList.remove("is-hidden");
        const hidden = $("#gastoAttachment");
        if (hidden) hidden.value = "";
      }

      cerrarModalAdjunto();
      alert("Adjunto eliminado correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el adjunto ❌");
    }
  });
}

// ---------------- DRAWER: ÚLTIMOS MOVIMIENTOS ----------------
const drawer = document.getElementById("drawerMovimientos");
const btnUltimos = document.getElementById("btnUltimos");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = drawer ? drawer.querySelector(".drawer__overlay") : null;

function abrirDrawer() {
  if (!drawer) return;
  drawer.classList.add("drawer--open");
}

function cerrarDrawer() {
  if (!drawer) return;
  drawer.classList.remove("drawer--open");
}

if (btnUltimos) {
  btnUltimos.addEventListener("click", () => {
    actualizarUltimosMovimientos();
    abrirDrawer();
  });
}

if (drawerClose) {
  drawerClose.addEventListener("click", cerrarDrawer);
}

if (drawerOverlay) {
  drawerOverlay.addEventListener("click", cerrarDrawer);
}

// monta a listinha dos últimos movimentos (5 mais recentes)
function actualizarUltimosMovimientos() {
  const cont = document.getElementById("ultimosMovimientos");
  if (!cont) return;

  const combinados = [
    ...ingresosCache.map((i) => ({
      tipo: "Ingreso",
      descripcion: i.descripcion,
      monto: i.monto,
      fecha: i.fecha,
      categoria: i.categoria,
    })),
    ...gastosCache.map((g) => ({
      tipo: "Gasto",
      descripcion: g.descripcion,
      monto: g.monto,
      fecha: g.fecha,
      categoria: g.categoria,
    })),
  ];

  combinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const top5 = combinados.slice(0, 5);

  cont.innerHTML = "";

  if (top5.length === 0) {
    cont.innerHTML = `<p class="ultimos-empty">Todavía no hay movimientos registrados.</p>`;
    return;
  }

  top5.forEach((mov) => {
    const item = document.createElement("div");
    item.className = "ultimos-item";
    item.innerHTML = `
      <div class="ultimos-item__header">
        <span class="ultimos-tipo ultimos-tipo--${
          mov.tipo === "Ingreso" ? "ingreso" : "gasto"
        }">
          ${mov.tipo}
        </span>
        <span class="ultimos-monto">
          ${mov.tipo === "Ingreso" ? "+" : "-"} ${fmt(mov.monto)} €
        </span>
      </div>
      <div class="ultimos-item__body">
        <span class="ultimos-desc">${mov.descripcion || "Sin descripción"}</span>
      </div>
      <div class="ultimos-item__meta">
        <span>${mov.fecha || ""}</span>
        <span>${mov.categoria || ""}</span>
      </div>
    `;
    cont.appendChild(item);
  });
}

// ---------------- UPLOAD (INPUT OCULTO) ----------------
if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file || !uploadMeta.id || !uploadMeta.tipo) {
      uploadMeta = { tipo: null, id: null, origin: null };
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch(
        `/api/files/${uploadMeta.tipo}/${uploadMeta.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resp.ok) {
        throw new Error("Error al subir el archivo");
      }

      alert("Archivo adjuntado correctamente ✅");

      if (uploadMeta.origin === "formIngreso") {
        if (btnAdjuntarIngreso)
          btnAdjuntarIngreso.classList.add("is-hidden");
        if (btnVerAdjuntoIngreso)
          btnVerAdjuntoIngreso.classList.remove("is-hidden");
        const hidden = $("#ingresoAttachment");
        if (hidden) hidden.value = "hasAttachment";
      } else if (uploadMeta.origin === "formGasto") {
        if (btnAdjuntarGasto)
          btnAdjuntarGasto.classList.add("is-hidden");
        if (btnVerAdjuntoGasto)
          btnVerAdjuntoGasto.classList.remove("is-hidden");
        const hidden = $("#gastoAttachment");
        if (hidden) hidden.value = "hasAttachment";
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo adjuntar el archivo ❌");
    } finally {
      uploadMeta = { tipo: null, id: null, origin: null };
      fileInput.value = "";
    }
  });
}

// chamado pelos botões "Adjuntar archivo"
function abrirUpload(tipo, id, origin = null) {
  if (!fileInput) {
    console.error("No se encontró el input de archivo oculto (#fileInput)");
    return;
  }
  uploadMeta = { tipo, id, origin };
  fileInput.click();
}

// ---------------- RESUMEN / GRÁFICO ----------------
function actualizarResumen(totalIngresos, totalGastos) {
  $("#totalIngresosResumen").textContent = `${fmt(totalIngresos)} €`;
  $("#totalGastosResumen").textContent = `${fmt(totalGastos)} €`;
  $("#saldoActual").textContent = `${fmt(totalIngresos - totalGastos)} €`;
  actualizarGrafico(totalIngresos, totalGastos);
}

function actualizarGrafico(totalIngresos, totalGastos) {
  const ctx = document.getElementById("graficoFinanzas");

  const data = {
    labels: ["Ingresos", "Gastos"],
    datasets: [
      {
        data: [totalIngresos, totalGastos],
        // Ingresos AZUL, Gastos LARANJA-AVERMELHADO
        backgroundColor: ["#3B82F6", "#F97316"],
        borderColor: ["#1D4ED8", "#C2410C"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    animation: { animateScale: true },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${fmt(context.parsed)} €`,
        },
      },
    },
  };

  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, { type: "pie", data, options });
}

// ---------------- GASTOS ----------------
async function listarGastos() {
  try {
    const res = await fetch(API_GASTOS);
    const gastos = await res.json();

    gastosCache = gastos; // guarda para el drawer

    const list = $("#gastosList");
    list.innerHTML = "";
    let total = 0;

    gastos.forEach((gasto) => {
      total += gasto.monto;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${gasto.descripcion}</td>
        <td>${fmt(gasto.monto)}</td>
        <td>${gasto.fecha}</td>
        <td>${gasto.categoria}</td>
        <td>
          <button class="editBtn">Editar</button>
          <button class="delBtn">Eliminar</button>
        </td>
      `;
      tr.querySelector(".editBtn").onclick = () => cargarGasto(gasto);
      tr.querySelector(".delBtn").onclick = async () => {
        if (confirm("¿Seguro que quieres eliminar este gasto?")) {
          await fetch(`${API_GASTOS}/${gasto.id}`, { method: "DELETE" });
          listarGastos();
          listarIngresos();
        }
      };

      list.appendChild(tr);
    });

    $("#totalGastos").textContent = `Total Gastos: ${fmt(total)} €`;
    $("#totalGastos").dataset.total = total;

    const totalIngresos = parseFloat($("#totalIngresos").dataset.total || 0);
    actualizarResumen(totalIngresos, total);

    actualizarUltimosMovimientos();
  } catch (error) {
    console.error(error);
  }
}

function cargarGasto(gasto) {
  if (gastoForm) gastoForm.classList.remove("is-hidden");
  $("#gastoForm button").textContent = "Actualizar Gasto";
  $("#gastoId").value = gasto.id;
  $("#gastoDescripcion").value = gasto.descripcion;
  $("#gastoMonto").value = gasto.monto;
  $("#gastoFecha").value = gasto.fecha;
  $("#gastoCategoria").value = gasto.categoria;
}

$("#gastoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("#gastoId").value;
  const data = {
    descripcion: $("#gastoDescripcion").value,
    monto: parseFloat($("#gastoMonto").value),
    fecha: $("#gastoFecha").value,
    categoria: $("#gastoCategoria").value,
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_GASTOS}/${id}` : API_GASTOS;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  $("#gastoForm").reset();
  $("#gastoId").value = "";
  $("#gastoForm button").textContent = "Guardar Gasto";
  listarGastos();
});

// ---------------- INGRESOS ----------------
async function listarIngresos() {
  try {
    const res = await fetch(API_INGRESOS);
    const ingresos = await res.json();

    ingresosCache = ingresos; // guarda para el drawer

    const list = $("#ingresosList");
    list.innerHTML = "";
    let total = 0;

    ingresos.forEach((ingreso) => {
      total += ingreso.monto;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ingreso.descripcion}</td>
        <td>${fmt(ingreso.monto)}</td>
        <td>${ingreso.fecha}</td>
        <td>${ingreso.categoria}</td>
        <td>
          <button class="editBtn">Editar</button>
          <button class="delBtn">Eliminar</button>
        </td>
      `;
      tr.querySelector(".editBtn").onclick = () => cargarIngreso(ingreso);
      tr.querySelector(".delBtn").onclick = async () => {
        if (confirm("¿Seguro que quieres eliminar este ingreso?")) {
          await fetch(`${API_INGRESOS}/${ingreso.id}`, { method: "DELETE" });
          listarIngresos();
          listarGastos();
        }
      };

      list.appendChild(tr);
    });

    $("#totalIngresos").textContent = `Total Ingresos: ${fmt(total)} €`;
    $("#totalIngresos").dataset.total = total;

    const totalGastos = parseFloat($("#totalGastos").dataset.total || 0);
    actualizarResumen(total, totalGastos);

    actualizarUltimosMovimientos();
  } catch (error) {
    console.error(error);
  }
}

function cargarIngreso(ingreso) {
  if (ingresoForm) ingresoForm.classList.remove("is-hidden");
  $("#ingresoForm button").textContent = "Actualizar Ingreso";
  $("#ingresoId").value = ingreso.id;
  $("#ingresoDescripcion").value = ingreso.descripcion;
  $("#ingresoMonto").value = ingreso.monto;
  $("#ingresoFecha").value = ingreso.fecha;
  $("#ingresoCategoria").value = ingreso.categoria;
}

$("#ingresoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("#ingresoId").value;
  const data = {
    descripcion: $("#ingresoDescripcion").value,
    monto: parseFloat($("#ingresoMonto").value),
    fecha: $("#ingresoFecha").value,
    categoria: $("#ingresoCategoria").value,
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_INGRESOS}/${id}` : API_INGRESOS;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  $("#ingresoForm").reset();
  $("#ingresoId").value = "";
  $("#ingresoForm button").textContent = "Guardar Ingreso";
  listarIngresos();
});

// ---------------- INICIALIZAÇÃO ----------------
listarGastos();
listarIngresos();
