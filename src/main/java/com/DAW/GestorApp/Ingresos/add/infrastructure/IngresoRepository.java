package com.DAW.GestorApp.Ingresos.add.infrastructure;

import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {

    List<Ingreso> findByUsuarioId(Long usuarioId);

    // Suma total de ingresos de un usuario (devuelve 0 si es null)
    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i WHERE i.usuario.id = :usuarioId")
    Double sumMontoByUsuarioId(Long usuarioId);
}