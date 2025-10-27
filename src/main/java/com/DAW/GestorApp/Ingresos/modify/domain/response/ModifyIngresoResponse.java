package com.DAW.GestorApp.Ingresos.modify.domain.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ModifyIngresoResponse(Long id, String descripcion, BigDecimal monto, LocalDate fecha) {}
