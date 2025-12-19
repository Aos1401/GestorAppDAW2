package com.DAW.GestorApp.UploadFile.domain;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface UploadFileService {

    String saveFile(String tipo, Long id, MultipartFile file);

    Resource loadFile(String tipo, Long id);

    void deleteFile(String tipo, Long id);

    String saveTempFile(MultipartFile file);

    Resource loadTempFile(String token);

    void deleteTempFile(String token);

    void attachTempToMovimiento(String tempToken, String tipo, Long id);
}
