package com.DAW.GestorApp.Ingresos.modify.application;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class ModificarIngresoService {
    private final IngresoRepository IngresoRepository;

    public ModificarIngresoService(IngresoRepository IngresoRepository) {
        this.IngresoRepository = IngresoRepository;
    }

    public Ingreso actualizarIngreso(Long id, Ingreso datosActualizados) {
        Ingreso ingreso = IngresoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingreso no encontrado"));
        ingreso.setDescripcion(datosActualizados.getDescripcion());
        ingreso.setMonto(datosActualizados.getMonto());
        ingreso.setFecha(datosActualizados.getFecha());
        ingreso.setCategoria(datosActualizados.getCategoria());
        return IngresoRepository.save(ingreso);
    }
}
