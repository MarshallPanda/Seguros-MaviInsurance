// /assets/sctiptjs/nodo.js
(function () {
  // =======================
  // 🔧 CONFIGURACIÓN INTERNA
  // =======================
  const CONFIG = {
    modoEnvio: "auto",                    // "waapi" | "whatsapp" | "auto"
    waapiBase: "https://waapi.app/api/v1",
    waapiInstance: "65266",
    waapiToken: "REEMPLAZA_TU_TOKEN_AQUI",// ⚠️ No expongas en producción si puedes evitarlo
    numeroDestino: "17863487699"          // ✅ +1 (786) 348-7699 sin "+" 17863487699
  };

  // ===== utilidades =====
  const $ = (id) => document.getElementById(id);
  const onlyDigits = (s) => (s || "").replace(/\D+/g, "");
  const br = (s) => (s || "").replace(/\n/g, "<br>");

  function construirMensaje({ nombre, servicio, mensaje, numeroMostrar }) {
    return `Hola buen día, soy *${nombre}*,\n` +
           `Estoy interesado en realizar una cotizacion de: *${servicio}.*\n\n` +
           `Mensaje: *${mensaje}*\n\n` +
           `Mi número es: *${numeroMostrar}*`;
  }

  // ===== notificación flotante (reusa tu HTML/CSS) =====
  function mostrarNotificacion(exito, textoOk, textoError) {
    const noti = $("wa-notification");
    if (!noti) return;

    const headerText = noti.querySelector("strong");
    const bodyText = noti.querySelector(".wa-body p");

    if (exito) {
      headerText.textContent = "Mensaje enviado";
      bodyText.innerHTML = `<i class="fas fa-info-circle"></i> ${textoOk || "Este mensaje fue enviado de forma privada. Un asesor se pondrá en contacto contigo."}`;
      noti.style.borderLeft = "5px solid #25d366";
    } else {
      headerText.textContent = "Error al enviar";
      bodyText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${textoError || "Ocurrió un problema al enviar el mensaje. Intenta nuevamente más tarde."}`;
      noti.style.borderLeft = "5px solid #e74c3c";
    }

    noti.style.display = "block";
    setTimeout(() => (noti.style.display = "none"), 7000);
  }

  // ===== abrir WhatsApp (app + fallback web) =====
  function abrirWhatsApp(destinoDigits, textoMensaje) {
    if (!destinoDigits) {
      mostrarNotificacion(false, "", "Número destino inválido.");
      return;
    }
    const encoded = encodeURIComponent(textoMensaje);
    const appUrl = `whatsapp://send?phone=${destinoDigits}&text=${encoded}`;
    const webUrl = `https://api.whatsapp.com/send?phone=${destinoDigits}&text=${encoded}`;

    // intento abrir app
    const a = document.createElement("a");
    a.href = appUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // fallback web
    setTimeout(() => {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 300);

    mostrarNotificacion(true, "Se abrió WhatsApp con tu mensaje.");
  }

  // ===== envío WAAPI =====
  async function enviarPorWAAPI({ destinoDigits, textoMensaje }) {
    if (!destinoDigits) throw new Error("Número destino inválido");
    const chatId = `${destinoDigits}@c.us`;

    // Refleja destino en el preview
    const chatNumPreview = $("chat-num-preview");
    if (chatNumPreview) chatNumPreview.textContent = chatId;

    const res = await fetch(`${CONFIG.waapiBase}/instances/${CONFIG.waapiInstance}/client/action/send-message`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${CONFIG.waapiToken}`
      },
      body: JSON.stringify({ chatId, message: textoMensaje })
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${t || "Error al enviar WAAPI"}`);
    }
    return res.json();
  }

  // ===== Vista previa en tiempo real =====
  function actualizarPreview() {
    const nombre = $("nombre")?.value.trim() || "";
    const codigo = onlyDigits($("codigo")?.value.trim() || "");
    const numero = onlyDigits($("numero")?.value.trim() || "");
    const servicio = $("servicio")?.value || "";
    const mensaje = $("mensaje")?.value.trim() || "";

    // número del cliente SOLO para mostrar dentro del mensaje
    const numeroMostrar = `${codigo} ${numero}`.trim();

    // En el encabezado del chat preview mostramos el DESTINO real:
    const chatIdDestino = `${CONFIG.numeroDestino}@c.us`;
    const chatNumPreview = $("chat-num-preview");
    if (chatNumPreview) chatNumPreview.textContent = chatIdDestino;

    const textoMensaje = construirMensaje({ nombre, servicio, mensaje, numeroMostrar });
    const chatBody = $("mensaje-chat");
    if (chatBody) {
      chatBody.innerHTML = textoMensaje.trim()
        ? `<p>${br(textoMensaje)}</p>`
        : `<p class="placeholder">Tu mensaje aparecerá aquí...</p>`;
    }
  }

  // ===== Handler principal del formulario =====
  function onSubmit(e) {
    e.preventDefault();

    const nombre = $("nombre").value.trim();
    const codigo = onlyDigits($("codigo").value.trim());
    const numero = onlyDigits($("numero").value.trim());
    const servicio = $("servicio").value;
    const mensaje = $("mensaje").value.trim();

    // El envío SIEMPRE es al número destino fijo
    const destinoDigits = CONFIG.numeroDestino;

    // El número del cliente viaja dentro del texto:
    const numeroMostrar = `${codigo} ${numero}`;
    const textoMensaje = construirMensaje({ nombre, servicio, mensaje, numeroMostrar });

    // Forzar preview inmediato
    const chatBody = $("mensaje-chat");
    if (chatBody) chatBody.innerHTML = `<p>${br(textoMensaje)}</p>`;
    const chatNumPreview = $("chat-num-preview");
    if (chatNumPreview) chatNumPreview.textContent = `${destinoDigits}@c.us`;

    // Flujo según configuración
    if (CONFIG.modoEnvio === "whatsapp") {
      abrirWhatsApp(destinoDigits, textoMensaje);
      return;
    }

    if (CONFIG.modoEnvio === "waapi") {
      enviarPorWAAPI({ destinoDigits, textoMensaje })
        .then(() => mostrarNotificacion(true, "Mensaje enviado vía WAAPI."))
        .catch((err) => {
          console.error("WAAPI falló:", err);
          mostrarNotificacion(false, "", "No se pudo enviar vía WAAPI.");
        });
      return;
    }

    // "auto": intenta WAAPI y si falla, abre WhatsApp
    enviarPorWAAPI({ destinoDigits, textoMensaje })
      .then(() => mostrarNotificacion(true, "Mensaje enviado vía WAAPI."))
      .catch((err) => {
        console.error("WAAPI falló (auto):", err);
        mostrarNotificacion(false, "", "WAAPI falló. Abriendo WhatsApp como alternativa...");
        abrirWhatsApp(destinoDigits, textoMensaje);
      });
  }

  // ===== wiring =====
  document.addEventListener("DOMContentLoaded", function () {
    const form = $("formulario");
    if (!form) return;

    // preview en tiempo real
    ["nombre", "codigo", "numero", "servicio", "mensaje"].forEach(id => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", actualizarPreview);
        el.addEventListener("change", actualizarPreview);
      }
    });
    actualizarPreview();

    // submit
    form.addEventListener("submit", onSubmit);
  });
})();
