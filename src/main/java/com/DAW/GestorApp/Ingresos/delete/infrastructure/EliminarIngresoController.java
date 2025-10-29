package com.DAW.GestorApp.Ingresos.delete.infrastructure;

import com.DAW.GestorApp.Ingresos.delete.application.EliminarIngresoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin(origins = "*")
public class EliminarIngresoController {

    private final EliminarIngresoService eliminarIngresoService;

    public EliminarIngresoController(EliminarIngresoService eliminarIngresoService) {
        this.eliminarIngresoService = eliminarIngresoService;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        eliminarIngresoService.eliminarIngreso(id);
    }
}

