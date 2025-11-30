package com.DAW.GestorApp.UploadFile.domain;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface UploadFileService {

    String saveFile(String tipo, Long id, MultipartFile file);

    Resource loadFile(String tipo, Long id);

    String saveTempFile(MultipartFile file);

    void attachTempToMovimiento(String tempToken, String tipo, Long id);

    // já existia:
    void deleteFile(String tipo, Long id);
}
