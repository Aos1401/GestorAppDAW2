package com.DAW.GestorApp.Gastos.add.application;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import org.springframework.stereotype.Service;

@Service
public class AddGastoService {
    private final GastoRepository gastoRepository;

    public AddGastoService(GastoRepository gastoRepository) {
        this.gastoRepository = gastoRepository;
    }

    public Gasto guardarGasto(Gasto gasto) {
        return gastoRepository.save(gasto);
    }
}
