package com.DAW.GestorApp.Gastos.add.infrastructure;


import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {
}

