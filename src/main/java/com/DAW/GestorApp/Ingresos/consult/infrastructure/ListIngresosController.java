package com.DAW.GestorApp.Ingresos.consult.infrastructure;

import com.DAW.GestorApp.Ingresos.consult.application.ConsultIngresosApp;
import com.DAW.GestorApp.Ingresos.consult.domain.response.IngresoView;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingresos")
public class ListIngresosController {

    private final ConsultIngresosApp app;

    public ListIngresosController(ConsultIngresosApp app) {
        this.app = app;
    }

    @GetMapping
    public List<IngresoView> list() {
        return app.handle();
    }
}
