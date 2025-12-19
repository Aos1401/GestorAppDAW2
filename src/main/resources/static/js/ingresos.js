const ingresoForm = $("#ingresoForm");
const openIngresoFormBtn = $("#openIngresoForm");

if (openIngresoFormBtn) {
  openIngresoFormBtn.addEventListener("click", () => {
    ingresoForm.classList.toggle("is-hidden");
  });
}

async function listarIngresos() {
  const userId = getUsuarioId();
  if (!userId) return;

  try {
    const res = await fetch(`${API_INGRESOS}/${userId}`);
    if (!res.ok) throw new Error("Error fetching ingresos");

    const data = await res.json();
    ingresosCache = data;

    const list = $("#ingresosList");
    list.innerHTML = "";
    let total = 0;

    data.forEach((i) => {
      total += i.monto;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i.descripcion}</td>
        <td>${fmt(i.monto)}</td>
        <td>${i.fecha}</td>
        <td>${i.categoria}</td>
        <td style="display:flex; gap:8px; align-items:center;">
          <button class="btn btn-outline-attachment" title="Ver adjunto" onclick="verAdjuntoIngreso(${i.id})">📎</button>
          <button class="btn btn-outline-attachment" title="Editar" onclick='cargarIngreso(${JSON.stringify(i)})'>✏️</button>
          <button class="btn btn-danger" title="Eliminar" style="padding:0.3rem 0.6rem;" onclick='borrarIngreso(${i.id})'>🗑️</button>
        </td>
      `;
      list.appendChild(tr);
    });

    $("#totalIngresos").textContent = `Total: ${fmt(total)} €`;
    $("#totalIngresos").dataset.total = total;

    const tGas = parseFloat($("#totalGastos")?.dataset.total || 0);
    actualizarResumen(total, tGas);
  } catch (e) {
    console.error(e);
  }
}

window.verAdjuntoIngreso = async (id) => {
  try {
    const resp = await fetch(`${API_FILES}/ingresos/${id}?t=${Date.now()}`, { method: "GET", cache: "no-store" });
    if (!resp.ok) {
      alert("Este ingreso no tiene adjunto.");
      return;
    }
    window.openAdjuntoDefinitivo?.("ingresos", id);
  } catch (e) {
    console.error(e);
    alert("No se pudo abrir el adjunto.");
  }
};

window.cargarIngreso = async (i) => {
  ingresoForm?.classList.remove("is-hidden");
  $("#ingresoId").value = i.id;
  $("#ingresoDescripcion").value = i.descripcion;
  $("#ingresoMonto").value = i.monto;
  $("#ingresoFecha").value = i.fecha;
  $("#ingresoCategoria").value = i.categoria;

  ingresoForm.querySelector("button[type='submit']").textContent = "Actualizar ingreso";

  // Verifica adjunto definitivo y alterna botones del form
  if (window.verificarAdjunto) {
    await window.verificarAdjunto("ingresos", i.id, "ingreso");
  }
};

window.borrarIngreso = async (id) => {
  if (!confirm("¿Eliminar?")) return;
  await fetch(`${API_INGRESOS}/${id}`, { method: "DELETE" });
  listarIngresos();
};

if (ingresoForm) {
  ingresoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getUsuarioId();
    const id = $("#ingresoId").value;

    const body = {
      descripcion: $("#ingresoDescripcion").value,
      monto: parseFloat($("#ingresoMonto").value),
      fecha: $("#ingresoFecha").value,
      categoria: $("#ingresoCategoria").value,
    };

    const url = id ? `${API_INGRESOS}/${id}` : `${API_INGRESOS}/${userId}`;
    const method = id ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      alert("No se pudo guardar el ingreso.");
      return;
    }

    let finalId = id;
    if (!id) {
      const created = await resp.json(); // tu controller devuelve Ingreso => JSON con id
      finalId = created?.id;
    }

    try {
      if (finalId && window.attachTempIfAny) {
        await window.attachTempIfAny("ingreso", finalId);
      }
    } catch (err) {
      console.error(err);
      alert("Ingreso guardado, pero no se pudo asociar el archivo.");
    }

    ingresoForm.reset();
    $("#ingresoId").value = "";
    ingresoForm.querySelector("button[type='submit']").textContent = "Guardar ingreso";

    listarIngresos();
  });
}
