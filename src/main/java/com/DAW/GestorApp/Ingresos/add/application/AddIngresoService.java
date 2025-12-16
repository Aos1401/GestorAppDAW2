package com.DAW.GestorApp.Ingresos.add.application;

import com.DAW.GestorApp.Auth.domain.Usuario;
import com.DAW.GestorApp.Auth.infrastructure.UsuarioRepository;
import com.DAW.GestorApp.Ingresos.add.domain.Ingreso;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import org.springframework.stereotype.Service;

@Service
public class AddIngresoService {

    private final IngresoRepository ingresoRepository;
    private final UsuarioRepository usuarioRepository; // Necesario para buscar usuario

    public AddIngresoService(IngresoRepository ingresoRepository, UsuarioRepository usuarioRepository) {
        this.ingresoRepository = ingresoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Ingreso guardarIngreso(Ingreso ingreso, Long usuarioId) {
        // 1. Verificar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Asignar usuario
        ingreso.setUsuario(usuario);

        // 3. Guardar
        return ingresoRepository.save(ingreso);
    }
}