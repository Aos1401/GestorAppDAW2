let grafico = null;

function actualizarResumen(totalIngresos, totalGastos) {
    const lblIng = $("#totalIngresosResumen");
    const lblGas = $("#totalGastosResumen");
    const lblSaldo = $("#saldoActual");

    if (lblIng) lblIng.textContent = `${fmt(totalIngresos)} €`;
    if (lblGas) lblGas.textContent = `${fmt(totalGastos)} €`;
    
    if (lblSaldo) {
        const saldo = totalIngresos - totalGastos;
        lblSaldo.textContent = `${fmt(saldo)} €`;
        lblSaldo.style.color = saldo < 0 ? "#e11d48" : "inherit";
    }

    actualizarGrafico(totalIngresos, totalGastos);
}

function actualizarGrafico(totalIngresos, totalGastos) {
  const ctx = document.getElementById("graficoFinanzas");
  if (!ctx) return;

  const datos = [totalIngresos, totalGastos];

  if (grafico) {
    grafico.data.datasets[0].data = datos;
    grafico.update(); // 🔥 anima suavemente
    return;
  }

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Ingresos", "Gastos"],
      datasets: [
        {
          data: datos,
          backgroundColor: ["#3B82F6", "#F97316"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 700,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label: (c) => ` ${c.label}: ${fmt(c.raw)} €`,
          },
        },
      },
    },
  });
}
