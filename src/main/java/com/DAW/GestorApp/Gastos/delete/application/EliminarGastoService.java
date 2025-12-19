package com.DAW.GestorApp.Gastos.delete.application;

import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import org.springframework.stereotype.Service;

@Service
public class EliminarGastoService {
    private final GastoRepository gastoRepository;

    public EliminarGastoService(GastoRepository gastoRepository) {
        this.gastoRepository = gastoRepository;
    }

    public void eliminarGasto(Long id) {
        gastoRepository.deleteById(id);
    }
}

