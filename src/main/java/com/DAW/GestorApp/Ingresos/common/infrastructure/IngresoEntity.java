package com.DAW.GestorApp.Ingresos.common.infrastructure;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ingreso")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class IngresoEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descripcion;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;
    @Column(nullable = false)
    private LocalDate fecha;
}
