package com.DAW.GestorApp.NotiGmail.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "alert_status")
public class AlertStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean alertSent = false;

    public AlertStatus() {
    }

    public AlertStatus(boolean alertSent) {
        this.alertSent = alertSent;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isAlertSent() {
        return alertSent;
    }

    public void setAlertSent(boolean alertSent) {
        this.alertSent = alertSent;
    }
}