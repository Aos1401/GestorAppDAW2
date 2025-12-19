package com.DAW.GestorApp.Ingresos.add.application;

import com.DAW.GestorApp.Auth.domain.Usuario;
import com.DAW.GestorApp.Auth.infrastructure.UsuarioRepository;
import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class AddIngresoService {

    private final IngresoRepository ingresoRepository;
    private final UsuarioRepository usuarioRepository;

    public AddIngresoService(IngresoRepository ingresoRepository, UsuarioRepository usuarioRepository) {
        this.ingresoRepository = ingresoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Ingreso guardarIngreso(Ingreso ingreso, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        ingreso.setUsuario(usuario);
        return ingresoRepository.save(ingreso);
    }
}