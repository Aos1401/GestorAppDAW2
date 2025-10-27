package com.DAW.GestorApp.Ingresos.consult.domain.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IngresoView(Long id, String descripcion, BigDecimal monto, LocalDate fecha) {}
