package com.DAW.GestorApp.Ingresos.modify.infrastructure;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.modify.application.ModificarIngresoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin(origins = "*")
public class ModificarIngresoController {

    private final ModificarIngresoService modificarIngresoService;

    public ModificarIngresoController(ModificarIngresoService modificarIngresoService) {
        this.modificarIngresoService = modificarIngresoService;
    }

    @PutMapping("/{id}")
    public Ingreso actualizar(@PathVariable Long id, @RequestBody Ingreso ingreso) {
        return modificarIngresoService.actualizarIngreso(id, ingreso);
    }
}
