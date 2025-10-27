package com.DAW.GestorApp.Ingresos.common.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Ingreso(Long id, String descripcion, BigDecimal monto, LocalDate fecha) {}
