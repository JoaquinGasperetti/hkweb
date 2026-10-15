// HK Entertainment – Envío y validación de Propuestas de Videojuegos (propuestas.js)
// Configuración opcional:
// Si creás un formulario gratuito en https://formspree.io o https://web3forms.com,
// pegá tu URL de Formspree en FORMSPREE_ENDPOINT (ej: "https://formspree.io/f/xxxxxxx")
// para recibir las propuestas directo en tu casilla sin abrir el cliente de correo.
// Si se deja vacío (""), el sistema arma el correo formateado hacia EMAIL_DESTINO
// y ofrece envío en 1 clic por cliente de mail, Gmail Web o copia al portapapeles.

(function () {
  var FORMSPREE_ENDPOINT = "";
  var EMAIL_DESTINO = "contacto@hkentertainment.com.ar";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("formPropuesta");
    if (!form) return;

    var customEndpoint = form.getAttribute("data-formspree");
    if (customEndpoint && customEndpoint.indexOf("https://") === 0) {
      FORMSPREE_ENDPOINT = customEndpoint;
    }

    // Campo de presupuesto directo
    var budgetInput = document.getElementById("propPresupuesto");

    // Contador de caracteres de la idea
    var ideaTextarea = document.getElementById("propIdea");
    var charCount = document.getElementById("propIdeaCount");
    if (ideaTextarea && charCount) {
      var updateCount = function () {
        var len = ideaTextarea.value.length;
        charCount.textContent = len + " / 2000 caracteres";
      };
      ideaTextarea.addEventListener("input", updateCount);
      updateCount();
    }

    var feedbackBox = document.getElementById("propFeedback");
    var submitBtn = document.getElementById("propSubmitBtn");

    function construirResumen(datos) {
      return [
        "=== NUEVA PROPUESTA DE VIDEOJUEGO - HK ENTERTAINMENT ===",
        "",
        "1. DATOS DE CONTACTO",
        "- Nombre / Estudio: " + datos.nombre,
        "- Email: " + datos.email,
        "- Contacto alternativo (WhatsApp/Discord/Red): " + (datos.contacto_alt || "No especificado"),
        "",
        "2. SOBRE EL PROYECTO",
        "- Título / Concepto: " + datos.titulo,
        "- Plataforma objetivo: " + datos.plataforma,
        "- Estado actual: " + datos.estado,
        "- Link de referencia / GDD / Demo: " + (datos.link || "No incluido"),
        "",
        "3. PRESUPUESTO Y ALCANCE",
        "- Presupuesto indicado: " + datos.presupuesto,
        "- Plazos / aclaraciones: " + (datos.presupuesto_detalle || "No especificado"),
        "",
        "4. DESCRIPCIÓN DE LA IDEA",
        datos.idea
      ].join("\n");
    }

    function mostrarConfirmacion(datos, enviadoPorApi) {
      if (!feedbackBox) return;
      var resumen = construirResumen(datos);
      var asunto = "[Propuesta Videojuego] " + datos.titulo + " - " + datos.nombre;
      var mailtoUrl =
        "mailto:" +
        EMAIL_DESTINO +
        "?subject=" +
        encodeURIComponent(asunto) +
        "&body=" +
        encodeURIComponent(resumen);
      var gmailUrl =
        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
        encodeURIComponent(EMAIL_DESTINO) +
        "&su=" +
        encodeURIComponent(asunto) +
        "&body=" +
        encodeURIComponent(resumen);

      feedbackBox.classList.remove("proposal-feedback--error");
      feedbackBox.hidden = false;

      if (enviadoPorApi) {
        feedbackBox.innerHTML =
          "<h4>¡Propuesta enviada con éxito!</h4>" +
          "<p>Recibimos los datos de <strong>" +
          escaparHtml(datos.titulo) +
          "</strong>. Nuestro equipo va a evaluar la factibilidad técnica y el presupuesto; si lo vemos viable, te escribimos a <strong>" +
          escaparHtml(datos.email) +
          "</strong>.</p>" +
          '<div class="proposal-feedback-actions">' +
          '<button type="button" class="btn btn-ghost" id="btnNuevaPropuesta">Enviar otra propuesta</button>' +
          "</div>";
      } else {
        feedbackBox.innerHTML =
          "<h4>¡Tu propuesta está lista para enviar!</h4>" +
          "<p>Revisamos cada idea y, si la vemos factible, te escribimos a <strong>" +
          escaparHtml(datos.email) +
          "</strong>. Elegí cómo querés mandarla ahora o copiá el resumen:</p>" +
          '<div class="proposal-feedback-actions">' +
          '<a class="btn btn-primary" href="' +
          mailtoUrl +
          '">Abrir app de Correo</a>' +
          '<a class="btn btn-outline" href="' +
          gmailUrl +
          '" target="_blank" rel="noopener">Enviar por Gmail Web</a>' +
          '<button type="button" class="btn btn-ghost" id="btnCopiarPropuesta">Copiar texto</button>' +
          "</div>" +
          '<pre class="proposal-summary-pre" id="propResumenTexto"></pre>';

        var pre = document.getElementById("propResumenTexto");
        if (pre) pre.textContent = resumen;

        var copyBtn = document.getElementById("btnCopiarPropuesta");
        if (copyBtn) {
          copyBtn.addEventListener("click", function () {
            copiarTexto(resumen, function () {
              copyBtn.textContent = "¡Copiado al portapapeles!";
              setTimeout(function () {
                copyBtn.textContent = "Copiar texto";
              }, 2500);
            });
          });
        }

        // Intentar abrir el cliente de correo predeterminado automáticamente
        window.location.href = mailtoUrl;
      }

      var resetBtn = document.getElementById("btnNuevaPropuesta");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          form.reset();
          feedbackBox.hidden = true;
        });
      }

      feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function copiarTexto(texto, callback) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(callback).catch(function () {
          fallbackCopy(texto, callback);
        });
      } else {
        fallbackCopy(texto, callback);
      }
    }

    function fallbackCopy(texto, callback) {
      var ta = document.createElement("textarea");
      ta.value = texto;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        if (callback) callback();
      } catch (e) {}
      document.body.removeChild(ta);
    }

    function escaparHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var datos = {
        nombre: (document.getElementById("propNombre").value || "").trim(),
        email: (document.getElementById("propEmail").value || "").trim(),
        contacto_alt: (document.getElementById("propContactoAlt").value || "").trim(),
        titulo: (document.getElementById("propTitulo").value || "").trim(),
        plataforma: document.getElementById("propPlataforma").value || "A definir",
        estado: document.getElementById("propEstado").value || "Idea inicial",
        idea: (document.getElementById("propIdea").value || "").trim(),
        link: (document.getElementById("propLink").value || "").trim(),
        presupuesto: ((budgetInput && budgetInput.value) || "").trim(),
        presupuesto_detalle: (
          document.getElementById("propPresupuestoDetalle").value || ""
        ).trim()
      };

      if (!datos.nombre || !datos.email || !datos.titulo || !datos.idea || !datos.presupuesto) {
        if (feedbackBox) {
          feedbackBox.classList.add("proposal-feedback--error");
          feedbackBox.hidden = false;
          feedbackBox.innerHTML =
            "<h4>Faltan datos obligatorios</h4><p>Por favor completá tu nombre, correo electrónico, título tentativo, la descripción de la idea y la cantidad de presupuesto.</p>";
        }
        return;
      }

      if (FORMSPREE_ENDPOINT) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando propuesta...";
        }
        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            _subject: "[Propuesta Videojuego] " + datos.titulo + " - " + datos.nombre,
            nombre: datos.nombre,
            email: datos.email,
            contacto_alternativo: datos.contacto_alt,
            titulo_proyecto: datos.titulo,
            plataforma: datos.plataforma,
            estado_actual: datos.estado,
            presupuesto: datos.presupuesto,
            presupuesto_detalle: datos.presupuesto_detalle,
            link_referencia: datos.link,
            idea: datos.idea
          })
        })
          .then(function (res) {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Enviar propuesta";
            }
            if (res.ok) {
              mostrarConfirmacion(datos, true);
            } else {
              mostrarConfirmacion(datos, false);
            }
          })
          .catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Enviar propuesta";
            }
            mostrarConfirmacion(datos, false);
          });
      } else {
        mostrarConfirmacion(datos, false);
      }
    });
  });
})();
