package com.DAW.GestorApp.Ingresos.delete.application;

import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class EliminarIngresoService {
    private final IngresoRepository IngresoRepository;

    public EliminarIngresoService(IngresoRepository IngresoRepository) {
        this.IngresoRepository = IngresoRepository;
    }

    public void eliminarIngreso(Long id) {
        IngresoRepository.deleteById(id);
    }
}

