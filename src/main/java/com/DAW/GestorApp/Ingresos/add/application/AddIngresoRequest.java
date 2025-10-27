package com.DAW.GestorApp.Ingresos.add.application;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AddIngresoRequest(
        String descripcion,
        @NotNull @Positive BigDecimal monto,
        @NotNull LocalDate fecha
) {}
