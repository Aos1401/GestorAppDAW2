package com.DAW.GestorApp.Gastos.modify.infrastructure;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import com.DAW.GestorApp.Gastos.modify.application.ModificarGastoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gastos")
@CrossOrigin(origins = "*")
public class ModificarGastoController {

    private final ModificarGastoService modificarGastoService;

    public ModificarGastoController(ModificarGastoService modificarGastoService) {
        this.modificarGastoService = modificarGastoService;
    }

    @PutMapping("/{id}")
    public Gasto actualizar(@PathVariable Long id, @RequestBody Gasto gasto) {
        return modificarGastoService.actualizarGasto(id, gasto);
    }
}
