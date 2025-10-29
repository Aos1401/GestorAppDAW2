// =================== CONFIG ===================
const API_GASTOS = "http://localhost:8081/gastos";
const API_INGRESOS = "http://localhost:8081/ingresos";

// =================== UTILIDADES ===================
const $ = (sel) => document.querySelector(sel);
const fmt = (num) => (Number(num) || 0).toFixed(2);

// =================== SELECTOR DE VISTA ===================
const vistaSelector = $("#vistaSelector");
const gastosSection = $("#gastosSection");
const ingresosSection = $("#ingresosSection");

vistaSelector.addEventListener("change", () => {
  if (vistaSelector.value === "gastos") {
    gastosSection.style.display = "";
    ingresosSection.style.display = "none";
  } else {
    gastosSection.style.display = "none";
    ingresosSection.style.display = "";
  }
});

// ==========================================================
// =================== CRUD GASTOS ==========================
// ==========================================================
async function listarGastos() {
  const res = await fetch(API_GASTOS);
  const gastos = await res.json();

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

    // Editar
    tr.querySelector(".editBtn").onclick = () => cargarGasto(gasto);
    // Eliminar
    tr.querySelector(".delBtn").onclick = async () => {
      await fetch(`${API_GASTOS}/${gasto.id}`, { method: "DELETE" });
      listarGastos();
    };

    list.appendChild(tr);
  });

  $("#totalGastos").textContent = `Total: ${fmt(total)} €`;
}

function cargarGasto(gasto) {
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

  if (id) {
    await fetch(`${API_GASTOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    await fetch(API_GASTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  $("#gastoForm").reset();
  listarGastos();
});

// ==========================================================
// =================== CRUD INGRESOS ========================
// ==========================================================
async function listarIngresos() {
  const res = await fetch(API_INGRESOS);
  const ingresos = await res.json();

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

    // Editar
    tr.querySelector(".editBtn").onclick = () => cargarIngreso(ingreso);
    // Eliminar
    tr.querySelector(".delBtn").onclick = async () => {
      await fetch(`${API_INGRESOS}/${ingreso.id}`, { method: "DELETE" });
      listarIngresos();
    };

    list.appendChild(tr);
  });

  $("#totalIngresos").textContent = `Total: ${fmt(total)} €`;
}

function cargarIngreso(ingreso) {
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

  if (id) {
    await fetch(`${API_INGRESOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    await fetch(API_INGRESOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  $("#ingresoForm").reset();
  listarIngresos();
});

// ==========================================================
// =================== INICIALIZACIÓN ========================
// ==========================================================
listarGastos();
listarIngresos();
