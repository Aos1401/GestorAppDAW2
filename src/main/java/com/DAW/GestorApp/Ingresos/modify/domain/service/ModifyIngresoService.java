package com.DAW.GestorApp.Ingresos.modify.domain.service;

import com.DAW.GestorApp.Ingresos.modify.domain.response.ModifyIngresoResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ModifyIngresoService {
    ModifyIngresoResponse update(
            Long id,
            String descripcion,
            BigDecimal monto,
            LocalDate fecha,
            boolean partial
    );
}
