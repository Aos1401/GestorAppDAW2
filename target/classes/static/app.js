const API_GASTOS = "http://localhost:8081/gastos";
const API_INGRESOS = "http://localhost:8081/ingresos";
const $ = (sel) => document.querySelector(sel);
const fmt = (num) => (Number(num) || 0).toFixed(2) + " €";

let grafico;

// ==================== ACTUALIZAR RESUMEN ====================
function actualizarResumen(totalIngresos, totalGastos) {
  $("#totalIngresosResumen").textContent = `${fmt(totalIngresos)} €`;
  $("#totalGastosResumen").textContent = `${fmt(totalGastos)} €`;
  $("#saldoActual").textContent = `${fmt(totalIngresos - totalGastos)} €`;
  actualizarGrafico(totalIngresos, totalGastos);
}

// ==================== GRÁFICO PIE ====================
function actualizarGrafico(totalIngresos, totalGastos) {
  const ctx = document.getElementById("graficoFinanzas");

  const data = {
    labels: ["Ingresos", "Gastos"],
    datasets: [{
      data: [totalIngresos, totalGastos],
      backgroundColor: ["#4CAF50", "#F44336"],
      borderColor: ["#388E3C", "#C62828"],
      borderWidth: 2
    }]
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    animation: { animateScale: true },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${fmt(context.parsed)} €`
        }
      }
    }
  };

  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, { type: "pie", data, options });
}

// ==================== CRUD GASTOS ====================
async function listarGastos() {
  try {
    const res = await fetch(API_GASTOS);
    const gastos = await res.json();

    const list = $("#gastosList");
    list.innerHTML = "";
    let total = 0;

    gastos.forEach(gasto => {
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
  } catch (error) {
    console.error(error);
  }
}

function cargarGasto(gasto) {
  $("#gastoForm button").textContent = "Actualizar Gasto";
  $("#gastoId").value = gasto.id;
  $("#gastoDescripcion").value = gasto.descripcion;
  $("#gastoMonto").value = gasto.monto;
  $("#gastoFecha").value = gasto.fecha;
  $("#gastoCategoria").value = gasto.categoria;
}

$("#gastoForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = $("#gastoId").value;
  const data = {
    descripcion: $("#gastoDescripcion").value,
    monto: parseFloat($("#gastoMonto").value),
    fecha: $("#gastoFecha").value,
    categoria: $("#gastoCategoria").value
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_GASTOS}/${id}` : API_GASTOS;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  $("#gastoForm").reset();
  $("#gastoId").value = "";
  $("#gastoForm button").textContent = "Guardar Gasto";
  listarGastos();
});

// ==================== CRUD INGRESOS ====================
async function listarIngresos() {
  try {
    const res = await fetch(API_INGRESOS);
    const ingresos = await res.json();

    const list = $("#ingresosList");
    list.innerHTML = "";
    let total = 0;

    ingresos.forEach(ingreso => {
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
  } catch (error) {
    console.error(error);
  }
}

function cargarIngreso(ingreso) {
  $("#ingresoForm button").textContent = "Actualizar Ingreso";
  $("#ingresoId").value = ingreso.id;
  $("#ingresoDescripcion").value = ingreso.descripcion;
  $("#ingresoMonto").value = ingreso.monto;
  $("#ingresoFecha").value = ingreso.fecha;
  $("#ingresoCategoria").value = ingreso.categoria;
}

$("#ingresoForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = $("#ingresoId").value;
  const data = {
    descripcion: $("#ingresoDescripcion").value,
    monto: parseFloat($("#ingresoMonto").value),
    fecha: $("#ingresoFecha").value,
    categoria: $("#ingresoCategoria").value
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_INGRESOS}/${id}` : API_INGRESOS;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  $("#ingresoForm").reset();
  $("#ingresoId").value = "";
  $("#ingresoForm button").textContent = "Guardar Ingreso";
  listarIngresos();
});

// ==================== INICIALIZACIÓN ====================
listarGastos();
listarIngresos();
