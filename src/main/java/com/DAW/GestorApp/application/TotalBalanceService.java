package com.DAW.GestorApp.application;

import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class TotalBalanceService {

    private final GastoRepository gastoRepository;
    private final IngresoRepository ingresoRepository;

    public TotalBalanceService(GastoRepository gastoRepository, IngresoRepository ingresoRepository) {
        this.gastoRepository = gastoRepository;
        this.ingresoRepository = ingresoRepository;
    }

    public double calculateTotalBalance() {
        double totalIngresos = ingresoRepository.sumAllAmounts();
        double totalGastos = gastoRepository.sumAllAmounts();
        return totalIngresos - totalGastos;
    }
}
