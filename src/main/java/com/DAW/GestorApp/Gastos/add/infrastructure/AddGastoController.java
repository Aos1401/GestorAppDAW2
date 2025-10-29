package com.DAW.GestorApp.Gastos.add.infrastructure;

import com.DAW.GestorApp.Gastos.add.application.AddGastoService;
import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gastos")
@CrossOrigin(origins = "*")
public class AddGastoController {

    private final AddGastoService addGastoService;

    public AddGastoController(AddGastoService addGastoService) {
        this.addGastoService = addGastoService;
    }

    @PostMapping
    public Gasto crearGasto(@RequestBody Gasto gasto) {
        return addGastoService.guardarGasto(gasto);
    }
}
