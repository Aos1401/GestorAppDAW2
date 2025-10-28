package com.DAW.GestorApp.Gastos.delete.infrastructure;

import com.DAW.GestorApp.Gastos.delete.application.EliminarGastoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gastos")
@CrossOrigin(origins = "*")
public class EliminarGastoController {

    private final EliminarGastoService eliminarGastoService;

    public EliminarGastoController(EliminarGastoService eliminarGastoService) {
        this.eliminarGastoService = eliminarGastoService;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        eliminarGastoService.eliminarGasto(id);
    }
}

