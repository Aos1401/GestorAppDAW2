package com.DAW.GestorApp.Ingresos.add.infrastructure.data;

import com.DAW.GestorApp.Ingresos.add.domain.response.ShowAddIngresoResponse;
import com.DAW.GestorApp.Ingresos.add.domain.service.AddIngresoService;
import com.DAW.GestorApp.Ingresos.common.domain.model.Ingreso;
import com.DAW.GestorApp.Ingresos.common.application.IngresoMapper;
import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;
import com.DAW.GestorApp.Ingresos.common.domain.repositories.IngresoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class AddIngresoServiceImpl implements AddIngresoService {

    private final IngresoRepository repo;

    public AddIngresoServiceImpl(IngresoRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public ShowAddIngresoResponse add(String descripcion, BigDecimal monto, LocalDate fecha) {
        Ingreso dom = new Ingreso(null, descripcion, monto, fecha);
        IngresoEntity saved = repo.save(IngresoMapper.toEntity(dom));
        var d = IngresoMapper.toDomain(saved);
        return new ShowAddIngresoResponse(d.id(), d.descripcion(), d.monto(), d.fecha());
    }
}
