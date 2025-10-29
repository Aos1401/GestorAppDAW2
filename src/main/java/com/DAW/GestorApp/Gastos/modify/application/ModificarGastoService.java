package com.DAW.GestorApp.Gastos.modify.application;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import org.springframework.stereotype.Service;

@Service
public class ModificarGastoService {
    private final GastoRepository gastoRepository;

    public ModificarGastoService(GastoRepository gastoRepository) {
        this.gastoRepository = gastoRepository;
    }

    public Gasto actualizarGasto(Long id, Gasto datosActualizados) {
        Gasto gasto = gastoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));
        gasto.setDescripcion(datosActualizados.getDescripcion());
        gasto.setMonto(datosActualizados.getMonto());
        gasto.setFecha(datosActualizados.getFecha());
        gasto.setCategoria(datosActualizados.getCategoria());
        return gastoRepository.save(gasto);
    }
}
