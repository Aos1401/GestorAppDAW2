package com.DAW.GestorApp.Ingresos.add.infrastructure;

import com.DAW.GestorApp.Ingresos.add.application.AddIngresoRequest;
import com.DAW.GestorApp.Ingresos.add.application.AddIngresosApp;
import com.DAW.GestorApp.Ingresos.add.domain.response.ShowAddIngresoResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingresos")
public class AddIngresoController {

    private final AddIngresosApp addApp;

    public AddIngresoController(AddIngresosApp addApp) {
        this.addApp = addApp;
    }

    @PostMapping
    public ShowAddIngresoResponse add(@Valid @RequestBody AddIngresoRequest request) {
        return addApp.handle(request);
    }
}
