package com.DAW.GestorApp.Ingresos.add.domain.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ShowAddIngresoResponse(Long id, String descripcion, BigDecimal monto, LocalDate fecha) {}
