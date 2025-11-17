package com.DAW.GestorApp.NotiGmail.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@Entity
@Table(name = "alert_status")
@NoArgsConstructor
@AllArgsConstructor
public class AlertStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private boolean alertSent = false;


}