function actualizarResumen(totalIngresos, totalGastos) {
  $("#totalIngresosResumen").textContent = `${fmt(totalIngresos)} €`;
  $("#totalGastosResumen").textContent = `${fmt(totalGastos)} €`;
  $("#saldoActual").textContent = `${fmt(totalIngresos - totalGastos)} €`;
  actualizarGrafico(totalIngresos, totalGastos);
}

function actualizarGrafico(totalIngresos, totalGastos) {
  const ctx = document.getElementById("graficoFinanzas");
  if (!ctx) return;

  const data = {
    labels: ["Ingresos", "Gastos"],
    datasets: [
      {
        data: [totalIngresos, totalGastos],
        // cores chapadas, sem borda escura
        backgroundColor: ["#3B82F6", "#F97316"], // azul ingressos, laranja gastos
        borderWidth: 0,          // SEM borda
        hoverBorderWidth: 0,
        hoverOffset: 6           // só um efeito leve ao passar o mouse
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1, // força formato mais redondinho
    layout: {
      padding: 4,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded", // caixinha clean
          boxWidth: 14,
          boxHeight: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${fmt(context.parsed)} €`,
        },
      },
    },
  };

  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, { type: "pie", data, options });
}
