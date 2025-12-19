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

    // Ordenar por fecha (más reciente primero)
    combinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Coger solo los 10 primeros
    const top10 = combinados.slice(0, 10);

    cont.innerHTML = "";

    if (top10.length === 0) {
        cont.innerHTML = `<p style="text-align:center; opacity:0.6;">No hay movimientos aún.</p>`;
        return;
    }

    top10.forEach((mov) => {
        const esIngreso = mov.tipo === "Ingreso";
        const signo = esIngreso ? "+" : "-";
        const claseColor = esIngreso ? "text-blue-600" : "text-orange-600"; // Clases ejemplo o estilos inline

        const item = document.createElement("div");
        item.className = "ultimos-item"; // Asegúrate de tener CSS para esto o usa estilos simples
        item.style.padding = "10px";
        item.style.borderBottom = "1px solid #eee";

        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:500;">
                <span>${mov.tipo}</span>
                <span style="${esIngreso ? 'color:#2563eb' : 'color:#ea580c'}">
                    ${signo} ${fmt(mov.monto)} €
                </span>
            </div>
            <div style="font-size:0.9em; color:#555;">${mov.descripcion}</div>
            <div style="font-size:0.8em; color:#999; display:flex; justify-content:space-between; margin-top:4px;">
                <span>${mov.fecha}</span>
                <span>${mov.categoria}</span>
            </div>
        `;
        cont.appendChild(item);
    });
}