package com.DAW.GestorApp.Gastos.add.domain;

import com.DAW.GestorApp.eNum.MovementCategory;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "gasto")
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private double monto;
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private MovementCategory categoria;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public double getMonto() { return monto; }
    public void setMonto(double monto) { this.monto = monto; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public MovementCategory getCategoria() { return categoria; }
    public void setCategoria(MovementCategory categoria) { this.categoria = categoria; }
}
