package com.DAW.GestorApp.Ingresos.modify.infrastructure.data;

import com.DAW.GestorApp.Ingresos.common.domain.repositories.IngresoRepository;
import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;
import com.DAW.GestorApp.Ingresos.modify.domain.command.ModifyIngresoCommand;
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
    public ModifyIngresoResponse update(Long id, ModifyIngresoCommand cmd, boolean partial) {
        IngresoEntity e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingreso não encontrado com ID: " + id));

        if (partial) {
            if (cmd.descripcion() != null) e.setDescripcion(cmd.descripcion());
            if (cmd.monto() != null)       e.setMonto(cmd.monto());
            if (cmd.fecha() != null)       e.setFecha(cmd.fecha());
        } else {
            if (cmd.descripcion() == null || cmd.monto() == null || cmd.fecha() == null) {
                throw new RuntimeException("PUT requer descripcion, monto e fecha.");
            }
            e.setDescripcion(cmd.descripcion());
            e.setMonto(cmd.monto());
            e.setFecha(cmd.fecha());
        }

        IngresoEntity s = repo.save(e);
        return new ModifyIngresoResponse(s.getId(), s.getDescripcion(), s.getMonto(), s.getFecha());
    }
}
