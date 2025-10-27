package com.DAW.GestorApp.Ingresos.delete.infrastructure;

import com.DAW.GestorApp.Ingresos.delete.application.DeleteIngresoApp;
import com.DAW.GestorApp.Ingresos.delete.domain.response.DeleteResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingresos")
public class DeleteIngresoController {

    private final DeleteIngresoApp app;

    public DeleteIngresoController(DeleteIngresoApp app) { this.app = app; }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> delete(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(app.handle(id)); // 200 + corpo
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
