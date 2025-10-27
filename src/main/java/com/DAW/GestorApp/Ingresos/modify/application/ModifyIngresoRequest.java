package com.DAW.GestorApp.Ingresos.modify.application;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ModifyIngresoRequest(String descripcion, BigDecimal monto, LocalDate fecha) {}
