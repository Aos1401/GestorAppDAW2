console.log("--> CARGANDO ATTACHMENTS.JS (MODO DEBUG)");

const fileInput = document.getElementById("fileInput");
let uploadMeta = { tipo: null, id: null, context: null };

// 1. COMPROBAR SI LOS BOTONES EXISTEN EN EL HTML
window.addEventListener("DOMContentLoaded", () => {
    console.log("--> Verificando botones en el HTML...");

    const btnVerIngreso = document.getElementById("btnVerAdjuntoIngreso");
    const btnVerGasto = document.getElementById("btnVerAdjuntoGasto");

    if (!btnVerIngreso) console.error("❌ ERROR CRÍTICO: No encuentro el botón 'btnVerAdjuntoIngreso' en el HTML.");
    else console.log("✅ Botón 'btnVerAdjuntoIngreso' encontrado (estado oculto: " + btnVerIngreso.classList.contains("is-hidden") + ")");

    if (!btnVerGasto) console.error("❌ ERROR CRÍTICO: No encuentro el botón 'btnVerAdjuntoGasto' en el HTML.");
    else console.log("✅ Botón 'btnVerAdjuntoGasto' encontrado.");
});

// 2. CONFIGURAR CLICK EN LOS CLIPS
["ingreso", "gasto"].forEach(ctx => {
    const capitalized = ctx.charAt(0).toUpperCase() + ctx.slice(1);

    const btnAdd = document.getElementById(`btnAdjuntar${capitalized}`);
    const btnVer = document.getElementById(`btnVerAdjunto${capitalized}`);

    // Click en "Adjuntar"
    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            const inputId = document.getElementById(`${ctx}Id`);
            const id = inputId ? inputId.value : null;

            console.log(`--> Click en Adjuntar ${capitalized}. ID detectado: ${id}`);

            if (!id) {
                alert("Primero guarda el movimiento.");
                return;
            }

            // Guardamos el contexto
            uploadMeta = { tipo: `${ctx}s`, id: id, context: ctx };
            console.log("--> Meta guardado:", uploadMeta);

            fileInput.click();
        });
    }

    // Click en "Ver"
    if (btnVer) {
        btnVer.addEventListener("click", () => {
            const inputId = document.getElementById(`${ctx}Id`);
            const id = inputId ? inputId.value : null;
            if (id) abrirModalAdjunto(`${ctx}s`, id);
        });
    }
});

// 3. EVENTO DE SUBIDA (AQUÍ ESTÁ LA CLAVE)
if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
        console.log("--> Archivo seleccionado. Iniciando subida...");

        const file = e.target.files[0];
        if (!file || !uploadMeta.id) {
            console.error("❌ Cancelado: No hay archivo o no hay ID.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const url = `${API_FILES}/${uploadMeta.tipo}/${uploadMeta.id}`;
            console.log("--> Enviando a:", url);

            const resp = await fetch(url, { method: "POST", body: formData });

            if (!resp.ok) throw new Error("Error en la petición fetch");

            console.log("✅ Subida exitosa. Intentando mostrar botón...");
            alert("Archivo subido. Mira si aparece el botón 'Ver adjunto'.");

            // INTENTO FORZAR LA VISIBILIDAD
            alternarBotones(uploadMeta.context, true);

        } catch (error) {
            console.error("❌ ERROR AL SUBIR:", error);
            alert("Error al subir el archivo.");
        } finally {
            fileInput.value = "";
        }
    });
}

// 4. FUNCIÓN PARA CAMBIAR BOTONES
function alternarBotones(ctx, tieneArchivo) {
    console.log(`--> Ejecutando alternarBotones para contexto: '${ctx}', tieneArchivo: ${tieneArchivo}`);

    const capitalized = ctx.charAt(0).toUpperCase() + ctx.slice(1);
    const btnAdd = document.getElementById(`btnAdjuntar${capitalized}`);
    const btnVer = document.getElementById(`btnVerAdjunto${capitalized}`);

    if (!btnAdd || !btnVer) {
        console.error(`❌ ERROR: No encuentro los botones para ${ctx}`);
        return;
    }

    if (tieneArchivo) {
        console.log(`--> Ocultando ${btnAdd.id}, Mostrando ${btnVer.id}`);
        btnAdd.classList.add("is-hidden");
        btnVer.classList.remove("is-hidden");
    } else {
        console.log(`--> Mostrando ${btnAdd.id}, Ocultando ${btnVer.id}`);
        btnAdd.classList.remove("is-hidden");
        btnVer.classList.add("is-hidden");
    }
}

// 5. VERIFICACIÓN AL EDITAR
window.verificarAdjunto = async (tipoPlural, id, ctxSingular) => {
    console.log(`--> Verificando adjunto existente para ${tipoPlural}/${id}`);

    // Reset inicial
    alternarBotones(ctxSingular, false);

    try {
        const resp = await fetch(`${API_FILES}/${tipoPlural}/${id}`, { method: "HEAD" });
        if (resp.ok) {
            console.log("✅ Archivo existente detectado. Mostrando botón.");
            alternarBotones(ctxSingular, true);
        } else {
            console.log("ℹ️ No hay archivo previo.");
        }
    } catch (e) {
        console.error("Error verificando adjunto", e);
    }
};

// 6. MODAL (Igual que antes pero con logs)
const attachmentModal = document.getElementById("attachmentModal");
const attachmentPreview = document.getElementById("attachmentPreview");

function abrirModalAdjunto(tipo, id) {
    console.log(`--> Abriendo modal para ${tipo}/${id}`);
    if (!attachmentModal) return;

    const timestamp = new Date().getTime();
    const url = `${API_FILES}/${tipo}/${id}?t=${timestamp}`;

    attachmentPreview.innerHTML = `
        <h4 style="margin-top:0; margin-bottom:15px; text-align:center;">Archivo Adjunto</h4>
        <div style="text-align:center; margin-bottom:15px;">
            <img src="${url}"
                 style="max-width: 100%; max-height: 300px; border-radius: 8px;"
                 onerror="this.style.display='none'; document.getElementById('msg-error').style.display='block';"
            />
            <p id="msg-error" style="display:none; color:red;">No se puede previsualizar (PDF o error)</p>
        </div>
        <div style="display:flex; justify-content:center; gap:10px;">
            <a href="${url}" target="_blank" class="btn btn-outline">Abrir / Descargar</a>
            <button class="btn btn-danger" onclick="eliminarAdjunto('${tipo}', ${id})">Eliminar</button>
        </div>
    `;
    attachmentModal.classList.remove("is-hidden");
}

window.eliminarAdjunto = async (tipo, id) => {
    if(!confirm("¿Borrar archivo?")) return;
    try {
        await fetch(`${API_FILES}/${tipo}/${id}`, { method: "DELETE" });
        alert("Eliminado");
        attachmentModal.classList.add("is-hidden");
        const ctx = tipo.slice(0, -1);
        alternarBotones(ctx, false);
    } catch(e) { console.error(e); }
};

document.getElementById("closeAttachmentModal")?.addEventListener("click", () => {
    attachmentModal.classList.add("is-hidden");
});