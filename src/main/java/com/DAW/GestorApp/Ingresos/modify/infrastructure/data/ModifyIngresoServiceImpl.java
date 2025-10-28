package com.DAW.GestorApp.Ingresos.modify.infrastructure.data;

import com.DAW.GestorApp.Ingresos.common.domain.repositories.IngresoRepository;
import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;
import com.DAW.GestorApp.Ingresos.modify.application.ModifyIngresoRequest;
import com.DAW.GestorApp.Ingresos.modify.domain.response.ModifyIngresoResponse;
import com.DAW.GestorApp.Ingresos.modify.domain.service.ModifyIngresoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ModifyIngresoServiceImpl implements ModifyIngresoService {

    private final IngresoRepository repo;

    public ModifyIngresoServiceImpl(IngresoRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public ModifyIngresoResponse update(Long id, ModifyIngresoRequest req, boolean partial) {
        IngresoEntity e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingreso não encontrado com ID: " + id));

        if (partial) {
            if (req.descripcion() != null) e.setDescripcion(req.descripcion());
            if (req.monto() != null)       e.setMonto(req.monto());
            if (req.fecha() != null)       e.setFecha(req.fecha());
        } else {
            if (req.descripcion() == null || req.monto() == null || req.fecha() == null)
                throw new RuntimeException("PUT requer descripcion, monto e fecha.");
            e.setDescripcion(req.descripcion());
            e.setMonto(req.monto());
            e.setFecha(req.fecha());
        }

        IngresoEntity s = repo.save(e);
        return new ModifyIngresoResponse(s.getId(), s.getDescripcion(), s.getMonto(), s.getFecha());
    }
}
