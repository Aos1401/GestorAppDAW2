package com.DAW.GestorApp.Ingresos.delete.domain.service;

import com.DAW.GestorApp.Ingresos.delete.domain.response.DeleteResponse;

public interface DeleteIngresoService {
    DeleteResponse deleteById(Long id);
}
