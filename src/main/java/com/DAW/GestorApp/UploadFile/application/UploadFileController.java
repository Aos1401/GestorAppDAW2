package com.DAW.GestorApp.UploadFile.application;

import com.DAW.GestorApp.UploadFile.domain.UploadFileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@CrossOrigin
@RestController
@RequestMapping("/api/files")
public class UploadFileController {

    private final UploadFileService service;

    public UploadFileController(UploadFileService service) {
        this.service = service;
    }

    @PostMapping("/{tipo}/{id}")
    public ResponseEntity<?> upload(
            @PathVariable String tipo,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String path = service.saveFile(tipo, id, file);
            return ResponseEntity.ok("Archivo guardado en: " + path);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{tipo}/{id}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String tipo,
            @PathVariable Long id
    ) {
        Resource file = service.loadFile(tipo, id);

        String contentType;
        try {
            contentType = Files.probeContentType(file.getFile().toPath());
        } catch (IOException e) {
            contentType = null;
        }
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(file);
    }

    @DeleteMapping("/{tipo}/{id}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String tipo,
            @PathVariable Long id
    ) {
        service.deleteFile(tipo, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/temp")
    public ResponseEntity<String> uploadTemp(@RequestParam("file") MultipartFile file) {
        String token = service.saveTempFile(file);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/temp/{token}")
    public ResponseEntity<Resource> getTempFile(@PathVariable String token) {
        Resource file = service.loadTempFile(token);

        String contentType;
        try {
            contentType = Files.probeContentType(file.getFile().toPath());
        } catch (IOException e) {
            contentType = null;
        }
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(file);
    }

    // borra el temporal si el usuario cancela o cambia
    @DeleteMapping("/temp/{token}")
    public ResponseEntity<Void> deleteTempFile(@PathVariable String token) {
        service.deleteTempFile(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{tipo}/{id}/attach-temp")
    public ResponseEntity<Void> attachTemp(
            @PathVariable String tipo,
            @PathVariable Long id,
            @RequestParam("token") String token
    ) {
        service.attachTempToMovimiento(token, tipo, id);
        return ResponseEntity.ok().build();
    }
}
