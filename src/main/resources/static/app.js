const API_URL = "http://localhost:8081/gastos";

// Listar gastos
async function listarGastos() {
    const res = await fetch(API_URL);
    const gastos = await res.json();

    const list = document.getElementById("gastosList");
    list.innerHTML = "";

    let total = 0;

    gastos.forEach(gasto => {
        total += gasto.monto;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${gasto.descripcion}</td>
            <td>${gasto.monto.toFixed(2)}</td>
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
            await fetch(`${API_URL}/${gasto.id}`, { method: "DELETE" });
            listarGastos();
        };

        list.appendChild(tr);
    });

    document.getElementById("totalGastos").textContent = `Total: ${total.toFixed(2)} €`;
}

// Cargar gasto en el formulario para editar
function cargarGasto(gasto) {
    document.getElementById("gastoId").value = gasto.id;
    document.getElementById("descripcion").value = gasto.descripcion;
    document.getElementById("monto").value = gasto.monto;
    document.getElementById("fecha").value = gasto.fecha;
    document.getElementById("categoria").value = gasto.categoria;
}

// Manejar formulario para crear o actualizar
document.getElementById("gastoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("gastoId").value;

    const gastoData = {
        descripcion: document.getElementById("descripcion").value,
        monto: parseFloat(document.getElementById("monto").value),
        fecha: document.getElementById("fecha").value,
        categoria: document.getElementById("categoria").value
    };

    if (id) {
        // Actualizar
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gastoData)
        });
    } else {
        // Crear
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gastoData)
        });
    }

    document.getElementById("gastoForm").reset();
    listarGastos();
});

// Inicializar lista
listarGastos();
