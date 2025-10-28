package com.DAW.GestorApp.Gastos.consult.application;

import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConsultarGastosService {
    private final GastoRepository gastoRepository;

    public ConsultarGastosService(GastoRepository gastoRepository) {
        this.gastoRepository = gastoRepository;
    }

    public List<Gasto> listarGastos() {
        return gastoRepository.findAll();
    }
}
