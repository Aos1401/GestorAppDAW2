package com.DAW.GestorApp.Ingresos.add.application;

import com.DAW.GestorApp.Ingresos.add.domain.response.ShowAddIngresoResponse;
import com.DAW.GestorApp.Ingresos.add.domain.service.AddIngresoService;
import org.springframework.stereotype.Service;

@Service
public class AddIngresosApp {

    private final AddIngresoService service;

    public AddIngresosApp(AddIngresoService service) {
        this.service = service;
    }

    public ShowAddIngresoResponse handle(AddIngresoRequest request) {
        return service.add(request.descripcion(), request.monto(), request.fecha());
    }
}
