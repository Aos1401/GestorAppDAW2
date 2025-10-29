package com.DAW.GestorApp.Ingresos.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.DAW.GestorApp.Ingresos")
@EnableJpaRepositories(basePackages = "com.DAW.GestorApp.Ingresos.add.infrastructure")
@EntityScan(basePackages = "com.DAW.GestorApp.Ingresos.add.domain")
public class IngresosApp {
    public static void main(String[] args) {
        SpringApplication.run(IngresosApp.class, args);
    }
}