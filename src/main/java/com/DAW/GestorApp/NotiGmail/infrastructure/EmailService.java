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

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envía un correo de alerta a un usuario específico.
     */
    public void sendLowBalanceAlert(String recipientEmail, String userName, double currentBalance) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(recipientEmail);
            message.setSubject("⚠️ ALERTA DE SALDO BAJO: GestorApp");
            message.setText("Hola " + userName + ",\n\n" +
                    "Te informamos que tu saldo actual ha bajado del límite de seguridad.\n" +
                    "Saldo actual: " + String.format("%.2f", currentBalance) + " €\n\n" +
                    "Por favor, revisa tus gastos o añade nuevos ingresos.\n" +
                    "Saludos,\nEl equipo de GestorApp.");

            mailSender.send(message);
            System.out.println("✅ Email enviado correctamente a: " + recipientEmail);
        } catch (Exception e) {
            System.err.println("❌ Error enviando email a " + recipientEmail + ": " + e.getMessage());
        }
    }
}