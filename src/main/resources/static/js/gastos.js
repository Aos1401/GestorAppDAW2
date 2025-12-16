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

        data.forEach(g => {
            total += g.monto;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${g.descripcion}</td>
                <td>${fmt(g.monto)}</td>
                <td>${g.fecha}</td>
                <td>${g.categoria}</td>
                <td>
                    <button class="btn btn-outline-attachment" onclick='cargarGasto(${JSON.stringify(g)})'>✏️</button>
                    <button class="btn btn-danger" style="padding: 0.3rem 0.6rem;" onclick='borrarGasto(${g.id})'>🗑️</button>
                </td>
            `;
            list.appendChild(tr);
        });

        // Actualizar UI Total
        $("#totalGastos").textContent = `Total: ${fmt(total)} €`;
        $("#totalGastos").dataset.total = total;

        // Intentar actualizar resumen global
        const tIng = parseFloat($("#totalIngresos")?.dataset.total || 0);
        actualizarResumen(tIng, total);

    } catch (e) { console.error(e); }
}

window.cargarGasto = (g) => {
    if (gastoForm) gastoForm.classList.remove("is-hidden");
    $("#gastoId").value = g.id;
    $("#gastoDescripcion").value = g.descripcion;
    $("#gastoMonto").value = g.monto;
    $("#gastoFecha").value = g.fecha;
    $("#gastoCategoria").value = g.categoria;
    $("#gastoForm button").textContent = "Actualizar";
};

window.borrarGasto = async (id) => {
    if(!confirm("¿Eliminar?")) return;
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
            categoria: $("#gastoCategoria").value
        };

        const url = id ? `${API_GASTOS}/${id}` : `${API_GASTOS}/${userId}`;
        const method = id ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        gastoForm.reset();
        $("#gastoId").value = "";
        $("#gastoForm button").textContent = "Guardar";
        listarGastos();
    });
}