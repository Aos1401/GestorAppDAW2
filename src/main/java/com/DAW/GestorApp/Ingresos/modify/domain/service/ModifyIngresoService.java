package com.DAW.GestorApp.Ingresos.modify.domain.service;

import com.DAW.GestorApp.Ingresos.modify.application.ModifyIngresoRequest;
import com.DAW.GestorApp.Ingresos.modify.domain.response.ModifyIngresoResponse;

public interface ModifyIngresoService {
    ModifyIngresoResponse update(Long id, ModifyIngresoRequest req, boolean partial);
}
