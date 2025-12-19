const gastoForm = $("#gastoForm");
const openGastoFormBtn = $("#openGastoForm");

if (openGastoFormBtn) {
  openGastoFormBtn.addEventListener("click", () => {
    gastoForm.classList.toggle("is-hidden");
  });
}

async function listarGastos() {
  const userId = getUsuarioId();
  if (!userId) return;

  try {
    const res = await fetch(`${API_GASTOS}/${userId}`);
    if (!res.ok) throw new Error("Error fetching gastos");

    const data = await res.json();
    gastosCache = data;

    const list = $("#gastosList");
    list.innerHTML = "";
    let total = 0;

    data.forEach((g) => {
      total += g.monto;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${g.descripcion}</td>
        <td>${fmt(g.monto)}</td>
        <td>${g.fecha}</td>
        <td>${g.categoria}</td>
        <td style="display:flex; gap:8px; align-items:center;">
          <button class="btn btn-outline-attachment" title="Ver adjunto" onclick="verAdjuntoGasto(${g.id})">📎</button>
          <button class="btn btn-outline-attachment" title="Editar" onclick='cargarGasto(${JSON.stringify(g)})'>✏️</button>
          <button class="btn btn-danger" title="Eliminar" style="padding:0.3rem 0.6rem;" onclick='borrarGasto(${g.id})'>🗑️</button>
        </td>
      `;
      list.appendChild(tr);
    });

    $("#totalGastos").textContent = `Total: ${fmt(total)} €`;
    $("#totalGastos").dataset.total = total;

    const tIng = parseFloat($("#totalIngresos")?.dataset.total || 0);
    actualizarResumen(tIng, total);
  } catch (e) {
    console.error(e);
  }
}

window.verAdjuntoGasto = async (id) => {
  try {
    const resp = await fetch(`${API_FILES}/gastos/${id}?t=${Date.now()}`, { method: "GET", cache: "no-store" });
    if (!resp.ok) {
      alert("Este gasto no tiene adjunto.");
      return;
    }
    window.openAdjuntoDefinitivo?.("gastos", id);
  } catch (e) {
    console.error(e);
    alert("No se pudo abrir el adjunto.");
  }
};

window.cargarGasto = async (g) => {
  gastoForm?.classList.remove("is-hidden");
  $("#gastoId").value = g.id;
  $("#gastoDescripcion").value = g.descripcion;
  $("#gastoMonto").value = g.monto;
  $("#gastoFecha").value = g.fecha;
  $("#gastoCategoria").value = g.categoria;

  gastoForm.querySelector("button[type='submit']").textContent = "Actualizar gasto";

  if (window.verificarAdjunto) {
    await window.verificarAdjunto("gastos", g.id, "gasto");
  }
};

window.borrarGasto = async (id) => {
  if (!confirm("¿Eliminar?")) return;
  await fetch(`${API_GASTOS}/${id}`, { method: "DELETE" });
  listarGastos();
};

if (gastoForm) {
  gastoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getUsuarioId();
    const id = $("#gastoId").value;

    const body = {
      descripcion: $("#gastoDescripcion").value,
      monto: parseFloat($("#gastoMonto").value),
      fecha: $("#gastoFecha").value,
      categoria: $("#gastoCategoria").value,
    };

    const url = id ? `${API_GASTOS}/${id}` : `${API_GASTOS}/${userId}`;
    const method = id ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      alert("No se pudo guardar el gasto.");
      return;
    }

    let finalId = id;
    if (!id) {
      const created = await resp.json();
      finalId = created?.id;
    }

    try {
      if (finalId && window.attachTempIfAny) {
        await window.attachTempIfAny("gasto", finalId);
      }
    } catch (err) {
      console.error(err);
      alert("Gasto guardado, pero no se pudo asociar el archivo.");
    }

    gastoForm.reset();
    $("#gastoId").value = "";
    gastoForm.querySelector("button[type='submit']").textContent = "Guardar gasto";

    listarGastos();
  });
}
