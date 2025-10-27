package com.DAW.GestorApp.Ingresos.consult.infrastructure.data;

import com.DAW.GestorApp.Ingresos.common.domain.repositories.IngresoRepository;
import com.DAW.GestorApp.Ingresos.consult.domain.response.IngresoView;
import com.DAW.GestorApp.Ingresos.consult.domain.service.ConsultIngresosService;
import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultIngresosServiceImpl implements ConsultIngresosService {

    private final IngresoRepository repo;

    public ConsultIngresosServiceImpl(IngresoRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<IngresoView> listAll() {
        List<IngresoEntity> entities = repo.findAll();
        return entities.stream()
                .map(e -> new IngresoView(e.getId(), e.getDescripcion(), e.getMonto(), e.getFecha()))
                .toList();
    }
}
