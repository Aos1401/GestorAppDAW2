package com.DAW.GestorApp.Gastos.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories("com.DAW.GestorApp.Gastos.add.infrastructure")
@EntityScan("com.DAW.GestorApp.Gastos.add.domain")
@SpringBootApplication(scanBasePackages = "com.DAW.GestorApp.Gastos")
public class GastosApp {
    public static void main(String[] args) {
        SpringApplication.run(GastosApp.class, args);
    }
}
