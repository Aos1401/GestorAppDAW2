package com.DAW.GestorApp.NotiGmail.infraestructura;

import com.DAW.GestorApp.NotiGmail.domain.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertStatusRepository extends JpaRepository<AlertStatus, Long> {
}
