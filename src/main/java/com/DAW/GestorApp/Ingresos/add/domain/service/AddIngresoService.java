package com.DAW.GestorApp.Ingresos.add.domain.service;

import com.DAW.GestorApp.Ingresos.add.domain.response.ShowAddIngresoResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface AddIngresoService {
    ShowAddIngresoResponse add(String descripcion, BigDecimal monto, LocalDate fecha);
}
