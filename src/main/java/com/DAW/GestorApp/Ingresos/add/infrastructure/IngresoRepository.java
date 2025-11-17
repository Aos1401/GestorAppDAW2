package com.DAW.GestorApp.Ingresos.add.infrastructure;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // ¡NECESITAS ESTE IMPORT!
import org.springframework.stereotype.Repository;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {

    /**
     * Suma todos los montos de la tabla Ingreso.
     * COALESCE(SUM(i.monto), 0) asegura que si no hay ingresos, devuelva 0.
     */
    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i")
    double sumAllAmounts(); // <-- ¡Aquí se define el método!
}