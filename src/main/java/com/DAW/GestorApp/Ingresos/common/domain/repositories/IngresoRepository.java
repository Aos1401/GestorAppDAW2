package com.DAW.GestorApp.Ingresos.common.domain.repositories;

import com.DAW.GestorApp.Ingresos.common.infrastructure.IngresoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngresoRepository extends JpaRepository<IngresoEntity, Long> {}
