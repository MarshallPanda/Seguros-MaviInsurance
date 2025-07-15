document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    const chatId = `${codigo}${numero}@c.us`;
    const numeroMostrar = `${codigo} ${numero}`;

    const textoMensaje = `Hola buen día, soy *${nombre}*,\nEstoy interesado en realizar una cotizacion de: *${servicio}.*\nMe gustaría dejarles el siguiente mensaje: *${mensaje}*\n\nMi número es: *${numeroMostrar}*`;

    // Previsualización simulada
    document.getElementById('chat-num-preview').textContent = chatId;
    document.getElementById('mensaje-chat').innerHTML = `<p>${textoMensaje.replace(/\n/g, '<br>')}</p>`;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer PN3yWHSNCNjl6HyL8wDo6FWhRz5rTzi5MZfUSSDZe4e11fa1'
        },
        body: JSON.stringify({
            chatId: chatId,
            message: textoMensaje
        })
    };

    fetch('https://waapi.app/api/v1/instances/65266/client/action/send-message', options)
        .then(response => {
            if (response.ok) {
                mostrarNotificacion(true); // ✅ Éxito
                return response.json();
            } else {
                mostrarNotificacion(false); // ❌ Error HTTP
                throw new Error('Error al enviar el mensaje');
            }
        })
        .then(res => {
            console.log("Respuesta de WAAPI:", res);
        })
        .catch(err => {
            console.error("Error de red o envío:", err);
            mostrarNotificacion(false);
        });

});

function mostrarNotificacion(exito) {
    const noti = document.getElementById('wa-notification');
    const headerText = noti.querySelector('strong');
    const bodyText = noti.querySelector('.wa-body p');

    if (exito) {
        headerText.textContent = 'Mensaje enviado';
        bodyText.innerHTML = '<i class="fas fa-info-circle"></i> Este mensaje fue enviado de forma privada. Un asesor se pondrá en contacto contigo.';
        noti.style.borderLeft = '5px solid #25d366';
    } else {
        headerText.textContent = 'Error al enviar';
        bodyText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ocurrió un problema al enviar el mensaje. Intenta nuevamente más tarde.';
        noti.style.borderLeft = '5px solid #e74c3c';
    }

    noti.style.display = 'block';

    setTimeout(() => {
        noti.style.display = 'none';
    }, 7000);
}
