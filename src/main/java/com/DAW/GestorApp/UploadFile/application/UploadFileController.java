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

@RestController
@RequestMapping("/api/files")
public class UploadFileController {

    private final UploadFileService service;

    public UploadFileController(UploadFileService service) {
        this.service = service;
    }

    // POST /api/files/ingresos/{id}
    // POST /api/files/gastos/{id}
    @PostMapping("/{tipo}/{id}")
    public ResponseEntity<?> upload(
            @PathVariable String tipo,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String path = service.saveFile(tipo, id, file);
            // o front não usa essa string, só precisa do 200
            return ResponseEntity.ok("Archivo guardado en: " + path);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/temp")
    public ResponseEntity<String> uploadTemp(@RequestParam("file") MultipartFile file) {
        String token = service.saveTempFile(file);
        return ResponseEntity.ok(token); // devolve o token pro front
    }


    // GET /api/files/ingresos/{id}
    // GET /api/files/gastos/{id}
    @GetMapping("/{tipo}/{id}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String tipo,
            @PathVariable Long id
    ) {
        Resource file = service.loadFile(tipo, id); // pega o arquivo em disco

        String contentType;
        try {
            contentType = Files.probeContentType(file.getFile().toPath());
        } catch (IOException e) {
            contentType = null;
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(file);
    }

    // DELETE /api/files/ingresos/{id}
    // DELETE /api/files/gastos/{id}
    @DeleteMapping("/{tipo}/{id}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String tipo,
            @PathVariable Long id
    ) {
        service.deleteFile(tipo, id);  // garante que esse método exista no service
        return ResponseEntity.noContent().build();
    }
}
