package com.DAW.GestorApp.UploadFile.infrastructure;

import com.DAW.GestorApp.UploadFile.domain.UploadFileService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;


@Service
public class UploadFileServiceImpl implements UploadFileService {

    private final Path rootLocation = Paths.get("uploads");

    public UploadFileServiceImpl() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta 'uploads'", e);
        }
    }

    // =========================================
    // GUARDAR ARCHIVO
    // =========================================
    @Override
    public String saveFile(String tipo, Long id, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Archivo vacío");
            }

            // uploads/ingresos/2   o    uploads/gastos/5
            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));
            Files.createDirectories(dir);

            Path destino = dir.resolve(file.getOriginalFilename())
                    .normalize()
                    .toAbsolutePath();

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return destino.toString();

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo: " + e.getMessage(), e);
        }
    }

    // =========================================
    // CARGAR ARCHIVO
    // =========================================
    @Override
    public Resource loadFile(String tipo, Long id) {
        try {
            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));

            if (!Files.exists(dir)) {
                throw new RuntimeException("No hay archivos para este movimiento");
            }

            // Pegamos só o primeiro arquivo dentro da pasta do movimiento
            Optional<Path> first = Files.list(dir).findFirst();
            if (first.isEmpty()) {
                throw new RuntimeException("No hay archivos para este movimiento");
            }

            Path file = first.get();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("No se pudo leer el archivo");
            }

        } catch (IOException e) {
            throw new RuntimeException("Error al cargar archivo: " + e.getMessage(), e);
        }
    }

    // =========================================
    // ELIMINAR ARCHIVO
    // =========================================
    @Override
    public void deleteFile(String tipo, Long id) {
        try {
            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));

            if (!Files.exists(dir)) {
                throw new RuntimeException("No hay archivo para eliminar");
            }

            Optional<Path> first = Files.list(dir).findFirst();
            if (first.isEmpty()) {
                throw new RuntimeException("No hay archivo para eliminar");
            }

            Path file = first.get();
            Files.deleteIfExists(file);

        } catch (IOException e) {
            throw new RuntimeException("No se pudo eliminar el archivo: " + e.getMessage(), e);
        }
    }

    @Override
    public String saveTempFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Archivo temporal vacío");
            }

            Path tempDir = rootLocation.resolve("temp");
            Files.createDirectories(tempDir);

            // token único + nome original (pra gente exibir depois se quiser)
            String token = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path destino = tempDir.resolve(token)
                    .normalize()
                    .toAbsolutePath();

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            // devolvemos só o token (é isso que vai pro front)
            return token;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo temporal: " + e.getMessage(), e);
        }
    }

    // =========================================
    // MOVER ARCHIVO TEMPORAL → MOVIMIENTO DEFINITIVO
    // =========================================
    @Override
    public void attachTempToMovimiento(String tempToken, String tipo, Long id) {
        if (tempToken == null || tempToken.isBlank()) {
            return; // nada pra mover
        }

        try {
            Path tempDir = rootLocation.resolve("temp");
            Path tempFile = tempDir.resolve(tempToken);

            if (!Files.exists(tempFile)) {
                throw new RuntimeException("Archivo temporal no encontrado");
            }

            Path dirDestino = rootLocation.resolve(tipo).resolve(String.valueOf(id));
            Files.createDirectories(dirDestino);

            Path destino = dirDestino.resolve(tempToken)
                    .normalize()
                    .toAbsolutePath();

            Files.move(tempFile, destino, StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            throw new RuntimeException("No se pudo mover el archivo temporal: " + e.getMessage(), e);
        }
    }
}
