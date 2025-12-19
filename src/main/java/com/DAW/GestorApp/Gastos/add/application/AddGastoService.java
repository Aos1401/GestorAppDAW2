package com.DAW.GestorApp.Gastos.add.application;

import com.DAW.GestorApp.Auth.domain.Usuario;
import com.DAW.GestorApp.Auth.infrastructure.UsuarioRepository;
import com.DAW.GestorApp.Gastos.add.domain.Gasto;
import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import org.springframework.stereotype.Service;

@Service
public class AddGastoService {
    private final GastoRepository gastoRepository;
    private final UsuarioRepository usuarioRepository;

    public AddGastoService(GastoRepository gastoRepository, UsuarioRepository usuarioRepository) {
        this.gastoRepository = gastoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Gasto guardarGasto(Gasto gasto, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        gasto.setUsuario(usuario);
        return gastoRepository.save(gasto);
    }
}