package com.DAW.GestorApp.Ingresos.common.application;

import com.DAW.GestorApp.Ingresos.common.domain.model.Ingreso;
import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;

public class IngresoMapper {
    public static Ingreso toDomain(IngresoEntity e) {
        return new Ingreso(e.getId(), e.getDescripcion(), e.getMonto(), e.getFecha());
    }
    public static IngresoEntity toEntity(Ingreso d) {
        var e = new IngresoEntity();
        e.setId(d.id());
        e.setDescripcion(d.descripcion());
        e.setMonto(d.monto());
        e.setFecha(d.fecha());
        return e;
    }
}