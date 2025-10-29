package com.DAW.GestorApp.Ingresos.add.infrastructure;


import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {
}

