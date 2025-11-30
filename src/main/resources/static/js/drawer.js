// elementos do drawer
const drawer = document.getElementById("drawerMovimientos");
const btnUltimos = document.getElementById("btnUltimos");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = drawer ? drawer.querySelector(".drawer__overlay") : null;

function abrirDrawer() {
  if (!drawer) return;
  drawer.classList.add("drawer--open");
}

function cerrarDrawer() {
  if (!drawer) return;
  drawer.classList.remove("drawer--open");
}

if (btnUltimos) {
  btnUltimos.addEventListener("click", () => {
    actualizarUltimosMovimientos();
    abrirDrawer();
  });
}

if (drawerClose) {
  drawerClose.addEventListener("click", cerrarDrawer);
}

if (drawerOverlay) {
  drawerOverlay.addEventListener("click", cerrarDrawer);
}

// monta a listinha dos últimos movimentos (5 mais recentes)
function actualizarUltimosMovimientos() {
  const cont = document.getElementById("ultimosMovimientos");
  if (!cont) return;

  const combinados = [
    ...ingresosCache.map((i) => ({
      tipo: "Ingreso",
      descripcion: i.descripcion,
      monto: i.monto,
      fecha: i.fecha,
      categoria: i.categoria,
    })),
    ...gastosCache.map((g) => ({
      tipo: "Gasto",
      descripcion: g.descripcion,
      monto: g.monto,
      fecha: g.fecha,
      categoria: g.categoria,
    })),
  ];

  combinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const top5 = combinados.slice(0, 5);

  cont.innerHTML = "";

  if (top5.length === 0) {
    cont.innerHTML = `<p class="ultimos-empty">Todavía no hay movimientos registrados.</p>`;
    return;
  }

  top5.forEach((mov) => {
    const item = document.createElement("div");
    item.className = "ultimos-item";
    item.innerHTML = `
      <div class="ultimos-item__header">
        <span class="ultimos-tipo ultimos-tipo--${
          mov.tipo === "Ingreso" ? "ingreso" : "gasto"
        }">
          ${mov.tipo}
        </span>
        <span class="ultimos-monto">
          ${mov.tipo === "Ingreso" ? "+" : "-"} ${fmt(mov.monto)} €
        </span>
      </div>
      <div class="ultimos-item__body">
        <span class="ultimos-desc">${mov.descripcion || "Sin descripción"}</span>
      </div>
      <div class="ultimos-item__meta">
        <span>${mov.fecha || ""}</span>
        <span>${mov.categoria || ""}</span>
      </div>
    `;
    cont.appendChild(item);
  });
}
