
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("app.html")) {
        const userId = getUsuarioId();
        if (!userId) {
            window.location.replace("index.html");
            return;
        }
        console.log("Usuario ID:", userId);

        if (typeof listarGastos === "function") listarGastos();
        if (typeof listarIngresos === "function") listarIngresos();
    }
});

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        window.location.href = "index.html";
    });
}

const drawer = document.getElementById("drawerMovimientos");
const btnUltimos = document.getElementById("btnUltimos");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = drawer ? drawer.querySelector(".drawer__overlay") : null;

if (btnUltimos) {
    btnUltimos.addEventListener("click", () => {
        actualizarUltimosMovimientos();
        if (drawer) drawer.classList.add("drawer--open");
    });
}

function cerrarDrawer() {
    if (drawer) drawer.classList.remove("drawer--open");
}

if (drawerClose) drawerClose.addEventListener("click", cerrarDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", cerrarDrawer);

function actualizarUltimosMovimientos() {
    const cont = document.getElementById("ultimosMovimientos");
    if (!cont) return;

    const combinados = [
        ...ingresosCache.map((i) => ({ ...i, tipo: "Ingreso" })),
        ...gastosCache.map((g) => ({ ...g, tipo: "Gasto" })),
    ];

    combinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const top10 = combinados.slice(0, 10);

    cont.innerHTML = "";
    if (top10.length === 0) {
        cont.innerHTML = `<p style="text-align:center; padding:10px;">Sin movimientos.</p>`;
        return;
    }

    top10.forEach((mov) => {
        const esIngreso = mov.tipo === "Ingreso";
        const color = esIngreso ? "blue" : "orange";
        const signo = esIngreso ? "+" : "-";

        const item = document.createElement("div");
        item.style.padding = "8px";
        item.style.borderBottom = "1px solid #eee";
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold;">
                <span>${mov.tipo}</span>
                <span style="color:${color}">${signo} ${fmt(mov.monto)} €</span>
            </div>
            <div>${mov.descripcion}</div>
            <small>${mov.fecha} - ${mov.categoria}</small>
        `;
        cont.appendChild(item);
    });
}

function actualizarResumen(totalIngresos, totalGastos) {
    const lblIng = $("#totalIngresosResumen");
    const lblGas = $("#totalGastosResumen");
    const lblSaldo = $("#saldoActual");

    if (lblIng) lblIng.textContent = `${fmt(totalIngresos)} €`;
    if (lblGas) lblGas.textContent = `${fmt(totalGastos)} €`;
    if (lblSaldo) lblSaldo.textContent = `${fmt(totalIngresos - totalGastos)} €`;

    actualizarGrafico(totalIngresos, totalGastos);
}

function actualizarGrafico(ingresos, gastos) {
    const ctx = document.getElementById("graficoFinanzas");
    if (!ctx) return;

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Ingresos", "Gastos"],
            datasets: [{
                data: [ingresos, gastos],
                backgroundColor: ["#3B82F6", "#F97316"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}