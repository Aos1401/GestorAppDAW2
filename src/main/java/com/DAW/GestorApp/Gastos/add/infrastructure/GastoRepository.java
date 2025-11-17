package com.DAW.GestorApp.Gastos.add.infrastructure;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    /*COALESCE(SUM(g.monto), 0) asegura que si no hay gastos, devuelva 0.*/
    @Query("SELECT COALESCE(SUM(g.monto), 0) FROM Gasto g")
    double sumAllAmounts();
}