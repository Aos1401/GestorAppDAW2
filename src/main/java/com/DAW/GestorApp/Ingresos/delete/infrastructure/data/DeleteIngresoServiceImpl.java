package com.DAW.GestorApp.Ingresos.delete.infrastructure.data;

import com.DAW.GestorApp.Ingresos.common.domain.repositories.IngresoRepository;
import com.DAW.GestorApp.Ingresos.delete.domain.response.DeleteResponse;
import com.DAW.GestorApp.Ingresos.delete.domain.service.DeleteIngresoService;
import org.springframework.stereotype.Service;

@Service
public class DeleteIngresoServiceImpl implements DeleteIngresoService {

    private final IngresoRepository repo;

    public DeleteIngresoServiceImpl(IngresoRepository repo) { this.repo = repo; }

    @Override
    public DeleteResponse deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Ingreso não encontrado com ID: " + id);
        }
        repo.deleteById(id);
        return new DeleteResponse(id, true, "Ingreso deletado");
    }
}
