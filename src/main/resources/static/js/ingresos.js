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

        data.forEach(i => {
            total += i.monto;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${i.descripcion}</td>
                <td>${fmt(i.monto)}</td>
                <td>${i.fecha}</td>
                <td>${i.categoria}</td>
                <td>
                    <button class="btn btn-outline-attachment" onclick='cargarIngreso(${JSON.stringify(i)})'>✏️</button>
                    <button class="btn btn-danger" style="padding: 0.3rem 0.6rem;" onclick='borrarIngreso(${i.id})'>🗑️</button>
                </td>
            `;
            list.appendChild(tr);
        });

        $("#totalIngresos").textContent = `Total: ${fmt(total)} €`;
        $("#totalIngresos").dataset.total = total;

        const tGas = parseFloat($("#totalGastos")?.dataset.total || 0);
        actualizarResumen(total, tGas);

    } catch (e) { console.error(e); }
}

window.cargarIngreso = (i) => {
    if (ingresoForm) ingresoForm.classList.remove("is-hidden");
    $("#ingresoId").value = i.id;
    $("#ingresoDescripcion").value = i.descripcion;
    $("#ingresoMonto").value = i.monto;
    $("#ingresoFecha").value = i.fecha;
    $("#ingresoCategoria").value = i.categoria;
    $("#ingresoForm button").textContent = "Actualizar";
};

window.borrarIngreso = async (id) => {
    if(!confirm("¿Eliminar?")) return;
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
            categoria: $("#ingresoCategoria").value
        };

        const url = id ? `${API_INGRESOS}/${id}` : `${API_INGRESOS}/${userId}`;
        const method = id ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        ingresoForm.reset();
        $("#ingresoId").value = "";
        $("#ingresoForm button").textContent = "Guardar";
        listarIngresos();
    });
}