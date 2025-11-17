package com.DAW.GestorApp.NotiGmail.application;

import com.DAW.GestorApp.NotiGmail.domain.AlertStatus;
import com.DAW.GestorApp.NotiGmail.infraestructura.AlertStatusRepository;
import com.DAW.GestorApp.NotiGmail.infraestructura.EmailService;
import com.DAW.GestorApp.application.TotalBalanceService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AlertSchedulerService {

    private final TotalBalanceService totalBalanceService;
    private final EmailService emailService;
    private final AlertStatusRepository alertStatusRepository;

    @Value("${app.alert.threshold}")
    private double alertThreshold;

    public AlertSchedulerService(TotalBalanceService totalBalanceService,
                                 EmailService emailService,
                                 AlertStatusRepository alertStatusRepository) {
        this.totalBalanceService = totalBalanceService;
        this.emailService = emailService;
        this.alertStatusRepository = alertStatusRepository;
    }

    /*
     Verifica el balance total y envía una alerta por correo si el saldo está
     por debajo del umbral y la alerta no se ha enviado previamente.
    5 minutos = (300000 ms).
     */

    @Scheduled(fixedRate = 300000)
    public void checkAndSendAlert() {
        double totalBalance = totalBalanceService.calculateTotalBalance();

        // Mensaje de Log para verificar que la tarea programada se ejecuta
        System.out.println("LOG: Tarea programada: Verificando balance. Actual: "
                + totalBalance + "€. Umbral: " + alertThreshold);

        // Intenta obtener el único registro de estado (con ID 1) o crea uno nuevo.
        AlertStatus status = alertStatusRepository.findById(1L)
                .orElseGet(() -> {
                    AlertStatus newStatus = new AlertStatus();
                    // Se debe asignar el ID para asegurar que solo haya un registro en la tabla
                    // Nota: Asignar ID manualmente es delicado, pero común para tablas de estado único.
                    // Si el ID es autoincremental, el save() lo gestionará, pero lo buscamos con 1L.
                    // En este caso, dejamos que el repositorio lo maneje y confiamos en el save subsiguiente.
                    newStatus.setAlertSent(false);
                    return alertStatusRepository.save(newStatus);
                });

        boolean saldoBajo = totalBalance <= alertThreshold;

        if (saldoBajo && !status.isAlertSent()) {
            // 1. Enviar alerta si el saldo es bajo Y la alerta NO ha sido enviada.
            emailService.sendLowBalanceAlert(totalBalance);
            status.setAlertSent(true);
            alertStatusRepository.save(status);
            System.out.println("LOG: Alerta enviada. Saldo por debajo del umbral.");

        } else if (!saldoBajo && status.isAlertSent()) {
            // 2. Reiniciar el estado si el saldo sube Y la alerta estaba marcada como enviada.
            status.setAlertSent(false);
            alertStatusRepository.save(status);
            System.out.println("LOG: Saldo recuperado. Estado de alerta reiniciado.");

        } else {
            // 3. Estado normal (Saldo OK o Saldo bajo pero alerta ya enviada).
            System.out.println("LOG: No se requiere acción de alerta.");
        }
    }
}