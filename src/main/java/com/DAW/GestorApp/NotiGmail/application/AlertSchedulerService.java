package com.DAW.GestorApp.NotiGmail.application;

import com.DAW.GestorApp.Auth.domain.Usuario;
import com.DAW.GestorApp.Auth.infrastructure.UsuarioRepository;
import com.DAW.GestorApp.Gastos.add.infrastructure.GastoRepository;
import com.DAW.GestorApp.Ingresos.add.infrastructure.IngresoRepository;
import com.DAW.GestorApp.NotiGmail.infraestructura.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlertSchedulerService {

    private final UsuarioRepository usuarioRepository;
    private final IngresoRepository ingresoRepository;
    private final GastoRepository gastoRepository;
    private final EmailService emailService;

    // Umbral de alerta: 50 euros
    private final double ALERT_THRESHOLD = 50.00;

    public AlertSchedulerService(UsuarioRepository usuarioRepository,
                                 IngresoRepository ingresoRepository,
                                 GastoRepository gastoRepository,
                                 EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.ingresoRepository = ingresoRepository;
        this.gastoRepository = gastoRepository;
        this.emailService = emailService;
    }

    /*
     * AHORA: Se ejecuta cada 1 minuto (60000 ms).
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndSendAlertsPerUser() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        if (usuarios.isEmpty()) return;

        // He actualizado el mensaje de consola para que diga "cada 1 min"
        System.out.println("--- 🕒 Verificando saldos (cada 1 min) de " + usuarios.size() + " usuarios ---");

        for (Usuario usuario : usuarios) {
            Double totalIngresos = ingresoRepository.sumMontoByUsuarioId(usuario.getId());
            Double totalGastos = gastoRepository.sumMontoByUsuarioId(usuario.getId());

            if (totalIngresos == null) totalIngresos = 0.0;
            if (totalGastos == null) totalGastos = 0.0;

            double saldoActual = totalIngresos - totalGastos;
            boolean saldoBajo = saldoActual < ALERT_THRESHOLD;

            if (saldoBajo && !usuario.isAlertSent()) {
                System.out.println("⚠ ALERTA: Usuario " + usuario.getEmail() + " tiene saldo bajo (" + saldoActual + "€)");
                emailService.sendLowBalanceAlert(usuario.getEmail(), usuario.getNombre(), saldoActual);
                usuario.setAlertSent(true);
                usuarioRepository.save(usuario);

            } else if (!saldoBajo && usuario.isAlertSent()) {
                System.out.println("ℹ RECUPERADO: Usuario " + usuario.getEmail() + " ha subido su saldo.");
                usuario.setAlertSent(false);
                usuarioRepository.save(usuario);
            }
        }
    }
}