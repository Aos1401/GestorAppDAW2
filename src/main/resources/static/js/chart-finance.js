// Variable global para el gráfico (Chart.js)
let grafico = null;

function actualizarResumen(totalIngresos, totalGastos) {
    // 1. Actualizar las tarjetas de números
    const lblIng = $("#totalIngresosResumen");
    const lblGas = $("#totalGastosResumen");
    const lblSaldo = $("#saldoActual");

    if (lblIng) lblIng.textContent = `${fmt(totalIngresos)} €`;
    if (lblGas) lblGas.textContent = `${fmt(totalGastos)} €`;
    
    if (lblSaldo) {
        const saldo = totalIngresos - totalGastos;
        lblSaldo.textContent = `${fmt(saldo)} €`;
        // Poner en rojo si es negativo
        lblSaldo.style.color = saldo < 0 ? "#e11d48" : "inherit";
    }

    // 2. Actualizar el gráfico
    actualizarGrafico(totalIngresos, totalGastos);
}

function actualizarGrafico(totalIngresos, totalGastos) {
    const ctx = document.getElementById("graficoFinanzas");
    if (!ctx) return;

    // Si no hay datos, mostramos un gráfico vacío o ceros
    const datos = [totalIngresos, totalGastos];
    
    const data = {
        labels: ["Ingresos", "Gastos"],
        datasets: [
            {
                data: datos,
                backgroundColor: ["#3B82F6", "#F97316"], // Azul e Ingreso
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    boxWidth: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${fmt(context.raw)} €`
                }
            }
        },
    };

    // Si ya existe un gráfico previo, lo destruimos para crear el nuevo
    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "doughnut", // O "pie" si prefieres pastel completo
        data: data,
        options: options,
    });
}