package com.DAW.GestorApp.Ingresos.add.infrastructure;

import com.DAW.GestorApp.Ingresos.add.application.AddIngresoService;
import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin(origins = "*")
public class AddIngresoController {

    private final AddIngresoService addIngresoService;

    public AddIngresoController(AddIngresoService addIngresoService) {
        this.addIngresoService = addIngresoService;
    }


    @PostMapping("/{usuarioId}")
    public Ingreso crearIngreso(@RequestBody Ingreso ingreso, @PathVariable Long usuarioId) {
        return addIngresoService.guardarIngreso(ingreso, usuarioId);
    }
}