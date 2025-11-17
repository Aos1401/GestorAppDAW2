package com.DAW.GestorApp.NotiGmail.infraestructura;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.alert.recipient}")
    private String recipientEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendLowBalanceAlert(double currentBalance) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setSubject("ALERTA CRÍTICA: Saldo Total Bajo");
        message.setText("El saldo actual es de " + String.format("%.2f", currentBalance) +
                "€, lo cual está por debajo del umbral de seguridad de 50.00€. ¡Revisa tu aplicación!");
        mailSender.send(message);
    }
}
