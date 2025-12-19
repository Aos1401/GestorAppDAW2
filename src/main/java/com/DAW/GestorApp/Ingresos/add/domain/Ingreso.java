package com.DAW.GestorApp.Ingresos.add.domain;

import com.DAW.GestorApp.Auth.domain.Usuario;
import com.DAW.GestorApp.eNum.MovementCategory;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ingreso")
public class Ingreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private double monto;
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private MovementCategory categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    // ESTO EVITA EL ERROR DE SERIALIZACIÓN
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "email"})
    private Usuario usuario;

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

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}