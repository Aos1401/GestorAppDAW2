package com.DAW.GestorApp.Ingresos.modify.infrastructure;

import com.DAW.GestorApp.Ingresos.modify.application.ModifyIngresoApp;
import com.DAW.GestorApp.Ingresos.modify.application.ModifyIngresoRequest;
import com.DAW.GestorApp.Ingresos.modify.domain.response.ModifyIngresoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingresos")
public class ModifyIngresoController {

    private final ModifyIngresoApp app;

    public ModifyIngresoController(ModifyIngresoApp app) { this.app = app; }

    @PutMapping("/{id}")
    public ResponseEntity<ModifyIngresoResponse> put(@PathVariable Long id, @RequestBody ModifyIngresoRequest body) {
        try {
            return ResponseEntity.ok(app.put(id, body));
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().startsWith("Ingreso não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ModifyIngresoResponse> patch(@PathVariable Long id, @RequestBody ModifyIngresoRequest body) {
        try {
            return ResponseEntity.ok(app.patch(id, body));
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().startsWith("Ingreso não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }
}
