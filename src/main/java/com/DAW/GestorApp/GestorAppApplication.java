package com.DAW.GestorApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling; // IMPORTANTE

@SpringBootApplication
@ComponentScan(basePackages = "com.DAW.GestorApp")
@EnableJpaRepositories(basePackages = "com.DAW.GestorApp")
@EntityScan(basePackages = "com.DAW.GestorApp")
@EnableScheduling
public class GestorAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(GestorAppApplication.class, args);
    }
}

