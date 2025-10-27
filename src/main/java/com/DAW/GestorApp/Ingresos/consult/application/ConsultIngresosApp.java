package com.DAW.GestorApp.Ingresos.consult.application;

import com.DAW.GestorApp.Ingresos.consult.domain.response.IngresoView;
import com.DAW.GestorApp.Ingresos.consult.domain.service.ConsultIngresosService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultIngresosApp {

    private final ConsultIngresosService service;

    public ConsultIngresosApp(ConsultIngresosService service) {
        this.service = service;
    }

    public List<IngresoView> handle() {
        return service.listAll();
    }
}
