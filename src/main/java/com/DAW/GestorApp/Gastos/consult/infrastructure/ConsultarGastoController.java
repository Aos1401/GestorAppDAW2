package com.DAW.GestorApp.Gastos.consult.infrastructure;

import com.DAW.GestorApp.Gastos.consult.application.ConsultarGastosService;
import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gastos")
@CrossOrigin(origins = "*")
public class ConsultarGastoController {

    private final ConsultarGastosService consultarGastosService;

    public ConsultarGastoController(ConsultarGastosService consultarGastosService) {
        this.consultarGastosService = consultarGastosService;
    }

    @GetMapping
    public List<Gasto> listar() {
        return consultarGastosService.listarGastos();
    }
}
