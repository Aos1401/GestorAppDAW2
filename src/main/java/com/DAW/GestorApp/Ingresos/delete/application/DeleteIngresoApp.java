package com.DAW.GestorApp.Ingresos.delete.application;

import com.DAW.GestorApp.Ingresos.delete.domain.response.DeleteResponse;
import com.DAW.GestorApp.Ingresos.delete.domain.service.DeleteIngresoService;
import org.springframework.stereotype.Service;

@Service
public class DeleteIngresoApp {

    private final DeleteIngresoService service;

    public DeleteIngresoApp(DeleteIngresoService service) { this.service = service; }

    public DeleteResponse handle(Long id) {
        return service.deleteById(id);
    }
}
