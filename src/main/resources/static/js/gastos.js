const gastoForm = $("#gastoForm");
const openGastoFormBtn = $("#openGastoForm");

if (openGastoFormBtn && gastoForm) {
  openGastoFormBtn.addEventListener("click", () => {
    gastoForm.classList.toggle("is-hidden");
  });
}

async function listarGastos() {
  try {
    const res = await fetch(API_GASTOS);
    const gastos = await res.json();

    gastosCache = gastos; // usado no drawer

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

if (gastoForm) {
  gastoForm.addEventListener("submit", async (e) => {
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

    gastoForm.reset();
    $("#gastoId").value = "";
    $("#gastoForm button").textContent = "Guardar Gasto";
    listarGastos();
  });
}
