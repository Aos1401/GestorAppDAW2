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
    private void validateTipo(String tipo) {
        if (!"ingresos".equals(tipo) && !"gastos".equals(tipo)) {
            throw new RuntimeException("Tipo no permitido: " + tipo);
        }
    }

    private String safeFileName(String name) {
        String original = Optional.ofNullable(name).orElse("archivo");
        // evita rutas tipo C:\... o ../../
        return Paths.get(original).getFileName().toString();
    }

    private Path tempDir() throws IOException {
        Path tempDir = rootLocation.resolve("temp");
        Files.createDirectories(tempDir);
        return tempDir;
    }

    private String safeTokenName(String token) {
        return Paths.get(Optional.ofNullable(token).orElse("")).getFileName().toString();
    }

    @Override
    public String saveFile(String tipo, Long id, MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) throw new RuntimeException("Archivo vacío");
            validateTipo(tipo);

            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));
            Files.createDirectories(dir);

            String safeName = safeFileName(file.getOriginalFilename());
            Path destino = dir.resolve(safeName).normalize();

            if (!destino.startsWith(dir.normalize())) {
                throw new RuntimeException("Nombre de archivo inválido");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return destino.toString();
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo: " + e.getMessage(), e);
        }
    }

    @Override
    public Resource loadFile(String tipo, Long id) {
        try {
            validateTipo(tipo);

            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));

            if (!Files.exists(dir)) {
                throw new RuntimeException("No hay archivos para este movimiento");
            }

            Optional<Path> first;
            try (var stream = Files.list(dir)) {
                first = stream.findFirst();
            }

            if (first.isEmpty()) {
                throw new RuntimeException("No hay archivos para este movimiento");
            }

            Path file = first.get();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) return resource;
            throw new RuntimeException("No se pudo leer el archivo");
        } catch (IOException e) {
            throw new RuntimeException("Error al cargar archivo: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String tipo, Long id) {
        try {
            validateTipo(tipo);

            Path dir = rootLocation.resolve(tipo).resolve(String.valueOf(id));
            if (!Files.exists(dir)) return;

            try (var paths = Files.list(dir)) {
                paths.forEach(p -> {
                    try { Files.deleteIfExists(p); } catch (IOException ignored) {}
                });
            }

            try { Files.deleteIfExists(dir); } catch (IOException ignored) {}
        } catch (IOException e) {
            throw new RuntimeException("No se pudo eliminar el archivo: " + e.getMessage(), e);
        }
    }

    @Override
    public String saveTempFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) throw new RuntimeException("Archivo temporal vacío");

            Path tempDir = tempDir();

            String safeOriginal = safeFileName(file.getOriginalFilename());
            String token = UUID.randomUUID() + "_" + safeOriginal;

            Path destino = tempDir.resolve(token).normalize();

            if (!destino.startsWith(tempDir.normalize())) {
                throw new RuntimeException("Token inválido");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return token;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo temporal: " + e.getMessage(), e);
        }
    }

    @Override
    public Resource loadTempFile(String token) {
        try {
            String safe = safeTokenName(token);
            if (safe.isBlank()) throw new RuntimeException("Token inválido");

            Path tempDir = tempDir();
            Path file = tempDir.resolve(safe).normalize();

            if (!file.startsWith(tempDir.normalize()) || !Files.exists(file)) {
                throw new RuntimeException("Archivo temporal no encontrado");
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) return resource;

            throw new RuntimeException("No se pudo leer el archivo temporal");
        } catch (IOException e) {
            throw new RuntimeException("Error al cargar archivo temporal: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteTempFile(String token) {
        try {
            String safe = safeTokenName(token);
            if (safe.isBlank()) return;

            Path tempDir = tempDir();
            Path file = tempDir.resolve(safe).normalize();

            if (!file.startsWith(tempDir.normalize())) return;

            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo eliminar el archivo temporal: " + e.getMessage(), e);
        }
    }

    @Override
    public void attachTempToMovimiento(String tempToken, String tipo, Long id) {
        if (tempToken == null || tempToken.isBlank()) return;

        validateTipo(tipo);

        try {
            String safe = safeTokenName(tempToken);
            Path tempDir = tempDir();
            Path tempFile = tempDir.resolve(safe).normalize();

            if (!tempFile.startsWith(tempDir.normalize()) || !Files.exists(tempFile)) {
                throw new RuntimeException("Archivo temporal no encontrado");
            }

            Path dirDestino = rootLocation.resolve(tipo).resolve(String.valueOf(id));
            Files.createDirectories(dirDestino);

            Path destino = dirDestino.resolve(safe).normalize();

            if (!destino.startsWith(dirDestino.normalize())) {
                throw new RuntimeException("Destino inválido");
            }

            Files.move(tempFile, destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo mover el archivo temporal: " + e.getMessage(), e);
        }
    }
}
