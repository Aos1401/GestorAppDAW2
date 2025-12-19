package com.DAW.GestorApp.Ingresos.consult.application;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConsultarIngresosService {
    private final IngresoRepository ingresoRepository;

    public ConsultarIngresosService(IngresoRepository ingresoRepository) {
        this.ingresoRepository = ingresoRepository;
    }

    public List<Ingreso> listarIngresosPorUsuario(Long usuarioId) {
        return ingresoRepository.findByUsuarioId(usuarioId);
    }
}