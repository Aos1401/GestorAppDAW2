package com.DAW.GestorApp.Ingresos.consult.domain.service;

import com.DAW.GestorApp.Ingresos.consult.domain.response.IngresoView;
import java.util.List;

public interface ConsultIngresosService {
    List<IngresoView> listAll();
}
