const ingresoForm = $("#ingresoForm");
const openIngresoFormBtn = $("#openIngresoForm");

if (openIngresoFormBtn && ingresoForm) {
  openIngresoFormBtn.addEventListener("click", () => {
    ingresoForm.classList.toggle("is-hidden");
  });
}

async function listarIngresos() {
  try {
    const res = await fetch(API_INGRESOS);
    const ingresos = await res.json();

    ingresosCache = ingresos; // usado no drawer

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

if (ingresoForm) {
  ingresoForm.addEventListener("submit", async (e) => {
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

    ingresoForm.reset();
    $("#ingresoId").value = "";
    $("#ingresoForm button").textContent = "Guardar Ingreso";
    listarIngresos();
  });
}
