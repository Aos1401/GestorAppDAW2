package com.DAW.GestorApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan; // 👈 ¡Asegúrate de tener este import!

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories("com.DAW.GestorApp.NotiGmail.infraestructura")
@EntityScan("com.DAW.GestorApp.NotiGmail.domain") // 👈 ¡ESTO ES CRUCIAL!
public class GestorAppApplication {
	public static void main(String[] args) {
		SpringApplication.run(GestorAppApplication.class, args);
	}
}