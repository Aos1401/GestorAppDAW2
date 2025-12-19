package com.DAW.GestorApp.Ingresos.consult.infrastructure;

import com.DAW.GestorApp.Ingresos.consult.application.ConsultarIngresosService;
import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin(origins = "*")
public class ConsultarIngresoController {

    private final ConsultarIngresosService consultarIngresosService;

    public ConsultarIngresoController(ConsultarIngresosService consultarIngresosService) {
        this.consultarIngresosService = consultarIngresosService;
    }


    @GetMapping("/{usuarioId}")
    public List<Ingreso> listar(@PathVariable Long usuarioId) {
        return consultarIngresosService.listarIngresosPorUsuario(usuarioId);
    }
}