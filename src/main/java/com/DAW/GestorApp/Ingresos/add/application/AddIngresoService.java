package com.DAW.GestorApp.Ingresos.add.application;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class AddIngresoService {
    private final IngresoRepository IngresoRepository;

    public AddIngresoService(IngresoRepository IngresoRepository) {
        this.IngresoRepository = IngresoRepository;
    }

    public Ingreso guardarIngreso(Ingreso ingreso) {
        return IngresoRepository.save(ingreso);
    }
}
