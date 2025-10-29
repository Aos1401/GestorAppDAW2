package com.DAW.GestorApp.Ingresos.consult.application;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConsultarIngresosService {
    private final IngresoRepository IngresoRepository;

    public ConsultarIngresosService(IngresoRepository IngresoRepository) {
        this.IngresoRepository = IngresoRepository;
    }

    public List<Ingreso> listarIngresos() {
        return IngresoRepository.findAll();
    }
}
