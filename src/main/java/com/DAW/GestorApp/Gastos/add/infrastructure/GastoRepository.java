package com.DAW.GestorApp.Gastos.add.infrastructure;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    List<Gasto> findByUsuarioId(Long usuarioId);

    // Suma total de gastos de un usuario (devuelve 0 si es null)
    @Query("SELECT COALESCE(SUM(g.monto), 0) FROM Gasto g WHERE g.usuario.id = :usuarioId")
    Double sumMontoByUsuarioId(Long usuarioId);
}