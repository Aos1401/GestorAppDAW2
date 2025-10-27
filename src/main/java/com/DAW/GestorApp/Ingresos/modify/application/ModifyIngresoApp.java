package com.DAW.GestorApp.Ingresos.modify.application;

import com.DAW.GestorApp.Ingresos.modify.domain.command.ModifyIngresoCommand;
import com.DAW.GestorApp.Ingresos.modify.domain.response.ModifyIngresoResponse;
import com.DAW.GestorApp.Ingresos.modify.domain.service.ModifyIngresoService;
import org.springframework.stereotype.Service;

@Service
public class ModifyIngresoApp {

    private final ModifyIngresoService service;

    public ModifyIngresoApp(ModifyIngresoService service) {
        this.service = service;
    }

    public ModifyIngresoResponse put(Long id, ModifyIngresoRequest req) {
        return service.update(id, new ModifyIngresoCommand(req.descripcion(), req.monto(), req.fecha()), false);
    }

    public ModifyIngresoResponse patch(Long id, ModifyIngresoRequest req) {
        return service.update(id, new ModifyIngresoCommand(req.descripcion(), req.monto(), req.fecha()), true);
    }
}
