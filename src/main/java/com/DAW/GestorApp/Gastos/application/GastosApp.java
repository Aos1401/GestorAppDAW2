package com.DAW.GestorApp.Gastos.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.DAW.GestorApp.Gastos")
@EnableJpaRepositories(basePackages = "com.DAW.GestorApp.Gastos.add.infrastructure")
@EntityScan(basePackages = "com.DAW.GestorApp.Gastos.add.domain")
public class GastosApp {
    public static void main(String[] args) {
        SpringApplication.run(GastosApp.class, args);
    }
}