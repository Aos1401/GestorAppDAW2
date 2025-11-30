// input de arquivo global
const fileInput = document.getElementById("fileInput");

// modal
const attachmentModal = $("#attachmentModal");
const closeAttachmentModal = $("#closeAttachmentModal");
const attachmentPreview = $("#attachmentPreview");
const btnEliminarAdjunto = $("#btnEliminarAdjunto");
const modalBackdrop = attachmentModal
  ? attachmentModal.querySelector(".modal__backdrop")
  : null;

// contexto do adjunto aberto no modal
let currentAttachmentContext = null; // { tipo, id, origin }

// botões de adjunto dos formulários
const btnAdjuntarIngreso = $("#btnAdjuntarIngreso");
const btnVerAdjuntoIngreso = $("#btnVerAdjuntoIngreso");
const btnAdjuntarGasto = $("#btnAdjuntarGasto");
const btnVerAdjuntoGasto = $("#btnVerAdjuntoGasto");

// --------- ESTADO INICIAL DOS BOTÕES ---------
if (btnAdjuntarIngreso && btnVerAdjuntoIngreso) {
  btnAdjuntarIngreso.classList.remove("is-hidden");
  btnVerAdjuntoIngreso.classList.add("is-hidden");
}
if (btnAdjuntarGasto && btnVerAdjuntoGasto) {
  btnAdjuntarGasto.classList.remove("is-hidden");
  btnVerAdjuntoGasto.classList.add("is-hidden");
}

// --------- MODAL ---------
function abrirModalAdjunto(tipo, id, origin) {
  if (!attachmentModal || !attachmentPreview) return;

  currentAttachmentContext = { tipo, id, origin };
  const url = `/api/files/${tipo}/${id}`;

  // limpa conteúdo anterior
  attachmentPreview.innerHTML = "";

  // tenta mostrar como imagem primeiro
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Adjunto";
  img.style.maxWidth = "100%";
  img.style.borderRadius = "8px";
  img.style.display = "block";
  img.style.marginBottom = "8px";

  // se der erro (não é imagem ou backend errado), cai pro link simples
  img.onerror = () => {
    attachmentPreview.innerHTML = `
      <p>Haz clic en el enlace para ver el archivo adjunto:</p>
      <a href="${url}" target="_blank" rel="noopener noreferrer">Abrir adjunto</a>
    `;
  };

  attachmentPreview.appendChild(img);
  attachmentModal.classList.remove("is-hidden");
}


function cerrarModalAdjunto() {
  if (!attachmentModal) return;
  attachmentModal.classList.add("is-hidden");
  currentAttachmentContext = null;
}

if (closeAttachmentModal) {
  closeAttachmentModal.addEventListener("click", cerrarModalAdjunto);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", cerrarModalAdjunto);
}

// --------- BOTÕES DOS FORMULÁRIOS ---------
if (btnAdjuntarIngreso) {
  btnAdjuntarIngreso.addEventListener("click", () => {
    const id = $("#ingresoId").value;
    if (!id) {
      alert("Primero guarda el ingreso antes de adjuntar un archivo.");
      return;
    }
    abrirUpload("ingresos", id, "formIngreso");
  });
}

if (btnVerAdjuntoIngreso) {
  btnVerAdjuntoIngreso.addEventListener("click", () => {
    const id = $("#ingresoId").value;
    if (!id) {
      alert("No hay ingreso seleccionado.");
      return;
    }
    abrirModalAdjunto("ingresos", id, "formIngreso");
  });
}

if (btnAdjuntarGasto) {
  btnAdjuntarGasto.addEventListener("click", () => {
    const id = $("#gastoId").value;
    if (!id) {
      alert("Primero guarda el gasto antes de adjuntar un archivo.");
      return;
    }
    abrirUpload("gastos", id, "formGasto");
  });
}

if (btnVerAdjuntoGasto) {
  btnVerAdjuntoGasto.addEventListener("click", () => {
    const id = $("#gastoId").value;
    if (!id) {
      alert("No hay gasto seleccionado.");
      return;
    }
    abrirModalAdjunto("gastos", id, "formGasto");
  });
}

// --------- ELIMINAR ADJUNTO DESDE O MODAL ---------
if (btnEliminarAdjunto) {
  btnEliminarAdjunto.addEventListener("click", async () => {
    if (!currentAttachmentContext) return;

    const confirmed = confirm(
      "¿Seguro que quieres eliminar el archivo adjunto?"
    );
    if (!confirmed) return;

    const { tipo, id, origin } = currentAttachmentContext;

    try {
      const resp = await fetch(`/api/files/${tipo}/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        throw new Error("Error al eliminar el archivo");
      }

      if (origin === "formIngreso") {
        if (btnVerAdjuntoIngreso) btnVerAdjuntoIngreso.classList.add("is-hidden");
        if (btnAdjuntarIngreso) btnAdjuntarIngreso.classList.remove("is-hidden");
        const hidden = $("#ingresoAttachment");
        if (hidden) hidden.value = "";
      } else if (origin === "formGasto") {
        if (btnVerAdjuntoGasto) btnVerAdjuntoGasto.classList.add("is-hidden");
        if (btnAdjuntarGasto) btnAdjuntarGasto.classList.remove("is-hidden");
        const hidden = $("#gastoAttachment");
        if (hidden) hidden.value = "";
      }

      cerrarModalAdjunto();
      alert("Adjunto eliminado correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el adjunto ❌");
    }
  });
}

// --------- UPLOAD (INPUT OCULTO) ---------
if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file || !uploadMeta.id || !uploadMeta.tipo) {
      uploadMeta = { tipo: null, id: null, origin: null };
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch(
        `/api/files/${uploadMeta.tipo}/${uploadMeta.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resp.ok) {
        throw new Error("Error al subir el archivo");
      }

      alert("Archivo adjuntado correctamente ✅");

      if (uploadMeta.origin === "formIngreso") {
        if (btnAdjuntarIngreso)
          btnAdjuntarIngreso.classList.add("is-hidden");
        if (btnVerAdjuntoIngreso)
          btnVerAdjuntoIngreso.classList.remove("is-hidden");
        const hidden = $("#ingresoAttachment");
        if (hidden) hidden.value = "hasAttachment";
      } else if (uploadMeta.origin === "formGasto") {
        if (btnAdjuntarGasto)
          btnAdjuntarGasto.classList.add("is-hidden");
        if (btnVerAdjuntoGasto)
          btnVerAdjuntoGasto.classList.remove("is-hidden");
        const hidden = $("#gastoAttachment");
        if (hidden) hidden.value = "hasAttachment";
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo adjuntar el archivo ❌");
    } finally {
      uploadMeta = { tipo: null, id: null, origin: null };
      fileInput.value = "";
    }
  });
}

// chamado pelos botões "Adjuntar archivo"
function abrirUpload(tipo, id, origin = null) {
  if (!fileInput) {
    console.error("No se encontró el input de archivo oculto (#fileInput)");
    return;
  }
  uploadMeta = { tipo, id, origin };
  fileInput.click();
}
